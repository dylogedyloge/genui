import { tool as createTool } from "ai";
import { z } from "zod";

export const FlightTool = createTool({
  description: "Display a grid of flight cards",
  parameters: z.object({
    departureCity: z.string(), // Name of the departure city
    destinationCity: z.string(), // Name of the destination city
    date: z.string(), // Date of departure
  }),
  // execute: async function ({ departureCity, destinationCity, date }) {
  //   if (!date) {
  //     return {
  //       message: `لطفاً تاریخ پروازتون رو به من بگید.`,
  //       flights: [],
  //     };
  //   }
  //   // Helper function to fetch city data and determine if it's domestic or international
  //   const fetchCityData = async (cityName: string) => {
  //     // First, try fetching the city as a domestic city
  //     const domesticResponse = await fetch(
  //       `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}`
  //     );
  //     if (domesticResponse.ok) {
  //       const domesticData = await domesticResponse.json();
  //       if (domesticData.data.results.length > 0) {
  //         // Check if the city is in Iran (domestic)
  //         if (domesticData.data.results[0].country?.name === "ایران") {
  //           return {
  //             isDomestic: true, // Mark as domestic
  //           };
  //         }
  //       }
  //     }

  //     // If not found as a domestic city in Iran, try fetching as an international city
  //     const internationalResponse = await fetch(
  //       `https://api.atripa.ir/api/v2/basic/intl/cities?search=${cityName}`
  //     );
  //     if (internationalResponse.ok) {
  //       const internationalData = await internationalResponse.json();
  //       if (internationalData.data.length > 0) {
  //         return {
  //           isDomestic: false, // Mark as international
  //         };
  //       }
  //     }

  //     // If city is not found in either API, throw an error
  //     throw new Error(
  //       `City "${cityName}" not found in domestic or international cities`
  //     );
  //   };

  //   // Fetch data for both departure and destination cities
  //   const [departureData, destinationData] = await Promise.all([
  //     fetchCityData(departureCity),
  //     fetchCityData(destinationCity),
  //   ]);

  //   // Log the departure and destination city data for debugging
  //   console.log("Departure City Data:", departureData);
  //   console.log("Destination City Data:", destinationData);

  //   // Determine if both cities are domestic
  //   const bothAreDomestic =
  //     departureData.isDomestic && destinationData.isDomestic;

  //   // Log the isDomesticFlight flag for debugging
  //   console.log("Both Cities Are Domestic:", bothAreDomestic);

  //   // Fetch IDs for departure and destination cities based on domestic or international status
  //   let departureId, destinationId;
  //   if (bothAreDomestic) {
  //     // Fetch IDs from the domestic cities API
  //     const [departureResponse, destinationResponse] = await Promise.all([
  //       fetch(
  //         `https://api.atripa.ir/api/v2/basic/cities?search=${departureCity}`
  //       ),
  //       fetch(
  //         `https://api.atripa.ir/api/v2/basic/cities?search=${destinationCity}`
  //       ),
  //     ]);

  //     if (!departureResponse.ok || !destinationResponse.ok) {
  //       throw new Error("Failed to fetch city IDs from the domestic API");
  //     }

  //     const departureData = await departureResponse.json();
  //     const destinationData = await destinationResponse.json();

  //     departureId = departureData.data.results[0].id;
  //     destinationId = destinationData.data.results[0].id;
  //   } else {
  //     // Fetch IDs from the international cities API
  //     const [departureResponse, destinationResponse] = await Promise.all([
  //       fetch(
  //         `https://api.atripa.ir/api/v2/basic/intl/cities?search=${departureCity}`
  //       ),
  //       fetch(
  //         `https://api.atripa.ir/api/v2/basic/intl/cities?search=${destinationCity}`
  //       ),
  //     ]);

  //     if (!departureResponse.ok || !destinationResponse.ok) {
  //       throw new Error("Failed to fetch city IDs from the international API");
  //     }

  //     const departureData = await departureResponse.json();
  //     const destinationData = await destinationResponse.json();

  //     departureId = departureData.data[0].id;
  //     destinationId = destinationData.data[0].id;
  //   }

  //   // Log the IDs for debugging
  //   console.log("Departure ID:", departureId);
  //   console.log("Destination ID:", destinationId);

  //   // Determine which API to call based on the cities' domestic status
  //   const isDomesticFlight = bothAreDomestic;

  //   // Log which API is being called
  //   if (isDomesticFlight) {
  //     console.log("Calling Domestic Flight API");
  //   } else {
  //     console.log("Calling International Flight API");
  //   }

  //   // Construct the API URL based on the flight type
  //   let apiUrl;
  //   if (isDomesticFlight) {
  //     apiUrl = `https://api.atripa.ir/api/v2/reserve/flight/list/?departure=${departureId}&destination=${destinationId}&round_trip=false&date=${date}`;
  //   } else {
  //     // For international flights, construct the URL with query parameters
  //     apiUrl = `https://api.atripa.ir/api/v2/reserve/foreign/flight/list/?departure=${departureId}&destination=${destinationId}&adult=1&child=0&infant=0&round_trip=false&date=${date}`;
  //   }

  //   // Log the exact API URL being called
  //   console.log("Calling API URL:", apiUrl);

  //   // Fetch flight data using the appropriate API
  //   let flightResponse;
  //   if (isDomesticFlight) {
  //     // Use GET for domestic flights
  //     flightResponse = await fetch(apiUrl);
  //   } else {
  //     // Use POST for international flights, but send parameters as query parameters
  //     flightResponse = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   }

  //   // Log the status of the API response
  //   console.log("API Response Status:", flightResponse.status);

  //   // Check if the API call was successful
  //   if (!flightResponse.ok) {
  //     const errorData = await flightResponse.json();
  //     console.error("API Error Response:", JSON.stringify(errorData, null, 2));
  //     throw new Error(`Failed to fetch flight data: ${errorData.message}`);
  //   }

  //   const flightData = await flightResponse.json();

  //   // Log the raw API response for debugging
  //   console.log("Raw API Response:", JSON.stringify(flightData, null, 2));

  //   // Handle various error cases based on API response
  //   if (flightData.message === "Error acquired" && flightData.errors) {
  //     let errorMessage = "متاسفم، مشکلی پیش آمده: ";

  //     // Check for specific error messages
  //     if (flightData.errors.date) {
  //       errorMessage += flightData.errors.date.join(", ");
  //     } else {
  //       errorMessage += "لطفاً اطلاعات ورودی را بررسی کنید.";
  //     }

  //     return {
  //       message: errorMessage,
  //       flights: [],
  //     };
  //   }

  //   // Check if there are any flights available
  //   if (isDomesticFlight) {
  //     if (flightData.data.list.length === 0) {
  //       return {
  //         message: `متاسفم، پروازی برای ${departureCity} به ${destinationCity} در تاریخ ${date} پیدا نشد. لطفاً تاریخ یا مقصد دیگری را امتحان کنید.`,
  //         flights: [], // Return an empty array for flights
  //       };
  //     }
  //   } else {
  //     if (flightData.data.results.list.length === 0) {
  //       return {
  //         message: `متاسفم، پروازی برای ${departureCity} به ${destinationCity} در تاریخ ${date} پیدا نشد. لطفاً تاریخ یا مقصد دیگری را امتحان کنید.`,
  //         flights: [], // Return an empty array for flights
  //       };
  //     }
  //   }

  //   // Normalize the flight data for both domestic and international flights
  //   let flights = [];
  //   if (isDomesticFlight) {
  //     flights = flightData.data.list.map(
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
  //         arrivalTime: `${flight.arrival_date}- ${flight.destination_time}`,
  //         price: flight.adult_price,
  //         departure: flight.departure_name,
  //         destination: flight.destination_name,
  //         aircraft: flight.aircraft,
  //         baggage: flight.baggage,
  //         airlineLogo: flight.airline_logo,
  //       })
  //     );
  //   } else {
  //     flights = flightData.data.results.list.map(
  //       (flight: {
  //         segments: string | any[];
  //         fares: { adult: { total_price: any } };
  //       }) => {
  //         const firstSegment = flight.segments[0]; // First segment (departure details)
  //         const lastSegment = flight.segments[flight.segments.length - 1]; // Last segment (arrival details)
  //         const normalizedFlight = {
  //           airline: firstSegment.airline.persian, // Airline name in Persian
  //           flightNumber: firstSegment.flight_number, // Flight number
  //           departureTime: `${firstSegment.departure_date}- ${firstSegment.departure_time}`, // Departure time
  //           arrivalTime: `${lastSegment.arrival_date}- ${lastSegment.destination_time}`, // Arrival time
  //           price: flight.fares.adult.total_price, // Price for adults
  //           departure: firstSegment.departure.city.persian, // Departure city in Persian
  //           destination: lastSegment.destination.city.persian, // Destination city in Persian
  //           baggage: firstSegment.baggage, // Baggage allowance
  //           airlineLogo: firstSegment.airline.image, // Airline logo
  //         };

  //         // Log the normalized flight data for debugging
  //         console.log(
  //           "Normalized Flight Data:",
  //           JSON.stringify(normalizedFlight, null, 2)
  //         );

  //         return normalizedFlight;
  //       }
  //     );
  //   }

  //   // Log the final response sent to the AI
  //   console.log("Response Sent to AI:", JSON.stringify(flights, null, 2));

  //   return flights;
  // },
  execute: async function ({ departureCity, destinationCity, date }) {
    if (!date) {
      return {
        message: `لطفاً تاریخ پرواز را به من بگویید.`,
        flights: [],
      };
    }

    try {
      // Helper function to fetch city data and determine if it's domestic or international
      const fetchCityData = async (cityName: string) => {
        // First, try fetching the city as a domestic city
        const domesticResponse = await fetch(
          `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}`
        );
        if (domesticResponse.ok) {
          const domesticData = await domesticResponse.json();
          if (domesticData.data.results.length > 0) {
            // Check if the city is in Iran (domestic)
            if (domesticData.data.results[0].country?.name === "ایران") {
              return {
                isDomestic: true, // Mark as domestic
              };
            }
          }
        }

        // If not found as a domestic city in Iran, try fetching as an international city
        const internationalResponse = await fetch(
          `https://api.atripa.ir/api/v2/basic/intl/cities?search=${cityName}`
        );
        if (internationalResponse.ok) {
          const internationalData = await internationalResponse.json();
          if (internationalData.data.length > 0) {
            return {
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

      // Determine if both cities are domestic
      const bothAreDomestic =
        departureData.isDomestic && destinationData.isDomestic;

      // Fetch IDs for departure and destination cities based on domestic or international status
      let departureId, destinationId;
      if (bothAreDomestic) {
        // Fetch IDs from the domestic cities API
        const [departureResponse, destinationResponse] = await Promise.all([
          fetch(
            `https://api.atripa.ir/api/v2/basic/cities?search=${departureCity}`
          ),
          fetch(
            `https://api.atripa.ir/api/v2/basic/cities?search=${destinationCity}`
          ),
        ]);

        if (!departureResponse.ok || !destinationResponse.ok) {
          throw new Error("Failed to fetch city IDs from the domestic API");
        }

        const departureData = await departureResponse.json();
        const destinationData = await destinationResponse.json();

        departureId = departureData.data.results[0].id;
        destinationId = destinationData.data.results[0].id;
      } else {
        // Fetch IDs from the international cities API
        const [departureResponse, destinationResponse] = await Promise.all([
          fetch(
            `https://api.atripa.ir/api/v2/basic/intl/cities?search=${departureCity}`
          ),
          fetch(
            `https://api.atripa.ir/api/v2/basic/intl/cities?search=${destinationCity}`
          ),
        ]);

        if (!departureResponse.ok || !destinationResponse.ok) {
          throw new Error(
            "Failed to fetch city IDs from the international API"
          );
        }

        const departureData = await departureResponse.json();
        const destinationData = await destinationResponse.json();

        departureId = departureData.data[0].id;
        destinationId = departureData.data[0].id;
      }

      // Determine which API to call based on the cities' domestic status
      const isDomesticFlight = bothAreDomestic;

      // Construct the API URL based on the flight type
      let apiUrl;
      if (isDomesticFlight) {
        apiUrl = `https://api.atripa.ir/api/v2/reserve/flight/list/?departure=${departureId}&destination=${destinationId}&round_trip=false&date=${date}`;
      } else {
        // For international flights, construct the URL with query parameters
        apiUrl = `https://api.atripa.ir/api/v2/reserve/foreign/flight/list/?departure=${departureId}&destination=${destinationId}&adult=1&child=0&infant=0&round_trip=false&date=${date}`;
      }

      // Fetch flight data using the appropriate API
      let flightResponse;
      if (isDomesticFlight) {
        // Use GET for domestic flights
        flightResponse = await fetch(apiUrl);
      } else {
        // Use POST for international flights, but send parameters as query parameters
        flightResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // Check if the API call was successful
      if (!flightResponse.ok) {
        throw new Error(
          `Failed to fetch flight data: ${flightResponse.statusText}`
        );
      }

      const flightData = await flightResponse.json();

      // Normalize the flight data for both domestic and international flights
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
          })
        );
      } else {
        flights = flightData.data.results.list.map(
          (flight: {
            segments: string | any[];
            fares: { adult: { total_price: any } };
          }) => {
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

            return normalizedFlight;
          }
        );
      }

      return flights;
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
  // execute: async function ({
  //   location,
  //   checkIn,
  //   checkOut,
  //   adultsCount,
  //   childCount,
  //   childAges,
  // }) {
  //   // Check if checkIn and checkOut are missing
  //   if (!checkIn || !checkOut) {
  //     return {
  //       message:
  //         "چه تاریخی می‌خواهید برید؟ لطفاً تاریخ ورود و خروج رو بهم بگید.",
  //       hotels: [],
  //     };
  //   }

  //   // Helper function to fetch city data
  //   const fetchCityData = async (cityName: string) => {
  //     // First, try fetching the city as a foreign city (foreign=true)
  //     const foreignResponse = await fetch(
  //       `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}&foreign=true&accommodation=true`
  //     );

  //     if (foreignResponse.ok) {
  //       const foreignData = await foreignResponse.json();
  //       if (foreignData.data.results.length > 0) {
  //         // Return the parto_id for the foreign city
  //         return {
  //           cityId: foreignData.data.results[0].parto_id,
  //           isDomestic: false, // Mark as foreign
  //         };
  //       }
  //     }

  //     // If not found as a foreign city, try fetching as a domestic city (foreign=false)
  //     const domesticResponse = await fetch(
  //       `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}&foreign=false&accommodation=true`
  //     );

  //     if (domesticResponse.ok) {
  //       const domesticData = await domesticResponse.json();
  //       if (domesticData.data.results.length > 0) {
  //         // Return the id for the domestic city
  //         return {
  //           cityId: domesticData.data.results[0].id,
  //           isDomestic: true, // Mark as domestic
  //         };
  //       }
  //     }

  //     // If city is not found in either API, throw an error
  //     throw new Error(`City "${cityName}" not found`);
  //   };

  //   // Fetch city data for the location
  //   const cityData = await fetchCityData(location);

  //   // Log the city data for debugging
  //   console.log("City Data:", cityData);

  //   // Determine the API URL based on whether the city is domestic or foreign
  //   let apiUrl;
  //   if (cityData.isDomestic) {
  //     // Domestic hotel API
  //     apiUrl = `https://api.atripa.ir/reserve/accommodation/list/?city=${cityData.cityId}&check_in=${checkIn}&check_out=${checkOut}&adults_count=${adultsCount}`;
  //   } else {
  //     // International hotel API
  //     apiUrl = `https://api.atripa.ir/api/v2/reserve/foreign/accommodation/list/?city=${
  //       cityData.cityId
  //     }&check_in=${checkIn}&check_out=${checkOut}&adult_count=${adultsCount}&child_count=${childCount}&child_ages=${childAges.join(
  //       ","
  //     )}&nationality=IR`;
  //   }

  //   // Log the API URL for debugging
  //   console.log("Calling API URL:", apiUrl);

  //   // Fetch hotel data using the appropriate API
  //   const hotelResponse = await fetch(apiUrl);

  //   // Check if the API call was successful
  //   if (!hotelResponse.ok) {
  //     const errorData = await hotelResponse.json();
  //     console.error("API Error Response:", JSON.stringify(errorData, null, 2));
  //     throw new Error(`Failed to fetch hotel data: ${errorData.message}`);
  //   }

  //   const hotelData = await hotelResponse.json();

  //   // Log the raw API response for debugging
  //   console.log("Raw API Response:", JSON.stringify(hotelData, null, 2));

  //   // Handle various error cases based on API response
  //   if (hotelData.message === "Error acquired" && hotelData.errors) {
  //     let errorMessage = "متاسفم، مشکلی پیش آمده: ";

  //     // Check for specific error messages
  //     if (hotelData.errors.date) {
  //       errorMessage += hotelData.errors.date.join(", ");
  //     } else {
  //       errorMessage += "لطفاً اطلاعات ورودی را بررسی کنید.";
  //     }

  //     return {
  //       message: errorMessage,
  //       hotels: [],
  //     };
  //   }

  //   // Normalize the hotel data for both domestic and international hotels
  //   let hotels = [];
  //   if (cityData.isDomestic) {
  //     // Normalize domestic hotel data
  //     hotels = hotelData.data.data.map(
  //       (hotel: {
  //         name: any;
  //         rooms: { room_type_name: any }[];
  //         min_price: any;
  //         star_rating: any;
  //       }) => ({
  //         hotelName: hotel.name,
  //         location: location,
  //         checkIn: checkIn,
  //         checkOut: checkOut,
  //         roomType: hotel.rooms[0].room_type_name, // Example: First room type
  //         price: hotel.min_price, // Minimum price
  //         rating: hotel.star_rating, // Star rating
  //       })
  //     );
  //   } else {
  //     // Normalize international hotel data
  //     hotels = hotelData.data.results.map(
  //       (hotel: {
  //         name: any;
  //         rooms: { [x: string]: { name: any } };
  //         fare: { total: any };
  //         star_rating: any;
  //       }) => ({
  //         hotelName: hotel.name,
  //         location: location,
  //         checkIn: checkIn,
  //         checkOut: checkOut,
  //         roomType: hotel.rooms["1"].name, // Example: First room type
  //         price: hotel.fare.total, // Total price
  //         rating: hotel.star_rating, // Star rating
  //       })
  //     );
  //   }

  //   // Log the final response sent to the AI
  //   console.log("Response Sent to AI:", JSON.stringify(hotels, null, 2));

  //   return hotels;
  // },
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
          `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}&foreign=true&accommodation=true`
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
          `https://api.atripa.ir/api/v2/basic/cities?search=${cityName}&foreign=false&accommodation=true`
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
        apiUrl = `https://api.atripa.ir/reserve/accommodation/list/?city=${cityData.cityId}&check_in=${checkIn}&check_out=${checkOut}&adults_count=${adultsCount}`;
      } else {
        // International hotel API
        apiUrl = `https://api.atripa.ir/api/v2/reserve/foreign/accommodation/list/?city=${
          cityData.cityId
        }&check_in=${checkIn}&check_out=${checkOut}&adult_count=${adultsCount}&child_count=${childCount}&child_ages=${childAges.join(
          ","
        )}&nationality=IR`;
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
