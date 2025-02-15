export interface ChatInterfaceProps {}

// Define the structure of the Flight, or Hotel
export interface Flight {
  id: number; // Unique identifier
  airline: string; // Airline name (e.g. "هواپیمایی ماهان")
  flightNumber: string; // Flight number (e.g. "W5-1080")
  departure: string; // Departure city name
  destination: string; // Destination city name
  departureTime: string; // Departure date and time
  arrivalTime: string; // Arrival date and time
  price: number; // Price in Rials
  airlineLogo: string; // URL to airline logo image

  // Additional properties found in codebase
  type: string; // Flight type (e.g. "charter")
  capacity: number; // Available seats
  sellingType: string; // Selling type (e.g. "All")
  aircraft: string; // Aircraft type
  baggage: string; // Baggage allowance
  flightClass: string; // Flight class
  cobin: string; // Cabin class (e.g. "Economy")
  persian_type: string; // Persian flight type
  refundable: boolean | null; // Whether flight is refundable
  child_price: number; // Child ticket price
  infant_price: number; // Infant ticket price
  departure_terminal: string; // Departure terminal
  refund_rules: []; // Refund policy rules
  destination_terminal: string; // Arrival terminal
  flight_duration: string; // Duration of flight
  cobin_persian: string; // Persian cabin class
  with_tour: boolean | null; // Whether flight includes tour
  tag: string; // Additional tag info
  status?: "On Time" | "Delayed" | "Cancelled"; // Flight status
  departureCityData: any;
  destinationCityData: any;
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
  id: string; // Unique identifier for the hotel
  hotelName: string; // Name of the hotel
  location: string; // Location of the hotel
  checkIn: string; // Check-in date
  checkOut: string; // Check-out date
  roomType: string; // Room type (e.g., "Deluxe", "Suite")
  price: number; // Price per night in local currency (e.g., Toman)
  rating: number; // Hotel rating (e.g., out of 5 stars)
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
