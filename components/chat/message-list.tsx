// components/chat/MessageList.tsx
import ReactMarkdown from "react-markdown";
import { User } from "lucide-react";
import { GiHolosphere } from "react-icons/gi";

import { FlightCard } from "@/components/flight-card";
import { HotelCard } from "@/components/hotel-card";
import RestaurantCard from "@/components/restaurant-card";
import TourCard from "@/components/tour-card";

import { FlightCardSkeleton } from "@/components/flight-card-skeleton";
import { HotelCardSkeleton } from "@/components/hotel-card-skeleton";
import { RestaurantCardSkeleton } from "@/components/restaurant-card-skeleton";
import { TourCardSkeleton } from "@/components/tour-card-skeleton";

import { formatPersianTime } from "@/utils/time-helpers";
import { Message, ToolInvocation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  stop: () => void;
  error: Error | null;
  reload: () => void;
  mounted: boolean;
  visibilityControls: {
    flights: { map: any; showMore: Function; showLess: Function };
    hotels: { map: any; showMore: Function; showLess: Function };
    restaurants: { map: any; showMore: Function; showLess: Function };
    tours: { map: any; showMore: Function; showLess: Function };
  };
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  stop,
  error,
  reload,
  mounted,
  visibilityControls,
}) => {
  return (
    <div className="flex-grow overflow-auto space-y-4 mb-4">
      {messages.map((message, messageIndex) => (
        <div
          key={messageIndex}
          className={`flex ${message.isUser ? "justify-start" : "justify-end"}`}
        >
          {message.isUser ? (
            <>
              <User className="w-6 h-6 ml-4" />
              <div className="max-w-[70%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tr-none">
                <ReactMarkdown className="prose-sm text-sm">
                  {message.text}
                </ReactMarkdown>
                {mounted && (
                  <p className="text-xs opacity-50 text-left mt-1">
                    {formatPersianTime(message.timestamp)}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="max-w-full md:max-w-[70%] p-3 rounded-lg bg-primary text-primary-foreground rounded-tl-none">
                <ReactMarkdown className="prose-sm text-sm">
                  {message.text}
                </ReactMarkdown>
                {mounted && (
                  <p className="text-xs opacity-50 text-left mt-1">
                    {formatPersianTime(message.timestamp)}
                  </p>
                )}

                {/* Tool invocations */}
                {message.toolInvocations?.map(
                  (toolInvocation: ToolInvocation, invocationIndex: number) => {
                    const { toolName, state, result } = toolInvocation;

                    if (state === "result") {
                      // Handle different tool cards (flights, hotels, restaurants, tours)
                      switch (toolName) {
                        case "displayFlightCard":
                          return renderFlightCards(
                            result,
                            messageIndex,
                            invocationIndex,
                            visibilityControls.flights
                          );
                        case "displayHotelCard":
                          return renderHotelCards(
                            result,
                            messageIndex,
                            invocationIndex,
                            visibilityControls.hotels
                          );
                        case "displayRestaurantCard":
                          return renderRestaurantCards(
                            result,
                            messageIndex,
                            invocationIndex,
                            visibilityControls.restaurants
                          );
                        case "displayTourCard":
                          return renderTourCards(
                            result,
                            messageIndex,
                            invocationIndex,
                            visibilityControls.tours
                          );
                        default:
                          return null;
                      }
                    } else {
                      // Show skeleton while loading
                      return (
                        <div key={toolInvocation.toolCallId} className="mt-2">
                          {getSkeletonForTool(toolName)}
                        </div>
                      );
                    }
                  }
                )}
              </div>
              <GiHolosphere className="w-6 h-6 mr-4" />
            </>
          )}
        </div>
      ))}

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
  flights: any[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: { map: any; showMore: Function; showLess: Function }
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {flights
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((flight: any, flightIndex: number) => (
          <FlightCard key={flightIndex} {...flight} />
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
  hotels: any[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: { map: any; showMore: Function; showLess: Function }
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {hotels
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((hotel: any, hotelIndex: number) => (
          <HotelCard key={hotelIndex} {...hotel} />
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
  restaurants: any[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: { map: any; showMore: Function; showLess: Function }
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {restaurants
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((restaurant: any, restaurantIndex: number) => (
          <RestaurantCard key={restaurantIndex} {...restaurant} />
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
  tours: any[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: { map: any; showMore: Function; showLess: Function }
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {tours
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((tour: any, tourIndex: number) => (
          <TourCard key={tourIndex} {...tour} />
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
  visibilityControl: { map: any; showMore: Function; showLess: Function }
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
 * Return skeleton components based on tool type
 */
const getSkeletonForTool = (toolName: string) => {
  switch (toolName) {
    case "displayFlightCard":
      return <FlightCardSkeleton />;
    case "displayHotelCard":
      return <HotelCardSkeleton />;
    case "displayRestaurantCard":
      return <RestaurantCardSkeleton />;
    case "displayTourCard":
      return <TourCardSkeleton />;
    default:
      return null;
  }
};

export default MessageList;
