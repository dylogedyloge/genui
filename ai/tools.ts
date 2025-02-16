import { tool as createTool } from "ai";
import { z } from "zod";
import {
  determineFlightType,
  constructApiUrl,
  transformFlightData,
} from "./aiUtils";
import { API_ENDPOINTS } from "../endpoints/endpoints";


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