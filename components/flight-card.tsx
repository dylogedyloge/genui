'use client'

import { Plane, Clock, PlaneTakeoff, ArrowBigLeft, PlaneLanding } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

type FlightProps = {
  departure: string
  arrival: string
  airline: string
  flightNumber: string
  departureTime: string
  arrivalTime: string
  status: "On Time" | "Delayed" | "Cancelled"
}

export const FlightCard = ({
  airline,
  flightNumber,
  departure,
  arrival,
  departureTime,
  arrivalTime,
  status,
}: FlightProps) => {
  const getStatusColor = (status: FlightProps["status"]) => {
    switch (status) {
      case "On Time":
        return "bg-green-500"
      case "Delayed":
        return "bg-yellow-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}

    >
      <Card className="w-full sm:w-96 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold ">
              {airline}
            </h2>
            <Badge variant="outline" className="text-xs font-medium">
              {flightNumber}
            </Badge>
          </div>
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="text-right">
              <div className="flex  justify-between items-baseline">
                <p className="text-md font-bold mb-1">{departure}</p>
                <PlaneTakeoff className="prose -scale-x-100 w-4 h-4" />
              </div>
              <p className="text-sm">{departureTime}</p>
            </div>
            <div className="text-left">
            <div className="flex  justify-between items-baseline">

                <PlaneLanding className="prose -scale-x-100 w-4 h-4" />
            <p className="text-md font-bold mb-1">{arrival}</p>
              </div>
              
              <p className="text-sm">{arrivalTime}</p>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-between gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="flex items-center gap-2 ">
              <Clock className="h-3 w-3 " />
              <span className="text-xs ">{new Date().toLocaleDateString('fa-IR')}</span>
            </div>
            <Badge className={`${getStatusColor(status)} text-xs`}>
              {status}
            </Badge>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
