// "use client";

// import { FaPlane } from "react-icons/fa";
// import { Badge } from "@/components/shadcn/badge";
// import { motion } from "framer-motion";
// import { Button } from "@/components/shadcn/button";
// import { Avatar } from "../shadcn/avatar";
// import Image from "next/image";
// import moment from "moment-jalaali";
// import { useRouter } from "next/navigation";

// type FlightProps = {
//   departure: string; // Departure city name
//   destination: string; // Destination city name
//   airline: string; // Airline name in Persian
//   flightNumber: string; // Flight number
//   departureTime: string; // Departure time (formatted)
//   arrivalTime: string; // Arrival time (formatted)
//   price: number; // Price in Rial
//   airlineLogo: string;
// };

// const FlightCard = ({
//   airline,
//   flightNumber,
//   departure,
//   destination,
//   departureTime,
//   arrivalTime,
//   price,
//   airlineLogo,
// }: FlightProps) => {
//   const router = useRouter(); // Initialize Next.js router

//   // Function to handle card click
//   const handleCardClick = () => {
//     const flightInfo = {
//       airline,
//       flightNumber,
//       departure,
//       destination,
//       departureTime: jalaliDepartureTime,
//       arrivalTime: jalaliArrivalTime,
//       price,
//       airlineLogo,
//     };
//     console.log("Flight Information:", flightInfo);
//     // Save the flight details to session storage
//     sessionStorage.setItem("selectedFlight", JSON.stringify(flightInfo));
//     // Navigate to the new route
//     router.push("/flight-details");
//   };

//   // Convert Gregorian dates to Jalali dates
//   const convertToJalali = (dateTime: string) => {
//     // Split the date and time
//     const [date, time] = dateTime.split("-");
//     // Parse the Gregorian date
//     const jalaliDate = moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD");
//     // Return the Jalali date and time
//     return `${jalaliDate} - ${time.trim()}`;
//   };

//   // Convert departure and arrival times to Jalali
//   const jalaliDepartureTime = convertToJalali(departureTime);
//   const jalaliArrivalTime = convertToJalali(arrivalTime);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="w-full"
//       onClick={handleCardClick}
//     >
//       <div className="min-w-60 sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-1">
//               <Avatar>
//                 <Image
//                   width={50}
//                   height={50}
//                   src={airlineLogo}
//                   alt={`${airline} logo`}
//                 />
//               </Avatar>
//               <h2 className="text-sm font-semibold text-primary">{airline}</h2>
//             </div>

//             <Badge variant="secondary" className="text-xs font-medium">
//               {flightNumber}
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
//                 {departure} {/* Departure city name */}
//               </p>
//               <p className="text-xs prose-sm text-muted-foreground ">
//                 {jalaliDepartureTime} {/* Jalali Departure time */}
//               </p>
//             </div>
//             <div className="flex flex-col items-center px-4">
//               <FaPlane className="text-card-foreground w-6 h-6 rotate-180" />
//             </div>

//             <div className="text-right flex flex-col items-end">
//               <p className="text-md text-card-foreground font-bold mb-2">
//                 {destination} {/* Destination city name */}
//               </p>
//               <p className="text-xs prose-sm text-muted-foreground">
//                 {jalaliArrivalTime} {/* Jalali Arrival time */}
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
//                 {price.toLocaleString()} ریال{/* Price formatted */}
//               </p>
//             </div>
//             <Button className="animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
//               رزرو بلیط {/* Reserve Ticket */}
//             </Button>
//           </motion.div>
//         </div>
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
import moment from "moment-jalaali"; // Import moment-jalaali

type FlightProps = {
  departure: string; // Departure city name
  destination: string; // Destination city name
  airline: string; // Airline name in Persian
  flightNumber: string; // Flight number
  departureTime: string; // Departure time (formatted)
  arrivalTime: string; // Arrival time (formatted)
  price: number; // Price in Rial
  airlineLogo: string;
  onCardClick: (flightInfo: any) => void; // Callback function
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
  onCardClick, // Add callback function
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

  // Function to handle card click
  const handleCardClick = () => {
    const flightInfo = {
      airline,
      flightNumber,
      departure,
      destination,
      departureTime: jalaliDepartureTime,
      arrivalTime: jalaliArrivalTime,
      price,
      airlineLogo,
    };

    // Call the callback function to pass flight details to the parent
    onCardClick(flightInfo);
  };

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
                {departure} {/* Departure city name */}
              </p>
              <p className="text-xs prose-sm text-muted-foreground ">
                {jalaliDepartureTime} {/* Jalali Departure time */}
              </p>
            </div>
            <div className="flex flex-col items-center px-4">
              <FaPlane className="text-card-foreground w-6 h-6 rotate-180" />
            </div>

            <div className="text-right flex flex-col items-end">
              <p className="text-md text-card-foreground font-bold mb-2">
                {destination} {/* Destination city name */}
              </p>
              <p className="text-xs prose-sm text-muted-foreground">
                {jalaliArrivalTime} {/* Jalali Arrival time */}
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
                {price.toLocaleString()} ریال{/* Price formatted */}
              </p>
            </div>
            <Button
              onClick={handleCardClick}
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
