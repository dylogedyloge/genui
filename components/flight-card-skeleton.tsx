// 'use client'

// import { Card, CardContent } from "@/components/ui/card"
// import { motion } from "framer-motion"
// import { Skeleton } from "@/components/ui/skeleton"

// export const FlightCardSkeleton = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card className="w-full sm:w-96 shadow-sm">
//         <CardContent className="p-4">
//           {/* Airline and Flight Number */}
//           <div className="flex items-center justify-between mb-4">
//             <Skeleton className="h-4 w-24" /> {/* Airline */}
//             <Skeleton className="h-5 w-16" /> {/* Flight Number Badge */}
//           </div>

//           {/* Departure and Arrival Info */}
//           <motion.div
//             className="flex items-center justify-between mb-4"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1, duration: 0.3 }}
//           >
//             {/* Departure Details */}
//             <div className="text-right">
//               <div className="flex justify-between items-baseline gap-2">
//                 <Skeleton className="h-5 w-20 mb-1" /> {/* Departure City */}
//                 <Skeleton className="h-4 w-4" /> {/* Plane Icon */}
//               </div>
//               <Skeleton className="h-4 w-16" /> {/* Departure Time */}
//             </div>

//             {/* Arrival Details */}
//             <div className="text-left">
//               <div className="flex justify-between items-baseline gap-2">
//                 <Skeleton className="h-4 w-4" /> {/* Plane Icon */}
//                 <Skeleton className="h-5 w-20 mb-1" /> {/* Arrival City */}
//               </div>
//               <Skeleton className="h-4 w-16" /> {/* Arrival Time */}
//             </div>
//           </motion.div>

//           {/* Bottom Status Section */}
//           <motion.div
//             className="flex items-center justify-between gap-6"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.3 }}
//           >
//             <div className="flex items-center gap-2">
//               <Skeleton className="h-3 w-3" /> {/* Clock Icon */}
//               <Skeleton className="h-3 w-20" /> {/* Date */}
//             </div>
//             <Skeleton className="h-5 w-16" /> {/* Status Badge */}
//           </motion.div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }
import { Skeleton } from "@/components/ui/skeleton";
import { FaPlane } from "react-icons/fa";
import { motion } from "framer-motion";

export const FlightCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg ">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            {/* Airline and Flight Number */}
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-12 h-4" />
          </div>
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="text-left flex flex-col items-start">
              {/* Departure City and Time */}
              <Skeleton className="w-24 h-6 mb-2" />
              <Skeleton className="w-16 h-4" />
            </div>
            <div className="flex flex-col items-center px-4">
              {/* Plane Icon */}
              <FaPlane className="text-card-foreground w-6 h-6 rotate-180" />
            </div>
            <div className="text-right flex flex-col items-end">
              {/* Arrival City and Time */}
              <Skeleton className="w-24 h-6 mb-2" />
              <Skeleton className="w-16 h-4" />
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div>
              {/* Price */}
              <Skeleton className="w-16 h-6" />
            </div>
            <Skeleton className="w-24 h-8" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};