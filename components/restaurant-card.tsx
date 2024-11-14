"use client";

import { MapPin, Clock, Utensils, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type RestaurantProps = {
  name: string;
  cuisine: string;
  location: string;
  openingTime: string;
  closingTime: string;
  rating: number;
  priceRange: string;
};

export default function RestaurantCard({
  name,
  cuisine,
  location,
  openingTime,
  closingTime,
  rating,
  priceRange,
}: RestaurantProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full sm:w-96 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-primary">{name}</h2>
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
              <Utensils className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{cuisine}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              بازه قیمتی:
              {priceRange}
            </Badge>
          </motion.div>
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">ساعت باز شدن</p>
              </div>
              <p className="text-sm font-semibold">{openingTime}</p>
            </div>
            <Utensils className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1 justify-end">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">ساعت بسته شدن</p>
              </div>
              <p className="text-sm font-semibold">{closingTime}</p>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <Button className="w-full animate-shimmer items-center justify-center border border-primary bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
              رزرو رستوران
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
