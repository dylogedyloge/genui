import { API_ENDPOINTS } from "@/endpoints/endpoints";

// Helper function to fetch city data from the API
export const fetchCityData = async (cityName: string, apiEndpoint: string, isDomestic: boolean) => {
    console.log(`Checking ${apiEndpoint}?search=${cityName}`);
    const response = await fetch(`${apiEndpoint}?search=${cityName}`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (isDomestic) {
        // Domestic API response structure
        if (Array.isArray(data.data.results) && data.data.results.length > 0) {
          return data.data.results[0]; // Return the first match
        }
      } else {
        // International API response structure
        // if (Array.isArray(data.data) && data.data.length > 0) {
        //   return data.data[0]; // Return the first match
        // }
        if (Array.isArray(data.data.results) && data.data.results.length > 0) {
          return data.data.results[0]; // Return the first match
        }
      }
    } else {
      console.error(`Failed to fetch city data for ${cityName}`);
    }
    return null;
  };

 