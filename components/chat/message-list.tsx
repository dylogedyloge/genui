import ReactMarkdown from "react-markdown";
import { AnimatePresence } from "framer-motion";

import FlightCard from "@/components/cards/flight-card";
import HotelCard from "@/components/cards/hotel-card";

import FlightCardSkeleton from "@/components/skeletons/flight-card-skeleton";
import HotelCardSkeleton from "@/components/skeletons/hotel-card-skeleton";
import  PassengerCounter  from "@/components/passenger-counter/passenger-counter";

import { formatPersianTime } from "@/utils/time-helpers";
import { Button } from "@/components/shadcn/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Flight,
  Hotel,
  ToolInvocation,
  Message,
  VisibilityControl,
  CityData,
} from "@/types/chat";
import Image from "next/image";
import SelectedFlightAndHotelDetails from "../selected-card-details/selected-flight-and-hotel-details";

/**
 * Type Guards to check the type of `result` based on the toolName
 */
// 1. Update type guard interface
interface FlightResult {
  flights: Flight[];
  departureCityData: CityData;
  destinationCityData: CityData;
}

// 2. Update type guard function
function isFlightArray(result: any): result is FlightResult {
  return (
    result &&
    Array.isArray(result.flights) &&
    result.departureCityData &&
    result.destinationCityData
  );
}

const isHotelArray = (
  result: Flight[] | Hotel[] | undefined
): result is Hotel[] => {
  return !!result && (result as Hotel[])[0]?.hotelName !== undefined;
};

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  stop: () => void;
  error: Error | null;
  reload: () => void;
  mounted: boolean;
  visibilityControls: {
    flights: VisibilityControl;
    hotels: VisibilityControl;
  };
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  error,
  reload,
  mounted,
  visibilityControls,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showPassengerCounter, setShowPassengerCounter] = useState(false);
  const [passengerCounterMessage, setPassengerCounterMessage] = useState("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  // Callback function to handle flight card click
  const handleFlightCardClick = (flightInfo: Flight) => {
    setSelectedFlight(flightInfo);
  };
  // Callback function to handle hotel card click
  const handleHotelCardClick = (hotelInfo: Hotel) => {
    setSelectedHotel(hotelInfo);
  };

    // Callback function to handle passenger selection
    const handlePassengersSelected = (passengers: {
      adult: number;
      child: number;
      infant: number;
    }) => {
      // Hide the PassengerCounter component
      setShowPassengerCounter(false);
  
      // Call the FlightTool again with the selected passengers
      // You can use a function like `retryFlightTool(passengers)`
      console.log("Selected passengers:", passengers);
      // Example: retryFlightTool(passengers);
    };

  return (
    <div className="flex-grow overflow-auto space-y-4 mb-4">
      {messages.map((message, messageIndex) => (
        <div
          key={messageIndex}
          className={`flex ${
            message.role === "user" ? "justify-start" : "justify-end"
          }`}
        >
          {message.role === "user" ? (
            <>
              <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tr-none">
                <ReactMarkdown className="prose-sm text-sm">
                  {message.content || message.text}
                </ReactMarkdown>
                {mounted && (
                  <p className="text-xs text-muted-foreground text-left my-1">
                    {formatPersianTime(new Date())}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground rounded-tl-none">
                <ReactMarkdown className="prose-sm text-sm">
                  {message.content || message.text}
                </ReactMarkdown>
                {mounted && (
                  <p className="text-xs text-muted-foreground prose-sm text-left my-1">
                    {formatPersianTime(new Date())}
                  </p>
                )}

                {/* Tool invocations */}
                {message.toolInvocations?.map(
                  (toolInvocation: ToolInvocation, invocationIndex: number) => {
                    const { toolName, state, result } = toolInvocation;

                    if (state === "result") {

// Check if the result includes the `showPassengerCounter` flag
if (result?.showPassengerCounter) {
  // Show the PassengerCounter component
  // setShowPassengerCounter(true); این قسمت را چک کنید
  setPassengerCounterMessage(result.message);
  return null; // Skip rendering other content
}

                      // Use type guards to determine the type of `result`
                      switch (toolName) {
                        case "displayFlightCard":
                          if (isFlightArray(result)) {
                            return renderFlightCards(
                              result,
                              messageIndex,
                              invocationIndex,
                              visibilityControls.flights,
                              handleFlightCardClick
                            );
                          }
                          break;

                        case "displayHotelCard":
                          if (isHotelArray(result)) {
                            return renderHotelCards(
                              result,
                              messageIndex,
                              invocationIndex,
                              visibilityControls.hotels,
                              handleHotelCardClick
                            );
                          }
                          break;
                        default:
                          return null;
                      }
                    } else {
                      return (
                        <div key={toolInvocation.toolCallId} className="mt-2">
                          {renderSkeletonsForTool(toolName)}
                        </div>
                      );
                    }
                  }
                )}
              </div>
              <Image
                src="/logo1.png"
                width={100}
                height={100}
                alt="logo"
                className="w-6 h-8 mr-4 "
              />
            </>
          )}
        </div>
      ))}



{/* Render the PassengerCounter component if needed */}
{showPassengerCounter && (
        <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground">
          <p>{passengerCounterMessage}</p>
          <PassengerCounter onPassengersSelected={handlePassengersSelected} />
        </div>
      )}
      {/* Conditionally render the selected flight details with text transition animation */}
      <AnimatePresence>
        {(selectedFlight || selectedHotel) && (
          <SelectedFlightAndHotelDetails
            selectedFlight={selectedFlight}
            selectedHotel={selectedHotel}
          />
        )}
      </AnimatePresence>
      {error && (
        <div className="flex justify-center">
          <Button variant="destructive" size="sm" onClick={() => reload()}>
            تلاش مجدد
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Helper functions for rendering tool responses
 */
const renderFlightCards = (
  flights: {
    flights: Flight[];
    departureCityData: CityData;
    destinationCityData: CityData;
  },
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl,
  onFlightCardClick: (flightInfo: Flight) => void
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {flights.flights
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((flight: Flight) => (
          <FlightCard
            fareSourceCode={""}
            isClosed={false}
            visaRequirements={[]}
            fares={undefined}
            cabin={undefined}
            segments={[]}
            returnSegments={[]}
            key={flight.id}
            {...flight}
            onFlightCardClick={onFlightCardClick}
            departureCityData={flights.departureCityData}
            destinationCityData={flights.destinationCityData}
            isDomestic={
              flights.departureCityData.isDomestic &&
              flights.destinationCityData.isDomestic
            }
          />
        ))}
      {renderVisibilityButtons(
        flights.flights.length,
        messageIndex,
        invocationIndex,
        visibilityControl
      )}
    </div>
  );
};

const renderHotelCards = (
  hotels: Hotel[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl,
  onHotelCardClick: (hotelInfo: Hotel) => void
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {hotels
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((hotel: Hotel) => (
          <HotelCard
            key={hotel.id}
            onHotelCardClick={onHotelCardClick}
            {...hotel}
          />
        ))}
      {renderVisibilityButtons(
        hotels.length,
        messageIndex,
        invocationIndex,
        visibilityControl
      )}
    </div>
  );
};

/**
 * Render "Show More" and "Show Less" buttons
 */
const renderVisibilityButtons = (
  itemsLength: number,
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl
) => (
  <div className="col-span-full flex justify-center mt-4 gap-2">
    {(visibilityControl.map[messageIndex]?.[invocationIndex] || 2) <
      itemsLength && (
      <Button
        variant="secondary"
        onClick={() =>
          visibilityControl.showMore(messageIndex, invocationIndex)
        }
      >
        <ChevronDown />
        بیشتر
      </Button>
    )}
    {(visibilityControl.map[messageIndex]?.[invocationIndex] || 2) > 2 && (
      <Button
        variant="secondary"
        onClick={() =>
          visibilityControl.showLess(messageIndex, invocationIndex)
        }
      >
        <ChevronUp />
        کمتر
      </Button>
    )}
  </div>
);

/**
 * Return 2 skeleton components based on tool type
 */
const renderSkeletonsForTool = (toolName: string) => {
  switch (toolName) {
    case "displayFlightCard":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <FlightCardSkeleton key={i} />
          ))}
        </div>
      );
    case "displayHotelCard":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default MessageList;
