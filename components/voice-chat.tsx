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
import FlightCard from "@/components/cards/flight-card";
import HotelCard from "@/components/cards/hotel-card";
import FlightCardSkeleton from "@/components/skeletons/flight-card-skeleton";
import HotelCardSkeleton from "@/components/skeletons/hotel-card-skeleton";
import { Flight, Hotel, CityData } from "@/types/chat";
import { ChevronDown, ChevronUp } from "lucide-react";
import DateService from "@/services/date-service";

const USE_LOCAL_RELAY_SERVER_URL: string | undefined = void 0;



const VoiceChat = () => {
  const [flights, setFlights] = useState<{
    flights: Flight[];
    departureCityData: CityData;
    destinationCityData: CityData;
  } | null>(null);

  const [hotels, setHotels] = useState<{
    hotels: Hotel[];
    message: string;
    cityData: CityData;
  } | null>(null);

  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [visibleFlights, setVisibleFlights] = useState(2);
  const [visibleHotels, setVisibleHotels] = useState(2);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);



  const { setTheme } = useTheme();
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

  // Set dark theme when component mounts
  // useEffect(() => {
  //   setTheme("dark");
  //   // Cleanup function
  //   return () => {
  //     setTheme("light");
  //   };
  // }, [setTheme]);

  const handleFlightCardClick = (flightInfo: Flight) => {
    setSelectedFlight(flightInfo);
  };

  const handleHotelCardClick = (hotelInfo: Hotel) => {
    setSelectedHotel(hotelInfo);
  };

  const showMoreFlights = () => {
    setVisibleFlights((prev) => prev + 2);
  };

  const showLessFlights = () => {
    setVisibleFlights(Math.max(2, visibleFlights - 2));
  };

  const showMoreHotels = () => {
    setVisibleHotels((prev) => prev + 2);
  };

  const showLessHotels = () => {
    setVisibleHotels(Math.max(2, visibleHotels - 2));
  };

  const { gregorian: tomorrowDateGregorian, jalali: tomorrowDateJalali } =
    DateService.getTomorrow();

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
  - هنگام نمایش نتایجه جستجوی پرواز یا هتل:
    * فقط از ابزار مربوطه استفاده کنید و نتایجه را نمایش دهید
    * هیچ پیام متنی یا صوتی ارسال نکنید
    * از توضیح جزئیات پروازها یا هتل‌ها خودداری کنید
    * اگر کاربر درباره خرید بلیط یا رزرو هتل سوال کرد، پاسخ دهید: "پرواز/هتل مورد نظر خود را انتخاب کنید و از سایت آتریپا خرید کنید"
  - هنگام استفاده از ابزار displayFlightCard، اطلاعات مسافران را به صورت زیر ارسال کنید:
    * از کلمات مفرد استفاده کنید: adult (بزرگسال)، child (کودک)، infant (نوزاد)
    * مثال صحیح: {"passengers": {"adult": 2, "child": 1, "infant": 1}}
    * از کلمات جمع مانند adults، children یا infants استفاده نکنید
  - تاریخ فردا ${tomorrowDateGregorian} (میلادی) و ${tomorrowDateJalali} (شمسی) است. از این برای تفسیر تاریخ‌های نسبی استفاده کنید.
  - تمام تاریخ‌ها در پاسخ‌ها باید به فرمت شمسی باشند (مثلاً 1404/07/23).
  - تمام تاریخ‌هایی که به ابزارها ارسال می‌شوند باید به فرمت میلادی باشند (مثلاً 2025-10-15).
  - توجه داشته باشید که تمام قیمت‌ها به ریال هستند.
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
              // Type guard to ensure we're working with FlightTool args
              // First check if this is a flight args object by checking for departureCity
              if ("departureCity" in args) {
                // Now we can safely access flight-specific properties
                const flightArgs = args as {
                  departureCity: string;
                  destinationCity: string;
                  date: string;
                  passengers?:
                  | {
                    adult: number;
                    child: number;
                    infant: number;
                  }
                  | number;
                };

                // Log the original arguments to help with debugging
                console.log(
                  `📝 Original flight args:`,
                  JSON.stringify(flightArgs)
                );

                // Create a properly formatted passengers object that matches the text chat format
                let formattedPassengers = {
                  adult: 1,
                  child: 0,
                  infant: 0,
                };

                // Handle case where passengers is a number (total passengers)
                if (typeof flightArgs.passengers === "number") {
                  console.log(
                    `⚠️ Passengers provided as a single number: ${flightArgs.passengers}`
                  );
                  formattedPassengers.adult = flightArgs.passengers;
                }
                // Handle case where passengers is an object
                else if (
                  typeof flightArgs.passengers === "object" &&
                  flightArgs.passengers !== null
                ) {
                  // Log the raw passengers object to debug
                  console.log(
                    `🔍 Raw passengers object:`,
                    flightArgs.passengers
                  );

                  // Only handle singular property names
                  formattedPassengers = {
                    adult:
                      typeof flightArgs.passengers.adult === "string"
                        ? parseInt(
                          flightArgs.passengers.adult as unknown as string,
                          10
                        )
                        : flightArgs.passengers.adult ?? 1,

                    child:
                      typeof flightArgs.passengers.child === "string"
                        ? parseInt(
                          flightArgs.passengers.child as unknown as string,
                          10
                        )
                        : flightArgs.passengers.child ?? 0,

                    infant:
                      typeof flightArgs.passengers.infant === "string"
                        ? parseInt(
                          flightArgs.passengers.infant as unknown as string,
                          10
                        )
                        : flightArgs.passengers.infant ?? 0,
                  };
                }

                // Ensure all values are valid numbers
                if (isNaN(formattedPassengers.adult))
                  formattedPassengers.adult = 1;
                if (isNaN(formattedPassengers.child))
                  formattedPassengers.child = 0;
                if (isNaN(formattedPassengers.infant))
                  formattedPassengers.infant = 0;

                // Create a new args object with the properly formatted passengers
                const formattedArgs = {
                  departureCity: flightArgs.departureCity,
                  destinationCity: flightArgs.destinationCity,
                  date: flightArgs.date,
                  passengers: formattedPassengers,
                };

                console.log(
                  `🔄 Formatted args for ${name}:`,
                  JSON.stringify(formattedArgs)
                );

                // Execute the tool with the properly formatted arguments
                const result = await (
                  tool as typeof tools.displayFlightCard
                ).execute(
                  formattedArgs as Parameters<
                    typeof tools.displayFlightCard.execute
                  >[0],
                  {
                    abortSignal: undefined,
                  }
                );
                console.log(`✅ ${name} execution result:`, result);
                // Update the flights state with the result
                if (
                  result &&
                  Array.isArray(result.flights) &&
                  result.departureCityData &&
                  result.destinationCityData
                ) {
                  setFlights({
                    flights: result.flights as Flight[],
                    departureCityData: result.departureCityData as CityData,
                    destinationCityData: result.destinationCityData as CityData,
                  });
                } else {
                  console.warn(
                    "⚠️ Flight result missing required properties:",
                    result
                  );
                }
                return result;
              } else {
                throw new Error(
                  `Invalid arguments for ${name}: missing required properties`
                );
              }
            } else if (name === "displayHotelCard") {
              // Check if this is a hotel args object by checking for location
              if ("location" in args) {
                // No need to modify hotel args, just execute the tool
                const result = await (
                  tool as typeof tools.displayHotelCard
                ).execute(
                  args as Parameters<typeof tools.displayHotelCard.execute>[0],
                  {
                    abortSignal: undefined,
                  }
                );
                console.log(`✅ ${name} execution result:`, result);
                // Update the hotels state with the result
                if (result && Array.isArray(result.hotels) && result.cityData) {
                  setHotels({
                    hotels: result.hotels as Hotel[],
                    message: result.message || "",
                    cityData: result.cityData as CityData,
                  });
                } else {
                  console.warn(
                    "⚠️ Hotel result missing required properties:",
                    result
                  );
                }
                return result;
              } else {
                throw new Error(
                  `Invalid arguments for ${name}: missing required properties`
                );
              }
            }
            throw new Error(`Unknown tool: ${name}`);
          } catch (error) {
            console.error(`Error executing tool ${name}:`, error);
            throw error;
          }
        }
      );
    });

    client.on("error", (event: any) => console.error(event));
    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });

    // Enhanced conversation update handling
    // First, modify the conversation update handler in the useEffect
    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems();

      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }

      // Handle tool calls and set loading states
      if (item.tool_calls?.length > 0) {
        item.tool_calls.forEach((call: any) => {
          if (call.function.name === "displayFlightCard") {
            setLoadingFlights(true);
          } else if (call.function.name === "displayHotelCard") {
            setLoadingHotels(true);
          }
        });
      }

      // Clear loading states and update results when tool execution completes
      if (item.tool_outputs?.length > 0) {
        console.log("🔄 Tool execution results:", item.tool_outputs);
        // Store the results in the item itself instead of global state
        item.tool_outputs.forEach((output: any) => {
          const result = output.output;
          if (result) {
            if (result.flights) {
              item.flightResults = result;
              setLoadingFlights(false);
            } else if (result.hotels) {
              item.hotelResults = result;
              setLoadingHotels(false);
            }
          }
        });
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
    <div
      data-component="VoiceChat"
      dir="rtl"
      className="flex flex-col h-full overflow-hidden"
    >
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

      {/* Main scrollable content area containing all messages and cards */}
      <div className="flex-1 overflow-y-auto p-4 rounded-lg bg-background space-y-4">
        {items.map((item, index) => {
          const isMessageItem = "status" in item && "role" in item;

          // Only render if there are flights or hotels to show
          if (index === items.length - 1) {
            return (
              <div key={index}>
                {/* Show skeletons during loading */}
                {loadingFlights && (
                  <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
                    {[...Array(2)].map((_, i) => (
                      <FlightCardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {loadingHotels && (
                  <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
                    {[...Array(2)].map((_, i) => (
                      <HotelCardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {/* Display flight cards */}
                {flights && flights.flights.length > 0 && (
                  <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4 sm:w-2/3 mx-auto">
                    {flights.flights.slice(0, visibleFlights).map((flight: Flight) => (
                      <FlightCard
                        key={flight.id}
                        isClosed={false}
                        visaRequirements={[]}
                        fares={{
                          adult: {
                            price: 0,
                            count: 0,
                            total_price: 0,
                          },
                          total_price: 0,
                        }}
                        segments={[]}
                        returnSegments={[]}
                        {...flight}
                        refundable={flight.refundable ?? false}
                        departureCityData={flights.departureCityData}
                        destinationCityData={flights.destinationCityData}
                        with_tour={flight.with_tour ?? false}
                        isDomestic={
                          flights.departureCityData.isDomestic &&
                          flights.destinationCityData.isDomestic
                        }
                        onFlightCardClick={handleFlightCardClick}
                      />
                    ))}
                    {/* Show more/less buttons for flights */}
                    <div className="col-span-full flex justify-center mt-4 gap-2">
                      {visibleFlights < flights.flights.length && (
                        <Button variant="secondary" onClick={showMoreFlights}>
                          <ChevronDown />
                          بیشتر
                        </Button>
                      )}
                      {visibleFlights > 2 && (
                        <Button variant="secondary" onClick={showLessFlights}>
                          <ChevronUp />
                          کمتر
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Display hotel cards */}
                {hotels && hotels.hotels.length > 0 && (
                  <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4 sm:w-2/3 mx-auto">
                    {hotels.hotels.slice(0, visibleHotels).map((hotel: Hotel) => (
                      <HotelCard
                        key={hotel.id}
                        id={hotel.id}
                        hotelName={hotel.hotelName}
                        location={hotel.location}
                        checkIn={hotel.checkIn}
                        checkOut={hotel.checkOut}
                        roomType={hotel.roomType}
                        price={hotel.price}
                        rating={hotel.rating}
                        images={hotel.images}
                        address={hotel.address}
                        star={hotel.star}
                        type={hotel.type}
                        rooms={hotel.rooms}
                        amenities={hotel.amenities}
                        onHotelCardClick={handleHotelCardClick}
                      />
                    ))}
                    {/* Show more/less buttons for hotels */}
                    <div className="col-span-full flex justify-center mt-4 gap-2">
                      {visibleHotels < hotels.hotels.length && (
                        <Button variant="secondary" onClick={showMoreHotels}>
                          <ChevronDown />
                          بیشتر
                        </Button>
                      )}
                      {visibleHotels > 2 && (
                        <Button variant="secondary" onClick={showLessHotels}>
                          <ChevronUp />
                          کمتر
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="flex items-baseline w-full px-8 py-4 gap-4 bg-background">
        <div className="w-[40%]">
          <canvas ref={clientCanvasRef} className="w-full h-16" />
        </div>
        <Button
          variant={isConnected ? "destructive" : "default"}
          size="icon"
          onClick={isConnected ? disconnectConversation : connectConversation}
          className={`w-12 h-12 rounded-full ${isConnected ? "animate-pulse" : ""
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
