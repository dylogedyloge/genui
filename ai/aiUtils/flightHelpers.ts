import { fetchCityData } from './apiUtils';
import { API_ENDPOINTS } from '../../endpoints/endpoints'; 

// Function to determine if a flight is domestic or international
export const determineFlightType = async (departureCity: string, destinationCity: string) => {
  const domesticDepartureData = await fetchCityData(
    departureCity,
    API_ENDPOINTS.DOMESTIC.CITIES,
    true // isDomestic
  );
  const domesticDestinationData = await fetchCityData(
    destinationCity,
    API_ENDPOINTS.DOMESTIC.CITIES,
    true // isDomestic
  );

  if (domesticDepartureData && domesticDestinationData) {
    return {
      isDomestic: true,
      departureId: domesticDepartureData.id,
      destinationId: domesticDestinationData.id,
    };
  }

  const internationalDepartureData = await fetchCityData(
    departureCity,
    API_ENDPOINTS.INTERNATIONAL.CITIES,
    false // isDomestic
  );
  const internationalDestinationData = await fetchCityData(
    destinationCity,
    API_ENDPOINTS.INTERNATIONAL.CITIES,
    false // isDomestic
  );

  if (!internationalDepartureData || !internationalDestinationData) {
    throw new Error(
      `One or both cities not found in the international database: ${departureCity}, ${destinationCity}`
    );
  }

  return {
    isDomestic: false,
    departureId: internationalDepartureData.id,
    destinationId: internationalDestinationData.id,
  };
};

// Function to construct the API URL based on flight type
export const constructApiUrl = (isDomestic: boolean, departureId: string, destinationId: string, date: string) => {
  if (isDomestic) {
    return `${API_ENDPOINTS.DOMESTIC.FLIGHTS}?departure=${departureId}&destination=${destinationId}&round_trip=false&date=${date}`;
  }

  const params = new URLSearchParams({
    departure: departureId.toString(),
    destination: destinationId.toString(),
    round_trip: "false",
    date: date,
    adult: "1",
    child: "0",
    infant: "0",
  });
  return `${API_ENDPOINTS.INTERNATIONAL.FLIGHTS}/?${params}`;
};

// Function to transform flight data into a consistent format
export const transformFlightData = (flightData: any, isDomestic: boolean) => {
  if (isDomestic) {
    return flightData.data.list.map((flight: any) => ({
      airline: flight.airline_persian,
      flightNumber: flight.flight_number,
      departureTime: `${flight.departure_date}- ${flight.departure_time}`,
      arrivalTime: `${flight.arrival_date}- ${flight.destination_time}`,
      price: flight.adult_price,
      departure: flight.departure_name,
      destination: flight.destination_name,
      baggage: flight.baggage,
      airlineLogo: flight.airline_logo,
    }));
  }

  return flightData.data.results.list.map((flight: any) => {
    const firstSegment = flight.segments[0];
    const lastSegment = flight.segments[flight.segments.length - 1];
    return {
      airline: firstSegment.airline.persian,
      flightNumber: firstSegment.flight_number,
      departureTime: `${firstSegment.departure_date}- ${firstSegment.departure_time}`,
      arrivalTime: `${lastSegment.arrival_date}- ${lastSegment.destination_time}`,
      price: flight.fares.adult.total_price,
      departure: firstSegment.departure.city.persian,
      destination: lastSegment.destination.city.persian,
      baggage: firstSegment.baggage,
      airlineLogo: firstSegment.airline.image,
    };
  });
};