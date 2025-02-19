
"use client";
import { Badge } from "@/components/shadcn/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";
import { Avatar } from "../shadcn/avatar";
import Image from "next/image";
import moment from "moment-jalaali";
import type { CityData } from "@/types/chat";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/shadcn/accordion";
import {
  Plane,
  MapPin,
  CalendarClock,
  Wallet,
  Luggage,
  Clock,
  Hash,
  Loader2,
  Sofa,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import DOMPurify from "dompurify";
import { API_ENDPOINTS } from "../../endpoints/endpoints";
import { FaPlane } from "react-icons/fa";
import { Separator } from "../shadcn/separator";

type FlightProps = {
  fareSourceCode: string;
  isClosed: boolean;
  visaRequirements: any[];
  fares: any;
  cabin: any;
  segments: any[];
  returnSegments: any[];
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
  id,
  fareSourceCode,
  isClosed,
  visaRequirements,
  fares,
  cabin,
  segments,
  returnSegments,
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
  const [flightInfo, setFlightInfo] = useState<any | null>(null); // State to store flightInfo
  interface BaggageRule {
    departure: string;
    arrival: string;
    baggage: string;
  }
  const [baggageRules, setBaggageRules] = useState<
    BaggageRule[] | string | null
  >(null); // State for baggage rules
  const [refundRules, setRefundRules] = useState<any[] | string | null>(null); // State for refund rules with proper typing
  const [isLoadingBaggage, setIsLoadingBaggage] = useState(false); // State for baggage rules loading
  const [isLoadingRefund, setIsLoadingRefund] = useState(false); // State for refund rules loading

  // Convert Gregorian dates to Jalali dates
  const convertToJalali = (
    date: string,
    time: string,
    isDomestic: boolean,
    isDeparture: boolean
  ) => {
    const jalaliDate = moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD");

    if (isDomestic) {
      const extractedTime =
        time && typeof time === "string" && time.includes("-")
          ? time.split("-").pop()?.trim()
          : time;

      return isDeparture
        ? `${jalaliDate} - ${extractedTime}` // Format for departure: "1403/10/11 - 23:45"
        : jalaliDate; // Format for arrival: "1403/10/11"
    } else {
      const formattedTime =
        time && typeof time === "string" && time.includes(":")
          ? time.split(":").slice(0, 2).join(":") // Remove seconds if present
          : time || ""; // Default to an empty string if time is undefined or null

      return `${jalaliDate} - ${formattedTime}`;
    }
  };

  // Extract departure and arrival details based on flight type
  const getFlightDetails = () => {
    if (isDomestic) {
      return {
        airline: airline,
        flightNumber: flightNumber,
        departureCity: departureCityData?.name || departure,
        destinationCity: destinationCityData?.name || destination,
        departureTime: convertToJalali(
          departureTime.split("T")[0],
          departureTime.split("T")[1] || departureTime,
          isDomestic,
          true
        ),
        arrivalTime: convertToJalali(
          arrivalTime.split("T")[0],
          arrivalTime.split("T")[1] || arrivalTime,
          isDomestic,
          false
        ),
        baggage: baggage,
        flightDuration: flight_duration,
      };
    } else {
      const firstSegment = segments[0];
      return {
        airline: firstSegment.airline.persian,
        flightNumber: firstSegment.flightNumber,
        departureCity: firstSegment.departure.city.persian,
        destinationCity: firstSegment.destination.city.persian,
        departureTime: convertToJalali(
          firstSegment.departureDate,
          firstSegment.departureTime,
          isDomestic,
          true
        ),
        arrivalTime: convertToJalali(
          firstSegment.arrivalDate,
          firstSegment.destinationTime,
          isDomestic,
          false
        ),
        baggage: firstSegment.baggage,
        flightDuration: firstSegment.flightDuration,
      };
    }
  };

  const flightDetails = getFlightDetails();

  // Get the price based on flight type
  const getPrice = () => {
    return isDomestic ? price : fares.adult.total_price;
  };

  // Function to handle card click
  const handleFlightCardClick = () => {
    const flightInfo = {
      id,
      fareSourceCode,
      isClosed,
      visaRequirements,
      fares,
      cabin,
      segments,
      returnSegments,
      departureCityData,
      destinationCityData,
      airline,
      flightNumber,
      departure,
      destination,
      departureTime: flightDetails.departureTime,
      arrivalTime: flightDetails.arrivalTime,
      price: getPrice(), // Use the `getPrice` function here
      airlineLogo,
      type,
      capacity,
      sellingType,
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
        adult_price: flightInfo.price, // Use the `price` directly
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
      // Toggle accordion for international flights
      setIsAccordionOpen(!isAccordionOpen);
      console.log(flightInfo);
    }
  };

  const handleInternationalFlightPurchase = () => {
    // Ensure departureTime is defined and in the correct format
    const departureDate =
      segments[0]?.departureDate || departureTime?.split("T")[0];

    if (!departureDate) {
      console.error("Departure date is missing or invalid.");
      return;
    }

    // Extract departure and destination data from the first segment
    const firstSegment = segments[0];
    const departureCity = firstSegment.departure.city;
    const destinationCity = firstSegment.destination.city;

    // Construct generalInformation
    const generalInformation = {
      ticket: true,
      accommodation: false,
      itinerary: false,
      isInternational: true,
    };
    console.log("generalInformation", generalInformation);
    // Construct intFlightInformation
    const intFlightInformation = {
      departure: {
        id: departureCityData?.id || undefined,
        subs: [],
        name: departureCity.persian,
        english_name: departureCity.english,
        code: firstSegment.departure.terminal.code,
        city: departureCity.persian,
        english_city: departureCity.english,
        country: firstSegment.departure.country.persian,
        english_country: firstSegment.departure.country.english,
        country_code: firstSegment.departure.country.code,
      },
      destination: {
        id: destinationCityData?.id || undefined,
        subs: [],
        name: destinationCity.persian,
        english_name: destinationCity.english,
        code: firstSegment.destination.terminal.code,
        city: destinationCity.persian,
        english_city: destinationCity.english,
        country: firstSegment.destination.country.persian,
        english_country: firstSegment.destination.country.english,
        country_code: firstSegment.destination.country.code,
      },
      departureDate, // Use the validated departureDate
      returnDate: null, // No return date for one-way flights
      personCounter: {
        adult: 1,
        child: 0,
        infant: 0,
        totalPersons: 1,
      },
      isDirect: segments.length === 1, // True if there are no connecting flights
    };
    console.log("intFlightInformation", intFlightInformation);

    // Construct selectedIntFlight
    const selectedIntFlight = {
      id,
      fare_source_code: fareSourceCode,
      is_closed: isClosed,
      visa_requirements: visaRequirements,
      fares,
      cabin,
      segments,
      return_segments: returnSegments,
    };
    console.log("selectedIntFlight", selectedIntFlight);

    // Post the data to the parent app
    window.parent.postMessage(
      {
        type: "SELECTED_INT_FLIGHT",
        payload: {
          generalInformation,
          intFlightInformation,
          selectedIntFlight,
        },
      },
      "*"
    );
  };

  // Fetch baggage and refund rules when accordion is opened
  useEffect(() => {
    if (isAccordionOpen && !isDomestic) {
      // Fetch baggage rules
      setIsLoadingBaggage(true);
      fetch(
        `${API_ENDPOINTS.INTERNATIONAL.BAGGAGE}?fare_source_code=${fareSourceCode}`
      )
        .then((response) => response.json())
        .then((data) => {
          setBaggageRules(data.data.baggage_info);
          setIsLoadingBaggage(false);
        })
        .catch((error) => {
          console.error("Error fetching baggage rules:", error);
          setIsLoadingBaggage(false);
        });

      // Fetch refund rules
      setIsLoadingRefund(true);
      fetch(
        `${API_ENDPOINTS.INTERNATIONAL.RULES}?fare_source_code=${fareSourceCode}`
      )
        .then((response) => response.json())
        .then((data) => {
          setRefundRules(data.data);
          setIsLoadingRefund(false);
        })
        .catch((error) => {
          console.error("Error fetching refund rules:", error);
          setIsLoadingRefund(false);
        });
    }
  }, [isAccordionOpen, isDomestic, fareSourceCode]);

  // Function to render Markdown content
  const removeInlineStyles = (html: string | undefined) => {
    return (html || "").replace(/style="[^"]*"/g, ""); // Fallback to empty string if html is undefined
  };

  const renderMarkdown = (content: string | undefined) => {
    const cleanContent = DOMPurify.sanitize(removeInlineStyles(content)); // Ensure content is sanitized and styles are removed
    return <div dangerouslySetInnerHTML={{ __html: cleanContent }} />;
  };


  return (
    <Card className="min-w-60 sm:w-96 overflow-hidden transition-shadow duration-300 hover:shadow-lg rounded-lg">
      <div className="min-w-60 sm:w-96 shadow-md  dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
        <CardHeader className="pb-2">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10">
                <Image
                  width={48}
                  height={48}
                  src={isDomestic ? airlineLogo : segments[0].airline.image}
                  alt={`${
                    isDomestic ? airline : segments[0].airline.persian
                  } logo`}
                  className="rounded-full"
                />
              </Avatar>
              <div>
                <CardTitle className="text-sm font-semibold">
                  {isDomestic ? airline : segments[0].airline.persian}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {flightDetails.flightNumber}
                </p>
              </div>
            </div>
            <Badge variant="default" className="text-sm font-bold">
              {getPrice().toLocaleString()} ریال
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10">
                <Image
                  width={48}
                  height={48}
                  src={isDomestic ? airlineLogo : segments[1].airline.image}
                  alt={`${
                    isDomestic ? airline : segments[1].airline.persian
                  } logo`}
                  className="rounded-full"
                />
              </Avatar>
              <div>
                <CardTitle className="text-sm font-semibold">
                  {isDomestic ? airline : segments[1].airline.persian}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {flightDetails.flightNumber}
                </p>
              </div>
            </div>
            <Badge variant="default" className="text-sm font-bold">
              {getPrice().toLocaleString()} ریال
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
        <div className="flex items-center justify-between relative">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-primary" />
              <p className="text-sm font-medium">{flightDetails.departureCity}</p>
            </div>
            <p className="text-xs text-muted-foreground">{flightDetails.departureTime}</p>
          </div>
          <div className="flex items-center space-x-4">
            
            <FaPlane size={24} className="text-primary transform rotate-180" />
           
          </div>
          <div className="space-y-2 text-right">
            <div className="flex items-center space-x-2 justify-end">
              <MapPin size={16} className="text-primary" />
              <p className="text-sm font-medium">{flightDetails.destinationCity}</p>
            </div>
            <p className="text-xs text-muted-foreground">{flightDetails.arrivalTime}</p>
          </div>
        </div>
          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="text-primary" size={16} />
              <span className="text-primary">{flightDetails.flightDuration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Luggage className="text-primary" size={16} />
              <span className="text-primary">{flightDetails.baggage}</span>
            </div>
            <div className="flex items-center gap-1">
              <Sofa className="text-primary" size={16} />
              <span className="text-primary">{isDomestic ? cobin_persian : cabin.persian}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button
            onClick={handleFlightCardClick}
            className="w-full"
            variant={isDomestic ? "default" : "outline"}
          >
            {isDomestic
              ? "خرید"
              : isAccordionOpen
              ? "بستن جزئیات"
              : "مشاهده جزئیات"}
          </Button>
        </CardFooter>

        {!isDomestic && (
          <Accordion
            type="single"
            collapsible
            value={isAccordionOpen ? "details" : ""}
            className="px-4 pb-4"
          >
            <AccordionItem value="details" className="border-none">
              <AccordionContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="details">جزئیات پرواز</TabsTrigger>
                    <TabsTrigger
                      value="baggage-rules"
                      disabled={isLoadingBaggage}
                    >
                      {isLoadingBaggage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "قوانین بار"
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="refund-rules"
                      disabled={isLoadingRefund}
                    >
                      {isLoadingRefund ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "قوانین استرداد"
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    <motion.div
                      className="space-y-4"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 },
                        },
                      }}
                    >
                      {[
                        {
                          label: "شرکت هواپیمایی",
                          value: flightDetails.airline,
                          icon: <Plane className="w-4 h-4" />,
                        },
                        {
                          label: "شماره پرواز",
                          value: flightDetails.flightNumber,
                          icon: <Hash className="w-4 h-4" />,
                        },
                        {
                          label: "مبدا",
                          value: flightDetails.departureCity,
                          icon: <MapPin className="w-4 h-4" />,
                        },
                        {
                          label: "مقصد",
                          value: flightDetails.destinationCity,
                          icon: <MapPin className="w-4 h-4" />,
                        },
                        {
                          label: "حرکت",
                          value: flightDetails.departureTime,
                          icon: <CalendarClock className="w-4 h-4" />,
                        },
                        {
                          label: "فرود",
                          value: flightDetails.arrivalTime,
                          icon: <CalendarClock className="w-4 h-4" />,
                        },
                        {
                          label: "قیمت به ریال",
                          value: getPrice().toLocaleString(),
                          icon: <Wallet className="w-4 h-4" />,
                        },
                        {
                          label: "کلاس پرواز",
                          value: cabin.persian,
                          icon: <Sofa className="w-4 h-4" />,
                        },
                        {
                          label: "بار مجاز",
                          value: flightDetails.baggage,
                          icon: <Luggage className="w-4 h-4" />,
                        },
                        {
                          label: "مدت پرواز",
                          value: flightDetails.flightDuration,
                          icon: <Clock className="w-4 h-4" />,
                        },
                      ].map(
                        (item, index) =>
                          item.value && (
                            <motion.div
                              key={item.label}
                              className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
                              variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {item.icon}
                                <p className="text-xs font-semibold text-card-foreground">
                                  {item.label}:
                                </p>
                              </div>
                              <p className="text-xs text-card-foreground">
                                {item.value}
                              </p>
                            </motion.div>
                          )
                      )}
                    </motion.div>
                    <Button
                      onClick={handleInternationalFlightPurchase}
                      className="w-full mt-4"
                    >
                      خرید
                    </Button>
                  </TabsContent>

                  <TabsContent value="baggage-rules">
                    <div className="space-y-4 text-sm" dir="ltr">
                      {baggageRules ? (
                        Array.isArray(baggageRules) ? (
                          <>
                            <ul className="list-disc list-inside text-sm text-card-foreground">
                              {baggageRules.map((rule: any, index: number) => (
                                <li key={index}>
                                  {rule.departure} به {rule.arrival}:{" "}
                                  {rule.baggage}
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          renderMarkdown(baggageRules)
                        )
                      ) : (
                        <p className="text-sm text-card-foreground text-center">
                          داده‌ای یافت نشد
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="refund-rules">
                    <div
                      className="font-mono  space-y-4 w-full text-sm"
                      dir="ltr"
                    >
                      {refundRules ? (
                        Array.isArray(refundRules) ? (
                          <>
                            {refundRules.map((rule: any, index: number) => (
                              <div key={index}>
                                {rule.rule_details.map(
                                  (detail: any, detailIndex: number) => (
                                    <div key={detailIndex} className="mb-4">
                                      <p className="font-semibold text-card-foreground">
                                        {detail.category}:
                                      </p>
                                      {/* {renderMarkdown(detail.rules_parsed)} */}
                                      <div className="rule-text">
                                        {renderMarkdown(detail.rules_parsed)}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ))}
                          </>
                        ) : (
                          renderMarkdown(refundRules)
                        )
                      ) : (
                        <p className="text-sm text-card-foreground text-center">
                          داده‌ای یافت نشد
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </Card>
  );
};

export default FlightCard;
