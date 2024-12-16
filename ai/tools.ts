import { tool as createTool } from "ai";
import { z } from "zod";

// export const FlightTool = createTool({
//   description: "Display a grid of flight cards",
//   parameters: z.object({
//     departureCity: z.string(), // Name of the departure city
//     destinationCity: z.string(), // Name of the destination city
//     date: z.string(), // Date of departure
//   }),
//   execute: async function ({ departureCity, destinationCity, date }) {
//     // Helper function to fetch city data and determine if it's domestic or international
//     const fetchCityData = async (cityName: string) => {
//       // First, try fetching the city as a domestic city
//       const domesticResponse = await fetch(
//         `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}`
//       );
//       if (domesticResponse.ok) {
//         const domesticData = await domesticResponse.json();
//         if (domesticData.data.results.length > 0) {
//           return {
//             id: domesticData.data.results[0].id,
//             isDomestic: true, // Mark as domestic
//           };
//         }
//       }

//       // If not found as domestic, try fetching as an international city
//       const internationalResponse = await fetch(
//         `https://api.atripa.ir/api/v2/basic/intl/cities?search=${cityName}`
//       );
//       if (internationalResponse.ok) {
//         const internationalData = await internationalResponse.json();
//         if (internationalData.data.length > 0) {
//           return {
//             id: internationalData.data[0].id,
//             isDomestic: false, // Mark as international
//           };
//         }
//       }

//       // If city is not found in either API, throw an error
//       throw new Error(
//         `City "${cityName}" not found in domestic or international cities`
//       );
//     };

//     // Fetch data for both departure and destination cities
//     const [departureData, destinationData] = await Promise.all([
//       fetchCityData(departureCity),
//       fetchCityData(destinationCity),
//     ]);

//     // Check if we have valid IDs for both cities
//     if (!departureData.id || !destinationData.id) {
//       throw new Error("Invalid city names provided");
//     }

//     // Determine which API to call based on the cities' domestic status
//     const isDomesticFlight =
//       departureData.isDomestic && destinationData.isDomestic;
//     const apiUrl = isDomesticFlight
//       ? `https://api.atripa.ir/api/v2/reserve/flight/list/?departure=${departureData.id}&destination=${destinationData.id}&round_trip=false&date=${date}`
//       : `https://api.atripa.ir/api/v2/reserve/foreign-flight/list/?departure=${departureData.id}&destination=${destinationData.id}&round_trip=false&date=${date}`;

//     // Fetch flight data using the appropriate API
//     const flightResponse = await fetch(apiUrl);

//     if (!flightResponse.ok) {
//       throw new Error("Failed to fetch flight data");
//     }

//     const flightData = await flightResponse.json();

//     // Handle various error cases based on API response
//     if (flightData.message === "Error acquired" && flightData.errors) {
//       let errorMessage = "متاسفم، مشکلی پیش آمده: ";

//       // Check for specific error messages
//       if (flightData.errors.date) {
//         errorMessage += flightData.errors.date.join(", ");
//       } else {
//         errorMessage += "لطفاً اطلاعات ورودی را بررسی کنید.";
//       }

//       return {
//         message: errorMessage,
//         flights: [],
//       };
//     }

//     // Check if there are any flights available
//     if (flightData.data.list.length === 0) {
//       return {
//         message: `متاسفم، پروازی برای ${departureCity} به ${destinationCity} در تاریخ ${date} پیدا نشد. لطفاً تاریخ یا مقصد دیگری را امتحان کنید.`,
//         flights: [], // Return an empty array for flights
//       };
//     }

//     // Assuming flightData.data.list is an array of flight objects
//     return flightData.data.list.map(
//       (flight: {
//         airline_persian: any;
//         flight_number: any;
//         departure_date: any;
//         departure_time: any;
//         arrival_date: any;
//         destination_time: any;
//         adult_price: any;
//         departure_name: any;
//         destination_name: any;
//         aircraft: any;
//         baggage: any;
//         airline_logo: any;
//       }) => ({
//         airline: flight.airline_persian,
//         flightNumber: flight.flight_number,
//         departureTime: `${flight.departure_date}- ${flight.departure_time}`,
//         arrivalTime: `${flight.arrival_date}- ${flight.destination_time}`, // Adjust as necessary if destination_time is not available
//         price: flight.adult_price,
//         departure: flight.departure_name,
//         destination: flight.destination_name,
//         aircraft: flight.aircraft,
//         baggage: flight.baggage,
//         airlineLogo: flight.airline_logo,
//       })
//     );
//   },
// });

export const FlightTool = createTool({
  description: "Display a grid of flight cards",
  parameters: z.object({
    departureCity: z.string(), // Name of the departure city
    destinationCity: z.string(), // Name of the destination city
    date: z.string(), // Date of departure
  }),
  execute: async function ({ departureCity, destinationCity, date }) {
    // Helper function to fetch city data and determine if it's domestic or international
    const fetchCityData = async (cityName: string) => {
      // First, try fetching the city as a domestic city
      const domesticResponse = await fetch(
        `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}`
      );
      if (domesticResponse.ok) {
        const domesticData = await domesticResponse.json();
        if (domesticData.data.results.length > 0) {
          return {
            id: domesticData.data.results[0].id,
            isDomestic: true, // Mark as domestic
          };
        }
      }

      // If not found as domestic, try fetching as an international city
      const internationalResponse = await fetch(
        `https://api.atripa.ir/api/v2/basic/intl/cities?search=${cityName}`
      );
      if (internationalResponse.ok) {
        const internationalData = await internationalResponse.json();
        if (internationalData.data.length > 0) {
          return {
            id: internationalData.data[0].id,
            isDomestic: false, // Mark as international
          };
        }
      }

      // If city is not found in either API, throw an error
      throw new Error(
        `City "${cityName}" not found in domestic or international cities`
      );
    };

    // Fetch data for both departure and destination cities
    const [departureData, destinationData] = await Promise.all([
      fetchCityData(departureCity),
      fetchCityData(destinationCity),
    ]);

    // Check if we have valid IDs for both cities
    if (!departureData.id || !destinationData.id) {
      throw new Error("Invalid city names provided");
    }

    // Determine which API to call based on the cities' domestic status
    const isDomesticFlight =
      departureData.isDomestic && destinationData.isDomestic;
    const apiUrl = isDomesticFlight
      ? `https://api.atripa.ir/api/v2/reserve/flight/list/?departure=${departureData.id}&destination=${destinationData.id}&round_trip=false&date=${date}`
      : `https://api.atripa.ir/api/v2/reserve/foreign/flight/list/?departure=${departureData.id}&destination=${destinationData.id}&adult=1&child=0&infant=0&round_trip=false&date=${date}`;

    // Fetch flight data using the appropriate API
    const flightResponse = await fetch(apiUrl);

    if (!flightResponse.ok) {
      throw new Error("Failed to fetch flight data");
    }

    const flightData = await flightResponse.json();

    // Log the raw API response for debugging
    console.log("Raw API Response:", JSON.stringify(flightData, null, 2));

    // Handle various error cases based on API response
    if (flightData.message === "Error acquired" && flightData.errors) {
      let errorMessage = "متاسفم، مشکلی پیش آمده: ";

      // Check for specific error messages
      if (flightData.errors.date) {
        errorMessage += flightData.errors.date.join(", ");
      } else {
        errorMessage += "لطفاً اطلاعات ورودی را بررسی کنید.";
      }

      return {
        message: errorMessage,
        flights: [],
      };
    }

    // Check if there are any flights available
    if (isDomesticFlight) {
      if (flightData.data.list.length === 0) {
        return {
          message: `متاسفم، پروازی برای ${departureCity} به ${destinationCity} در تاریخ ${date} پیدا نشد. لطفاً تاریخ یا مقصد دیگری را امتحان کنید.`,
          flights: [], // Return an empty array for flights
        };
      }
    } else {
      if (flightData.data.results.list.length === 0) {
        return {
          message: `متاسفم، پروازی برای ${departureCity} به ${destinationCity} در تاریخ ${date} پیدا نشد. لطفاً تاریخ یا مقصد دیگری را امتحان کنید.`,
          flights: [], // Return an empty array for flights
        };
      }
    }

    // Normalize the flight data for both domestic and international flights
    let flights = [];
    if (isDomesticFlight) {
      flights = flightData.data.list.map((flight) => ({
        airline: flight.airline_persian,
        flightNumber: flight.flight_number,
        departureTime: `${flight.departure_date}- ${flight.departure_time}`,
        arrivalTime: `${flight.arrival_date}- ${flight.destination_time}`,
        price: flight.adult_price,
        departure: flight.departure_name,
        destination: flight.destination_name,
        aircraft: flight.aircraft,
        baggage: flight.baggage,
        airlineLogo: flight.airline_logo,
      }));
    } else {
      flights = flightData.data.results.list.map((flight) => {
        const firstSegment = flight.segments[0]; // First segment (departure details)
        const lastSegment = flight.segments[flight.segments.length - 1]; // Last segment (arrival details)
        const normalizedFlight = {
          airline: firstSegment.airline.persian, // Airline name in Persian
          flightNumber: firstSegment.flight_number, // Flight number
          departureTime: `${firstSegment.departure_date}- ${firstSegment.departure_time}`, // Departure time
          arrivalTime: `${lastSegment.arrival_date}- ${lastSegment.destination_time}`, // Arrival time
          price: flight.fares.adult.total_price, // Price for adults
          departure: firstSegment.departure.city.persian, // Departure city in Persian
          destination: lastSegment.destination.city.persian, // Destination city in Persian
          baggage: firstSegment.baggage, // Baggage allowance
          airlineLogo: firstSegment.airline.image, // Airline logo
        };

        // Log the normalized flight data for debugging
        console.log(
          "Normalized Flight Data:",
          JSON.stringify(normalizedFlight, null, 2)
        );

        return normalizedFlight;
      });
    }

    // Log the final response sent to the AI
    console.log("Response Sent to AI:", JSON.stringify(flights, null, 2));

    return flights;
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
