import { tool as createTool } from "ai";
import { z } from "zod";

export const FlightTool = createTool({
  description: "Display the flight card for a flight",
  parameters: z.object({
    departure: z.string(),
    arrival: z.string(),
  }),
  execute: async function ({ departure, arrival }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      departure,
      arrival,
      airline: "ایران ایر",
      flightNumber: "123 A32",
      departureTime: "23 خرداد 1403",
      arrivalTime: "24 خرداد 1403",
      status: "On Time",
      price: 10400000,
    };
  },
});

export const HotelTool = createTool({
  description: "Display the hotel card for a hotel",
  parameters: z.object({
    location: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
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
    checkIn: z.string(),
    checkOut: z.string(),
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

export const tools = {
  displayFlightCard: FlightTool,
  displayHotelCard: HotelTool,
  displayRestaurantCard: RestaurantTool,
  displayTourCard: TourTool,
};
// import { tool as createTool } from "ai";
// import { z } from "zod";

// export const WeatherTool = createTool({
//   description: "Display the weather for a location",
//   parameters: z.object({
//     location: z.string(),
//   }),
//   execute: async function ({ location }) {
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     return {
//       temperature: 75,
//       weather: "sunny",
//       location,
//     };
//   },
// });

// export const tools = {
//   displayWeather: WeatherTool,
// };
