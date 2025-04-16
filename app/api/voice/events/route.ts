// app/api/voice/events/route.ts
import { NextRequest } from "next/server";
import { getSession, removeSession } from "@/lib/voice-sessions"; // Adjust path
import { tools } from "@/ai/tools"; // Reuse tools definition
import DateService from "@/services/date-service";
import { Flight, Hotel, CityData } from "@/types/chat"; // Import types if needed for tool results

// Helper to send SSE messages
function sendSseMessage(controller: ReadableStreamDefaultController<any>, type: string, data: any) {
    try {
        const message = `data: ${JSON.stringify({ type, data })}\n\n`;
        // console.log("Sending SSE:", message.substring(0, 100)); // Log snippet
        controller.enqueue(new TextEncoder().encode(message));
    } catch (e) {
         console.error("Error enqueuing SSE message:", e);
         // Handle potential errors if the stream is closed
         if ((e as Error).message.includes('Controller is already closed')) {
             // Optionally try to remove the session if the stream is unexpectedly closed
             // removeSession(sessionId); // Be cautious with cleanup logic here
         }
    }
}


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
        return new Response("Missing sessionId", { status: 400 });
    }

    const session = getSession(sessionId);

    if (!session) {
        console.warn(`Session not found for ID (events): ${sessionId}`);
        return new Response("Invalid session ID", { status: 404 });
    }

    const client = session.client;

    // Create the SSE stream
    const stream = new ReadableStream({
        start(controller) {
            console.log(`SSE Stream started for session: ${sessionId}`);
            // Store the controller in the session state *now*
            session.streamController = controller;

            // --- Configure RealtimeClient Listeners ---
            client.on("open", () => {
                 console.log(`Realtime client opened for session: ${sessionId}`);
                 sendSseMessage(controller, "connection_status", { status: "connected" });
            });

            client.on("close", (event: any) => {
                console.log(`Realtime client closed for session ${sessionId}:`, event?.code, event?.reason);
                sendSseMessage(controller, "connection_status", { status: "disconnected", reason: event?.reason ?? "Connection closed" });
                 // Clean up the session when the underlying connection closes
                 removeSession(sessionId);
                 // Controller is likely closed automatically by the browser/client when connection drops
            });

            client.on("error", (error: any) => {
                console.error(`Realtime client error for session ${sessionId}:`, error);
                sendSseMessage(controller, "connection_status", { status: "error", message: error?.message ?? "Unknown connection error" });
                 removeSession(sessionId); // Clean up on error
            });

             client.on("conversation.updated", async ({ item, delta }: any) => {
                 // Send text updates
                 if (delta?.text || item?.formatted?.transcript || item?.formatted?.text) {
                     sendSseMessage(controller, "text_update", {
                         role: item.role,
                         text: delta?.text ?? item.formatted?.transcript ?? item.formatted?.text ?? "",
                         itemId: item.id, // Send item ID for client-side matching if needed
                         status: item.status, // e.g., 'in_progress', 'completed'
                     });
                 }

                 // Send audio chunks (Base64 encoded)
                 if (delta?.audio) {
                    try {
                        // Convert Int16Array buffer directly to Base64
                        const buffer = Buffer.from(delta.audio.buffer);
                        const base64Audio = buffer.toString('base64');
                        sendSseMessage(controller, "audio_chunk", { chunk: base64Audio });
                    } catch (e) {
                        console.error("Error encoding audio chunk:", e)
                    }
                 }

                 // Inform client about tool calls (client just needs to know, execution is server-side)
                 if (item.tool_calls?.length > 0 && item.status === "requires_action") {
                    console.log(`[${sessionId}] Tool call received:`, item.tool_calls)
                     sendSseMessage(controller, "tool_call_start", { toolCalls: item.tool_calls });
                 }
                 // Send results AFTER tool execution (handled by addTool callback below)
             });

            // --- Add Tools (Server-Side Execution) ---
            const { gregorian: tomorrowDateGregorian, jalali: tomorrowDateJalali } = DateService.getTomorrow();
            const instructions = `SYSTEM SETTINGS: ... [Your full instructions here, including date context: ${tomorrowDateGregorian} / ${tomorrowDateJalali}] ... `; // Keep instructions server-side

            // Function to safely parse JSON arguments
            const safeJsonParse = (jsonString: string, toolName: string): any => {
                try {
                    return JSON.parse(jsonString);
                } catch (e) {
                    console.error(`[${sessionId}] Failed to parse arguments for tool ${toolName}:`, jsonString, e);
                    // Send an error message back to the client via SSE
                    sendSseMessage(controller, "tool_execution_error", {
                        toolName: toolName,
                        error: `Invalid arguments format received: ${e instanceof Error ? e.message : 'Unknown parsing error'}`,
                        rawArguments: jsonString // Send raw args for debugging on client if needed
                    });
                    return null; // Indicate failure
                }
            };


            Object.entries(tools).forEach(([name, tool]) => {
                const shape = tool.parameters._def.shape;
                const parameters = typeof shape === 'function' ? shape() : shape;

                client.addTool(
                    {
                        type: "function" as const,
                        name,
                        description: tool.description || `Tool for ${name}`,
                        parameters: {
                            type: "object" as const,
                            properties: parameters,
                            required: Object.entries(parameters)
                                .filter(([_, value]) => !('isOptional' in value._def))
                                .map(([key]) => key),
                        },
                    },
                    // Server-side execution function
                    async (args: Record<string, any>) => {
                        console.log(`[${sessionId}] Executing tool ${name} server-side with raw args:`, args);
                        sendSseMessage(controller, "tool_execution_start", { name }); // Inform client

                        try {
                            // ---> ARGUMENT PARSING & FORMATTING (Similar to client-side but done here) <---
                            let formattedArgs = args;
                            if (name === "displayFlightCard") {
                                const flightArgs = args as any; // Cast for easier access, handle potential errors
                                let passengers = { adult: 1, child: 0, infant: 0 };

                                if (typeof flightArgs.passengers === 'object' && flightArgs.passengers !== null) {
                                    // Assuming keys like 'adult', 'child', 'infant' might exist
                                    passengers = {
                                        adult: parseInt(String(flightArgs.passengers.adult ?? 1), 10) || 1,
                                        child: parseInt(String(flightArgs.passengers.child ?? 0), 10) || 0,
                                        infant: parseInt(String(flightArgs.passengers.infant ?? 0), 10) || 0,
                                    };
                                } else if (typeof flightArgs.passengers === 'number') {
                                    passengers.adult = flightArgs.passengers;
                                } else if (typeof flightArgs.passengers === 'string') {
                                     // Attempt to parse if it's a JSON string representation of the object
                                     try {
                                         const parsedPassengers = JSON.parse(flightArgs.passengers);
                                         passengers = {
                                            adult: parseInt(String(parsedPassengers.adult ?? 1), 10) || 1,
                                            child: parseInt(String(parsedPassengers.child ?? 0), 10) || 0,
                                            infant: parseInt(String(parsedPassengers.infant ?? 0), 10) || 0,
                                         };
                                     } catch (e) {
                                         console.warn(`[${sessionId}] Could not parse passengers string: ${flightArgs.passengers}. Defaulting to 1 adult.`);
                                         passengers = { adult: 1, child: 0, infant: 0 };
                                     }
                                }

                                formattedArgs = {
                                    ...flightArgs,
                                    passengers: passengers
                                };
                                console.log(`[${sessionId}] Formatted flight args:`, formattedArgs);
                            }
                            // Add formatting for HotelCard if needed

                            // Execute the actual tool function (make sure it's accessible server-side)
                            const result = await tool.execute(formattedArgs, { abortSignal: undefined });
                            console.log(`[${sessionId}] Tool ${name} execution result:`, result);

                            // Send the result back to the client via SSE
                            sendSseMessage(controller, "tool_result", { name, result });
                            return result; // Return result to RealtimeClient

                        } catch (error) {
                            console.error(`[${sessionId}] Error executing tool ${name}:`, error);
                             // Send error back to client via SSE
                            sendSseMessage(controller, "tool_execution_error", {
                                name: name,
                                error: error instanceof Error ? error.message : "Unknown tool execution error"
                            });
                            // It's important to return *something* or throw, so Realtime knows the tool failed.
                            // Returning an error object might be suitable depending on RealtimeClient's handling.
                            // For simplicity, we might just log and let Realtime potentially timeout or handle internally.
                            // Consider returning a structured error: return { error: true, message: ... }
                            throw error; // Re-throwing might be necessary for RealtimeClient's internal state.
                        }
                    }
                );
            });


            // --- Initiate Realtime Connection ---
            console.log(`[${sessionId}] Configuring and connecting RealtimeClient...`);
            client.updateSession({
                instructions: instructions,
                input_audio_transcription: { model: "whisper-1" },
                voice: "ash",
                tools: Object.entries(tools).map(([name, tool]) => {
                     const shape = tool.parameters._def.shape;
                     const parameters = typeof shape === 'function' ? shape() : shape;
                     return {
                         type: "function" as const,
                         name,
                         description: tool.description || `Tool for ${name}`,
                         parameters: {
                             type: "object" as const,
                             properties: parameters,
                             required: Object.entries(parameters)
                                 .filter(([_, value]) => !('isOptional' in value._def))
                                 .map(([key]) => key),
                         },
                    };
                }),
                tool_choice: "auto",
                turn_detection: { type: "server_vad" } // Use server VAD
            });

            client.connect().catch(err => {
                 console.error(`[${sessionId}] Failed to connect RealtimeClient:`, err);
                 sendSseMessage(controller, "connection_status", { status: "error", message: "Failed to connect to Realtime service" });
                 removeSession(sessionId);
            });

        },
        cancel(reason) {
            console.log(`SSE Stream cancelled for session ${sessionId}. Reason:`, reason);
            // Client disconnected - clean up the server-side session
            removeSession(sessionId);
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}