"use client";

import { FaPlane } from "react-icons/fa";
import { Badge } from "@/components/shadcn/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";

type FlightProps = {
  departure: string;
  arrival: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  status: "On Time" | "Delayed" | "Cancelled";
  price: number;
};

const FlightCard = ({
  airline,
  flightNumber,
  departure,
  arrival,
  departureTime,
  arrivalTime,
  price,
}: FlightProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="min-w-60 sm:w-96 shadow-md  dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg  ">
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
              <p className="text-md text-card-foreground font-bold mb-2">
                {departure}
              </p>
              <p className="text-xs prose-sm text-muted-foreground">
                {departureTime}
              </p>
            </div>
            <div className="flex flex-col items-center px-4">
              {/* <div className="sm:w-24 w-0 h-px bg-border mb-2" /> */}
              <FaPlane className="text-card-foreground w-6 h-6   rotate-180" />
            </div>

            <div className="text-right flex flex-col items-end">
              <p className="text-md text-card-foreground font-bold mb-2">
                {arrival}
              </p>
              <p className="text-xs prose-sm text-muted-foreground">
                {arrivalTime}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="">
              <p className="prose-sm text-sm font-semibold text-card-foreground">
                {" "}
                {price} تومان
              </p>
            </div>
            <Button className="animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
              رزرو بلیط
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
export default FlightCard;