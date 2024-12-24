import { tool as createTool } from "ai";
import { z } from "zod";
import { API_ENDPOINTS } from "../endpoints/endpoints";

// export const FlightTool = createTool({
//   description: "Display a grid of flight cards",
//   parameters: z.object({
//     departureCity: z.string(), // Name of the departure city
//     destinationCity: z.string(), // Name of the destination city
//     date: z.string(), // Date of departure
//   }),

//   execute: async function ({ departureCity, destinationCity, date }) {
//     if (!date) {
//       return {
//         message: `لطفاً تاریخ پرواز رو به من بگین.`,
//         flights: [],
//       };
//     }

//     try {
//       // Helper function to fetch city data and determine if it's domestic or international
//       const fetchCityData = async (cityName: string) => {
//         // Check if the city is a domestic city in Iran
//         const domesticResponse = await fetch(
//           `${API_ENDPOINTS.DOMESTIC.CITIES}?search=${cityName}`
//         );
//         if (domesticResponse.ok) {
//           const domesticData = await domesticResponse.json();

//           if (
//             domesticData.data.results.length > 0 &&
//             domesticData.data.results[0].country?.name === "ایران"
//           ) {
//             return {
//               isDomestic: true,
//             };
//           }
//         }

//         // If not found as a domestic city in Iran, try fetching as an international city
//         const internationalResponse = await fetch(
//           `${API_ENDPOINTS.INTERNATIONAL.CITIES}?search=${cityName}&foreign=true`
//         );
//         if (internationalResponse.ok) {
//           const internationalData = await internationalResponse.json();
//           if (internationalData.data.results.length > 0) {
//             return {
//               isDomestic: false,
//             };
//           }
//         }

//         // If city is not found in either API, throw an error
//         throw new Error(
//           `City "${cityName}" not found in domestic or international cities`
//         );
//       };

//       // Fetch data for both departure and destination cities
//       const [departureData, destinationData] = await Promise.all([
//         fetchCityData(departureCity),
//         fetchCityData(destinationCity),
//       ]);
//       // Determine if both cities are domestic
//       const bothAreDomestic =
//         departureData.isDomestic && destinationData.isDomestic;

//       // Fetch IDs for departure and destination cities based on domestic or international status
//       let departureId, destinationId;
//       if (bothAreDomestic) {
//         // Fetch IDs from the domestic cities API
//         const [departureResponse, destinationResponse] = await Promise.all([
//           fetch(`${API_ENDPOINTS.DOMESTIC.CITIES}?search=${departureCity}`),
//           fetch(`${API_ENDPOINTS.DOMESTIC.CITIES}?search=${destinationCity}`),
//         ]);

//         if (!departureResponse.ok || !destinationResponse.ok) {
//           throw new Error("Failed to fetch city IDs from the domestic API");
//         }
//         const departureData = await departureResponse.json();
//         const destinationData = await destinationResponse.json();
//         departureId = departureData.data.results[0].id;
//         destinationId = destinationData.data.results[0].id;
//       } else {
//         // // Fetch IDs from the international cities API
//         // console.log("both are not domestic");
//         // const [departureResponse, destinationResponse] = await Promise.all([
//         //   fetch(
//         //     `${API_ENDPOINTS.INTERNATIONAL.CITIES}?search=${departureCity}&foreign=true`
//         //   ),
//         //   fetch(
//         //     `${API_ENDPOINTS.INTERNATIONAL.CITIES}?search=${destinationCity}&foreign=true`
//         //   ),
//         // ]);
//         // console.log("Departure Response:", {
//         //   city: departureCity,
//         //   status: departureResponse.status,
//         //   ok: departureResponse.ok,
//         // });

//         // console.log("Destination Response:", {
//         //   city: destinationCity,
//         //   status: destinationResponse.status,
//         //   ok: destinationResponse.ok,
//         // });

//         // if (!departureResponse.ok || !destinationResponse.ok) {
//         //   throw new Error(
//         //     "Failed to fetch city IDs from the international API"
//         //   );
//         // }

//         // const departureData = await departureResponse.json();
//         // const destinationData = await destinationResponse.json();
//         // console.log("Departure Data:", {
//         //   resultsLength: departureData.data.results.length,
//         //   firstResult: departureData.data.results[0],
//         // });
//         // console.log("Destination Data:", {
//         //   resultsLength: destinationData.data.results.length,
//         //   firstResult: destinationData.data.results[0],
//         // });

//         // if (departureData.data.results.length === 0) {
//         //   throw new Error(`Departure city "${departureCity}" not found`);
//         // }

//         // if (destinationData.data.results.length === 0) {
//         //   throw new Error(`Destination city "${destinationCity}" not found`);
//         // }
//         // departureId = departureData.data.results[0].id;
//         // destinationId = destinationData.data.results[0].id;
//         // For mixed flights (domestic to international or vice versa)
//         const [departureResponse, destinationResponse] = await Promise.all([
//           // Try domestic API first for Tehran
//           fetch(`${API_ENDPOINTS.DOMESTIC.CITIES}?search=${departureCity}`),
//           // Use international API for Amsterdam
//           fetch(
//             `${API_ENDPOINTS.INTERNATIONAL.CITIES}?search=${destinationCity}&foreign=true`
//           ),
//         ]);

//         const departureData = await departureResponse.json();
//         const destinationData = await destinationResponse.json();

//         console.log("Mixed Flight City Data:", {
//           departure: departureData.data.results[0],
//           destination: destinationData.data.results[0],
//         });

//         // For Tehran, use domestic city ID
//         if (departureData.data.results.length === 0) {
//           throw new Error(
//             `Departure city "${departureCity}" not found in domestic cities`
//           );
//         }

//         // For Amsterdam, use international city ID
//         if (destinationData.data.results.length === 0) {
//           throw new Error(
//             `Destination city "${destinationCity}" not found in international cities`
//           );
//         }

//         departureId = departureData.data.results[0].id;
//         destinationId = destinationData.data.results[0].id;

//         console.log("Mixed Flight City IDs:", { departureId, destinationId });
//       }
//       console.log("City IDs:", { departureId, destinationId });
//       // Determine which API to call based on the cities' domestic status
//       const isDomesticFlight = bothAreDomestic;

//       // Construct the API URL based on the flight type
//       let apiUrl;
//       if (isDomesticFlight) {
//         apiUrl = `${API_ENDPOINTS.DOMESTIC.FLIGHTS}?departure=${departureId}&destination=${destinationId}&round_trip=false&date=${date}`;
//       } else {
//         // For international flights, construct the URL with query parameters

//         apiUrl = `${API_ENDPOINTS.INTERNATIONAL.FLIGHTS}?departure=${departureId}&destination=${destinationId}&round_trip=false&date=${date}`;
//         // console.log("apiUrl for international flights", apiUrl);
//       }

//       // Fetch flight data using the appropriate API
//       let flightResponse;
//       if (isDomesticFlight) {
//         // Use GET for domestic flights
//         flightResponse = await fetch(apiUrl);
//       } else {
//         // Use POST for international flights, but send parameters as query parameters
//         // For international flights, send params as query parameters with POST method
//         const params = new URLSearchParams({
//           departure: departureId.toString(),
//           destination: destinationId.toString(),
//           round_trip: "false",
//           date: date,
//           adult: "1",
//           child: "0",
//           infant: "0",
//         });

//         const url = `${API_ENDPOINTS.INTERNATIONAL.FLIGHTS}/?${params}`;
//         // const url = `https://api.atripa.ir/api/v2/reserve/foreign/flight/list/?departure=6979&destination=230&adult=1&child=0&infant=0&round_trip=false&date=2024-12-24`;

//         // console.log("International Flight API Request:", {
//         //   url,
//         //   method: "POST",
//         // });

//         flightResponse = await fetch(url, {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//           },
//         });
//       }

//       // Check if the API call was successful
//       if (!flightResponse.ok) {
//         throw new Error(
//           `Failed to fetch flight data: ${flightResponse.statusText}`
//         );
//       }

//       const flightData = await flightResponse.json();
//       // Normalize the flight data for both domestic and international flights
//       // console.log("flightData for internationl flights", flightData);
//       let flights = [];
//       if (isDomesticFlight) {
//         flights = flightData.data.list.map(
//           (flight: {
//             airline_persian: any;
//             flight_number: any;
//             departure_date: any;
//             departure_time: any;
//             arrival_date: any;
//             destination_time: any;
//             adult_price: any;
//             departure_name: any;
//             destination_name: any;
//             aircraft: any;
//             airline_logo: any;
//             type: any;
//             capacity: any;
//             sellingType: any;
//             id: any;
//             baggage: any;
//             flightClass: any;
//             cobin: any;
//             persian_type: any;
//             refundable: any;
//             child_price: any;
//             infant_price: any;
//             departure_terminal: any;
//             refund_rules: any;
//             destination_terminal: any;
//             flight_duration: any;
//             cobin_persian: any;
//             with_tour: any;
//             tag: any;
//           }) => ({
//             airline: flight.airline_persian,
//             flightNumber: flight.flight_number,
//             departureTime: `${flight.departure_date}- ${flight.departure_time}`,
//             arrivalTime: `${flight.arrival_date}- ${flight.destination_time}`,
//             price: flight.adult_price,
//             departure: flight.departure_name,
//             destination: flight.destination_name,
//             aircraft: flight.aircraft,
//             baggage: flight.baggage,
//             airlineLogo: flight.airline_logo,
//             type: flight.type,
//             capacity: flight.capacity,
//             sellingType: flight.sellingType,
//             id: flight.id,
//             flightClass: flight.flightClass,
//             cobin: flight.cobin,
//             persian_type: flight.persian_type,
//             refundable: flight.refundable,
//             child_price: flight.child_price,
//             infant_price: flight.infant_price,
//             departure_terminal: flight.departure_terminal,
//             refund_rules: flight.refund_rules,
//             destination_terminal: flight.destination_terminal,
//             flight_duration: flight.flight_duration,
//             cobin_persian: flight.cobin_persian,
//             with_tour: flight.with_tour,
//             tag: flight.tag,
//           })
//         );
//       } else {
//         flights = flightData.data.results.list.map(
//           (flight: {
//             segments: string | any[];
//             fares: { adult: { total_price: any } };
//           }) => {
//             const firstSegment = flight.segments[0]; // First segment (departure details)
//             const lastSegment = flight.segments[flight.segments.length - 1]; // Last segment (arrival details)
//             const normalizedFlight = {
//               airline: firstSegment.airline.persian, // Airline name in Persian
//               flightNumber: firstSegment.flight_number, // Flight number
//               departureTime: `${firstSegment.departure_date}- ${firstSegment.departure_time}`, // Departure time
//               arrivalTime: `${lastSegment.arrival_date}- ${lastSegment.destination_time}`, // Arrival time
//               price: flight.fares.adult.total_price, // Price for adults
//               departure: firstSegment.departure.city.persian, // Departure city in Persian
//               destination: lastSegment.destination.city.persian, // Destination city in Persian
//               baggage: firstSegment.baggage, // Baggage allowance
//               airlineLogo: firstSegment.airline.image, // Airline logo
//             };

//             return normalizedFlight;
//           }
//         );
//       }

//       // Return the flights along with the departure and destination city data
//       return {
//         flights,
//         // departureCityData: departureData,
//         // destinationCityData: destinationData,
//         departureCityData: { ...departureData, isDomestic: bothAreDomestic },
//         destinationCityData: {
//           ...destinationData,
//           isDomestic: bothAreDomestic,
//         },
//       };
//     } catch (error) {
//       console.error("Error fetching flight data:", error);
//       return {
//         message: `متاسفم، در حال حاضر نمی‌توانیم اطلاعات پرواز را به شما بدهیم. لطفاً بعداً دوباره امتحان کنید.`,
//         flights: [],
//       };
//     }
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
    if (!date) {
      return {
        message: `لطفاً تاریخ پرواز رو به من بگین.`,
        flights: [],
      };
    }
console.log("departureCity", departureCity);
console.log("destinationCity", destinationCity);
console.log("date", date);
    try {
      // Helper function to fetch city data from the domestic API
      const fetchDomesticCityData = async (cityName: string) => {
        console.log(`Checking ${cityName} in domestic cities`);
        const response = await fetch(
          `${API_ENDPOINTS.DOMESTIC.CITIES}?search=${cityName}`
        );
        console.log(`Response of Checking ${cityName} in domestic cities :`, response);
        if (response.ok) {
          const data = await response.json();
          if (data.data.results.length > 0) {
            return data.data.results[0];
          }
          console.log(`data.data.results[0] for ${cityName} in domestic cities :`, data.data.results[0])
        }
        return null; 
      };

      // Helper function to fetch city data from the international API
      const fetchInternationalCityData = async (cityName: string) => {
        console.log(`Checking ${cityName} in international cities`);

        const response = await fetch(
          `${API_ENDPOINTS.INTERNATIONAL.CITIES}?search=${cityName}&foreign=true`
        );
        console.log(`Response of Checking ${cityName} in international cities :`, response);

        if (response.ok) {
          const data = await response.json();
          if (data.data.results.length > 0) {
            return data.data.results[0];
          }
          console.log(`data.data.results[0] for ${cityName} in internationl cities :`, data.data.results[0])

        }
        return null;
      };

      // Fetch data for both departure and destination cities from the domestic API
      const [domesticDepartureData, domesticDestinationData] =
        await Promise.all([
          fetchDomesticCityData(departureCity),
          fetchDomesticCityData(destinationCity),
        ]);
console.log(`domesticDepartureData for ${departureCity} `, domesticDepartureData);
console.log(`domesticDestinationData for ${destinationCity}`, domesticDestinationData);
      let isDomesticFlight = false;
      let departureId, destinationId;

      if (domesticDepartureData && domesticDestinationData) {
        // Both cities are domestic
        isDomesticFlight = true;
        departureId = domesticDepartureData.id;
        destinationId = domesticDestinationData.id;
        console.log("isDomesticFligh",isDomesticFlight)
        console.log(`departureId for ${departureCity} `, departureId);
        console.log(`destinationId for ${destinationCity}`, destinationId);
      } else {
        // One or both cities are international, fetch both from international API
        const [internationalDepartureData, internationalDestinationData] =
          await Promise.all([
            fetchInternationalCityData(departureCity),
            fetchInternationalCityData(destinationCity),
          ]);

        if (!internationalDepartureData) {
          throw new Error(
            `Departure city "${departureCity}" not found in international cities`
          );
        }

        if (!internationalDestinationData) {
          throw new Error(
            `Destination city "${destinationCity}" not found in international cities`
          );
        }

        departureId = internationalDepartureData.id;
        destinationId = internationalDestinationData.id;
      }

      // Construct the API URL based on the flight type
      let apiUrl;
      if (isDomesticFlight) {
        apiUrl = `${API_ENDPOINTS.DOMESTIC.FLIGHTS}?departure=${departureId}&destination=${destinationId}&round_trip=false&date=${date}`;
      } else {
        const params = new URLSearchParams({
          departure: departureId.toString(),
          destination: destinationId.toString(),
          round_trip: "false",
          date: date,
          adult: "1",
          child: "0",
          infant: "0",
        });
        apiUrl = `${API_ENDPOINTS.INTERNATIONAL.FLIGHTS}/?${params}`;
      }

      // Fetch flight data using the appropriate API
      let flightResponse;
      if (isDomesticFlight) {
        flightResponse = await fetch(apiUrl);
      } else {
        flightResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        });
      }

      if (!flightResponse.ok) {
        throw new Error(
          `Failed to fetch flight data: ${flightResponse.statusText}`
        );
      }

      const flightData = await flightResponse.json();
      let flights = [];

      if (isDomesticFlight) {
        flights = flightData.data.list.map(
          (flight: {
            airline_persian: any;
            flight_number: any;
            departure_date: any;
            departure_time: any;
            arrival_date: any;
            destination_time: any;
            adult_price: any;
            departure_name: any;
            destination_name: any;
            aircraft: any;
            baggage: any;
            airline_logo: any;
            type: any;
            capacity: any;
            sellingType: any;
            id: any;
            flightClass: any;
            cobin: any;
            persian_type: any;
            refundable: any;
            child_price: any;
            infant_price: any;
            departure_terminal: any;
            refund_rules: any;
            destination_terminal: any;
            flight_duration: any;
            cobin_persian: any;
            with_tour: any;
            tag: any;
          }) => ({
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
            flightClass: flight.flightClass,
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
          })
        );
      } else {
        flights = flightData.data.results.list.map(
          (flight: {
            segments: string | any[];
            fares: { adult: { total_price: any } };
          }) => {
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
          }
        );
      }

      return {
        flights,
        departureCityData: { isDomestic: isDomesticFlight },
        destinationCityData: { isDomestic: isDomesticFlight },
      };
    } catch (error) {
      console.error("Error fetching flight data:", error);
      return {
        message: `متاسفم، در حال حاضر نمی‌توانیم اطلاعات پرواز را به شما بدهیم. لطفاً بعداً دوباره امتحان کنید.`,
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
          // `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}&foreign=true&accommodation=true`
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
          // `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}&foreign=false&accommodation=true`
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
        // apiUrl = `https://api.atripa.ir/reserve/accommodation/list/?city=${cityData.cityId}&check_in=${checkIn}&check_out=${checkOut}&adults_count=${adultsCount}`;
      } else {
        // International hotel API
        apiUrl = `${API_ENDPOINTS.INTERNATIONAL.HOTELS}/?city=${
          cityData.cityId
        }&check_in=${checkIn}&check_out=${checkOut}&adult_count=${adultsCount}&child_count=${childCount}&child_ages=${childAges.join(
          ","
        )}&nationality=IR`;
        // apiUrl = `https://api.atripa.ir/api/v2/reserve/foreign/accommodation/list/?city=${
        //   cityData.cityId
        // }&check_in=${checkIn}&check_out=${checkOut}&adult_count=${adultsCount}&child_count=${childCount}&child_ages=${childAges.join(
        //   ","
        // )}&nationality=IR`;
      }

      // Fetch hotel data using the appropriate API
      const hotelResponse = await fetch(apiUrl);

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
