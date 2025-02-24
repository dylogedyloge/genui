"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index";
import { Mic, MicOff } from "lucide-react";
import { Button } from "./shadcn/button";

const USE_LOCAL_RELAY_SERVER_URL: string | undefined = void 0;

const VoiceChat = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

  const instructions = `SYSTEM SETTINGS:
------
INSTRUCTIONS:
- به زبان فارسی صحبت کنید
- فقط به سوالات در مورد سفر پاسخ دهید
- لطفاً پاسخ‌های خود را به صورت صوتی و مفید ارائه دهید.
- پاسخ‌ها باید کوتاه و مفید باشند و حداکثر ۲۰۰ کاراکتر داشته باشند.
- می‌توانید از کاربر سؤال بپرسید.


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
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: true,
          }
    )
  );

  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  const [items, setItems] = useState<ItemType[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    startTimeRef.current = new Date().toISOString();
    setIsConnected(true);
    setItems(client.conversation.getItems());

    await wavRecorder.begin();
    await wavStreamPlayer.connect();
    await client.connect();

    if (client.getTurnDetectionType() === "server_vad") {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
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
      color: string
    ) => {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Number of bars to display
      const barCount = 32;
      // Width of each bar
      const barWidth = width / barCount;
      // Gap between bars
      const gap = 2;
      // Actual width of each bar considering the gap
      const actualBarWidth = barWidth - gap;

      ctx.fillStyle = color;

      // Sample the frequency data to match our bar count
      const step = Math.floor(values.length / barCount);

      for (let i = 0; i < barCount; i++) {
        // Get average value for this bar
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += Math.abs(values[i * step + j] || 0);
        }
        const average = sum / step;

        // Calculate bar height (scale the value for better visualization)
        const barHeight = average * (height * 1.5);

        // Draw the bar
        ctx.fillRect(
          i * barWidth, // x position
          height - barHeight, // y position (draw from bottom)
          actualBarWidth, // bar width
          barHeight // bar height
        );
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
            drawWave(clientCtx, result.values, getColor("text-foreground/50"));
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
            drawWave(serverCtx, result.values, getColor("text-foreground"));
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
  //   const wavStreamPlayer = wavStreamPlayerRef.current;
  //   const client = clientRef.current;

  //   client.updateSession({ instructions: instructions });
  //   client.updateSession({ input_audio_transcription: { model: "whisper-1" } });
  //   client.updateSession({ voice: "ash" });

  //   client.on("error", (event: any) => console.error(event));
  //   client.on("conversation.interrupted", async () => {
  //     const trackSampleOffset = await wavStreamPlayer.interrupt();
  //     if (trackSampleOffset?.trackId) {
  //       const { trackId, offset } = trackSampleOffset;
  //       await client.cancelResponse(trackId, offset);
  //     }
  //   });

  //   client.on("conversation.updated", async ({ item, delta }: any) => {
  //     const items = client.conversation.getItems();
  //     if (delta?.audio) {
  //       wavStreamPlayer.add16BitPCM(delta.audio, item.id);
  //     }
  //     if (item.status === "completed" && item.formatted.audio?.length) {
  //       const wavFile = await WavRecorder.decode(
  //         item.formatted.audio,
  //         24000,
  //         24000
  //       );
  //       item.formatted.file = wavFile;
  //     }
  //     setItems(items);
  //   });

  //   setItems(client.conversation.getItems());

  //   return () => {
  //     client.reset();
  //   };
  // }, []);
  useEffect(() => {
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    client.updateSession({ instructions: instructions });
    client.updateSession({ input_audio_transcription: { model: "whisper-1" } });
    client.updateSession({ voice: "ash" });

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
  }, []);
  return (
    <div data-component="VoiceChat" dir="rtl">
            {/* Conversation Display */}
            <div
        className="w-full max-w-2xl mx-auto h-64 overflow-y-auto p-4 rounded-lg border bg-background"
        data-conversation-content
      >
        {items.map((item, index) => {
          // Type guard to check if item has the required properties
          const isMessageItem = "status" in item && "role" in item;

          return (
            <div
              key={index}
              className={`mb-4 ${
                isMessageItem && item.role === "assistant"
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              <div className="font-semibold mb-1">
                {isMessageItem && item.role === "assistant"
                  ? "🤖 دستیار"
                  : "👤 شما"}
                :
              </div>
              <div className="text-sm">
                {isMessageItem && item.status === "completed"
                  ? item.formatted?.transcript || item.formatted?.text || ""
                  : isMessageItem && item.status === "in_progress"
                  ? "در حال پردازش..."
                  : ""}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 m-1">
        <div className="flex items-baseline justify-center gap-2">
          <div className="w-16 h-16">
            <canvas ref={clientCanvasRef} className="w-full h-full" />
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
          </Button>
          <div className="w-16 h-16">
            <canvas ref={serverCanvasRef} className="w-full h-full" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default VoiceChat;
