"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index";
import { Mic, MicOff } from "lucide-react";
import { Button } from "./shadcn/button";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { formatPersianTime } from "@/utils/time-helpers";
import { useTheme } from "next-themes";

const USE_LOCAL_RELAY_SERVER_URL: string | undefined = void 0;

const VoiceChat = () => {
  const { setTheme } = useTheme();
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
  // Set dark theme when component mounts
  useEffect(() => {
    setTheme("dark");
    // Optional: Cleanup function to reset theme when component unmounts
    return () => setTheme("light");
  }, [setTheme]);
  const instructions = `SYSTEM SETTINGS:
------
INSTRUCTIONS:
- به زبان فارسی صحبت کنید
- لطفاً پاسخ‌های خود را به صورت صوتی و مفید ارائه دهید
- پاسخ‌ها باید کوتاه و مفید باشند و حداکثر 400 کاراکتر داشته باشند
- برای جستجو و رزرو هتل یا پرواز، به کاربر بگویید: "لطفا از چت متنی برای جستجوی پرواز یا هتل استفاده کنید"
- به سوالات عمومی در مورد سفر، هتل و پرواز پاسخ دهید
- می‌توانید از کاربر سؤال بپرسید
`;

  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );
  // const clientRef = useRef<RealtimeClient>(
  //   new RealtimeClient(
  //     USE_LOCAL_RELAY_SERVER_URL
  //       ? { url: USE_LOCAL_RELAY_SERVER_URL }
  //       : {
  //           apiKey: apiKey,
  //           dangerouslyAllowAPIKeyInBrowser: true,
  //         }
  //   )
  // );

  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      USE_LOCAL_RELAY_SERVER_URL
        ? { url: USE_LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
            dangerouslyAllowAPIKeyInBrowser: true,
            debug: true
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
  }, [instructions]);
  return (
    <div data-component="VoiceChat" dir="rtl" className="flex flex-col h-full">
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
        </Button>
        <div className="w-[40%]">
          <canvas ref={serverCanvasRef} className="w-full h-16" />
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
