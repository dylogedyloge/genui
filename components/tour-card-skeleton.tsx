import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Clock, Bus, Tag, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export const TourCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full sm:w-96 shadow-sm">
        <CardContent className="p-4">
          {/* Tour name and category */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>

          {/* Destination and Duration */}
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Skeleton className="w-24 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Skeleton className="w-16 h-4" />
            </div>
          </motion.div>

          {/* Start Date and End Date */}
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Skeleton className="w-16 h-4" />
              </div>
              <Skeleton className="w-20 h-4" />
            </div>
            <Bus className="text-card-foreground w-6 h-6" />
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1 justify-end">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Skeleton className="w-16 h-4" />
              </div>
              <Skeleton className="w-20 h-4" />
            </div>
          </motion.div>

          {/* Group Size and Price */}
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <Skeleton className="w-24 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <Skeleton className="w-16 h-4" />
            </div>
          </motion.div>

          {/* Reserve Button */}
          <Skeleton className="w-full h-8" />
        </CardContent>
      </Card>
    </motion.div>
  );
};