import { tool as createTool } from "ai";
import { z } from "zod";

// export const FlightTool = createTool({
//   description: "Display the flight card for a flight",
//   parameters: z.object({
//     departure: z.string(),
//     arrival: z.string(),
//   }),
//   execute: async function ({ departure, arrival }) {
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     return {
//       departure,
//       arrival,
//       airline: "ایران ایر",
//       flightNumber: "123 A32",
//       departureTime: "23 خرداد 1403",
//       arrivalTime: "24 خرداد 1403",
//       status: "On Time",
//       price: 10400000,
//     };
//   },
// });
export const FlightTool = createTool({
  description: "Display a grid of flight cards",
  parameters: z.object({
    departure: z.string(),
    arrival: z.string(),
  }),
  execute: async function ({ departure, arrival }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Ensure the tool is returning an array of flight data
    return [
      {
        departure,
        arrival,
        airline: "ایران ایر",
        flightNumber: "123 A32",
        departureTime: "23 خرداد 1403",
        arrivalTime: "24 خرداد 1403",
        status: "On Time",
        price: 10400000,
      },
      {
        departure,
        arrival,
        airline: "ماهان ایر",
        flightNumber: "456 B78",
        departureTime: "22 خرداد 1403",
        arrivalTime: "22 خرداد 1403",
        status: "On Time",
        price: 9800000,
      },
      {
        departure,
        arrival,
        airline: "کیش ایر",
        flightNumber: "789 C54",
        departureTime: "21 خرداد 1403",
        arrivalTime: "21 خرداد 1403",
        status: "Delayed",
        price: 12000000,
      },
      {
        departure,
        arrival,
        airline: "تابان ایر",
        flightNumber: "101 D23",
        departureTime: "20 خرداد 1403",
        arrivalTime: "21 خرداد 1403",
        status: "Cancelled",
        price: 8500000,
      },
    ];
  },
});
export const HotelTool = createTool({
  description: "Display the hotel card for a hotel",
  parameters: z.object({
    location: z.string(),
  }),
  execute: async function ({ location }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      hotelName: "هتل درویشی",
      location,
      checkIn: "24 بهمن 1403",
      checkOut: "29بهمن 1403",
      roomType: "لوکس",
      price: 850000,
      rating: 4.6,
    };
  },
});
export const RestaurantTool = createTool({
  description: "Display the restaurant card for a restaurant",
  parameters: z.object({
    location: z.string(),
  }),
  execute: async function ({ location }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      name: "رستوران فرنو",
      cuisine: "ایتالیایی",
      location,
      openingTime: "9 صبح",
      closingTime: "12 شب",
      rating: 4.6,
      priceRange: 850000,
    };
  },
});
export const TourTool = createTool({
  description: "Display the tour card for a tour",
  parameters: z.object({
    destination: z.string(),
  }),
  execute: async function ({ destination }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      name: "تور اهرام مصر",
      destination,
      duration: " 7 روز",
      startDate: " 14 دی 1403",
      endDate: "21 دی 1403",
      groupSize: "50 نفر",
      price: " 1200000",
      category: " ماجراجویی",
    };
  },
});
export const ItineraryTool = createTool({
  description: "Display the Itinerary card for an Itinerary",
  parameters: z.object({
    destination: z.string(),
  }),
  execute: async function ({ destination }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      name: "تور اهرام مصر",
      destination,
      duration: " 7 روز",
      startDate: " 14 دی 1403",
      endDate: "21 دی 1403",
      groupSize: "50 نفر",
      price: " 1200000",
      category: " ماجراجویی",
    };
  },
});

export const tools = {
  displayFlightCard: FlightTool,
  displayHotelCard: HotelTool,
  displayRestaurantCard: RestaurantTool,
  displayTourCard: TourTool,
  displayItineraryCard: ItineraryTool,

};
