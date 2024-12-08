"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index";
import { WavRenderer } from "@/utils/wav_renderer";
import { User, Brain, Mic, MicOff } from "lucide-react";
import { Button } from "./shadcn/button";

const USE_LOCAL_RELAY_SERVER_URL: string | undefined = void 0;

const VoiceChat = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

  const instructions = `SYSTEM SETTINGS:
------
INSTRUCTIONS:
- به زبان فارسی صحبت کنید
- لطفاً پاسخ‌های خود را به صورت صوتی و مفید ارائه دهید.
- پاسخ‌ها باید کوتاه و مفید باشند و حداکثر ۲۰۰ کاراکتر داشته باشند.
- می‌توانید از کاربر سؤال بپرسید.
- آماده اکتشاف و مکالمه باشید.

------
شخصیت:
- پر انرژی و مثبت باشید.
- سریع صحبت کنید، انگار هیجان‌زده هستید.

------

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
  const [inputText, setInputText] = useState("");

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
    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: `سلام`,
      },
    ]);

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

    const render = () => {
      if (isLoaded) {
        if (clientCanvas) {
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          clientCtx = clientCtx || clientCanvas.getContext("2d");
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              "#0099ff",
              10,
              0,
              8
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
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              "#fff700",
              10,
              0,
              8
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

  useEffect(() => {
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    client.updateSession({ instructions: instructions });
    client.updateSession({ input_audio_transcription: { model: "whisper-1" } });
    client.updateSession({ voice: "shimmer" });

    client.on("error", (event: any) => console.error(event));
    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
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
    <div
      data-component="VoiceChat"

      dir="rtl"
    >
      {/* Main Content */}

      {/* <div className="flex-1 p-4 overflow-y-hidden h-full">
        <div className="space-y-4">
          {items.slice(1).map((conversationItem) => (
            <div
              key={conversationItem.id}
              className={`flex items-start ${
                conversationItem.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex items-start ${
                  conversationItem.role === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${
                    conversationItem.role === "user" ? "ml-2" : "mr-2"
                  }`}
                >
                  {conversationItem.role === "user" ? (
                    <User size={16} className="text-blue-500" />
                  ) : (
                    <Brain size={16} className="text-gray-500" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg shadow-md max-w-xs ${
                    conversationItem.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {conversationItem.formatted
                    .tool ? null : conversationItem.role === "user" ? (
                    <div>
                      {conversationItem.formatted.transcript ||
                        (conversationItem.formatted.audio?.length
                          ? "(در حال رونویسی)"
                          : conversationItem.formatted.text || "(ارسال شد)")}
                    </div>
                  ) : (
                    <div>
                      {conversationItem.formatted.transcript ||
                        conversationItem.formatted.text ||
                        "(کوتاه شده)"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Actions Section */}
      <div className=" flex items-center justify-center gap-2 ">
        <Button
          variant="default"
          size="icon"
          onClick={isConnected ? disconnectConversation : connectConversation}
          className={`rounded-full ${isConnected ? "animate-pulse" : ""}`}
        >
          {isConnected ? (
            <MicOff />
          ) : (
            <Mic />
          )}
        </Button>
      </div>
    </div>
  );
};
export default VoiceChat;