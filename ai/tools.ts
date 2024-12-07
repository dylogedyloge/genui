import { tool as createTool } from "ai";
import { z } from "zod";

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
        airline: "امیر ایر",
        flightNumber: "123123 A32",
        departureTime: "13 مهر 1403",
        arrivalTime: "24 مهر 1403",
        status: "On Time",
        price: 400000,
      },
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
    return [
      {
        hotelName: "هتل درویشی",
        location,
        checkIn: "24 بهمن 1403",
        checkOut: "29بهمن 1403",
        roomType: "لوکس",
        price: 850000,
        rating: 4.6,
      },
      {
        hotelName: "هتل امارات",
        location,
        checkIn: "12 بهمن 1401",
        checkOut: "13بهمن 1401",
        roomType: "لاکچری",
        price: 2350000,
        rating: 4.2,
      },
      {
        hotelName: "هتل امیر",
        location,
        checkIn: "09 خرداد 1402",
        checkOut: "10خرداد 1402",
        roomType: "معممولی",
        price: 120000,
        rating: 4.9,
      },
      {
        hotelName: "هتل آبان",
        location,
        checkIn: "13 آبان 1403",
        checkOut: "14آبان 1403",
        roomType: "لوکس",
        price: 910000,
        rating: 3.9,
      },
      {
        hotelName: "هتل امیرشاهان",
        location,
        checkIn: "24 بهمن 1403",
        checkOut: "29بهمن 1403",
        roomType: "وی آی پی",
        price: 1850000,
        rating: 4.9,
      },
      {
        hotelName: "هتل کانتیننتال",
        location,
        checkIn: "23 اردیبهشت 1403",
        checkOut: "24اردیبهشت 1403",
        roomType: "لوکس",
        price: 340000,
        rating: 4.7,
      },
    ];
  },
});
export const RestaurantTool = createTool({
  description: "Display the restaurant card for a restaurant",
  parameters: z.object({
    location: z.string(),
  }),
  execute: async function ({ location }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return [
      {
        name: "رستوران فرنو",
        cuisine: "ایتالیایی",
        location,
        openingTime: "9 صبح",
        closingTime: "12 شب",
        rating: 4.6,
        priceRange: 850000,
      },
      {
        name: "کافه دیدار",
        cuisine: "فرانسوی",
        location,
        openingTime: "8 صبح",
        closingTime: "11 شب",
        rating: 4.3,
        priceRange: 500000,
      },
      {
        name: "فست‌فود برگ سبز",
        cuisine: "فست‌فود",
        location,
        openingTime: "11 صبح",
        closingTime: "1 بامداد",
        rating: 4.7,
        priceRange: 300000,
      },
      {
        name: "رستوران شب‌های تهران",
        cuisine: "ایرانی",
        location,
        openingTime: "10 صبح",
        closingTime: "11 شب",
        rating: 4.5,
        priceRange: 600000,
      },
      {
        name: "کافه سیمرغ",
        cuisine: "ترکی",
        location,
        openingTime: "9 صبح",
        closingTime: "12 شب",
        rating: 4.8,
        priceRange: 750000,
      },
      {
        name: "رستوران بام سبز",
        cuisine: "مدیترانه‌ای",
        location,
        openingTime: "12 ظهر",
        closingTime: "2 بامداد",
        rating: 4.2,
        priceRange: 950000,
      },
      {
        name: "رستوران طهران قدیم",
        cuisine: "سنتی",
        location,
        openingTime: "10 صبح",
        closingTime: "10 شب",
        rating: 4.4,
        priceRange: 400000,
      },
    ];
  },
});
export const TourTool = createTool({
  description: "Display the tour card for a tour",
  parameters: z.object({
    destination: z.string(),
  }),
  execute: async function ({ destination }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return [
      {
        name: "تور اهرام مصر",
        destination,
        duration: "7 روز",
        startDate: "14 دی 1403",
        endDate: "21 دی 1403",
        groupSize: "50 نفر",
        price: "1200000",
        category: "ماجراجویی",
      },
      {
        name: "تور جزایر مالدیو",
        destination,
        duration: "5 روز",
        startDate: "10 بهمن 1403",
        endDate: "15 بهمن 1403",
        groupSize: "20 نفر",
        price: "3000000",
        category: "استراحتی",
      },
      {
        name: "تور طبیعت‌گردی گیلان",
        destination,
        duration: "3 روز",
        startDate: "5 اسفند 1403",
        endDate: "8 اسفند 1403",
        groupSize: "35 نفر",
        price: "800000",
        category: "طبیعت‌گردی",
      },
    ];
  },
});

export const tools = {
  displayFlightCard: FlightTool,
  displayHotelCard: HotelTool,
  displayRestaurantCard: RestaurantTool,
  displayTourCard: TourTool,
};
