import { ReactNode } from "react";

export interface ChatInterfaceProps {}

// Define the structure of the Flight, Hotel, Restaurant, and Tour
// export interface Flight {
//   destination: string; // Change from ReactNode to string
//   id: string; // Unique identifier for the flight
//   departure: string; // Departure city or airport name
//   arrival: string; // Arrival city or airport name
//   airline: string; // Airline name
//   flightNumber: string; // Flight number
//   departureTime: string; // Time of departure
//   arrivalTime: string; // Time of arrival
//   status: "On Time" | "Delayed" | "Cancelled"; // Status of the flight
//   price: number; // Price in local currency (e.g., Toman)
//   airlineLogo: string;
// }
export interface Flight {
  id: number; // Unique identifier for the flight
  departure: string; // Departure city or airport name
  destination: string; // Destination city or airport name
  airline: string; // Airline name
  flightNumber: string; // Flight number
  departureTime: string; // Time of departure (e.g., "2024-12-24 - 20:40")
  arrivalTime: string; // Time of arrival (e.g., "2024-12-24 - 22:00")
  price: number; // Price in local currency (e.g., Toman)
  airlineLogo: string; // URL of the airline logo
  type: string; // Type of flight (e.g., "charter")
  capacity: number; // Capacity of the flight
  sellingType: string; // Selling type (e.g., "All")
  aircraft: string; // Aircraft type (e.g., "Boeing MD")
  baggage: string;
  flightClass: string; // Class of the flight (e.g., "Economy")
  cobin: string; // Cabin type (e.g., "Economy")
  persian_type: string; // Persian type of flight (e.g., "چارتر")
  refundable: boolean | null; // Refundable status (true/false/null)
  child_price: number; // Price for children
  infant_price: number; // Price for infants
  departure_terminal: string; // Departure terminal (e.g., "Terminal 1")
  refund_rules: string[]; // Refund rules
  destination_terminal: string; // Destination terminal (e.g., "Terminal 2")
  flight_duration: string; // Flight duration (e.g., "1h 20m")
  cobin_persian: string; // Persian name for the cabin (e.g., "اکونومی")
  with_tour: boolean | null; // Whether the flight is with a tour package
  tag: string; // Tag for the flight (e.g., "zm")
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

export interface Restaurant {
  id: string; // Unique identifier for the restaurant
  name: string; // Name of the restaurant
  cuisine: string; // Type of cuisine (e.g., "Italian", "Persian")
  location: string; // Location of the restaurant
  openingTime: string; // Opening time of the restaurant
  closingTime: string; // Closing time of the restaurant
  rating: number; // Rating of the restaurant (e.g., out of 5 stars)
  priceRange: string; // Price range (e.g., "$$", "$$$")
}

export interface Tour {
  id: string; // Unique identifier for the tour
  name: string; // Name of the tour
  destination: string; // Destination of the tour
  duration: string; // Duration of the tour (e.g., "3 days")
  startDate: string; // Start date of the tour
  endDate: string; // End date of the tour
  groupSize: number; // Number of people in the tour group
  price: number; // Price of the tour (e.g., in Toman)
  category: string; // Category (e.g., "Adventure", "Luxury")
}

// Tool Invocation for displaying flight, hotel, restaurant, or tour details
export interface ToolInvocation {
  toolName: string;
  toolCallId: string;
  state: "calling" | "result";
  result?: Flight[] | Hotel[] | Restaurant[] | Tour[];
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
