"use client";

import {
  MapPin,
  Clock,
  Coffee,
  Utensils,
  Bed,
  Camera,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type ActivityType = "Breakfast" | "Lunch" | "Dinner" | "Sightseeing" | "Hotel";

type Activity = {
  type: ActivityType;
  name: string;
  time: string;
  location: string;
};

type ItineraryProps = {
  day: number;
  date: string;
  activities: Activity[];
};

const ActivityIcon = ({ type }: { type: ActivityType }) => {
  switch (type) {
    case "Breakfast":
    case "Lunch":
    case "Dinner":
      return <Utensils className="w-4 h-4" />;
    case "Sightseeing":
      return <Camera className="w-4 h-4" />;
    case "Hotel":
      return <Bed className="w-4 h-4" />;
    default:
      return <Coffee className="w-4 h-4" />;
  }
};

export default function ItineraryCard({
  day = 1,
  date = "2023-08-15",
  activities = [
    {
      type: "Breakfast",
      name: "Hotel Breakfast",
      time: "08:00",
      location: "Hotel Restaurant",
    },
    {
      type: "Sightseeing",
      name: "City Tour",
      time: "10:00",
      location: "City Center",
    },
    {
      type: "Lunch",
      name: "Local Cuisine",
      time: "13:00",
      location: "Downtown Restaurant",
    },
    {
      type: "Sightseeing",
      name: "Museum Visit",
      time: "15:00",
      location: "National Museum",
    },
    {
      type: "Dinner",
      name: "Gourmet Experience",
      time: "19:00",
      location: "Michelin Star Restaurant",
    },
    {
      type: "Hotel",
      name: "Overnight Stay",
      time: "22:00",
      location: "Luxury Hotel",
    },
  ],
}: ItineraryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full sm:w-96 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">روز {day}</h2>
            <Badge variant="secondary" className="text-xs font-medium">
              <Calendar className="w-3 h-3 mr-1 inline-block" />
              {date}
            </Badge>
          </div>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{activity.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 inline-block mr-1" />
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3 inline-block mr-1" />
                    {activity.location}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Button className="w-full animate-shimmer items-center justify-center border border-primary bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
              جزئیات را ببینید
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
