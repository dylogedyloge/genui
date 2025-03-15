"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index";
import { Loader2, Mic, MicOff } from "lucide-react";
import { Button } from "./shadcn/button";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { formatPersianTime } from "@/utils/time-helpers";
import { useTheme } from "next-themes";
import { setupProxy } from "@/utils/proxy-helper";
import { tools } from "@/ai/tools";

const USE_LOCAL_RELAY_SERVER_URL: string | undefined = void 0;

const VoiceChat = () => {
  const { setTheme } = useTheme();
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

  // Set dark theme when component mounts
  useEffect(() => {
    setTheme("dark");
    // Cleanup function
    return () => {
      setTheme("light");
    };
  }, [setTheme]);

  const instructions = `SYSTEM SETTINGS:
------
INSTRUCTIONS:
- به زبان فارسی صحبت کنید
- لطفاً پاسخ‌های خود را به صورت صوتی و مفید ارائه دهید
- پاسخ‌ها باید کوتاه و مفید باشند و حداکثر 400 کاراکتر داشته باشند
- برای جستجو و رزرو هتل یا پرواز از ابزارهای مربوطه استفاده کنید
- به سوالات عمومی در مورد سفر، هتل و پرواز پاسخ دهید
- می‌توانید از کاربر سؤال بپرسید
- برای جستجوی پرواز از ابزار displayFlightCard استفاده کنید
- برای جستجوی هتل از ابزار displayHotelCard استفاده کنید
`;

  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );

  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      USE_LOCAL_RELAY_SERVER_URL
        ? { url: USE_LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
            dangerouslyAllowAPIKeyInBrowser: true,
            debug: false,
          }
    )
  );

  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  const [items, setItems] = useState<ItemType[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const maxReconnectAttempts = 3;
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connectConversation = useCallback(async () => {
    try {
      setConnectionState("connecting");
      const client = clientRef.current;
      const wavRecorder = wavRecorderRef.current;
      const wavStreamPlayer = wavStreamPlayerRef.current;

      await wavRecorder.begin();
      await wavStreamPlayer.connect();
      await client.connect();

      setConnectionState("connected");
      setIsConnected(true);
      setItems(client.conversation.getItems());

      if (client.getTurnDetectionType() === "server_vad") {
        await wavRecorder.record((data) => client.appendInputAudio(data.mono));
      }
    } catch (error) {
      setConnectionState("error");
      console.error("Connection failed:", error);
      setConnectionError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  }, []);

  // Reconnection logic
  const attemptReconnection = useCallback(async () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      setReconnectAttempts((prev) => prev + 1);
      try {
        await connectConversation();
        setReconnectAttempts(0); // Reset on successful connection
      } catch (error) {
        console.error(
          `Reconnection attempt ${reconnectAttempts + 1} failed:`,
          error
        );
        // Try again after exponential backoff
        setTimeout(attemptReconnection, Math.pow(2, reconnectAttempts) * 1000);
      }
    } else {
      setConnectionError(
        "Maximum reconnection attempts reached. Please try again later."
      );
      setConnectionState("error");
    }
  }, [reconnectAttempts, connectConversation]);

  useEffect(() => {
    const client = clientRef.current;

    client.on("close", (event: any) => {
      if (connectionState === "connected") {
        setConnectionState("error");
        attemptReconnection();
      }
    });

    return () => {
      client.off("close");
    };
  }, [connectionState, attemptReconnection]);

  const changeTurnEndType = async (value: string) => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    if (value === "none" && wavRecorder.getStatus() === "recording") {
      await wavRecorder.pause();
    }
    client.updateSession({
      turn_detection: value === "none" ? null : { type: "server_vad" },
    });
    if (value === "server_vad" && client.isConnected()) {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
  };

  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll("[data-conversation-content]")
    );
    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  useEffect(() => {
    let isLoaded = true;

    changeTurnEndType("server_vad");

    const wavRecorder = wavRecorderRef.current;
    const clientCanvas = clientCanvasRef.current;
    let clientCtx: CanvasRenderingContext2D | null = null;

    const wavStreamPlayer = wavStreamPlayerRef.current;
    const serverCanvas = serverCanvasRef.current;
    let serverCtx: CanvasRenderingContext2D | null = null;

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      values: Float32Array,
      color: string,
      role: "user" | "ai" = "user"
    ) => {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barCount = 32;
      const barWidth = width / barCount;
      const gap = 2;
      const actualBarWidth = barWidth - gap;
      const cornerRadius = 8;

      // Create gradient colors with additional safety checks
      const createGradient = (x: number, height: number, barHeight: number) => {
        const safeX = Math.max(0, isFinite(x) ? x : 0);
        const safeHeight = Math.max(1, isFinite(height) ? height : 1);
        const safeBarHeight = Math.max(1, isFinite(barHeight) ? barHeight : 1);

        try {
          const gradient = ctx.createLinearGradient(
            safeX,
            safeHeight,
            safeX,
            safeHeight - safeBarHeight
          );
          if (role === "user") {
            // Dark shades of gray for user
            gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)"); // Slightly lighter dark gray
            gradient.addColorStop(0.5, "rgba(20, 20, 23, 0.9)"); // Mid dark gray
            gradient.addColorStop(1, "rgb(9, 9, 11, 1)"); // Very dark gray
          } else {
            // Light shades of gray for AI
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Light gray (pure white)
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.7)"); // 70% opacity white
            gradient.addColorStop(1, "rgba(255, 255, 255, 0.4)"); // 40% opacity white
          }
          return gradient;
        } catch (error) {
          return color;
        }
      };

      const step = Math.floor(values.length / barCount);

      for (let i = 0; i < barCount; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += Math.abs(values[i * step + j] || 0);
        }
        const average = sum / step;
        const barHeight = average * (height * 1.5);

        const x = i * barWidth;
        const y = height - barHeight;

        // Set gradient fill for each bar
        ctx.fillStyle = createGradient(x, height, barHeight);

        // Draw rounded rectangle with gradient
        ctx.beginPath();
        ctx.moveTo(x + cornerRadius, y);
        ctx.lineTo(x + actualBarWidth - cornerRadius, y);
        ctx.quadraticCurveTo(
          x + actualBarWidth,
          y,
          x + actualBarWidth,
          y + cornerRadius
        );
        ctx.lineTo(x + actualBarWidth, y + barHeight - cornerRadius);
        ctx.quadraticCurveTo(
          x + actualBarWidth,
          y + barHeight,
          x + actualBarWidth - cornerRadius,
          y + barHeight
        );
        ctx.lineTo(x + cornerRadius, y + barHeight);
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - cornerRadius);
        ctx.lineTo(x, y + cornerRadius);
        ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
        ctx.closePath();
        ctx.fill();
      }
    };
    const getColor = (className: string) => {
      const tempDiv = document.createElement("div");
      tempDiv.className = className;
      document.body.appendChild(tempDiv);
      const color = getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);
      return color;
    };

    const render = () => {
      if (isLoaded) {
        if (clientCanvas) {
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          clientCtx = clientCtx || clientCanvas.getContext("2d");
          if (clientCtx) {
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            drawWave(
              clientCtx,
              result.values,
              getColor("text-foreground/50"),
              "user"
            );
          }
        }
        if (serverCanvas) {
          if (!serverCanvas.width || !serverCanvas.height) {
            serverCanvas.width = serverCanvas.offsetWidth;
            serverCanvas.height = serverCanvas.offsetHeight;
          }
          serverCtx = serverCtx || serverCanvas.getContext("2d");
          if (serverCtx) {
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            drawWave(
              serverCtx,
              result.values,
              getColor("text-foreground"),
              "ai"
            );
          }
        }
        window.requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      isLoaded = false;
    };
  }, []);

  // useEffect(() => {
  //   // Setup proxy first
  //   setupProxy();

  //   const wavStreamPlayer = wavStreamPlayerRef.current;
  //   const client = clientRef.current;

  //   // Consolidated error handler
  //   const handleError = (event: any) => {
  //     console.error('OpenAI WebSocket Error:', event);
  //     const errorMessage = event?.message || 'Connection failed';
  //     setConnectionError(errorMessage);
  //     setIsConnected(false);

  //     // Attempt to reconnect after 5 seconds
  //     setTimeout(() => {
  //       if (!isConnected) {
  //         connectConversation().catch(console.error);
  //       }
  //     }, 5000);
  //   };

  //   client.on("error", handleError);
  //   client.on("close", handleError);

  //       // connection status logging
  //       client.on("open", async () => {
  //         console.log('🟢 WebSocket Connection Established');
  //         setConnectionError(null);

  //         try {
  //           console.log('🔍 Checking IP address...');
  //           // Use a different IP check service and bypass proxy
  //           const response = await fetch('https://ifconfig.me/ip', {
  //             method: 'GET',
  //             headers: {
  //               'bypass-proxy': 'true',
  //               'Accept': 'text/plain'
  //             }
  //           });

  //           if (!response.ok) {
  //             throw new Error(`HTTP error! status: ${response.status}`);
  //           }

  //           const ip = await response.text();
  //           console.log('🌐 Current Connection IP:', ip);
  //         } catch (err) {
  //           // Try alternative IP service if first one fails
  //           try {
  //             const response = await fetch('https://icanhazip.com', {
  //               method: 'GET',
  //               headers: {
  //                 'bypass-proxy': 'true',
  //                 'Accept': 'text/plain'
  //               }
  //             });
  //             const ip = await response.text();
  //             console.log('🌐 Current Connection IP:', ip.trim());
  //           } catch (fallbackErr) {
  //             console.warn('⚠️ IP Check Failed:', err instanceof Error ? err.message : 'Failed to fetch IP');
  //           }
  //         }
  //       });

  //   client.updateSession({ instructions: instructions });
  //   client.updateSession({ input_audio_transcription: { model: "whisper-1" } });
  //   client.updateSession({ voice: "ash" });
  useEffect(() => {
    // Setup proxy first
    // setupProxy();
    console.log("🔄 Initial setup started...");

    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    // Convert tools to the format expected by RealtimeClient
    const toolDefinitions = Object.entries(tools).map(([name, tool]) => {
      // Get the schema shape
      const schema = tool.parameters._def.shape();

      // Convert Zod schema to JSON Schema format
      const properties: Record<string, any> = {};
      const required: string[] = [];

      Object.entries(schema).forEach(([key, value]) => {
        properties[key] = {
          type:
            value._def.typeName === "ZodString"
              ? "string"
              : value._def.typeName === "ZodNumber"
              ? "number"
              : "object",
        };

        // Check if the field is required
        if (!("isOptional" in value._def)) {
          required.push(key);
        }
      });

      return {
        type: "function" as const,
        name,
        description: tool.description || `Tool for ${name}`,
        parameters: {
          type: "object",
          properties,
          required,
        },
      };
    });

    // Consolidated error handler
    const handleError = (event: any) => {
      console.error("❌ OpenAI WebSocket Error:", event);
      const errorMessage = event?.message || "Connection failed";
      setConnectionError(errorMessage);
      setIsConnected(false);

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (!isConnected) {
          connectConversation().catch((error) =>
            console.error("❌ Reconnection failed:", error)
          );
        }
      }, 5000);
    };

    // Remove duplicate error handlers
    client.off("error");
    client.off("close");
    client.off("open");

    // Add handlers in correct order
    client.on("error", handleError);
    client.on("close", handleError);

    client.on("open", async () => {
      console.log("🟢 WebSocket Connection Established");
      setConnectionError(null);
      setIsConnected(true);

      try {
        console.log("🔍 Initiating IP check...");
        const response = await fetch("https://ifconfig.me/ip", {
          method: "GET",
          headers: {
            Accept: "text/plain",
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const ip = await response.text();
        console.log("🌐 Current Connection IP:", ip.trim());
      } catch (err) {
        console.log("⚠️ First IP check failed, trying backup service...");
        try {
          const response = await fetch("https://icanhazip.com", {
            method: "GET",
            headers: {
              Accept: "text/plain",
            },
          });
          const ip = await response.text();
          console.log("🌐 Current Connection IP:", ip.trim());
        } catch (fallbackErr) {
          console.error("❌ All IP checks failed");
        }
      }
    });

    // // Rest of the setup
    // client.updateSession({ instructions: instructions });
    // client.updateSession({ input_audio_transcription: { model: "whisper-1" } });
    // client.updateSession({ voice: "ash" });
    // Update session with tools and other settings
    client.updateSession({
      instructions: instructions,
      input_audio_transcription: { model: "whisper-1" },
      voice: "ash",
      tools: toolDefinitions,
      tool_choice: "auto",
    });
    // Add tool handlers
    Object.entries(tools).forEach(([name, tool]) => {
      const shape = tool.parameters._def.shape;
      const parameters = typeof shape === "function" ? shape() : shape;
      console.log("🔧 Registering tool:", name, {
        parameters,
        description: tool.description,
      });

      client.addTool(
        {
          type: "function" as const,
          name,
          description: tool.description || `Tool for ${name}`,
          parameters: {
            type: "object" as const,
            properties: parameters,
            required: Object.entries(parameters)
              .filter(([_, value]) => !("isOptional" in value._def))
              .map(([key]) => key),
          },
        },
        async (args: Parameters<typeof tool.execute>[0]) => {
          try {
            console.log(`🚀 Executing tool ${name} with args:`, args);
            // Type assertion based on the tool name
            if (name === "displayFlightCard") {
              const result = await (
                tool as typeof tools.displayFlightCard
              ).execute(
                args as Parameters<typeof tools.displayFlightCard.execute>[0],
                {
                  abortSignal: undefined,
                }
              );
              console.log(`✅ ${name} execution result:`, result);
              return result;
            } else if (name === "displayHotelCard") {
              const result = await (
                tool as typeof tools.displayHotelCard
              ).execute(
                args as Parameters<typeof tools.displayHotelCard.execute>[0],
                {
                  abortSignal: undefined,
                }
              );
              console.log(`✅ ${name} execution result:`, result);
              return result;
            }
            throw new Error(`Unknown tool: ${name}`);
          } catch (error) {
            console.error(`Error executing tool ${name}:`, error);
            throw error;
          }
        }
      );
    });
    // Object.entries(tools).forEach(([name, tool]) => {
    //   const shape = tool.parameters._def.shape;
    //   const parameters = typeof shape === 'function' ? shape() : shape;

    //   client.addTool(
    //     {
    //       type: "function" as const,
    //       name,
    //       description: tool.description || `Tool for ${name}`,
    //       parameters: {
    //         type: "object" as const,
    //         properties: parameters,
    //         required: Object.entries(parameters)
    //           .filter(([_, value]) => !('isOptional' in value._def))
    //           .map(([key]) => key)
    //       }
    //     },
    //     async (args: Parameters<typeof tool.execute>[0]) => {
    //       try {
    //         const result = await tool.execute(args, {
    //           abortSignal: undefined
    //         });
    //         return result;
    //       } catch (error) {
    //         console.error(`Error executing tool ${name}:`, error);
    //         throw error;
    //       }
    //     }
    //   );
    // });

    client.on("error", (event: any) => console.error(event));
    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });

    // Enhanced conversation update handling
    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems();

      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }

      // Handle tool calls and results
      if (item.tool_calls?.length > 0) {
        console.log("🛠️ Tool calls detected:", {
          toolCalls: item.tool_calls,
          arguments: item.tool_calls.map((call: any) => {
            try {
              return JSON.parse(call.function.arguments);
            } catch (e) {
              return call.function.arguments;
            }
          }),
        });
        // Tool calls are handled automatically by the client
        // Results will be included in the next response
      }

      // Log tool results if any
      if (item.tool_outputs?.length > 0) {
        console.log("🔄 Tool execution results:", item.tool_outputs);
      }

      if (item.status === "completed" && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      client.reset();
    };
  }, [instructions]);

  return (
    <div data-component="VoiceChat" dir="rtl" className="flex flex-col h-full">
      {connectionError && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
          {connectionError}
        </div>
      )}
      {connectionState === "connecting" && (
        <div className="flex justify-center items-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {/* Conversation Display */}
      <div
        className="flex-1 w-full overflow-y-auto p-4 rounded-lg  bg-background space-y-4"
        data-conversation-content
      >
        {items.map((item, index) => {
          const isMessageItem = "status" in item && "role" in item;

          return (
            <div
              key={index}
              className={`flex ${
                isMessageItem && item.role === "assistant"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {isMessageItem && item.role === "user" ? (
                <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tr-none">
                  <ReactMarkdown className="prose-sm text-sm">
                    {item.formatted?.transcript || item.formatted?.text || ""}
                  </ReactMarkdown>
                  <p className="text-xs text-muted-foreground text-left my-1">
                    {formatPersianTime(new Date())}
                  </p>
                </div>
              ) : (
                <>
                  <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground rounded-tl-none">
                    <ReactMarkdown className="prose-sm text-sm">
                      {"status" in item && item.status === "completed"
                        ? item.formatted?.transcript ||
                          item.formatted?.text ||
                          ""
                        : "در حال پردازش..."}
                    </ReactMarkdown>
                    <p className="text-xs text-muted-foreground prose-sm text-left my-1">
                      {formatPersianTime(new Date())}
                    </p>
                  </div>
                  <Image
                    src="/logo1-dark.png"
                    width={100}
                    height={100}
                    alt="logo"
                    className="w-6 h-8 mr-4"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-baseline justify-center w-full px-8 py-4 gap-4">
        <div className="w-[40%]">
          <canvas ref={clientCanvasRef} className="w-full h-16" />
        </div>
        <Button
          variant={isConnected ? "destructive" : "default"}
          size="icon"
          onClick={isConnected ? disconnectConversation : connectConversation}
          className={`w-12 h-12 rounded-full ${
            isConnected ? "animate-pulse" : ""
          }`}
        >
          {isConnected ? <MicOff /> : <Mic />}
          tools
        </Button>
        <div className="w-[40%]">
          <canvas ref={serverCanvasRef} className="w-full h-16" />
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
