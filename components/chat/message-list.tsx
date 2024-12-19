import ReactMarkdown from "react-markdown";
import { User } from "lucide-react";
import { GiHolosphere } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

import FlightCard from "@/components/cards/flight-card";
import HotelCard from "@/components/cards/hotel-card";
import RestaurantCard from "@/components/cards/restaurant-card";
import TourCard from "@/components/cards/tour-card";

import FlightCardSkeleton from "@/components/skeletons/flight-card-skeleton";
import HotelCardSkeleton from "@/components/skeletons/hotel-card-skeleton";
import RestaurantCardSkeleton from "@/components/skeletons/restaurant-card-skeleton";
import TourCardSkeleton from "@/components/skeletons/tour-card-skeleton";

import { formatPersianTime } from "@/utils/time-helpers";
import { Button } from "@/components/shadcn/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Flight,
  Hotel,
  Restaurant,
  Tour,
  ToolInvocation,
  Message,
  VisibilityControl,
} from "@/types/chat";
import Image from "next/image";
import SelectedFlightAndHotelDetails from "../selected-card-details/selected-flight-and-hotel-details";

/**
 * Type Guards to check the type of `result` based on the toolName
 */
const isFlightArray = (
  result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
): result is Flight[] => {
  return !!result && (result as Flight[])[0]?.departure !== undefined;
};

const isHotelArray = (
  result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
): result is Hotel[] => {
  return !!result && (result as Hotel[])[0]?.hotelName !== undefined;
};

const isRestaurantArray = (
  result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
): result is Restaurant[] => {
  return !!result && (result as Restaurant[])[0]?.cuisine !== undefined;
};

const isTourArray = (
  result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
): result is Tour[] => {
  return !!result && (result as Tour[])[0]?.destination !== undefined;
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
    restaurants: VisibilityControl;
    tours: VisibilityControl;
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

                        case "displayRestaurantCard":
                          if (isRestaurantArray(result)) {
                            return renderRestaurantCards(
                              result,
                              messageIndex,
                              invocationIndex,
                              visibilityControls.restaurants
                            );
                          }
                          break;

                        case "displayTourCard":
                          if (isTourArray(result)) {
                            return renderTourCards(
                              result,
                              messageIndex,
                              invocationIndex,
                              visibilityControls.tours
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
  flights: Flight[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl,
  onFlightCardClick: (flightInfo: Flight) => void
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {flights
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((flight: Flight) => (
          <FlightCard
            onFlightCardClick={onFlightCardClick}
            key={flight.id}
            {...flight}
          />
        ))}
      {renderVisibilityButtons(
        flights.length,
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

const renderRestaurantCards = (
  restaurants: Restaurant[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {restaurants
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((restaurant: Restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))}
      {renderVisibilityButtons(
        restaurants.length,
        messageIndex,
        invocationIndex,
        visibilityControl
      )}
    </div>
  );
};

const renderTourCards = (
  tours: Tour[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {tours
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((tour: Tour) => (
          <TourCard key={tour.id} {...tour} />
        ))}
      {renderVisibilityButtons(
        tours.length,
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
    case "displayRestaurantCard":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      );
    case "displayTourCard":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default MessageList;
