"use client";

import { MapPin, Calendar, Clock, Bus, Tag, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type TourProps = {
  name: string;
  destination: string;
  duration: string;
  startDate: string;
  endDate: string;
  groupSize: number;
  price: number;
  category: string;
};

export default function TourCard({
  name,
  destination,
  duration,
  startDate,
  endDate,
  groupSize,
  price,
  category,
}: TourProps) {
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
              {category}
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
              <p className="text-sm text-muted-foreground">{destination}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{duration}</p>
            </div>
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
                <p className="text-xs text-muted-foreground">تاریخ شروع</p>
              </div>
              <p className="text-sm font-semibold">{startDate}</p>
            </div>
            <Bus className="text-card-foreground w-6 h-6" />
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1 justify-end">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">تاریخ پایان</p>
              </div>
              <p className="text-sm font-semibold">{endDate}</p>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  تعداد نفرات {groupSize}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-primary">
                  {price} تومان
                </p>
              </div>
            </div>
            <Button className="w-full animate-shimmer items-center justify-center border border-slate-800 bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground dark:text-card-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
              رزرو تور
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}