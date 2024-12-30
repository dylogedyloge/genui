import { fetchCityData } from "./apiUtils";
import { API_ENDPOINTS } from "../../endpoints/endpoints";

// Function to determine if a flight is domestic or international
export const determineFlightType = async (
  departureCity: string,
  destinationCity: string
) => {
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
export const constructApiUrl = (
  isDomestic: boolean,
  departureId: string,
  destinationId: string,
  date: string
) => {
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
      aircraft: flight.aircraft,
      baggage: flight.baggage,
      airlineLogo: flight.airline_logo,
      type: flight.type,
      capacity: flight.capacity,
      sellingType: flight.sellingType,
      id: flight.id,
      flightClass: flight.class,
      cobin: flight.cobin,
      persian_type: flight.persian_type,
      refundable: flight.refundable,
      child_price: flight.child_price,
      infant_price: flight.infant_price,
      departure_terminal: flight.departure_terminal,
      refund_rules: flight.refund_rules,
      destination_terminal: flight.destination_terminal,
      flight_duration: flight.flight_duration,
      cobin_persian: flight.cobin_persian,
      with_tour: flight.with_tour,
      tag: flight.tag,
    }));
  }

  // return flightData.data.results.list.map((flight: any) => {
  //   const firstSegment = flight.segments[0];
  //   const lastSegment = flight.segments[flight.segments.length - 1];
  //   return {
  //     fareSourceCode: flight.fare_source_code,
  //     airline: firstSegment.airline.persian, // Airline name in Persian
  //     flightNumber: firstSegment.flight_number, // Flight number
  //     departureTime: `${firstSegment.departure_date}- ${firstSegment.departure_time}`, // Departure time
  //     arrivalTime: `${lastSegment.arrival_date}- ${lastSegment.destination_time}`, // Arrival time
  //     price: flight.fares.adult.total_price, // Price for adults
  //     departure: firstSegment.departure.city.persian, // Departure city in Persian
  //     destination: lastSegment.destination.city.persian, // Destination city in Persian
  //     baggage: firstSegment.baggage, // Baggage allowance
  //     airlineLogo: firstSegment.airline.image, // Airline logo
  //     type: firstSegment.type,
  //     capacity: firstSegment.capacity,
  //     sellingType: firstSegment.sellingType,
  //     id: firstSegment.id,
  //     class: firstSegment.class,
  //     cobin: firstSegment.cobin,
  //     persian_type: firstSegment.persian_type,
  //     refundable: firstSegment.refundable,
  //     child_price: firstSegment.child_price,
  //     infant_price: firstSegment.infant_price,
  //     departure_terminal: firstSegment.departure_terminal,
  //     refund_rules: firstSegment.refund_rules,
  //     destination_terminal: firstSegment.destination_terminal,
  //     flight_duration: firstSegment.flight_duration,
  //     cobin_persian: firstSegment.cobin_persian,
  //     with_tour: firstSegment.with_tour,
  //     tag: firstSegment.tag,
  //   };
  // });
  return flightData.data.results.list.map((flight: any) => {
    const firstSegment = flight.segments[0];
    const lastSegment = flight.segments[flight.segments.length - 1];

    return {
      id: flight.id,
      fareSourceCode: flight.fare_source_code,
      isClosed: flight.is_closed,
      visaRequirements: flight.visa_requirements,
      fares: flight.fares,
      cabin: flight.cabin,
      segments: flight.segments.map((segment: any) => ({
        departureDate: segment.departure_date,
        departureTime: segment.departure_time,
        arrivalDate: segment.arrival_date,
        destinationTime: segment.destination_time,
        flightNumber: segment.flight_number,
        flightDuration: segment.flight_duration,
        connectionTime: segment.connection_time,
        fareClass: segment.fare_class,
        departure: {
          country: segment.departure.country,
          city: segment.departure.city,
          terminal: segment.departure.terminal,
        },
        destination: {
          country: segment.destination.country,
          city: segment.destination.city,
          terminal: segment.destination.terminal,
        },
        airline: segment.airline,
        operatingAirline: segment.operating_airline,
        aircraft: segment.aircraft,
        baggage: segment.baggage,
        capacity: segment.capacity,
      })),
      returnSegments: flight.return_segments,
    };
  });
};
