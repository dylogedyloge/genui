import { Skeleton } from "@/components/shadcn/skeleton";
import { MapPin, Clock, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/shadcn/card";
import { motion } from "framer-motion";

const RestaurantCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="min-w-60 sm:w-96 shadow-md  dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
        <CardContent className="p-4">
          {/* Restaurant name and rating */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-10 h-4" />
          </div>

          {/* Cuisine and Price Range */}
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-muted-foreground" />
              <Skeleton className="w-20 h-4" />
            </div>
            <Skeleton className="w-16 h-4" />
          </motion.div>

          {/* Opening and Closing Times */}
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Skeleton className="w-16 h-4" />
              </div>
              <Skeleton className="w-12 h-4" />
            </div>
            <Utensils className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1 justify-end">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Skeleton className="w-16 h-4" />
              </div>
              <Skeleton className="w-12 h-4" />
            </div>
          </motion.div>

          {/* Location and Button */}
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Skeleton className="w-48 h-4" />
            </div>
            <Skeleton className="w-full h-8" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
export default RestaurantCardSkeleton;
