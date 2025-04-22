import { tool as createTool } from "ai";
import { z } from "zod";
import {
  determineFlightType,
  constructApiUrl,
  transformFlightData,
} from "./aiUtils";
import {
  constructHotelApiUrl,
  determineCityType,
  normalizeHotelData,
} from "./aiUtils/hotelHelpers";

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
        showPassengerCounter: true,
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
        headers: isDomestic
          ? {}
          : {
              Accept: "application/json",
              "Content-Type": "application/json",
              // Add any other required headers
              "X-Requested-With": "XMLHttpRequest",
              "Cache-Control": "no-cache",
            },
        cache: "no-store",
        credentials: "include",
      });
      console.log("apiUrl in tools", apiUrl);

      if (!flightResponse.ok) {
        throw new Error(
          `Failed to fetch flight data: ${flightResponse.statusText}`
        );
      }

      const flightData = await flightResponse.json();

      // Transform flight data into a consistent format
      const flights = transformFlightData(flightData, isDomestic,passengers);

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
  description: "Display a grid of hotel cards",
  parameters: z.object({
    location: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    adultsCount: z.number().default(1),
    childCount: z.number().default(0),
    childAges: z.array(z.number()).default([]),
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
      // Determine city type and get city ID
      const cityData = await determineCityType(location);

      // Construct the API URL
      const apiUrl = constructHotelApiUrl(
        cityData.isDomestic,
        cityData.cityId,
        {
          location,
          checkIn,
          checkOut,
          adultsCount,
          childCount,
          childAges,
        }
      );
      console.log("apiUrl:", apiUrl);

      // Fetch hotel data
      const hotelResponse = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // "Cache-Control": "no-cache", // Removed this line to fix CORS issue
          "X-Requested-With": "XMLHttpRequest",
        },
        cache: "no-store", // Keep this if you still want to suggest no caching
      });
      console.log("apiUrl in tools", apiUrl);

      if (!hotelResponse.ok) {
        throw new Error(
          `Failed to fetch hotel data: ${hotelResponse.statusText}`
        );
      }

      const hotelData = await hotelResponse.json();

      // Transform hotel data into a consistent format
      const hotels = normalizeHotelData(
        hotelData,
        cityData.isDomestic,
        location,
        checkIn,
        checkOut
      );
      return {
        // hotels,
        // cityData: { isDomestic: cityData.isDomestic },
        hotels: hotels,
        message: hotels.length > 0 
          ? `${hotels.length} هتل در ${location} پیدا شد.`
          : `متاسفانه هتلی در ${location} پیدا نشد.`,
        cityData: { isDomestic: cityData.isDomestic }
      };
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      return {
        message:
          "متاسفم، در حال حاضر نمی‌توانیم اطلاعات هتل را به شما بدهیم. لطفاً بعداً دوباره امتحان کنید.",
        hotels: [],
      };
    }
  },
});
export const tools = {
  displayFlightCard: FlightTool,
  displayHotelCard: HotelTool,
};
