export interface ChatInterfaceProps {}

// Define the structure of the Flight, or Hotel
export interface Flight {
  id: number; // Unique identifier
  airline: string; // Airline name (e.g. "Mahan Air")
  airline_persian: string; // Persian airline name (e.g. "هواپیمایی ماهان")
  flightNumber: string; // Flight number (e.g. "W5-1080")
  departure: string; // Departure city name
  destination: string; // Destination city name
  departureTime: string; // Combined Departure date and time (e.g., "YYYY-MM-DDTHH:mm:ss")
  arrivalTime: string; // Combined Arrival date and time (e.g., "YYYY-MM-DDTHH:mm:ss")
  departure_date: string; // Departure date (e.g., "YYYY-MM-DD")
  arrival_date: string; // Arrival date (e.g., "YYYY-MM-DD")
  departure_time: string; // Departure time (e.g., "HH:mm:ss")
  destination_time: string; // Arrival time (e.g., "HH:mm:ss")
  price: number; // Price in Rials (usually adult price)
  airlineLogo: string; // URL to airline logo image
  type: string; // Flight type (e.g. "charter")
  capacity: number; // Available seats
  sellingType: string; // Selling type (e.g. "All")
  aircraft: string; // Aircraft type
  baggage: string; // Baggage allowance
  flightClass: string; // Flight class
  cobin: string; // Cabin class (e.g. "Economy")
  cobin_persian: string; // Persian cabin class
  persian_type: string; // Persian flight type
  refundable: boolean | null; // Whether flight is refundable
  child_price: number; // Child ticket price
  infant_price: number; // Infant ticket price
  departure_terminal: string; // Departure terminal
  destination_terminal: string; // Arrival terminal
  refund_rules: any[]; // Refund policy rules
  flight_duration: string; // Duration of flight
  with_tour: boolean | null; // Whether flight includes tour
  tag: string; // Additional tag info
  fare_source_code: string; // Fare source code
  isClosed?: boolean; // Optional: If applicable for international flights
  visaRequirements?: any; // Optional: If applicable for international flights
  fares?: any; // Optional: Detailed fare breakdown if available
  segments?: any[]; // Optional: For international flights with segments
  returnSegments?: any[]; // Optional: For international flights with segments
  status?: "On Time" | "Delayed" | "Cancelled"; // Flight status
  departureCityData: CityData; // Ensure CityData type is correctly imported/defined
  destinationCityData: CityData; // Ensure CityData type is correctly imported/defined
  onFlightCardClick?: (flight: Flight) => void; // Callback prop
  passengers?: {
    adult: number;
    child: number;
    infant: number;
  };
}

export interface CityData {
  id: number;
  name: string;
  english_name: string;
  iata: string;
  latitude: string;
  longitude: string;
  description: string | null;
  is_province_capital: boolean;
  is_country_capital: boolean;
  usage_flight: number;
  usage_accommodation: number;
  country: any; // Add specific type if available
  province: any; // Add specific type if available
  flight: any; // Add specific type if available
  accommodation: any; // Add specific type if available
  has_plan: boolean;
  parto_id: string;
  isDomestic: boolean;
}

export interface Hotel {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  price: number;
  rating: number;
  images: Array<{
    image: string;
    alt: string;
    caption: string | null;
  }>;
  address: string;
  star: number;
  type: string;
  rooms: Array<{
    room_type_name: string;
    room_type_capacity: number;
    rate_plans: Array<{
      name: string;
      cancelable: number;
      meal_type_included: string;
      prices: {
        total_price: number;
        inventory: number;
        has_off: boolean;
      };
    }>;
  }>;
  amenities?: string[];
}

// Tool Invocation for displaying flight, or hotel details
export interface ToolInvocation {
  toolName: string;
  toolCallId: string;
  state: "calling" | "result";
  result?: Flight[] | Hotel[];
}

// Message structure
export interface Message {
  role: string;
  content?: string;
  text?: string;
  timestamp: Date | string | number;
  toolInvocations?: ToolInvocation[];
  flightDetails?: Flight;
}

// Visibility control for showing more/less items
export interface VisibilityControl {
  map: Record<number, Record<number, number>>;
  showMore: (messageIndex: number, invocationIndex: number) => void;
  showLess: (messageIndex: number, invocationIndex: number) => void;
}
