"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, House, UtensilsCrossed, NotebookPen, Bus } from "lucide-react";

interface BotCardProps {
  title: string;
  description: string;
  iconName: string;
}

const iconMap = {
  Plane,
  House,
  UtensilsCrossed,
  NotebookPen,
  Bus,
};

const BotCard: React.FC<BotCardProps> = ({ title, description, iconName }) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className=" w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
      <motion.div
        className="overflow-hidden border pt-4 relative rounded-lg shadow-lg cursor-pointer w-full h-56 flex justify-center items-start"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {IconComponent && <IconComponent className="w-20 h-20" />}
        <div className="bg-background absolute bottom-0 left-0 right-0 p-4 text-card-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-md font-bold mb-2 flex items-center">
              {title}
            </div>
            <div className="text-xs">{description}</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BotCard;
