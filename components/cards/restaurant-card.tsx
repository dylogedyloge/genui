"use client";

import { MapPin, Clock, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";

type RestaurantProps = {
  name: string;
  cuisine: string;
  location: string;
  openingTime: string;
  closingTime: string;
  rating: number;
  priceRange: string;
};

const RestaurantCard = ({
  name,
  cuisine,
  location,
  openingTime,
  closingTime,
  rating,
}: RestaurantProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-w-60 sm:w-96 shadow-md  dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
        <div className="p-4">
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
          ></motion.div>
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground"> باز </p>
              </div>
              <p className="text-xs prose-sm text-muted-foreground">
                {openingTime}
              </p>
            </div>
            <Utensils className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1 justify-end">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground"> بسته </p>
              </div>
              <p className="text-xs prose-sm text-muted-foreground">
                {closingTime}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="flex justify-between gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{cuisine}</p>
            </div>
          </motion.div>
          <Button className="w-full animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
            رزرو رستوران
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
