import { tool as createTool } from 'ai';
import { z } from 'zod';

export const FlightTool = createTool({
  description: 'Display the flight card for a flight',
  parameters: z.object({
    departure: z.string(),
    arrival: z.string(),
  }),
  execute: async function ({ departure, arrival }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      departure,
      arrival,
      airline: 'ایران ایر',
      flightNumber: "123 A32",
      departureTime: "23 خرداد 1403",
      arrivalTime: "24 خرداد 1403",
      status: "On Time",
      price: 10400000
    };
  },
});

// export const HotelTool = createTool({
//   description: 'Display the hotel card for a hotel',
//   parameters: z.object({
//     location: z.string(),
//     checkInDate: z.string(),
//     checkOutDate: z.string(),
//   }),
//   execute: async function ({ location, checkInDate, checkOutDate }) {
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     return {
//       hotelName: 'Grand Hotel',
//       location,
//       checkInDate,
//       checkOutDate,
//       pricePerNight: 150,
//       status: 'Available',
//     };
//   },
// });

export const tools = {
  displayFlightCard: FlightTool,
  // displayHotelCard: HotelTool,
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
