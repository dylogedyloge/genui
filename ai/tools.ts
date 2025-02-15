import { tool as createTool } from "ai";
import { z } from "zod";
import {
  determineFlightType,
  constructApiUrl,
  transformFlightData,
} from "./aiUtils";
import { API_ENDPOINTS } from "../endpoints/endpoints";

// UNIFIED VERSION OF FLIGHTTOOL
// // Helper function to fetch city data from the API
// const fetchCityData = async (cityName: string, apiEndpoint: string, isDomestic: boolean) => {
//   console.log(`Checking ${apiEndpoint}?search=${cityName}`);
//   const response = await fetch(`${apiEndpoint}?search=${cityName}`);
//   if (response.ok) {
//     const data = await response.json();
//     if (isDomestic) {
//       // Domestic API response structure
//       if (Array.isArray(data.data.results) && data.data.results.length > 0) {
//         return data.data.results[0]; // Return the first match
//       }
//     } else {
//       // International API response structure
//       if (Array.isArray(data.data) && data.data.length > 0) {
//         return data.data[0]; // Return the first match
//       }
//     }
//   } else {
//     console.error(`Failed to fetch city data for ${cityName}`);
//   }
//   return null;
// };

// // Function to determine if a flight is domestic or international
// const determineFlightType = async (departureCity: string, destinationCity: string) => {
//   const domesticDepartureData = await fetchCityData(
//     departureCity,
//     API_ENDPOINTS.DOMESTIC.CITIES,
//     true // isDomestic
//   );
//   const domesticDestinationData = await fetchCityData(
//     destinationCity,
//     API_ENDPOINTS.DOMESTIC.CITIES,
//     true // isDomestic
//   );

//   if (domesticDepartureData && domesticDestinationData) {
//     return {
//       isDomestic: true,
//       departureId: domesticDepartureData.id,
//       destinationId: domesticDestinationData.id,
//     };
//   }

//   const internationalDepartureData = await fetchCityData(
//     departureCity,
//     API_ENDPOINTS.INTERNATIONAL.CITIES,
//     false // isDomestic
//   );
//   const internationalDestinationData = await fetchCityData(
//     destinationCity,
//     API_ENDPOINTS.INTERNATIONAL.CITIES,
//     false // isDomestic
//   );

//   if (!internationalDepartureData || !internationalDestinationData) {
//     throw new Error(
//       `One or both cities not found in the international database: ${departureCity}, ${destinationCity}`
//     );
//   }

//   return {
//     isDomestic: false,
//     departureId: internationalDepartureData.id,
//     destinationId: internationalDestinationData.id,
//   };
// };

// // Function to construct the API URL based on flight type
// const constructApiUrl = (isDomestic: boolean, departureId: string, destinationId: string, date: string) => {
//   if (isDomestic) {
//     return `${API_ENDPOINTS.DOMESTIC.FLIGHTS}?departure=${departureId}&destination=${destinationId}&round_trip=false&date=${date}`;
//   }

//   const params = new URLSearchParams({
//     departure: departureId.toString(),
//     destination: destinationId.toString(),
//     round_trip: "false",
//     date: date,
//     adult: "1",
//     child: "0",
//     infant: "0",
//   });
//   return `${API_ENDPOINTS.INTERNATIONAL.FLIGHTS}/?${params}`;
// };

// // Function to fetch flight data from the appropriate API
// const fetchFlightData = async (apiUrl: string, isDomestic: boolean) => {
//   const flightResponse = await fetch(apiUrl, {
//     method: isDomestic ? "GET" : "POST",
//     headers: isDomestic ? {} : { Accept: "application/json" },
//   });

//   if (!flightResponse.ok) {
//     throw new Error(`Failed to fetch flight data: ${flightResponse.statusText}`);
//   }

//   return await flightResponse.json();
// };

// // Function to transform flight data into a consistent format
// const transformFlightData = (flightData: any, isDomestic: boolean) => {
//   if (isDomestic) {
//     return flightData.data.list.map((flight: any) => ({
//       airline: flight.airline_persian,
//       fareSourceCode: flight.fare_source_code,
//       flightNumber: flight.flight_number,
//       departureTime: `${flight.departure_date}- ${flight.departure_time}`,
//       arrivalTime: `${flight.arrival_date}- ${flight.destination_time}`,
//       price: flight.adult_price,
//       departure: flight.departure_name,
//       destination: flight.destination_name,
//       baggage: flight.baggage,
//       airlineLogo: flight.airline_logo,
//     }));
//   }

//   return flightData.data.results.list.map((flight: any) => {
//     const firstSegment = flight.segments[0];
//     const lastSegment = flight.segments[flight.segments.length - 1];
//     return {
//       airline: firstSegment.airline.persian,
//       flightNumber: firstSegment.flight_number,
//       departureTime: `${firstSegment.departure_date}- ${firstSegment.departure_time}`,
//       arrivalTime: `${lastSegment.arrival_date}- ${lastSegment.destination_time}`,
//       price: flight.fares.adult.total_price,
//       departure: firstSegment.departure.city.persian,
//       destination: lastSegment.destination.city.persian,
//       baggage: firstSegment.baggage,
//       airlineLogo: firstSegment.airline.image,
//     };
//   });
// };

// // Main FlightTool function
// export const FlightTool = createTool({
//   description: "Display a grid of flight cards",
//   parameters: z.object({
//     departureCity: z.string(),
//     destinationCity: z.string(),
//     date: z.string(),
//   }),
//   execute: async function ({ departureCity, destinationCity, date }) {
//     if (!date) {
//       return {
//         message: "لطفاً تاریخ پرواز رو به من بگین.",
//         flights: [],
//       };
//     }

//     try {
//       // Determine flight type and get city IDs
//       const { isDomestic, departureId, destinationId } = await determineFlightType(
//         departureCity,
//         destinationCity
//       );

//       // Construct the API URL
//       const apiUrl = constructApiUrl(isDomestic, departureId, destinationId, date);

//       // Fetch flight data
//       const flightData = await fetchFlightData(apiUrl, isDomestic);

//       // Transform flight data into a consistent format
//       const flights = transformFlightData(flightData, isDomestic);

//       return {
//         flights,
//         departureCityData: { isDomestic },
//         destinationCityData: { isDomestic },
//       };
//     } catch (error) {
//       console.error("Error fetching flight data:", error);
//       return {
//         message:
//           "متاسفم، در حال حاضر نمی‌توانیم اطلاعات پرواز را به شما بدهیم. لطفاً بعداً دوباره امتحان کنید.",
//         flights: [],
//       };
//     }
//   },
// });
export const FlightTool = createTool({
  description: "Display a grid of flight cards",
  parameters: z.object({
    departureCity: z.string(),
    destinationCity: z.string(),
    date: z.string(),
    passengers: z
      .object({
        adult: z.number(),
        child: z.number(),
        infant: z.number(),
      })
      .optional(),
  }),
  execute: async function ({
    departureCity,
    destinationCity,
    date,
    passengers,
  }) {
    if (!date) {
      return {
        message: "لطفاً تاریخ پرواز رو به من بگین.",
        flights: [],
      };
    }

    if (!passengers) {
      return {
        message: "لطفاً تعداد مسافران رو بهم بگین.",
        showPAssengerCounter: true,
      };
    }

    try {
      // Determine flight type and get city IDs
      const { isDomestic, departureId, destinationId } =
        await determineFlightType(departureCity, destinationCity);

      // Construct the API URL
      const apiUrl = constructApiUrl(
        isDomestic,
        departureId,
        destinationId,
        date,
        passengers
      );

      // Fetch flight data
      const flightResponse = await fetch(apiUrl, {
        method: isDomestic ? "GET" : "POST",
        headers: isDomestic ? {} : { Accept: "application/json" },
      });

      if (!flightResponse.ok) {
        throw new Error(
          `Failed to fetch flight data: ${flightResponse.statusText}`
        );
      }

      const flightData = await flightResponse.json();

      // Transform flight data into a consistent format
      const flights = transformFlightData(flightData, isDomestic);

      return {
        flights,
        departureCityData: { isDomestic },
        destinationCityData: { isDomestic },
      };
    } catch (error) {
      console.error("Error fetching flight data:", error);
      return {
        message:
          "متاسفم، در حال حاضر نمی‌توانیم اطلاعات پرواز را به شما بدهیم. لطفاً بعداً دوباره امتحان کنید.",
        flights: [],
      };
    }
  },
});

export const HotelTool = createTool({
  description: "Display the hotel card for a hotel",
  parameters: z.object({
    location: z.string(), // Location (city name)
    checkIn: z.string(), // Check-in date (YYYY-MM-DD)
    checkOut: z.string(), // Check-out date (YYYY-MM-DD)
    adultsCount: z.number().default(1), // Number of adults
    childCount: z.number().default(0), // Number of children
    childAges: z.array(z.number()).default([]), // Ages of children
  }),

  execute: async function ({
    location,
    checkIn,
    checkOut,
    adultsCount,
    childCount,
    childAges,
  }) {
    if (!checkIn || !checkOut) {
      return {
        message: `لطفاً تاریخ ورود و خروج خود را مشخص کنید.`,
        hotels: [],
      };
    }

    try {
      // Helper function to fetch city data
      const fetchCityData = async (cityName: string) => {
        // First, try fetching the city as a foreign city (foreign=true)
        const foreignResponse = await fetch(
          `${API_ENDPOINTS.INTERNATIONAL.CITIES}?search=${cityName}&foreign=true&accommodation=true`
        );

        if (foreignResponse.ok) {
          const foreignData = await foreignResponse.json();
          if (foreignData.data.results.length > 0) {
            // Return the parto_id for the foreign city
            return {
              cityId: foreignData.data.results[0].parto_id,
              isDomestic: false, // Mark as foreign
            };
          }
        }

        // If not found as a foreign city, try fetching as a domestic city (foreign=false)
        const domesticResponse = await fetch(
          `${API_ENDPOINTS.DOMESTIC.CITIES}?search=${cityName}&foreign=false&accommodation=true`
        );

        if (domesticResponse.ok) {
          const domesticData = await domesticResponse.json();
          if (domesticData.data.results.length > 0) {
            // Return the id for the domestic city
            return {
              cityId: domesticData.data.results[0].id,
              isDomestic: true, // Mark as domestic
            };
          }
        }

        // If city is not found in either API, throw an error
        throw new Error(`City "${cityName}" not found`);
      };

      // Fetch city data for the location
      const cityData = await fetchCityData(location);

      // Determine the API URL based on whether the city is domestic or foreign
      let apiUrl;
      if (cityData.isDomestic) {
        // Domestic hotel API
        apiUrl = `${API_ENDPOINTS.DOMESTIC.HOTELS}/?city=${cityData.cityId}&check_in=${checkIn}&check_out=${checkOut}&adults_count=${adultsCount}`;
      } else {
        // International hotel API
        apiUrl = `${API_ENDPOINTS.INTERNATIONAL.HOTELS}/?city=${
          cityData.cityId
        }&check_in=${checkIn}&check_out=${checkOut}&adult_count=${adultsCount}&child_count=${childCount}&child_ages=${childAges.join(
          ","
        )}&nationality=IR`;
      }
      console.log("first api url", apiUrl);
      // Fetch hotel data using the appropriate API
      const hotelResponse = await fetch(apiUrl);
      console.log("API URL", apiUrl);
      // Check if the API call was successful
      if (!hotelResponse.ok) {
        throw new Error(
          `Failed to fetch hotel data: ${hotelResponse.statusText}`
        );
      }

      const hotelData = await hotelResponse.json();
      // Normalize the hotel data for both domestic and international hotels
      let hotels = [];
      if (cityData.isDomestic) {
        // Normalize domestic hotel data
        hotels = hotelData.data.data.map(
          (hotel: {
            name: any;
            rooms: { room_type_name: any }[];
            min_price: any;
            star_rating: any;
          }) => ({
            hotelName: hotel.name,
            location: location,
            checkIn: checkIn,
            checkOut: checkOut,
            roomType: hotel.rooms[0].room_type_name, // Example: First room type
            price: hotel.min_price, // Minimum price
            rating: hotel.star_rating, // Star rating
          })
        );
      } else {
        // Normalize international hotel data
        hotels = hotelData.data.results.map(
          (hotel: {
            name: any;
            rooms: { [x: string]: { name: any } };
            fare: { total: any };
            star_rating: any;
          }) => ({
            hotelName: hotel.name,
            location: location,
            checkIn: checkIn,
            checkOut: checkOut,
            roomType: hotel.rooms["1"].name, // Example: First room type
            price: hotel.fare.total, // Total price
            rating: hotel.star_rating, // Star rating
          })
        );
      }

      return hotels;
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      return {
        message: `متاسفم، در حال حاضر نمی‌توانیم اطلاعات هتل را به شما بدهیم. لطفاً بعداً دوباره امتحان کنید.`,
        hotels: [],
      };
    }
  },
});

export const tools = {
  displayFlightCard: FlightTool,
  displayHotelCard: HotelTool,
};
