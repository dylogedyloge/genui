"use client";

import Image from "next/image";
import { Bed, Calendar, MapPin, Star, Coffee, Users } from "lucide-react";
import { Badge } from "@/components/shadcn/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/shadcn/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import { useState } from "react";
import { Building, Hotel, Check } from "lucide-react";
import CustomCarousel from "../shadcn/custom-carousel";

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
  fare?: { total: number };
};

const HotelCard = ({
  hotelName,
  location,
  checkIn,
  checkOut,
  roomType,
  price,
  rating,
  onHotelCardClick,
  address,
  star,
  type,
  rooms = [],
  amenities = [],
  images = [],
  fare
}: HotelProps) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  // Get the first room and rate plan safely
  const firstRoom = rooms?.[0] || {};
  const firstRatePlan = firstRoom?.rate_plans?.[0] || {};

  const handleOpenDetailsAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  console.log("hotel data", firstRoom)
  const handleHotelCardClick = () => {

    const transformedHotelInfo = {
      hotelName,
      type,
      star,
      address,
      images,
      rooms: rooms.map(room => ({
        room_type_name: room.room_type_name,
        room_type_capacity: room.room_type_capacity,
        rate_plans: room.rate_plans.map(plan => ({
          name: plan.name,
          cancelable: plan.cancelable,
          meal_type_included: plan.meal_type_included,
          prices: {
            total_price: plan.prices.total_price,
            inventory: plan.prices.inventory,
            has_off: plan.prices.has_off
          }
        }))
      })),
      checkIn,
      checkOut,
      price,
      amenities
    };

    const generalInformation = {
      ticket: false,
      accommodation: true,
      itinerary: false,
      isInternational: false
    };

    // Send message to parent window
    window.parent.postMessage(
      {
        type: "SELECTED_HOTEL",
        payload: {
          selectedHotel: transformedHotelInfo,
          generalInformation
        }
      },
      "*"
    );
    console.log("selectedHotel", transformedHotelInfo);
    console.log("generalInformation", generalInformation);
  };






  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-w-60 sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg overflow-x-hidden">
        <div className="relative h-48 w-full">
          {Array.isArray(images) && images.length > 0 && images[0]?.image ? (
            <CustomCarousel images={images} hotelName={hotelName} />
          ) : (
            <Image
              src="/default-hotel-image.png"
              alt={hotelName}
              fill
              className="object-cover w-full h-full rounded-t-lg"
              priority
            />
          )}
          <div className="absolute top-2 right-2 z-20">
            {star ? (
              <Badge variant="secondary" className="text-xs font-medium">
                {[...Array(star)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 inline text-yellow-600" />
                ))}
              </Badge>
            ) : null}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-md font-bold text-primary">{hotelName}</h2>
            <Badge variant="outline" className="text-xs">
              {type}
            </Badge>
          </div>

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
              {(typeof fare?.total === "number" && fare?.total > 0
                ? fare.total
                : price
              ).toLocaleString()} ریال
              <span className="text-xs text-muted-foreground mr-1">/ شب</span>
            </p>
            {firstRatePlan.cancelable === 1 && (
              <Badge variant="outline" className="text-xs">
                قابل کنسلی
              </Badge>
            )}
          </div>
          <Button
            onClick={handleOpenDetailsAccordion}
            variant="outline"
            className="w-full mt-4 text-foreground"
          >
            {isAccordionOpen ? "بستن جزئیات" : "مشاهده جزئیات"}
          </Button>
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
                        icon: <Building className="w-4 h-4 text-muted-foreground" />,
                      },
                      {
                        label: "درجه هتل",
                        value: star ? `${star} ستاره` : null,
                        icon: <Star className="w-4 h-4 text-muted-foreground" />,
                      },
                      {
                        label: "آدرس",
                        value: address,
                        icon: <MapPin className="w-4 h-4 text-muted-foreground" />,
                      },
                      {
                        label: "نوع",
                        value: type,
                        icon: <Hotel className="w-4 h-4 text-muted-foreground" />,
                      },
                      {
                        label: "تاریخ ورود",
                        value: checkIn,
                        icon: <Calendar className="w-4 h-4 text-muted-foreground" />,
                      },
                      {
                        label: "تاریخ خروج",
                        value: checkOut,
                        icon: <Calendar className="w-4 h-4 text-muted-foreground" />,
                      },
                    ]
                      .filter(item => !!item.value)
                      .map((item) => (
                        <motion.div
                          key={item.label}
                          className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 flex-wrap"
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
                          <p className="text-xs text-card-foreground break-words whitespace-normal max-w-[60%] text-left">
                            {item.value}
                          </p>
                        </motion.div>
                      ))}
                  </motion.div>
                  <Button
                    onClick={handleHotelCardClick}
                    className="w-full mt-4"
                  >
                    خرید
                  </Button>
                </TabsContent>

                <TabsContent value="rooms">
                  <div className="space-y-4">
                    {rooms.map((room, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4"
                      >
                        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
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
