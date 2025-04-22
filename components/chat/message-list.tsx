import ReactMarkdown from "react-markdown";
import FlightCard from "@/components/cards/flight-card";
import HotelCard from "@/components/cards/hotel-card";

import { fetchCityData } from "@/ai/aiUtils/apiUtils";
import { API_ENDPOINTS } from "@/endpoints/endpoints";



import FlightCardSkeleton from "@/components/skeletons/flight-card-skeleton";
import HotelCardSkeleton from "@/components/skeletons/hotel-card-skeleton";
import PassengerCounter from "@/components/passenger-counter/passenger-counter";
import CabinTypeSelector from "@/components/cabin-type-selector/cabin-type-selector";

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

/**
 * Type Guards to check the type of `result` based on the toolName
 */

interface HotelResult {
  hotels: Hotel[];
  message: string;
  cityData: CityData;
}
interface FlightResult {
  flights: Flight[];
  departureCityData: CityData;
  destinationCityData: CityData;
  passengers?: { // This top-level passengers might be redundant now but keep for structure
    adult: number;
    child: number;
    infant: number;
  };
  showCabinTypeSelector?: boolean;
  showPassengerCounter?: boolean;
  message?: string;
  cabinType?: {
    id: number;
    name: string;
    value: string;
  };
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

const isHotelArray = (result: any): result is HotelResult => {
  return (
    result &&
    Array.isArray(result.hotels) &&
    result.cityData &&
    typeof result.message === "string"
  );
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
  const [showCabinTypeSelector, setShowCabinTypeSelector] = useState(false);
  const [cabinTypeSelectorMessage, setCabinTypeSelectorMessage] = useState("لطفا نوع پروازتان را انتخاب کنید");
  const [cityDataMap, setCityDataMap] = useState<{
    [key: string]: { departureCityData: CityData | null; destinationCityData: CityData | null };
  }>({});


  useEffect(() => {
    // Check if any tool invocation has showCabinTypeSelector or showPassengerCounter
    messages.forEach(message => {
      message.toolInvocations?.forEach(toolInvocation => {
        if (toolInvocation.state === "result") {
          // Check if result is a FlightResult before accessing flight-specific properties
          if (isFlightArray(toolInvocation.result) && toolInvocation.result.showCabinTypeSelector) {
            setShowCabinTypeSelector(true);
            if (toolInvocation.result.message) {
              setCabinTypeSelectorMessage(toolInvocation.result.message);
            }
          }
          // Check if result is a FlightResult before accessing passenger counter
          if (isFlightArray(toolInvocation.result) && toolInvocation.result.showPassengerCounter) {
            setShowPassengerCounter(true);
            if (toolInvocation.result.message) {
              setPassengerCounterMessage(toolInvocation.result.message);
            }
          }
        }
      });
    });
  }, [messages]);
  
  // Helper to generate a unique key for each message/tool invocation
  const getCityKey = (messageIndex: number, invocationIndex: number) =>
    `${messageIndex}_${invocationIndex}`;
  
    // Function to fetch city data
    const fetchCitiesData = async (departure: string, destination: string, messageIndex: number, invocationIndex: number) => {
      const [depCity, destCity] = await Promise.all([
        fetchCityData(departure, API_ENDPOINTS.DOMESTIC.CITIES, true),
        fetchCityData(destination, API_ENDPOINTS.DOMESTIC.CITIES, true)
      ]);
  
      setCityDataMap(prev => ({
        ...prev,
        [getCityKey(messageIndex, invocationIndex)]: {
          departureCityData: depCity,
          destinationCityData: destCity
        }
      }));
      return { departureCityData: depCity, destinationCityData: destCity };
    };



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
  const handleCabinTypeSelected = (cabinType: {
    id: number;
    name: string;
    value: string;
  }) => {
    // Hide the CabinTypeSelector component
    setShowCabinTypeSelector(false);
  
    // Call the FlightTool again with the selected cabin type
    console.log("Selected cabin type:", cabinType);
    // Example: retryFlightTool(cabinType);
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
                              {
                                ...result,
                                departureCityData: cityDataMap[getCityKey(messageIndex, invocationIndex)]?.departureCityData ?? result.departureCityData,
                                destinationCityData: cityDataMap[getCityKey(messageIndex, invocationIndex)]?.destinationCityData ?? result.destinationCityData,
                              },
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
      {showCabinTypeSelector && (
        <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground">
          <p>{cabinTypeSelectorMessage}</p>
          <CabinTypeSelector onSelect={handleCabinTypeSelected} />
        </div>
      )}
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
  result: FlightResult, // result contains { flights: Flight[], passengers?: {...}, ... }
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl,
  onFlightCardClick: (flightInfo: Flight) => void
) => {
  // Ensure city data exists before rendering, or provide defaults
  const departureCityData = result.departureCityData || { isDomestic: true }; // Provide a default or handle appropriately
  const destinationCityData = result.destinationCityData || { isDomestic: true }; // Provide a default or handle appropriately

  const defaultFares = {
    adult: { price: 0, count: 0, total_price: 0 },
    child: { price: 0, count: 0, total_price: 0 }, // Add defaults if needed
    infant: { price: 0, count: 0, total_price: 0 }, // Add defaults if needed
    total_price: 0,
    // Add any other expected properties within fares with default values
  };

  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {result.flights
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((flight: Flight) => (
          <FlightCard
            key={flight.id} 
            {...flight} 
            isClosed={flight.isClosed ?? false}
            visaRequirements={flight.visaRequirements ?? []}
            fares={flight.fares ?? defaultFares}
            segments={flight.segments ?? []}
            returnSegments={flight.returnSegments ?? []}
            with_tour={flight.with_tour ?? false}
            onFlightCardClick={onFlightCardClick}
            departureCityData={departureCityData}
            destinationCityData={destinationCityData}
            isDomestic={
              departureCityData.isDomestic &&
              destinationCityData.isDomestic
            }
          />
        ))}
      {renderVisibilityButtons(
        result.flights.length,
        messageIndex,
        invocationIndex,
        visibilityControl
      )}
    </div>
  );
};

const renderHotelCards = (
  result: HotelResult,
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl,
  onHotelCardClick: (hotelInfo: Hotel) => void
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {result.hotels
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((hotel: Hotel) => (
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
          onHotelCardClick={onHotelCardClick}
            // key={hotel.id}
            // onHotelCardClick={onHotelCardClick}
            // {...hotel}
          />
        ))}
      {renderVisibilityButtons(
        result.hotels.length,
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
