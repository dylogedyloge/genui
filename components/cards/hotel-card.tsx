// "use client";

// import { Bed, Calendar, MapPin } from "lucide-react";
// import { Badge } from "@/components/shadcn/badge";
// import { motion } from "framer-motion";
// import { Button } from "@/components/shadcn/button";
// import moment from "moment-jalaali";

// type HotelProps = {
//   hotelName: string;
//   location: string;
//   checkIn: string;
//   checkOut: string;
//   roomType: string;
//   price: number;
//   rating: number;
//   onHotelCardClick: (hotelInfo: any) => void;
// };

// const HotelCard = ({
//   hotelName,
//   location,
//   checkIn,
//   checkOut,
//   roomType,
//   price,
//   rating,
//   onHotelCardClick,
// }: HotelProps) => {
//   // Convert Gregorian dates to Jalali dates
//   const convertToJalali = (date: string) => {
//     // Parse the Gregorian date
//     const jalaliDate = moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD");
//     return jalaliDate;
//   };

//   // Convert checkIn and checkOut dates to Jalali
//   const jalaliCheckIn = convertToJalali(checkIn);
//   const jalaliCheckOut = convertToJalali(checkOut);

//     // Function to handle card click
//     const handleHotelCardClick = () => {
//       const hotelInfo = {
//         hotelName,
//         location,
//         checkIn: jalaliCheckIn,
//         checkOut: jalaliCheckOut,
//         roomType,
//         price,
//         rating,
//       };

//       // Call the callback function to pass flight details to the parent
//       onHotelCardClick(hotelInfo);
//     };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="min-w-60 sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg ">
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-sm font-semibold text-primary">{hotelName}</h2>
//             <Badge variant="secondary" className="text-xs font-medium">
//               ★ {rating.toFixed(1)}
//             </Badge>
//           </div>
//           <motion.div
//             className="flex items-center justify-between mb-4"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1, duration: 0.3 }}
//           >
//             <div className="flex items-center gap-2">
//               <MapPin className="w-4 h-4 text-muted-foreground" />
//               <p className="text-sm text-muted-foreground">{location}</p>
//             </div>
//             <Badge variant="outline" className="text-xs">
//               {roomType}
//             </Badge>
//           </motion.div>
//           <motion.div
//             className="flex items-center justify-between mb-4"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2, duration: 0.3 }}
//           >
//             <div className="text-left">
//               <div className="flex items-center gap-1 mb-1">
//                 <Calendar className="w-4 h-4 text-muted-foreground" />
//                 <p className="text-xs text-muted-foreground">ورود</p>
//               </div>
//               <p className="text-xs prose-sm text-muted-foreground">
//                 {jalaliCheckIn} {/* Jalali Check-In Date */}
//               </p>
//             </div>
//             <Bed className="text-card-foreground w-6 h-6" />
//             <div className="text-right">
//               <div className="flex items-center gap-1 mb-1 justify-end">
//                 <Calendar className="w-4 h-4 text-muted-foreground" />
//                 <p className="text-xs text-muted-foreground">خروج</p>
//               </div>
//               <p className="text-xs prose-sm text-muted-foreground">
//                 {jalaliCheckOut} {/* Jalali Check-Out Date */}
//               </p>
//             </div>
//           </motion.div>
//           <motion.div
//             className="flex items-center justify-between"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.3 }}
//           >
//             <p className="text-sm font-semibold text-primary">
//               {price.toLocaleString()}ریال
//               <span className="text-xs text-muted-foreground">/ شب</span>
//             </p>
//             <Button onClick={handleHotelCardClick} className="animate-shimmer border-slate-800 items-center justify-center border border-primary dark:text-card-foreground bg-primary bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] font-medium text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
//              دیدن جزئیات
//             </Button>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default HotelCard;
"use client";

import { Bed, Calendar, MapPin, Star, Coffee, Users } from "lucide-react";
import { Badge } from "@/components/shadcn/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/shadcn/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import { useState } from "react";
import { Building, Hotel, Check } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn/carousel";

type HotelProps = {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  price: number;
  images: Array<{
    image: string;
    alt: string;
    caption: string | null;
  }>;
  rating: number;
  imageUrl?: string;
  amenities?: string[];
  onHotelCardClick: (hotelInfo: any) => void;
  // New props based on API response
  address: string;
  star: number;
  type: string;
  rooms: Array<{
    room_type_name: string;
    room_type_capacity: number;
    rate_plans: Array<{
      name: string;
      cancelable: number;
      meal_type_included: string;
      prices: {
        total_price: number;
        inventory: number;
        has_off: boolean;
      };
    }>;
  }>;
};

const HotelCard = ({
  hotelName,
  location,
  checkIn,
  checkOut,
  roomType,
  price,
  rating,
  imageUrl,
  onHotelCardClick,
  address,
  star,
  type,
  rooms = [],
  amenities = [],
  images = [],
}: HotelProps) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  // Get the first room and rate plan safely
  const firstRoom = rooms?.[0] || {};
  const firstRatePlan = firstRoom?.rate_plans?.[0] || {};
  const handleHotelCardClick = () => {
    setIsAccordionOpen(!isAccordionOpen);
    const hotelInfo = {
      hotelName,
      location,
      checkIn,
      checkOut,
      roomType,
      price,
      rating,
      address,
      star,
      type,
      rooms,
    };
    onHotelCardClick(hotelInfo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      // onClick={handleHotelCardClick}
      className="cursor-pointer"
    >
      <div className="min-w-60 sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
        <div className="relative h-48 w-full">
          {/* {imageUrl && (
            <Image
            src={`https://api.atripa.ir${imageUrl}`}
              alt={hotelName}
              fill
              className="object-cover rounded-t-lg"
            />
          )} */}
          <Carousel className="w-full h-full rounded-t-lg">
            <CarouselContent className="h-full">
              {images && images.length > 0 ? (
                images.map((img, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={`https://api.atripa.ir${img.image}`}
                        alt={img.alt || hotelName}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="h-full">
                  <div className="relative h-full w-full bg-muted flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No Image Available</p>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {images && images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 z-10" />
                <CarouselNext className="right-2 z-10" />
              </>
            )}
          </Carousel>
          <div className="absolute top-2 right-2 z-20">
            <Badge variant="secondary" className="text-xs font-medium">
              {[...Array(star)].map((_, i) => (
                <Star key={i} className="w-3 h-3 inline text-yellow-400" />
              ))}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-primary">{hotelName}</h2>
            <Badge variant="outline" className="text-xs">
              {type}
            </Badge>
          </div>

          <motion.div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{address}</p>
          </motion.div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {firstRoom.room_type_name || roomType || "Standard"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                ظرفیت {firstRoom.room_type_capacity || 1} نفر
              </p>
            </div>
          </div>

          {firstRatePlan.meal_type_included === "breakfast" && (
            <div className="flex items-center gap-2 mb-3">
              <Coffee className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">صبحانه رایگان</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{checkIn}</p>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{checkOut}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">
              {price.toLocaleString()} ریال
              <span className="text-xs text-muted-foreground mr-1">/ شب</span>
            </p>

            {firstRatePlan.cancelable === 1 && (
              <Badge variant="outline" className="text-xs">
                قابل کنسلی
              </Badge>
            )}
            <Button
              onClick={handleHotelCardClick}
              variant="outline"
              className="text-xs"
            >
              {isAccordionOpen ? "بستن جزئیات" : "مشاهده جزئیات"}
            </Button>
          </div>
        </div>

        <Accordion
          type="single"
          collapsible
          value={isAccordionOpen ? "details" : ""}
          className="px-4 pb-4"
        >
          <AccordionItem value="details" className="border-none">
            <AccordionContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="details">جزئیات هتل</TabsTrigger>
                  <TabsTrigger value="rooms">اتاق‌ها</TabsTrigger>
                  <TabsTrigger value="amenities">امکانات</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 },
                      },
                    }}
                  >
                    {[
                      {
                        label: "نام هتل",
                        value: hotelName,
                        icon: <Building className="w-4 h-4" />,
                      },
                      {
                        label: "درجه هتل",
                        value: `${star} ستاره`,
                        icon: <Star className="w-4 h-4" />,
                      },
                      {
                        label: "آدرس",
                        value: address,
                        icon: <MapPin className="w-4 h-4" />,
                      },
                      {
                        label: "نوع",
                        value: type,
                        icon: <Hotel className="w-4 h-4" />,
                      },
                      {
                        label: "تاریخ ورود",
                        value: checkIn,
                        icon: <Calendar className="w-4 h-4" />,
                      },
                      {
                        label: "تاریخ خروج",
                        value: checkOut,
                        icon: <Calendar className="w-4 h-4" />,
                      },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <p className="text-xs font-semibold text-card-foreground">
                            {item.label}:
                          </p>
                        </div>
                        <p className="text-xs text-card-foreground">
                          {item.value}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>

                <TabsContent value="rooms">
                  <div className="space-y-4">
                    {rooms.map((room, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4"
                      >
                        <h3 className="text-sm font-semibold mb-2">
                          {room.room_type_name}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            ظرفیت: {room.room_type_capacity} نفر
                          </p>
                          {room.rate_plans.map((plan, planIndex) => (
                            <div key={planIndex} className="space-y-1">
                              <p className="text-xs font-medium">{plan.name}</p>
                              <p className="text-xs text-muted-foreground">
                                قیمت: {plan.prices.total_price.toLocaleString()}{" "}
                                ریال
                              </p>
                              {plan.meal_type_included === "breakfast" && (
                                <Badge variant="outline" className="text-xs">
                                  شامل صبحانه
                                </Badge>
                              )}
                              {plan.cancelable === 1 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs mr-2"
                                >
                                  قابل کنسلی
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="amenities">
                  <div className="grid grid-cols-2 gap-4">
                    {amenities?.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-card-foreground"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );
};

export default HotelCard;
