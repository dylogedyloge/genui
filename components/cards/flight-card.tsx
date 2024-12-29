"use client";

import { FaPlane } from "react-icons/fa";
import { Badge } from "@/components/shadcn/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";
import { Avatar } from "../shadcn/avatar";
import Image from "next/image";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import { CityData } from "@/types/chat";
import { useState } from "react"; // Import useState for managing accordion state
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion"; // Import shadcn/ui Accordion components
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";

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
  refund_rules: [];
  destination_terminal: string;
  flight_duration: string;
  cobin_persian: string;
  with_tour: boolean | null;
  tag: string;
  onFlightCardClick: (flightInfo: any) => void;
  departureCityData: CityData;
  destinationCityData: CityData;
  isDomestic: boolean;
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
  departureCityData,
  destinationCityData,
  isDomestic,
}: FlightProps) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // State for accordion
  const [flightInfo, setFlightInfo] = useState<any>(null); // State to store flightInfo

  // Convert Gregorian dates to Jalali dates
  const convertToJalali = (dateTime: string) => {
    const [date, time] = dateTime.split("-");
    const jalaliDate = moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD");
    return `${jalaliDate} - ${time.trim()}`;
  };

  // Convert departure and arrival times to Jalali
  const jalaliDepartureTime = convertToJalali(departureTime);
  const jalaliArrivalTime = convertToJalali(arrivalTime);

  const router = useRouter();

  // Function to handle card click
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
      departureCityData,
      destinationCityData,
    };

    if (isDomestic) {
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

      const generalInformation = {
        ticket: true,
        accommodation: false,
        itinerary: false,
        isInternational: false,
      };

      const domesticFlightInformation = {
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
        personCounter: {
          adult: 1,
          child: 0,
          infant: 0,
          totalPersons: 1,
        },
      };
      window.parent.postMessage(
        {
          type: "SELECTED_FLIGHT",
          payload: {
            selectedDepartureFlight: transformedFlightInfo,
            generalInformation,
            domesticFlightInformation,
          },
        },
        "*"
      );
    } else {
      // Set flightInfo before toggling the accordion
      setFlightInfo(flightInfo);
      console.log("flightInfo 1", flightInfo);
      // Toggle accordion for international flights
      setIsAccordionOpen(!isAccordionOpen);
    }
  };
  console.log("flightInfo 2", flightInfo);

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
              {isDomestic
                ? "دیدن جزِئیات"
                : isAccordionOpen
                ? "بستن"
                : "جزئیات"}
            </Button>
          </motion.div>
        </div>

        {/* Accordion for international flights */}
        {!isDomestic && (
          <Accordion
            type="single"
            collapsible
            value={isAccordionOpen ? "item-1" : undefined}
          >
            <AccordionItem value="item-1">
              <AccordionContent className="p-6 pt-0 text-card-foreground">
                {flightInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="space-y-4"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {[
                        {
                          label: "شرکت هواپیمایی",
                          value: flightInfo.airline,
                        },
                        {
                          label: "شماره پرواز",
                          value: flightInfo.flightNumber,
                        },
                        {
                          label: "کلاس پرواز",
                          value: flightInfo.flightClass,
                        },
                        { label: "بار مجاز", value: flightInfo.baggage },
                        {
                          label: "قابل استرداد",
                          value: flightInfo.refundable ? "بله" : "خیر",
                        },
                        {
                          label: "ترمینال خروج",
                          value: flightInfo.departure_terminal,
                        },
                        {
                          label: "ترمینال ورود",
                          value: flightInfo.destination_terminal,
                        },
                        {
                          label: "مدت پرواز",
                          value: flightInfo.flight_duration,
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <p className="text-sm font-semibold text-card-foreground">
                            {item.label}:
                          </p>
                          <p className="text-sm text-card-foreground">
                            {item.value}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </motion.div>
  );
};

export default FlightCard;
