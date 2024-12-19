"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import { CalendarDays, MapPin, DollarSign, Home, Star } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../shadcn/accordion";
import { useEffect, useState } from "react";

// type SelectedFlightProps = {
//   selectedFlight: {
//     airline: string;
//     flightNumber: string;
//     departure: string;
//     destination: string;
//     departureTime: string;
//     arrivalTime: string;
//     price: number;
//     airlineLogo: string;
//   };
// };
// type SelectedHotelProps = {
//   selectedHotel: {
//     hotelName: string;
//     location: string;
//     checkIn: string;
//     checkOut: string;
//     roomType: string;
//     price: number;
//     rating: number;
//   };
// };
type SelectedProps = {
  selectedFlight?:
    | {
        airline: string;
        flightNumber: string;
        departure: string;
        destination: string;
        departureTime: string;
        arrivalTime: string;
        price: number;
        airlineLogo?: string;
      }
    | null
    | undefined;
  selectedHotel?:
    | {
        hotelName: string;
        location: string;
        checkIn: string;
        checkOut: string;
        roomType: string;
        price: number;
        rating: number;
      }
    | null
    | undefined;
};
const SelectedFlightAndHotelDetails = ({
  selectedFlight,
  selectedHotel,
}: SelectedProps) => {
  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="min-w-60 sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg p-0">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          key={`${selectedFlight?.flightNumber}-${selectedHotel?.hotelName}`}
        >
          <CardHeader>
            {selectedFlight && (
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <CardTitle className=" font-bold text-primary text-center">
                    جزئیات پرواز انتخابی
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={selectedFlight?.airlineLogo || ""}
                            alt={`${selectedFlight?.airline} logo`}
                            width={50}
                            height={50}
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">
                            هواپیمایی:
                          </span>{" "}
                          {selectedFlight?.airline}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">
                            شماره پرواز:
                          </span>{" "}
                          <Badge variant="secondary">
                            {selectedFlight?.flightNumber}
                          </Badge>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">مبدا:</span>{" "}
                          {selectedFlight?.departure}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary rotate-180" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">مقصد:</span>{" "}
                          {selectedFlight?.destination}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">
                            زمان پرواز:
                          </span>{" "}
                          {selectedFlight?.departureTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">
                            زمان فرود:
                          </span>
                          {selectedFlight?.arrivalTime}
                        </p>
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <p className="text-sm font-semibold">
                            {selectedFlight?.price.toLocaleString()} ریال
                          </p>
                        </div>
                        <Button className="bg-primary text-primary-foreground animate-shimmer">
                          تایید
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            )}
            {selectedHotel && (
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <CardTitle className=" font-bold text-primary text-center">
                    جزئیات هتل انتخابی
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">هتل</span>{" "}
                          {selectedHotel?.hotelName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">مکان:</span>{" "}
                          {selectedHotel?.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">ورود:</span>{" "}
                          {selectedHotel?.checkIn}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">خروج:</span>{" "}
                          {selectedHotel?.checkOut}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Home className="w-14 h-w-14 text-primary" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">
                            نوع اتاق:
                          </span>{" "}
                          {selectedHotel?.roomType}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">امتیاز:</span>{" "}
                          <Badge variant="secondary">
                            {selectedHotel?.rating.toFixed(1)}
                          </Badge>
                        </p>
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* <DollarSign className="w-4 h-4 text-primary" /> */}
                          <p className="text-sm font-semibold">قیمت:</p>
                          <p className="text-sm font-semibold">
                            {selectedHotel?.price.toLocaleString()} ریال
                          </p>
                        </div>
                        <Button className="bg-primary text-primary-foreground animate-shimmer">
                          تأیید
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            )}
          </CardHeader>
        </Accordion>
      </Card>
    </motion.div>
  );
};

export default SelectedFlightAndHotelDetails;
