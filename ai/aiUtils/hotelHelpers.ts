import { fetchCityData } from "./apiUtils";
import { API_ENDPOINTS } from "../../endpoints/endpoints";
import DateService from "@/services/date-service";

// Type definitions
interface HotelSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  adultsCount: number;
  childCount: number;
  childAges: number[];
}

interface CityData {
  cityId: string;
  isDomestic: boolean;
}

interface NormalizedHotel {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  price: number;
  rating: number;
  imageUrl?: string;
  amenities?: string[];
}

// Helper function to determine city type and get city ID
export const determineCityType = async (
  location: string
): Promise<CityData> => {
  try {
    // First try domestic cities
    const domesticData = await fetchCityData(
      location,
      API_ENDPOINTS.DOMESTIC.CITIES,
      true
    );

    if (domesticData) {
      return {
        cityId: domesticData.id,
        isDomestic: true,
      };
    }

    // If not domestic, try international
    const internationalData = await fetchCityData(
      location,
      API_ENDPOINTS.INTERNATIONAL.CITIES,
      false
    );

    if (!internationalData) {
      throw new Error(`City "${location}" not found in either database`);
    }

    return {
      cityId: internationalData.id,
      isDomestic: false,
    };
  } catch (error) {
    console.error("Error determining city type:", error);
    throw new Error("Failed to determine city type");
  }
};

// Construct API URL based on city type
export const constructHotelApiUrl = (
  isDomestic: boolean,
  cityId: string,
  params: HotelSearchParams
): string => {
  const { checkIn, checkOut, adultsCount, childCount, childAges } = params;

  // Ensure dates are in correct format
  const formattedCheckIn = checkIn.split('T')[0];  
  const formattedCheckOut = checkOut.split('T')[0]; 


  console.log('Formatted dates:', {
    checkIn: formattedCheckIn,
    checkOut: formattedCheckOut
  });

  if (isDomestic) {
    const url = `${API_ENDPOINTS.DOMESTIC.HOTELS}/?city=${cityId}&check_in=${formattedCheckIn}&check_out=${formattedCheckOut}&adults_count=${adultsCount}`;
    console.log('Generated URL:', url);
    return url;
  }

  const queryParams = new URLSearchParams({
    city: cityId,
    check_in: formattedCheckIn,
    check_out: formattedCheckOut,
    adult_count: adultsCount.toString(),
    child_count: childCount.toString(),
    child_ages: childAges.join(","),
    nationality: "IR",
  });

  return `${API_ENDPOINTS.INTERNATIONAL.HOTELS}/?${queryParams.toString()}`;
};

// Normalize hotel data from API responses
export const normalizeHotelData = (
  rawData: any,
  isDomestic: boolean,
  location: string,
  checkIn: string,
  checkOut: string
): NormalizedHotel[] => {
  // First check if we have valid data
  if (!rawData?.data?.data || !Array.isArray(rawData.data.data)) {
    console.error('Invalid hotel data structure:', rawData);
    return [];
  }

  // Filter out null values from the data array
  const validData = rawData.data.data.filter((hotel: any) => hotel !== null);
  if (isDomestic) {
    return validData.map((hotel: any) => ({
      id: hotel.id?.toString() || '',
      hotelName: hotel.name || '',
      location: location,
      checkIn: DateService.toJalali(checkIn),
      checkOut: DateService.toJalali(checkOut),
      roomType: hotel.rooms?.[0]?.room_type_name || "Standard",
      price: hotel.min_price || 0,
      rating: hotel.star || 0,
      imageUrl: hotel.images?.[0]?.image || '',
      amenities: [], // Add amenities if available in the API response
    }));
  }
  // International hotels (keeping the existing logic but with safety checks)
  return rawData.data.results.map((hotel: any) => ({
    id: hotel.id?.toString() || '',
    hotelName: hotel.name || '',
    location: location,
    checkIn: DateService.toJalali(checkIn),
    checkOut: DateService.toJalali(checkOut),
    roomType: hotel.rooms?.["1"]?.name || "Standard",
    price: hotel.fare?.total || 0,
    rating: hotel.star_rating || 0,
    imageUrl: hotel.images?.[0]?.image || '',
    amenities: [], // Add amenities if available in the API response
  }));
};

// Main hotel search function
export const searchHotels = async (
  params: HotelSearchParams
): Promise<NormalizedHotel[]> => {
  try {
    // Validate dates
    if (DateService.isAfter(params.checkIn, params.checkOut)) {
      throw new Error("Check-in date must be before check-out date");
    }

    // Determine city type and get city ID
    const cityData = await determineCityType(params.location);

    // Construct API URL
    const apiUrl = constructHotelApiUrl(
      cityData.isDomestic,
      cityData.cityId,
      params
    );

    // Fetch hotel data
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    if (!response.ok) {
      // throw new Error(`API request failed with status ${response.status}`);
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      throw new Error(`API request failed: ${JSON.stringify(errorData)}`);
    }

    const rawData = await response.json();

    // Normalize and return data
    return normalizeHotelData(
      rawData,
      cityData.isDomestic,
      params.location,
      params.checkIn,
      params.checkOut
    );
  } catch (error) {
    console.error("Hotel search error:", error);
    throw new Error("Failed to search for hotels");
  }
};

// Helper function to validate search parameters
export const validateHotelSearchParams = (
  params: HotelSearchParams
): string[] => {
  const errors: string[] = [];

  if (!params.location) {
    errors.push("Location is required");
  }

  if (!params.checkIn || !params.checkOut) {
    errors.push("Both check-in and check-out dates are required");
  }

  if (params.adultsCount < 1) {
    errors.push("At least one adult is required");
  }

  if (params.childCount > 0 && params.childAges.length !== params.childCount) {
    errors.push("Child ages must be provided for all children");
  }

  return errors;
};
