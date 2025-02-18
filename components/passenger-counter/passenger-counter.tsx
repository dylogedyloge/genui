"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
// import { User, Baby, BabyIcon as Child } from 'lucide-react'
import {
  FaMale as Adult,
  FaChild as Child,
  FaBaby as Infant,
} from "react-icons/fa";

type PassengerType = "بزرگسال" | "کودک" | "نوزاد";
interface PassengerCounterProps {
  onPassengersSelected: (passengers: { adult: number; child: number; infant: number; }) => void;
}
const PassengerCounter = ({ onPassengersSelected }: PassengerCounterProps) => {
  const [state, setState] = useState({
    counts: { بزرگسال: 1, کودک: 0, نوزاد: 0 },
    lastUpdated: null as PassengerType | null,
  });

  const increment = (type: PassengerType) => {
    setState((prev) => ({
      counts: { ...prev.counts, [type]: prev.counts[type] + 1 },
      lastUpdated: type,
    }));
  };

  const decrement = (type: PassengerType) => {
    if (type === "بزرگسال" && state.counts[type] > 1) {
      setState((prev) => ({
        counts: { ...prev.counts, [type]: prev.counts[type] - 1 },
        lastUpdated: type,
      }));
    } else if (type !== "بزرگسال" && state.counts[type] > 0) {
      setState((prev) => ({
        counts: { ...prev.counts, [type]: prev.counts[type] - 1 },
        lastUpdated: type,
      }));
    }
  };

// 
  const handleSendNumOfPassengers = () => {
    const passengers = {
      adult: state.counts["بزرگسال"],
      child: state.counts["کودک"],
      infant: state.counts["نوزاد"],
    };
    onPassengersSelected(passengers); // Call the callback with the selected passengers
  };

  const CounterItem = ({
    type,
    icon: Icon,
  }: {
    type: PassengerType;
    icon: React.ElementType;
  }) => (
    <div className="flex items-center justify-between p-1">
      <div className="flex items-center space-x-2 space-x-reverse">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Icon className="h-4 w-4 text-[#006363]" />
        </motion.div>
        <span className="text-xs font-bold ">{type}</span>
      </div>
      <div className="flex items-center space-x-2 space-x-reverse">
        <Button variant="outline" size="sm" onClick={() => increment(type)}>
          +
        </Button>
        {state.lastUpdated === type ? (
          <AnimatePresence mode="wait">
            <motion.span
              key={state.counts[type]}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-4 text-center text-xs font-bold"
            >
              {state.counts[type]}
            </motion.span>
          </AnimatePresence>
        ) : (
          <span className="w-4 text-center text-xs font-bold">
            {state.counts[type]}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => decrement(type)}
          disabled={
            (type === "بزرگسال" && state.counts[type] <= 1) ||
            (type !== "بزرگسال" && state.counts[type] <= 0)
          }
        >
          -
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="min-w-60 sm:w-72 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg"
        dir="rtl"
      >
        <CardContent>
          <CounterItem type="بزرگسال" icon={Adult} />
          <CounterItem type="کودک" icon={Child} />
          <CounterItem type="نوزاد" icon={Infant} />
          <Button
            onClick={handleSendNumOfPassengers}
            className=" mt-4 text-xs w-full animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            تأیید
          </Button>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default PassengerCounter;
