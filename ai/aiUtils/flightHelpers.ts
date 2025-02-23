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
  departureId: string | number,
  destinationId: string | number,
  date: string,
  passengers: { adult: number; child: number; infant: number } | undefined
) => {
  const baseUrl = isDomestic
    ? API_ENDPOINTS.DOMESTIC.FLIGHTS
    : `${API_ENDPOINTS.INTERNATIONAL.FLIGHTS}/`;

  const passengerParams = passengers
    ? `&adult=${passengers.adult}&child=${passengers.child}&infant=${passengers.infant}`
    : '';

  return `${baseUrl}?departure=${departureId}&destination=${destinationId}&date=${date}${passengerParams}&round_trip=false`;
};
// export const constructApiUrl = (
//   isDomestic: boolean,
//   departureId: string | number,
//   destinationId: string | number,
//   date: string,
//   passengers: { adult: number; child: number; infant: number } | undefined
// ) => {
//   const baseUrl = isDomestic
//     ? API_ENDPOINTS.DOMESTIC.FLIGHTS
//     : API_ENDPOINTS.INTERNATIONAL.FLIGHTS;

//   // Construct passenger query params
//   const passengerParams = passengers
//     ? `&adult=${passengers.adult}&child=${passengers.child}&infant=${passengers.infant}`
//     : '';

//   if (isDomestic) {
//     console.log("isDomestic",isDomestic)
//     return `${baseUrl}?departure=${departureId}&destination=${destinationId}&date=${date}${passengerParams}&round_trip=false`;
//   } else {
//     console.log("isDomestic",isDomestic)
//     return `${baseUrl}/?departure=${departureId}&destination=${destinationId}&date=${date}${passengerParams}&round_trip=false`; /*look at the slash before url*/
//   }
// };

// Function to transform flight data into a consistent format
export const transformFlightData = (flightData: any, isDomestic: boolean) => {
  if (!flightData?.data) {
    console.error('Invalid flight data structure:', flightData);
    return [];
  }

  if (isDomestic) {
    // Handle domestic flights
    const list = flightData.data?.list || [];
    return list.map((flight: any) => ({
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

  // Handle international flights
  const list = flightData.data?.results?.list || [];
  return list.map((flight: any) => ({
    id: flight.id,
    fareSourceCode: flight.fare_source_code,
    isClosed: flight.is_closed,
    visaRequirements: flight.visa_requirements,
    fares: flight.fares,
    cabin: flight.cabin,
    airline: flight.segments[0]?.airline?.persian || '',
    flightNumber: flight.segments[0]?.flight_number || '',
    departureTime: flight.segments[0]?.departure_date + 'T' + flight.segments[0]?.departure_time,
    arrivalTime: flight.segments[flight.segments.length - 1]?.arrival_date + 'T' + flight.segments[flight.segments.length - 1]?.destination_time,
    departure: flight.segments[0]?.departure?.city?.persian || '',
    destination: flight.segments[flight.segments.length - 1]?.destination?.city?.persian || '',
    aircraft: flight.segments[0]?.aircraft || '',
    baggage: flight.segments[0]?.baggage || '',
    airlineLogo: flight.segments[0]?.airline?.image || '',
    flight_duration: flight.segments[0]?.flight_duration || '',
    segments: flight.segments?.map((segment: any) => ({
      departure_date: segment.departure_date,
      departure_time: segment.departure_time,
      arrival_date: segment.arrival_date,
      destination_time: segment.destination_time,
      flight_number: segment.flight_number,
      flight_duration: segment.flight_duration,
      connection_time: segment.connection_time,
      fare_class: segment.fare_class,
      departure: segment.departure,
      destination: segment.destination,
      airline: segment.airline,
      operating_airline: segment.operating_airline,
      aircraft: segment.aircraft,
      baggage: segment.baggage,
      capacity: segment.capacity,
    })) || [],
    returnSegments: flight.return_segments || [],
  }));
};
