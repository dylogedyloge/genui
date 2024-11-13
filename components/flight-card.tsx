// 'use client'

// import { Plane, Clock, PlaneTakeoff, ArrowBigLeft, PlaneLanding } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { motion } from "framer-motion"
// import { Button } from "./ui/button"

// type FlightProps = {
//   departure: string
//   arrival: string
//   airline: string
//   flightNumber: string
//   departureTime: string
//   arrivalTime: string
//   status: "On Time" | "Delayed" | "Cancelled",
//   price: number
// }

// export const FlightCard = ({
//   airline,
//   flightNumber,
//   departure,
//   arrival,
//   departureTime,
//   arrivalTime,
//   status,
//   price
// }: FlightProps) => {
//   const getStatusColor = (status: FlightProps["status"]) => {
//     switch (status) {
//       case "On Time":
//         return "bg-green-500"
//       case "Delayed":
//         return "bg-yellow-500"
//       case "Cancelled":
//         return "bg-red-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}

//     >
//       <Card className="w-full sm:w-96 shadow-sm">
//         <CardContent className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-sm font-semibold ">
//               {airline}
//             </h2>
//             <Badge variant="destructive" className="text-xs font-medium">
//               {flightNumber}
//             </Badge>
//           </div>
//           <motion.div
//             className="flex items-center justify-between mb-4"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1, duration: 0.3 }}
//           >
//             <div className="text-right">
//               <div className="flex  justify-between items-baseline">
//                 <p className="text-md font-bold move-plane mb-1">{departure}</p>
//                 <PlaneTakeoff className="prose -scale-x-100 w-4 h-4 move-plane" />
//               </div>
//               <p className="text-sm">{departureTime}</p>
//             </div>
//             <div className="text-left">
//             <div className="flex  justify-between items-baseline">

//                 <PlaneLanding className="prose -scale-x-100 w-4 h-4" />
//             <p className="text-md font-bold mb-1">{arrival}</p>
//               </div>
              
//               <p className="text-sm">{arrivalTime}</p>
//             </div>
//           </motion.div>
//           <motion.div
//             className="flex items-center justify-between gap-6"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.3 }}
//           >
//             <Button variant="secondary">خرید بلیط</Button>
//             <Badge variant="outline" >
//               {price} ریال
//             </Badge>
//           </motion.div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }
'use client'

import { PlaneTakeoff, PlaneLanding } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

type FlightProps = {
  departure: string
  arrival: string
  airline: string
  flightNumber: string
  departureTime: string
  arrivalTime: string
  status: "On Time" | "Delayed" | "Cancelled"
  price: number
}

export const FlightCard =({
  airline,
  flightNumber,
  departure,
  arrival,
  departureTime,
  arrivalTime,
  status,
  price
}: FlightProps = {
  airline: "AirlineX",
  flightNumber: "AX123",
  departure: "New York",
  arrival: "London",
  departureTime: "09:00",
  arrivalTime: "15:00",
  status: "On Time",
  price: 500
})=> {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
     
    >
      <div className="shadow-md  dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg ">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-semibold text-primary">{airline}</h2>
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
              <p className="text-md text-card-foreground font-bold mb-2">{departure}</p>
              <p className="text-xs prose-sm text-muted-foreground">{departureTime}</p>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="sm:w-24 w-0 h-px bg-border mb-2" />
              <PlaneTakeoff className="text-card-foreground w-6 h-6 animate-pulse" />
            </div>
            
            <div className="text-right flex flex-col items-end">
              <p className="text-md text-card-foreground font-bold mb-2">{arrival}</p>
              <p className="text-xs prose-sm text-muted-foreground">{arrivalTime}</p>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="">
              <p className="prose-sm text-sm font-semibold text-card-foreground"> {price} تومان</p>
            </div>
            <Button className=" inline-flex  animate-shimmer items-center justify-center border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]  font-medium dark:text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">رزرو بلیط</Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
