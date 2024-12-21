"use client";

import { FaPlane } from "react-icons/fa";
import { Badge } from "@/components/shadcn/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";
import { Avatar } from "../shadcn/avatar";
import Image from "next/image";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";

type FlightProps = {
  departure: string;
  destination: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airlineLogo: string;
  type: string;
  capacity: number;
  sellingType: string;
  id: number;
  aircraft: string;
  baggage: string;
  flightClass: string;
  cobin: string;
  persian_type: string;
  refundable: boolean | null;
  child_price: number;
  infant_price: number;
  departure_terminal: string;
  refund_rules: string[];
  destination_terminal: string;
  flight_duration: string;
  cobin_persian: string;
  with_tour: boolean | null;
  tag: string;
  onFlightCardClick: (flightInfo: any) => void;
};

const FlightCard = ({
  airline,
  flightNumber,
  departure,
  destination,
  departureTime,
  arrivalTime,
  price,
  airlineLogo,
  type,
  capacity,
  sellingType,
  id,
  aircraft,
  baggage,
  flightClass,
  cobin,
  persian_type,
  refundable,
  child_price,
  infant_price,
  departure_terminal,
  refund_rules,
  destination_terminal,
  flight_duration,
  cobin_persian,
  with_tour,
  tag,
  onFlightCardClick,
}: FlightProps) => {
  // Convert Gregorian dates to Jalali dates
  const convertToJalali = (dateTime: string) => {
    // Split the date and time
    const [date, time] = dateTime.split("-");
    // Parse the Gregorian date
    const jalaliDate = moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD");
    // Return the Jalali date and time
    return `${jalaliDate} - ${time.trim()}`;
  };

  // Convert departure and arrival times to Jalali
  const jalaliDepartureTime = convertToJalali(departureTime);
  const jalaliArrivalTime = convertToJalali(arrivalTime);

  const router = useRouter();

  // Function to handle card click
  // const handleFlightCardClick = () => {
  //   const flightInfo = {
  //     airline,
  //     flightNumber,
  //     departure,
  //     destination,
  //     departureTime: jalaliDepartureTime,
  //     arrivalTime: jalaliArrivalTime,
  //     price,
  //     airlineLogo,
  //   };

  //   // Transform the flightInfo object to match the required structure
  //   const transformedFlightInfo = {
  //     type: "charter", // Default value
  //     capacity: 5, // Default value
  //     airline: flightInfo.airline.toLowerCase(), // Convert to lowercase
  //     sellingType: "All", // Default value
  //     id: 699, // Default value
  //     aircraft: "Boeing MD", // Default value
  //     class: "", // Default value
  //     cobin: "Economy", // Default value
  //     persian_type: "چارتر", // Default value
  //     refundable: null, // Default value
  //     adult_price: flightInfo.price, // Use the price from chatbot
  //     child_price: flightInfo.price, // Use the price from chatbot
  //     infant_price: flightInfo.price, // Use the price from chatbot
  //     airline_persian: flightInfo.airline, // Use the airline from chatbot
  //     airline_logo: flightInfo.airlineLogo, // Use the airline logo from chatbot
  //     flight_number: flightInfo.flightNumber.toUpperCase(), // Convert to uppercase
  //     departure: "THR", // Default value
  //     departure_name: flightInfo.departure, // Use the departure from chatbot
  //     english_departure_name: "Tehran", // Default value
  //     departure_date: "2024-12-29", // Default value
  //     departure_time: flightInfo.departureTime.split(" - ")[1], // Extract time
  //     baggage: "0", // Default value
  //     departure_terminal: "", // Default value
  //     refund_rules: [], // Default value
  //     destination: "MHD", // Default value
  //     destination_name: flightInfo.destination, // Use the destination from chatbot
  //     english_destination_name: "Mashhad", // Default value
  //     destination_time: "", // Default value
  //     destination_terminal: "", // Default value
  //     flight_duration: "", // Default value
  //     arrival_date: "2024-12-29", // Default value
  //     cobin_persian: "اکونومی", // Default value
  //     with_tour: null, // Default value
  //     tag: "zm", // Default value
  //   };

  //   // Static data for generalInformation
  //   const generalInformation = {
  //     ticket: true,
  //     accommodation: false,
  //     itinerary: false,
  //     isInternational: false,
  //   };

  //   // Static data for ticketInformation
  //   const ticketInformation = {
  //     departure: {
  //       id: 303,
  //       name: "تهران",
  //       english_name: "Tehran",
  //       iata: "THR",
  //       latitude: "35.700618",
  //       longitude: "51.401378",
  //       description: null,
  //       is_province_capital: true,
  //       is_country_capital: true,
  //       usage_flight: 86880,
  //       usage_accommodation: 1503,
  //       country: {
  //         id: 1,
  //         name: "ایران",
  //         english_name: "Iran",
  //         iata: "IRN",
  //         parto_iata: "IR",
  //         description: null,
  //         nationality: "IRN",
  //         continental: "آسیا",
  //       },
  //       province: {
  //         id: 8,
  //         name: "تهران",
  //         english_name: "Tehran",
  //         description: null,
  //         country: {
  //           id: 1,
  //           name: "ایران",
  //           english_name: "Iran",
  //           iata: "IRN",
  //           parto_iata: "IR",
  //           description: null,
  //           nationality: "IRN",
  //           continental: "آسیا",
  //         },
  //       },
  //       flight: true,
  //       accommodation: true,
  //       has_plan: false,
  //       parto_id: 0,
  //       color: "#1E1E1E",
  //       value: 303,
  //       label: "تهران - THR",
  //     },
  //     destination: {
  //       id: 445,
  //       name: "مشهد",
  //       english_name: "Mashhad",
  //       iata: "MHD",
  //       latitude: "36.297498",
  //       longitude: "59.605939",
  //       description: null,
  //       is_province_capital: true,
  //       is_country_capital: false,
  //       usage_flight: 112303,
  //       usage_accommodation: 6624,
  //       country: {
  //         id: 1,
  //         name: "ایران",
  //         english_name: "Iran",
  //         iata: "IRN",
  //         parto_iata: "IR",
  //         description: null,
  //         nationality: "IRN",
  //         continental: "آسیا",
  //       },
  //       province: {
  //         id: 11,
  //         name: "خراسان رضوی",
  //         english_name: "Razavi Khorasan",
  //         description: null,
  //         country: {
  //           id: 1,
  //           name: "ایران",
  //           english_name: "Iran",
  //           iata: "IRN",
  //           parto_iata: "IR",
  //           description: null,
  //           nationality: "IRN",
  //           continental: "آسیا",
  //         },
  //       },
  //       flight: true,
  //       accommodation: true,
  //       has_plan: true,
  //       parto_id: 0,
  //       color: "#006363",
  //       value: 445,
  //       label: "مشهد - MHD",
  //     },
  //     departureDate: "2024-12-29",
  //     returnDate: null,
  //     personCounter: {
  //       adult: 1,
  //       child: 0,
  //       infant: 0,
  //       totalPersons: 1,
  //     },
  //     secondTicket: false,
  //   };

  //   console.log(
  //     "Sending transformed flight details to parent:",
  //     transformedFlightInfo
  //   ); // Debugging

  //   // Send the transformed flight details, generalInformation, and ticketInformation to the parent React app using postMessage
  //   window.parent.postMessage(
  //     {
  //       type: "SELECTED_FLIGHT",
  //       payload: {
  //         selectedDepartureFlight: transformedFlightInfo,
  //         generalInformation,
  //         ticketInformation,
  //       },
  //     },
  //     "http://localhost:3000" // Target origin (React app's origin)
  //   );
  // };
  const handleFlightCardClick = () => {
    const flightInfo = {
      airline,
      flightNumber,
      departure,
      destination,
      departureTime: jalaliDepartureTime,
      arrivalTime: jalaliArrivalTime,
      price,
      airlineLogo,
      type,
      capacity,
      sellingType,
      id,
      aircraft,
      baggage,
      flightClass,
      cobin,
      persian_type,
      refundable,
      child_price,
      infant_price,
      departure_terminal,
      refund_rules,
      destination_terminal,
      flight_duration,
      cobin_persian,
      with_tour,
      tag,
    };

    // Transform the flightInfo object to match the required structure
    const transformedFlightInfo = {
      type: flightInfo.type,
      capacity: flightInfo.capacity,
      airline: flightInfo.airline.toLowerCase(),
      sellingType: flightInfo.sellingType,
      id: flightInfo.id,
      aircraft: flightInfo.aircraft,
      class: flightInfo.flightClass,
      cobin: flightInfo.cobin,
      persian_type: flightInfo.persian_type,
      refundable: flightInfo.refundable,
      adult_price: flightInfo.price,
      child_price: flightInfo.child_price,
      infant_price: flightInfo.infant_price,
      airline_persian: flightInfo.airline,
      airline_logo: flightInfo.airlineLogo,
      flight_number: flightInfo.flightNumber.toUpperCase(),
      departure: flightInfo.departure,
      departure_name: flightInfo.departure,
      english_departure_name: "Tehran", // Default value
      departure_date: flightInfo.departureTime.split(" - ")[0],
      departure_time: flightInfo.departureTime.split(" - ")[1],
      baggage: flightInfo.baggage,
      departure_terminal: flightInfo.departure_terminal,
      refund_rules: flightInfo.refund_rules,
      destination: flightInfo.destination,
      destination_name: flightInfo.destination,
      english_destination_name: "Mashhad", // Default value
      destination_time: flightInfo.arrivalTime.split(" - ")[1],
      destination_terminal: flightInfo.destination_terminal,
      flight_duration: flightInfo.flight_duration,
      arrival_date: flightInfo.arrivalTime.split(" - ")[0],
      cobin_persian: flightInfo.cobin_persian,
      with_tour: flightInfo.with_tour,
      tag: flightInfo.tag,
    };

    // Static data for generalInformation
    const generalInformation = {
      ticket: true,
      accommodation: false,
      itinerary: false,
      isInternational: false,
    };

    // Dynamic data for ticketInformation
    const ticketInformation = {
      departure: {
        id: departureCityData.id,
        name: departureCityData.name,
        english_name: departureCityData.english_name,
        iata: departureCityData.iata,
        latitude: departureCityData.latitude,
        longitude: departureCityData.longitude,
        description: departureCityData.description,
        is_province_capital: departureCityData.is_province_capital,
        is_country_capital: departureCityData.is_country_capital,
        usage_flight: departureCityData.usage_flight,
        usage_accommodation: departureCityData.usage_accommodation,
        country: departureCityData.country,
        province: departureCityData.province,
        flight: departureCityData.flight,
        accommodation: departureCityData.accommodation,
        has_plan: departureCityData.has_plan,
        parto_id: departureCityData.parto_id,
      },
      destination: {
        id: destinationCityData.id,
        name: destinationCityData.name,
        english_name: destinationCityData.english_name,
        iata: destinationCityData.iata,
        latitude: destinationCityData.latitude,
        longitude: destinationCityData.longitude,
        description: destinationCityData.description,
        is_province_capital: destinationCityData.is_province_capital,
        is_country_capital: destinationCityData.is_country_capital,
        usage_flight: destinationCityData.usage_flight,
        usage_accommodation: destinationCityData.usage_accommodation,
        country: destinationCityData.country,
        province: destinationCityData.province,
        flight: destinationCityData.flight,
        accommodation: destinationCityData.accommodation,
        has_plan: destinationCityData.has_plan,
        parto_id: destinationCityData.parto_id,
      },
      departureDate: "2024-12-29", // Replace with actual departure date
      returnDate: null,
      personCounter: {
        adult: 1,
        child: 0,
        infant: 0,
        totalPersons: 1,
      },
      secondTicket: false,
    };

    console.log(
      "Sending transformed flight details to parent:",
      transformedFlightInfo
    ); // Debugging

    // Send the transformed flight details, generalInformation, and ticketInformation to the parent React app using postMessage
    window.parent.postMessage(
      {
        type: "SELECTED_FLIGHT",
        payload: {
          selectedDepartureFlight: transformedFlightInfo,
          generalInformation,
          ticketInformation,
        },
      },
      "http://localhost:3000" // Target origin (React app's origin)
    );
  };
  // const handleFlightCardClick = () => {
  //   const flightInfo = {
  //     airline,
  //     flightNumber,
  //     departure,
  //     destination,
  //     departureTime: jalaliDepartureTime,
  //     arrivalTime: jalaliArrivalTime,
  //     price,
  //     airlineLogo,
  //     type,
  //     capacity,
  //     sellingType,
  //     id,
  //     aircraft,
  //     baggage,
  //     flightClass,
  //     cobin,
  //     persian_type,
  //     refundable,
  //     child_price,
  //     infant_price,
  //     departure_terminal,
  //     refund_rules,
  //     destination_terminal,
  //     flight_duration,
  //     cobin_persian,
  //     with_tour,
  //     tag,
  //   };

  //   // Transform the flightInfo object to match the required structure
  //   const transformedFlightInfo = {
  //     type: flightInfo.type,
  //     capacity: flightInfo.capacity,
  //     airline: flightInfo.airline.toLowerCase(),
  //     sellingType: flightInfo.sellingType,
  //     id: flightInfo.id,
  //     aircraft: flightInfo.aircraft,
  //     calss: flightInfo.flightClass,
  //     cobin: flightInfo.cobin,
  //     persian_type: flightInfo.persian_type,
  //     refundable: flightInfo.refundable,
  //     adult_price: flightInfo.price,
  //     child_price: flightInfo.child_price,
  //     infant_price: flightInfo.infant_price,
  //     airline_persian: flightInfo.airline,
  //     airline_logo: flightInfo.airlineLogo,
  //     flight_number: flightInfo.flightNumber.toUpperCase(),
  //     departure: flightInfo.departure,
  //     departure_name: flightInfo.departure,
  //     english_departure_name: "Tehran", // Default value
  //     departure_date: flightInfo.departureTime.split(" - ")[0],
  //     departure_time: flightInfo.departureTime.split(" - ")[1],
  //     baggage: flightInfo.baggage,
  //     departure_terminal: flightInfo.departure_terminal,
  //     refund_rules: flightInfo.refund_rules,
  //     destination: flightInfo.destination,
  //     destination_name: flightInfo.destination,
  //     english_destination_name: "Mashhad", // Default value
  //     destination_time: flightInfo.arrivalTime.split(" - ")[1],
  //     destination_terminal: flightInfo.destination_terminal,
  //     flight_duration: flightInfo.flight_duration,
  //     arrival_date: flightInfo.arrivalTime.split(" - ")[0],
  //     cobin_persian: flightInfo.cobin_persian,
  //     with_tour: flightInfo.with_tour,
  //     tag: flightInfo.tag,
  //   };

  //   // Static data for generalInformation
  //   const generalInformation = {
  //     ticket: true,
  //     accommodation: false,
  //     itinerary: false,
  //     isInternational: false,
  //   };

  //   // Static data for ticketInformation
  //   const ticketInformation = {
  //     departure: {
  //       id: 303,
  //       name: "تهران",
  //       english_name: "Tehran",
  //       iata: "THR",
  //       latitude: "35.700618",
  //       longitude: "51.401378",
  //       description: null,
  //       is_province_capital: true,
  //       is_country_capital: true,
  //       usage_flight: 86880,
  //       usage_accommodation: 1503,
  //       country: {
  //         id: 1,
  //         name: "ایران",
  //         english_name: "Iran",
  //         iata: "IRN",
  //         parto_iata: "IR",
  //         description: null,
  //         nationality: "IRN",
  //         continental: "آسیا",
  //       },
  //       province: {
  //         id: 8,
  //         name: "تهران",
  //         english_name: "Tehran",
  //         description: null,
  //         country: {
  //           id: 1,
  //           name: "ایران",
  //           english_name: "Iran",
  //           iata: "IRN",
  //           parto_iata: "IR",
  //           description: null,
  //           nationality: "IRN",
  //           continental: "آسیا",
  //         },
  //       },
  //       flight: true,
  //       accommodation: true,
  //       has_plan: false,
  //       parto_id: 0,
  //       color: "#1E1E1E",
  //       value: 303,
  //       label: "تهران - THR",
  //     },
  //     destination: {
  //       id: 445,
  //       name: "مشهد",
  //       english_name: "Mashhad",
  //       iata: "MHD",
  //       latitude: "36.297498",
  //       longitude: "59.605939",
  //       description: null,
  //       is_province_capital: true,
  //       is_country_capital: false,
  //       usage_flight: 112303,
  //       usage_accommodation: 6624,
  //       country: {
  //         id: 1,
  //         name: "ایران",
  //         english_name: "Iran",
  //         iata: "IRN",
  //         parto_iata: "IR",
  //         description: null,
  //         nationality: "IRN",
  //         continental: "آسیا",
  //       },
  //       province: {
  //         id: 11,
  //         name: "خراسان رضوی",
  //         english_name: "Razavi Khorasan",
  //         description: null,
  //         country: {
  //           id: 1,
  //           name: "ایران",
  //           english_name: "Iran",
  //           iata: "IRN",
  //           parto_iata: "IR",
  //           description: null,
  //           nationality: "IRN",
  //           continental: "آسیا",
  //         },
  //       },
  //       flight: true,
  //       accommodation: true,
  //       has_plan: true,
  //       parto_id: 0,
  //       color: "#006363",
  //       value: 445,
  //       label: "مشهد - MHD",
  //     },
  //     departureDate: "2024-12-29",
  //     returnDate: null,
  //     personCounter: {
  //       adult: 1,
  //       child: 0,
  //       infant: 0,
  //       totalPersons: 1,
  //     },
  //     secondTicket: false,
  //   };

  //   console.log(
  //     "Sending transformed flight details to parent:",
  //     transformedFlightInfo
  //   ); // Debugging

  //   // Send the transformed flight details, generalInformation, and ticketInformation to the parent React app using postMessage
  //   window.parent.postMessage(
  //     {
  //       type: "SELECTED_FLIGHT",
  //       payload: {
  //         selectedDepartureFlight: transformedFlightInfo,
  //         generalInformation,
  //         ticketInformation,
  //       },
  //     },
  //     "http://localhost:3000" // Target origin (React app's origin)
  //   );
  // };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-w-60 sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1">
              <Avatar>
                <Image
                  width={50}
                  height={50}
                  src={airlineLogo}
                  alt={`${airline} logo`}
                />
              </Avatar>
              <h2 className="text-sm font-semibold text-primary">{airline}</h2>
            </div>

            <Badge variant="secondary" className="text-xs font-medium">
              {flightNumber}
            </Badge>
          </div>
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="text-left flex flex-col items-start">
              <p className="text-md text-card-foreground font-bold mb-2">
                {departure}
              </p>
              <p className="text-xs prose-sm text-muted-foreground ">
                {jalaliDepartureTime}
              </p>
            </div>
            <div className="flex flex-col items-center px-4">
              <FaPlane className="text-card-foreground w-6 h-6 rotate-180" />
            </div>

            <div className="text-right flex flex-col items-end">
              <p className="text-md text-card-foreground font-bold mb-2">
                {destination}
              </p>
              <p className="text-xs prose-sm text-muted-foreground">
                {jalaliArrivalTime}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div>
              <p className="prose-sm text-sm font-semibold text-card-foreground">
                {price.toLocaleString()} ریال
              </p>
            </div>
            <Button
              onClick={handleFlightCardClick}
              className="animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              دیدن جزِئیات
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
