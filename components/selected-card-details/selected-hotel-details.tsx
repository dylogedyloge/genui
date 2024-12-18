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
import { CalendarDays, MapPin, DollarSign, Star, Home } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";

type SelectedHotelProps = {
  selectedHotel: {
    hotelName: string;
    location: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    price: number;
    rating: number;
  };
};

const SelectedHotelDetails = ({ selectedHotel }: SelectedHotelProps) => {
  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="min-w-60 sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
        <Accordion type="single" collapsible className="w-full">
          <CardHeader>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <CardTitle className="font-bold text-primary text-center">
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
                        {selectedHotel.hotelName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">مکان:</span>{" "}
                        {selectedHotel.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">ورود:</span>{" "}
                        {selectedHotel.checkIn}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">خروج:</span>{" "}
                        {selectedHotel.checkOut}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Home className="w-14 h-w-14 text-primary" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">نوع اتاق:</span>{" "}
                        {selectedHotel.roomType}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">امتیاز:</span>{" "}
                        <Badge variant="secondary">{selectedHotel.rating.toFixed(1)}</Badge>
                      </p>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <p className="text-sm font-semibold">
                          {selectedHotel.price.toLocaleString()}
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
          </CardHeader>
        </Accordion>
      </Card>
    </motion.div>
  );
};

export default SelectedHotelDetails;

