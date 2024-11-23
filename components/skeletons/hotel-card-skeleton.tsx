import { Skeleton } from "@/components/shadcn/skeleton";
import { Bed, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/shadcn/card";
import { motion } from "framer-motion";

const HotelCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-w-60 sm:w-96 shadow-md  dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
        <div className="p-6">
          {/* Hotel name and rating */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-10 h-4" />
          </div>

          {/* Location and Room Type */}
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
            <Skeleton className="w-16 h-4" />
          </motion.div>

          {/* Check-in and Check-out */}
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Skeleton className="w-12 h-4" />
              </div>
              <Skeleton className="w-16 h-4" />
            </div>
            <Bed className="text-card-foreground w-6 h-6 animate-pulse" />
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1 justify-end">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Skeleton className="w-12 h-4" />
              </div>
              <Skeleton className="w-16 h-4" />
            </div>
          </motion.div>

          {/* Price and Button */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-24 h-8" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
export default HotelCardSkeleton;
