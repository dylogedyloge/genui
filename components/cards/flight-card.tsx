// "use client";

// import { FaPlane } from "react-icons/fa";
// import { Badge } from "@/components/shadcn/badge";
// import { motion } from "framer-motion";
// import { Button } from "@/components/shadcn/button";
// import { Avatar } from "../shadcn/avatar";
// import Image from "next/image";
// import moment from "moment-jalaali";
// import { CityData } from "@/types/chat";
// import { useEffect, useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
// } from "@/components/shadcn/accordion";
// import {
//   Plane,
//   Hash,
//   MapPin,
//   CalendarClock,
//   Wallet,
//   Users,
//   ShoppingCart,
//   Tag,
//   Luggage,
//   Sofa,
//   Baby,
//   Terminal,
//   Clock,
//   Gift,
//   Building,
//   Landmark,
//   ChevronDown,
//   ChevronUp,
//   Loader2,
// } from "lucide-react";
// import { Card } from "../shadcn/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
// import ReactMarkdown from "react-markdown";
// import remarkBreaks from "remark-breaks";
// import rehypeRaw from "rehype-raw";
// import DOMPurify from "dompurify";
// import { API_ENDPOINTS } from "../../endpoints/endpoints";

// type FlightProps = {
//   fareSourceCode: string;
//   isClosed: boolean;
//   visaRequirements: any[];
//   fares: any;
//   cabin: any;
//   segments: any[];
//   returnSegments: any[];
//   departure: string;
//   destination: string;
//   airline: string;
//   flightNumber: string;
//   departureTime: string;
//   arrivalTime: string;
//   price: number;
//   airlineLogo: string;
//   type: string;
//   capacity: number;
//   sellingType: string;
//   id: number;
//   aircraft: string;
//   baggage: string;
//   flightClass: string;
//   cobin: string;
//   persian_type: string;
//   refundable: boolean | null;
//   child_price: number;
//   infant_price: number;
//   departure_terminal: string;
//   refund_rules: [];
//   destination_terminal: string;
//   flight_duration: string;
//   cobin_persian: string;
//   with_tour: boolean | null;
//   tag: string;
//   onFlightCardClick: (flightInfo: any) => void;
//   departureCityData: CityData;
//   destinationCityData: CityData;
//   isDomestic: boolean;
// };

// const FlightCard = ({
//   id,
//   fareSourceCode,
//   isClosed,
//   visaRequirements,
//   fares,
//   cabin,
//   segments,
//   returnSegments,
//   airline,
//   flightNumber,
//   departure,
//   destination,
//   departureTime,
//   arrivalTime,
//   price,
//   airlineLogo,
//   type,
//   capacity,
//   sellingType,
//   aircraft,
//   baggage,
//   flightClass,
//   cobin,
//   persian_type,
//   refundable,
//   child_price,
//   infant_price,
//   departure_terminal,
//   refund_rules,
//   destination_terminal,
//   flight_duration,
//   cobin_persian,
//   with_tour,
//   tag,
//   departureCityData,
//   destinationCityData,
//   isDomestic,
// }: FlightProps) => {
//   const [isAccordionOpen, setIsAccordionOpen] = useState(false); // State for accordion
//   const [flightInfo, setFlightInfo] = useState<any>(null); // State to store flightInfo
//   const [baggageRules, setBaggageRules] = useState<any>(null); // State for baggage rules
//   const [refundRules, setRefundRules] = useState<any>(null); // State for refund rules
//   const [isLoadingBaggage, setIsLoadingBaggage] = useState(false); // State for baggage rules loading
//   const [isLoadingRefund, setIsLoadingRefund] = useState(false); // State for refund rules loading

//   // Convert Gregorian dates to Jalali dates
//   const convertToJalali = (
//     date: string,
//     time: string,
//     isDomestic: boolean,
//     isDeparture: boolean
//   ) => {
//     const jalaliDate = moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD");

//     if (isDomestic) {
//       // For domestic flights, extract the time part if it includes a Gregorian date
//       const extractedTime = time.includes("-")
//         ? time.split("-").pop()?.trim()
//         : time;

//       if (isDeparture) {
//         return `${jalaliDate} - ${extractedTime}`; // Format for departure: "1403/10/11 - 23:45"
//       } else {
//         return jalaliDate; // Format for arrival: "1403/10/11"
//       }
//     } else {
//       // For international flights, use the existing logic
//       const formattedTime = time.includes(":")
//         ? time.split(":").slice(0, 2).join(":") // Remove seconds if present
//         : time; // Use as-is if no colon
//       return `${jalaliDate} - ${formattedTime}`;
//     }
//   };

//   // Extract departure and arrival details based on flight type
//   const getFlightDetails = () => {
//     if (isDomestic) {
//       return {
//         airline: airline,
//         flightNumber: flightNumber,
//         departureCity: departureCityData?.name || departure, // Fallback to `departure` if `departureCityData.name` is missing
//         destinationCity: destinationCityData?.name || destination, // Fallback to `destination` if `destinationCityData.name` is missing
//         departureTime: convertToJalali(
//           departureTime.split("T")[0],
//           departureTime.split("T")[1] || departureTime,
//           isDomestic,
//           true
//         ), // Pass isDomestic and isDeparture flags
//         arrivalTime: convertToJalali(
//           arrivalTime.split("T")[0],
//           arrivalTime.split("T")[1] || arrivalTime,
//           isDomestic,
//           false
//         ), // Pass isDomestic and isDeparture flags
//         baggage: baggage,
//         flightDuration: flight_duration,
//       };
//     } else {
//       const firstSegment = segments[0];
//       return {
//         airline: firstSegment.airline.persian,
//         flightNumber: firstSegment.flightNumber,
//         departureCity: firstSegment.departure.city.persian,
//         destinationCity: firstSegment.destination.city.persian,
//         departureTime: convertToJalali(
//           firstSegment.departureDate,
//           firstSegment.departureTime,
//           isDomestic,
//           true
//         ), // Pass isDomestic and isDeparture flags
//         arrivalTime: convertToJalali(
//           firstSegment.arrivalDate,
//           firstSegment.destinationTime,
//           isDomestic,
//           false
//         ), // Pass isDomestic and isDeparture flags
//         baggage: firstSegment.baggage,
//         flightDuration: firstSegment.flightDuration,
//       };
//     }
//   };

//   const flightDetails = getFlightDetails();

//   // Get the price based on flight type
//   const getPrice = () => {
//     if (isDomestic) {
//       return price; // For domestic flights, use the `price` prop directly
//     } else {
//       return fares.adult.total_price; // For international flights, use `fares.adult.total_price`
//     }
//   };

//   // Fetch baggage and refund rules when accordion is opened
//   useEffect(() => {
//     if (isAccordionOpen && !isDomestic) {
//       // Fetch baggage rules
//       setIsLoadingBaggage(true);
//       fetch(
//         `${API_ENDPOINTS.INTERNATIONAL.BAGGAGE}?fare_source_code=${fareSourceCode}`
//       )
//         .then((response) => response.json())
//         .then((data) => {
//           setBaggageRules(data.data.baggage_info);
//           console.log(baggageRules);
//           setIsLoadingBaggage(false);
//         })
//         .catch((error) => {
//           console.error("Error fetching baggage rules:", error);
//           setIsLoadingBaggage(false);
//         });

//       // Fetch refund rules
//       setIsLoadingRefund(true);
//       fetch(
//         `${API_ENDPOINTS.INTERNATIONAL.RULES}?fare_source_code=${fareSourceCode}`
//       )
//         .then((response) => response.json())
//         .then((data) => {
//           setRefundRules(data.data);
//           setIsLoadingRefund(false);
//         })
//         .catch((error) => {
//           console.error("Error fetching refund rules:", error);
//           setIsLoadingRefund(false);
//         });
//     }
//   }, [isAccordionOpen, isDomestic, fareSourceCode]);

//   // Function to render Markdown content
//   const removeInlineStyles = (html: string) => {
//     return html.replace(/style="[^"]*"/g, ""); // Remove all style attributes
//   };

//   const renderMarkdown = (content: string) => {
//     const cleanContent = DOMPurify.sanitize(removeInlineStyles(content)); // Sanitize and remove styles
//     return (
//       <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeRaw]}>
//         {cleanContent}
//       </ReactMarkdown>
//     );
//   };

  // const handleInternationalFlightPurchase = () => {
  //   // Ensure departureTime is defined and in the correct format
  //   const departureDate =
  //     segments[0]?.departureDate || departureTime?.split("T")[0];

  //   if (!departureDate) {
  //     console.error("Departure date is missing or invalid.");
  //     return;
  //   }

  //   // Extract departure and destination data from the first segment
  //   const firstSegment = segments[0];
  //   const departureCity = firstSegment.departure.city;
  //   const destinationCity = firstSegment.destination.city;

  //   // Construct generalInformation
  //   const generalInformation = {
  //     ticket: true,
  //     accommodation: false,
  //     itinerary: false,
  //     isInternational: true,
  //   };
  // console.log("generalInformation",generalInformation)
  //   // Construct intFlightInformation
  //   const intFlightInformation = {
  //     departure: {
  //       id: departureCityData?.id || undefined,
  //       subs: [],
  //       name: departureCity.persian,
  //       english_name: departureCity.english,
  //       code: firstSegment.departure.terminal.code,
  //       city: departureCity.persian,
  //       english_city: departureCity.english,
  //       country: firstSegment.departure.country.persian,
  //       english_country: firstSegment.departure.country.english,
  //       country_code: firstSegment.departure.country.code,
  //     },
  //     destination: {
  //       id: destinationCityData?.id || undefined,
  //       subs: [],
  //       name: destinationCity.persian,
  //       english_name: destinationCity.english,
  //       code: firstSegment.destination.terminal.code,
  //       city: destinationCity.persian,
  //       english_city: destinationCity.english,
  //       country: firstSegment.destination.country.persian,
  //       english_country: firstSegment.destination.country.english,
  //       country_code: firstSegment.destination.country.code,
  //     },
  //     departureDate, // Use the validated departureDate
  //     returnDate: null, // No return date for one-way flights
  //     personCounter: {
  //       adult: 1,
  //       child: 0,
  //       infant: 0,
  //       totalPersons: 1,
  //     },
  //     isDirect: segments.length === 1, // True if there are no connecting flights
  //   };
  //   console.log("intFlightInformation",intFlightInformation)

  //   // Construct selectedIntFlight
  //   const selectedIntFlight = {
  //     id,
  //     fare_source_code: fareSourceCode,
  //     is_closed: isClosed,
  //     visa_requirements: visaRequirements,
  //     fares,
  //     cabin,
  //     segments,
  //     return_segments: returnSegments,
  //   };
  //   console.log("selectedIntFlight",selectedIntFlight)

  //   // Post the data to the parent app
  //   window.parent.postMessage(
  //     {
  //       type: "SELECTED_INT_FLIGHT",
  //       payload: {
  //         generalInformation,
  //         intFlightInformation,
  //         selectedIntFlight,
  //       },
  //     },
  //     "*"
  //   );
  // };

//   // Update the خرید button in the جزئیات پرواز tab
//   <TabsContent value="details">
//     <motion.div
//       className="space-y-4"
//       initial="hidden"
//       animate="visible"
//       variants={{
//         hidden: { opacity: 0 },
//         visible: {
//           opacity: 1,
//           transition: {
//             staggerChildren: 0.1,
//           },
//         },
//       }}
//     >
//       {/* Flight details rendering */}
//     </motion.div>
//     <Button
//       onClick={handleInternationalFlightPurchase} // Add the handler here
//       className="w-full animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
//     >
//       خرید
//     </Button>
//   </TabsContent>;

//   // Function to handle card click
//   const handleFlightCardClick = () => {
//     const flightInfo = {
//       id,
//       fareSourceCode,
//       isClosed,
//       visaRequirements,
//       fares,
//       cabin,
//       segments,
//       returnSegments,
//       departureCityData,
//       destinationCityData,
//       airline,
//       flightNumber,
//       departure,
//       destination,
//       departureTime: flightDetails.departureTime,
//       arrivalTime: flightDetails.arrivalTime,
//       price: getPrice(), // Use the `getPrice` function here
//       airlineLogo,
//       type,
//       capacity,
//       sellingType,
//       aircraft,
//       baggage,
//       flightClass,
//       cobin,
//       persian_type,
//       refundable,
//       child_price,
//       infant_price,
//       departure_terminal,
//       refund_rules,
//       destination_terminal,
//       flight_duration,
//       cobin_persian,
//       with_tour,
//       tag,
//     };

//     if (isDomestic) {
//       const transformedFlightInfo = {
//         type: flightInfo.type,
//         capacity: flightInfo.capacity,
//         airline: flightInfo.airline.toLowerCase(),
//         sellingType: flightInfo.sellingType,
//         id: flightInfo.id,
//         aircraft: flightInfo.aircraft,
//         class: flightInfo.flightClass,
//         cobin: flightInfo.cobin,
//         persian_type: flightInfo.persian_type,
//         refundable: flightInfo.refundable,
//         adult_price: flightInfo.price, // Use the `price` directly
//         child_price: flightInfo.child_price,
//         infant_price: flightInfo.infant_price,
//         airline_persian: flightInfo.airline,
//         airline_logo: flightInfo.airlineLogo,
//         flight_number: flightInfo.flightNumber.toUpperCase(),
//         departure: flightInfo.departure,
//         departure_name: flightInfo.departure,
//         english_departure_name: "Tehran", // Default value
//         departure_date: flightInfo.departureTime.split(" - ")[0],
//         departure_time: flightInfo.departureTime.split(" - ")[1],
//         baggage: flightInfo.baggage,
//         departure_terminal: flightInfo.departure_terminal,
//         refund_rules: flightInfo.refund_rules,
//         destination: flightInfo.destination,
//         destination_name: flightInfo.destination,
//         english_destination_name: "Mashhad", // Default value
//         destination_time: flightInfo.arrivalTime.split(" - ")[1],
//         destination_terminal: flightInfo.destination_terminal,
//         flight_duration: flightInfo.flight_duration,
//         arrival_date: flightInfo.arrivalTime.split(" - ")[0],
//         cobin_persian: flightInfo.cobin_persian,
//         with_tour: flightInfo.with_tour,
//         tag: flightInfo.tag,
//       };

//       const generalInformation = {
//         ticket: true,
//         accommodation: false,
//         itinerary: false,
//         isInternational: false,
//       };

//       const domesticFlightInformation = {
//         departure: {
//           id: departureCityData.id,
//           name: departureCityData.name,
//           english_name: departureCityData.english_name,
//           iata: departureCityData.iata,
//           latitude: departureCityData.latitude,
//           longitude: departureCityData.longitude,
//           description: departureCityData.description,
//           is_province_capital: departureCityData.is_province_capital,
//           is_country_capital: departureCityData.is_country_capital,
//           usage_flight: departureCityData.usage_flight,
//           usage_accommodation: departureCityData.usage_accommodation,
//           country: departureCityData.country,
//           province: departureCityData.province,
//           flight: departureCityData.flight,
//           accommodation: departureCityData.accommodation,
//           has_plan: departureCityData.has_plan,
//           parto_id: departureCityData.parto_id,
//         },
//         destination: {
//           id: destinationCityData.id,
//           name: destinationCityData.name,
//           english_name: destinationCityData.english_name,
//           iata: destinationCityData.iata,
//           latitude: destinationCityData.latitude,
//           longitude: destinationCityData.longitude,
//           description: destinationCityData.description,
//           is_province_capital: destinationCityData.is_province_capital,
//           is_country_capital: destinationCityData.is_country_capital,
//           usage_flight: destinationCityData.usage_flight,
//           usage_accommodation: destinationCityData.usage_accommodation,
//           country: destinationCityData.country,
//           province: destinationCityData.province,
//           flight: destinationCityData.flight,
//           accommodation: destinationCityData.accommodation,
//           has_plan: destinationCityData.has_plan,
//           parto_id: destinationCityData.parto_id,
//         },
//         personCounter: {
//           adult: 1,
//           child: 0,
//           infant: 0,
//           totalPersons: 1,
//         },
//       };
//       window.parent.postMessage(
//         {
//           type: "SELECTED_FLIGHT",
//           payload: {
//             selectedDepartureFlight: transformedFlightInfo,
//             generalInformation,
//             domesticFlightInformation,
//           },
//         },
//         "*"
//       );
//     } else {
//       // Set flightInfo before toggling the accordion
//       setFlightInfo(flightInfo);
//       // Toggle accordion for international flights
//       setIsAccordionOpen(!isAccordionOpen);
//       console.log(flightInfo);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="min-w-60 sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-1">
//               <Avatar>
//                 <Image
//                   width={70}
//                   height={50}
//                   src={isDomestic ? airlineLogo : segments[0].airline.image}
//                   alt={`${
//                     isDomestic ? airline : segments[0].airline.persian
//                   } logo`}
//                 />
//               </Avatar>
//               <h2 className="text-sm font-semibold text-primary">
//                 {isDomestic ? airline : segments[0].airline.persian}
//               </h2>
//             </div>

//             <Badge variant="secondary" className="text-xs font-medium">
//               {isDomestic ? flightNumber : segments[0].flightNumber}
//             </Badge>
//           </div>
//           <motion.div
//             className="flex items-center justify-between mb-8"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1, duration: 0.3 }}
//           >
//             <div className="text-left flex flex-col items-start">
//               <p className="text-md text-card-foreground font-bold mb-2">
//                 {flightDetails.departureCity} {/* Departure city */}
//               </p>
//               <p className="text-xs prose-sm text-muted-foreground ">
//                 {flightDetails.departureTime} {/* Departure date and time */}
//               </p>
//             </div>
//             <div className="flex flex-col items-center px-4">
//               <FaPlane className="text-card-foreground w-6 h-6 rotate-180" />
//             </div>
//             <div className="text-right flex flex-col items-end">
//               <p className="text-md text-card-foreground font-bold mb-2">
//                 {flightDetails.destinationCity} {/* Destination city */}
//               </p>
//               <p className="text-xs prose-sm text-muted-foreground">
//                 {flightDetails.arrivalTime} {/* Arrival date and time */}
//               </p>
//             </div>
//           </motion.div>
//           <motion.div
//             className="flex items-center justify-between"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.3 }}
//           >
//             <div>
//               <p className="prose-sm text-sm font-semibold text-card-foreground">
//                 {getPrice().toLocaleString()} ریال
//               </p>
//             </div>
//             <Button
//               onClick={handleFlightCardClick}
//               className="animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
//             >
//               {isDomestic ? (
//                 "خرید"
//               ) : isAccordionOpen ? (
//                 <ChevronUp />
//               ) : (
//                 <ChevronDown />
//               )}
//             </Button>
//           </motion.div>
//         </div>

//         {/* Accordion for international flights */}
//         {!isDomestic && (
//           <Accordion
//             type="single"
//             collapsible
//             value={isAccordionOpen ? "item-1" : undefined}
//           >
//             <AccordionItem value="item-1">
//               <AccordionContent className="p-6 pt-0 text-card-foreground">
//                 {flightInfo && (
//                   <Card className="p-4 rounded-lg">
//                     <Tabs defaultValue="details" className="w-full">
//                       <TabsList className="grid w-full grid-cols-3">
//                         <TabsTrigger value="details">جزئیات پرواز</TabsTrigger>
//                         <TabsTrigger
//                           value="baggage-rules"
//                           disabled={isLoadingBaggage ? true : undefined}
//                         >
//                           {isLoadingBaggage ? (
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                           ) : (
//                             "قوانین بار"
//                           )}
//                         </TabsTrigger>
//                         <TabsTrigger
//                           value="refund-rules"
//                           disabled={isLoadingRefund ? true : undefined}
//                         >
//                           {isLoadingRefund ? (
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                           ) : (
//                             "قوانین استرداد"
//                           )}
//                         </TabsTrigger>
//                       </TabsList>

//                       {/* جزئیات پرواز Tab */}
//                       <TabsContent value="details">
//                         <motion.div
//                           className="space-y-4"
//                           initial="hidden"
//                           animate="visible"
//                           variants={{
//                             hidden: { opacity: 0 },
//                             visible: {
//                               opacity: 1,
//                               transition: {
//                                 staggerChildren: 0.1,
//                               },
//                             },
//                           }}
//                         >
//                           {[
//                             {
//                               label: "شرکت هواپیمایی",
//                               value: flightDetails.airline,
//                               icon: <Plane className="w-4 h-4" />,
//                             },
//                             {
//                               label: "شماره پرواز",
//                               value: flightDetails.flightNumber,
//                               icon: <Hash className="w-4 h-4" />,
//                             },
//                             {
//                               label: "مبدا",
//                               value: flightDetails.departureCity,
//                               icon: <MapPin className="w-4 h-4" />,
//                             },
//                             {
//                               label: "مقصد",
//                               value: flightDetails.destinationCity,
//                               icon: <MapPin className="w-4 h-4" />,
//                             },
//                             {
//                               label: "حرکت",
//                               value: flightDetails.departureTime,
//                               icon: <CalendarClock className="w-4 h-4" />,
//                             },
//                             {
//                               label: "فرود",
//                               value: flightDetails.arrivalTime,
//                               icon: <CalendarClock className="w-4 h-4" />,
//                             },
//                             {
//                               label: "قیمت به ریال",
//                               value: getPrice().toLocaleString(),
//                               icon: <Wallet className="w-4 h-4" />,
//                             },
//                             {
//                               label: "کلاس پرواز",
//                               value: cabin.persian,
//                               icon: <Sofa className="w-4 h-4" />,
//                             },
//                             {
//                               label: "بار مجاز",
//                               value: flightDetails.baggage,
//                               icon: <Luggage className="w-4 h-4" />,
//                             },
//                             {
//                               label: "مدت پرواز",
//                               value: flightDetails.flightDuration,
//                               icon: <Clock className="w-4 h-4" />,
//                             },
//                           ].map(
//                             (item, index) =>
//                               item.value && (
//                                 <motion.div
//                                   key={item.label}
//                                   className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
//                                   variants={{
//                                     hidden: { opacity: 0, y: 20 },
//                                     visible: { opacity: 1, y: 0 },
//                                   }}
//                                 >
//                                   <div className="flex items-center gap-2">
//                                     {item.icon}
//                                     <p className="text-sm font-semibold text-card-foreground">
//                                       {item.label}:
//                                     </p>
//                                   </div>
//                                   <p className="text-sm text-card-foreground">
//                                     {item.value}
//                                   </p>
//                                 </motion.div>
//                               )
//                           )}
//                         </motion.div>
//                         <Button
//                           onClick={handleInternationalFlightPurchase}
//                           className="w-full animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
//                         >
//                           خرید
//                         </Button>
//                       </TabsContent>

//                       {/* قوانین بار Tab */}
//                       <TabsContent value="baggage-rules">
//                         <div className="space-y-4 text-center" dir="ltr">
//                           {baggageRules ? (
//                             Array.isArray(baggageRules) ? (
//                               <>
//                                 <ul className="list-disc list-inside text-sm text-card-foreground">
//                                   {baggageRules.map(
//                                     (rule: any, index: number) => (
//                                       <li key={index}>
//                                         {rule.departure} به {rule.arrival}:{" "}
//                                         {rule.baggage}
//                                       </li>
//                                     )
//                                   )}
//                                 </ul>
//                               </>
//                             ) : (
//                               renderMarkdown(baggageRules)
//                             )
//                           ) : (
//                             <p className="text-sm text-card-foreground text-center">
//                               داده‌ای یافت نشد.
//                             </p>
//                           )}
//                         </div>
//                       </TabsContent>

//                       {/* قوانین استرداد Tab */}
//                       <TabsContent value="refund-rules">
//                         <div className="space-y-4 w-full text-center" dir="ltr">
//                           {refundRules ? (
//                             Array.isArray(refundRules) ? (
//                               <>
//                                 {refundRules.map((rule: any, index: number) => (
//                                   <div key={index}>
//                                     {rule.rule_details.map(
//                                       (detail: any, detailIndex: number) => (
//                                         <div key={detailIndex} className="mb-4">
//                                           <p className="font-semibold text-card-foreground">
//                                             {detail.category}:
//                                           </p>
//                                           {/* {renderMarkdown(detail.rules_parsed)} */}
//                                           <div className="rule-text">
//                                             {renderMarkdown(
//                                               detail.rules_parsed
//                                             )}
//                                           </div>
//                                         </div>
//                                       )
//                                     )}
//                                   </div>
//                                 ))}
//                               </>
//                             ) : (
//                               renderMarkdown(refundRules)
//                             )
//                           ) : (
//                             <p className="text-sm text-card-foreground text-center">
//                               داده‌ای یافت نشد.
//                             </p>
//                           )}
//                         </div>
//                       </TabsContent>
//                     </Tabs>
//                   </Card>
//                 )}
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default FlightCard;
"use client";

import { FaPlane } from "react-icons/fa";
import { Badge } from "@/components/shadcn/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";
import { Avatar } from "../shadcn/avatar";
import Image from "next/image";
import moment from "moment-jalaali";
import { CityData } from "@/types/chat";
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
  Users,
  Luggage,
  Clock,
  ChevronDown,
  ChevronUp,
  Hash,
  Loader2,
  Sofa,
} from "lucide-react";
import { Card } from "../shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import { API_ENDPOINTS } from "../../endpoints/endpoints";

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
  const [baggageRules, setBaggageRules] = useState<BaggageRule[] | string | null>(null); // State for baggage rules
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
  console.log("generalInformation",generalInformation)
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
    console.log("intFlightInformation",intFlightInformation)

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
    console.log("selectedIntFlight",selectedIntFlight)

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
    // <Card className="p-4 space-y-4">
    //   {/* Header */}
    //   <div className="flex items-center justify-between">
    //     <div className="flex items-center space-x-2">
    //       <Avatar>
    //         <Image
    //           width={70}
    //           height={50}
    //           src={isDomestic ? airlineLogo : segments[0].airline.image}
    //           alt={`${isDomestic ? airline : segments[0].airline.persian} logo`}
    //         />
    //       </Avatar>
    //       <span>{isDomestic ? airline : segments[0].airline.persian}</span>
    //     </div>
    //     <span className="font-bold text-sm">
    //       {getPrice().toLocaleString()} ریال
    //     </span>
    //   </div>

    //   {/* Flight Summary */}
    //   <div className="space-y-2">
    //     <div className="flex items-center space-x-2">
    //       <MapPin size={16} />
    //       <span>{flightDetails.departureCity}</span>
    //     </div>
    //     <div className="flex items-center space-x-2">
    //       <Clock size={16} />
    //       <span>{flightDetails.departureTime}</span>
    //     </div>
    //     <div className="flex items-center space-x-2">
    //       <Plane size={16} />
    //       <span>{segments.length > 1 ? "پرواز با توقف" : "پرواز مستقیم"}</span>
    //     </div>
    //     <div className="flex items-center space-x-2">
    //       <MapPin size={16} />
    //       <span>{flightDetails.destinationCity}</span>
    //     </div>
    //     <div className="flex items-center space-x-2">
    //       <Clock size={16} />
    //       <span>{flightDetails.arrivalTime}</span>
    //     </div>
    //   </div>

    //   <Button
    //     onClick={handleFlightCardClick}
    //     className="animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
    //   >
    //     {isDomestic ? (
    //       "خرید"
    //     ) : isAccordionOpen ? (
    //       <ChevronUp />
    //     ) : (
    //       <ChevronDown />
    //     )}
    //   </Button>

    //   {/* Accordion for International Flights */}
    //   {!isDomestic && (
    //     <Accordion
    //       type="single"
    //       collapsible
    //       value={isAccordionOpen ? "details" : ""}
    //     >
    //       <AccordionItem value="details">
    //         <AccordionContent className="space-y-4">
    //           {/* Flight Details Tab */}
    //           <Tabs defaultValue="flight-details">
    //             <TabsList>
    //               <TabsTrigger value="flight-details">جزئیات پرواز</TabsTrigger>
    //               <TabsTrigger value="baggage-rules">قوانین بار</TabsTrigger>
    //               <TabsTrigger value="refund-rules">قوانین استرداد</TabsTrigger>
    //             </TabsList>

    //             {/* Flight Details Content */}
    //             <TabsContent value="flight-details">
    //               <div className="space-y-2">
    //                 {[
    //                   { label: "شرکت هواپیمایی", value: flightDetails.airline },
    //                   {
    //                     label: "شماره پرواز",
    //                     value: flightDetails.flightNumber,
    //                   },
    //                   { label: "مبدا", value: flightDetails.departureCity },
    //                   { label: "مقصد", value: flightDetails.destinationCity },
    //                   { label: "حرکت", value: flightDetails.departureTime },
    //                   { label: "فرود", value: flightDetails.arrivalTime },
    //                   {
    //                     label: "قیمت به ریال",
    //                     value: getPrice().toLocaleString(),
    //                   },
    //                   { label: "کلاس پرواز", value: cabin.persian },
    //                   { label: "بار مجاز", value: flightDetails.baggage },
    //                   {
    //                     label: "مدت پرواز",
    //                     value: flightDetails.flightDuration,
    //                   },
    //                 ].map(
    //                   (item, index) =>
    //                     item.value && (
    //                       <div
    //                         key={index}
    //                         className="flex items-center space-x-2"
    //                       >
    //                         <span>{item.label}:</span>
    //                         <span className="font-medium">{item.value}</span>
    //                       </div>
    //                     )
    //                 )}
    //               </div>
    //             </TabsContent>

    //             {/* قوانین بار Tab */}
    //             <TabsContent value="baggage-rules">
    //               <div className="space-y-4 text-center" dir="ltr">
    //                 {baggageRules ? (
    //                   Array.isArray(baggageRules) ? (
    //                     <>
    //                       <ul className="list-disc list-inside text-sm text-card-foreground">
    //                         {baggageRules.map((rule: any, index: number) => (
    //                           <li key={index}>
    //                             {rule.departure} به {rule.arrival}:{" "}
    //                             {rule.baggage}
    //                           </li>
    //                         ))}
    //                       </ul>
    //                     </>
    //                   ) : (
    //                     renderMarkdown(baggageRules)
    //                   )
    //                 ) : (
    //                   <p className="text-sm text-card-foreground text-center">
    //                     داده‌ای یافت نشد
    //                   </p>
    //                 )}
    //               </div>
    //             </TabsContent>

    //             {/* قوانین استرداد Tab */}
    //             <TabsContent value="refund-rules">
    //               <div className="space-y-4 w-full text-center" dir="ltr">
    //                 {refundRules ? (
    //                   Array.isArray(refundRules) ? (
    //                     <>
    //                       {refundRules.map((rule: any, index: number) => (
    //                         <div key={index}>
    //                           {rule.rule_details.map(
    //                             (detail: any, detailIndex: number) => (
    //                               <div key={detailIndex} className="mb-4">
    //                                 <p className="font-semibold text-card-foreground">
    //                                   {detail.category}:
    //                                 </p>
    //                                 {/* {renderMarkdown(detail.rules_parsed)} */}
    //                                 <div className="rule-text">
    //                                   {renderMarkdown(detail.rules_parsed)}
    //                                 </div>
    //                               </div>
    //                             )
    //                           )}
    //                         </div>
    //                       ))}
    //                     </>
    //                   ) : (
    //                     renderMarkdown(refundRules)
    //                   )
    //                 ) : (
    //                   <p className="text-sm text-card-foreground text-center">
    //                     داده‌ای یافت نشد
    //                   </p>
    //                 )}
    //               </div>
    //             </TabsContent>
    //           </Tabs>
    //         </AccordionContent>
    //       </AccordionItem>
    //     </Accordion>
    //   )}
    // </Card>
    <Card className="p-4 space-y-4">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <Avatar className="w-12 h-12 ">
        <Image
          width={48}
          height={48}
          src={isDomestic ? airlineLogo : segments[0].airline.image}
          alt={`${isDomestic ? airline : segments[0].airline.persian} logo`}
          className="rounded-full"
        />
      </Avatar>
      <span className="text-sm font-semibold t">
        {isDomestic ? airline : segments[0].airline.persian}
      </span>
    </div>
    <span className="text-lg font-bold ">
      {getPrice().toLocaleString()} ریال
    </span>
  </div>

  {/* Flight Summary */}
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center space-x-3">
        <MapPin size={20}  />
        <div>
          <p className="text-sm ">مبدا</p>
          <p className="font-medium ">
            {flightDetails.departureCity}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Clock size={20} className="" />
        <div>
          <p className="text-sm ">زمان حرکت</p>
          <p className="font-medium ">
            {flightDetails.departureTime}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Plane size={20} className="" />
        <div>
          <p className="text-sm ">نوع پرواز</p>
          <p className="font-medium ">
            {segments.length > 1 ? "پرواز با توقف" : "پرواز مستقیم"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <MapPin size={20}  />
        <div>
          <p className="text-sm ">مقصد</p>
          <p className="font-medium ">
            {flightDetails.destinationCity}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Clock size={20} className="" />
        <div>
          <p className="text-sm ">زمان فرود</p>
          <p className="font-medium ">
            {flightDetails.arrivalTime}
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Button */}
  <Button
    onClick={handleFlightCardClick}
    className="animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
  >
    {isDomestic ? "خرید" : isAccordionOpen ? <ChevronUp /> : <ChevronDown />}
  </Button>

  {/* Accordion for International Flights */}
  {!isDomestic && (
    <Accordion type="single" collapsible value={isAccordionOpen ? "details" : ""}>
      <AccordionItem value="details">
        <AccordionContent className="pt-4 space-y-6">
          {/* Flight Details Tab */}
          <Card className="p-4 rounded-lg">
                     <Tabs defaultValue="details" className="w-full">
                       <TabsList className="grid w-full grid-cols-3">
                         <TabsTrigger value="details">جزئیات پرواز</TabsTrigger>
                         <TabsTrigger
                           value="baggage-rules"
                           disabled={isLoadingBaggage ? true : undefined}
                         >
                           {isLoadingBaggage ? (
                             <Loader2 className="w-4 h-4 animate-spin" />
                           ) : (
                             "قوانین بار"
                           )}
                         </TabsTrigger>
                         <TabsTrigger
                           value="refund-rules"
                           disabled={isLoadingRefund ? true : undefined}
                         >
                           {isLoadingRefund ? (
                             <Loader2 className="w-4 h-4 animate-spin" />
                           ) : (
                             "قوانین استرداد"
                           )}
                         </TabsTrigger>
                       </TabsList>

                       {/* جزئیات پرواز Tab */}
                       <TabsContent value="details">
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
                                     <p className="text-sm font-semibold text-card-foreground">
                                       {item.label}:
                                     </p>
                                   </div>
                                   <p className="text-sm text-card-foreground">
                                     {item.value}
                                   </p>
                                 </motion.div>
                               )
                           )}
                         </motion.div>
                         <Button
                           onClick={handleInternationalFlightPurchase}
                           className="w-full animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                         >
                           خرید
                         </Button>
                       </TabsContent>

                       {/* قوانین بار Tab */}
                       <TabsContent value="baggage-rules">
                         <div className="space-y-4 text-center" dir="ltr">
                           {baggageRules ? (
                             Array.isArray(baggageRules) ? (
                               <>
                                 <ul className="list-disc list-inside text-sm text-card-foreground">
                                   {baggageRules.map(
                                     (rule: any, index: number) => (
                                       <li key={index}>
                                         {rule.departure} به {rule.arrival}:{" "}
                                         {rule.baggage}
                                       </li>
                                     )
                                   )}
                                 </ul>
                               </>
                             ) : (
                               renderMarkdown(baggageRules)
                             )
                           ) : (
                             <p className="text-sm text-card-foreground text-center">
                               داده‌ای یافت نشد.
                             </p>
                           )}
                         </div>
                       </TabsContent>

                       {/* قوانین استرداد Tab */}
                       <TabsContent value="refund-rules">
                         <div className="space-y-4 w-full text-center" dir="ltr">
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
                                             {renderMarkdown(
                                               detail.rules_parsed
                                             )}
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
                               داده‌ای یافت نشد.
                             </p>
                           )}
                         </div>
                       </TabsContent>
                     </Tabs>
                   </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )}
</Card>
  );
};

export default FlightCard;
