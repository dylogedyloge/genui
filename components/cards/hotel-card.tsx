"use client";

import { Bed, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";

type HotelProps = {
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  price: number;
  rating: number;
};

const HotelCard = ({
  hotelName,
  location,
  checkIn,
  checkOut,
  roomType,
  price,
  rating,
}: HotelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full sm:w-96 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-primary">{hotelName}</h2>
            <Badge variant="secondary" className="text-xs font-medium">
              ★ {rating.toFixed(1)}
            </Badge>
          </div>
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {roomType}
            </Badge>
          </motion.div>
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">ورود</p>
              </div>
              <p className="text-sm font-semibold">{checkIn}</p>
            </div>
            <Bed className="text-card-foreground w-6 h-6 animate-pulse" />
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1 justify-end">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">خروج</p>
              </div>
              <p className="text-sm font-semibold">{checkOut}</p>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <p className="text-sm font-semibold text-primary">
              {price}تومان
              <span className="text-xs text-muted-foreground">/ شب</span>
            </p>
            <Button className="animate-shimmer items-center justify-center border border-slate-800 bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground dark:text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
              رزرو هتل
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
export default HotelCard
