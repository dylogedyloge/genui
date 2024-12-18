// "use client";

// import { motion } from "framer-motion";
// import { Badge } from "@/components/shadcn/badge";
// import { Button } from "@/components/shadcn/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/shadcn/card";
// import { Separator } from "@/components/shadcn/separator";
// import { Plane, CalendarDays, MapPin, DollarSign } from "lucide-react";

// type SelectedFlightProps = {
//   selectedFlight: {
//     airline: string;
//     flightNumber: string;
//     departure: string;
//     destination: string;
//     departureTime: string;
//     arrivalTime: string;
//     price: number;
//   };
// };

// const SelectedFlightDetails = ({ selectedFlight }: SelectedFlightProps) => {
//   return (
//     <motion.div
//       className="mt-6"
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card className="p-6 bg-white dark:bg-black rounded-lg shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-primary text-center">
//             جزئیات پرواز انتخابی {/* Selected Flight Details */}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-6 sm:grid-cols-2">
//             <div className="flex items-center gap-3">
//               <Plane className="w-5 h-5 text-primary" />
//               <p className="text-sm font-medium">
//                 <span className="text-muted-foreground">هواپیمایی:</span>{" "}
//                 {selectedFlight.airline}
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <Badge variant="secondary">{selectedFlight.flightNumber}</Badge>
//               <p className="text-sm font-medium">
//                 <span className="text-muted-foreground">شماره پرواز:</span>{" "}
//                 {selectedFlight.flightNumber}
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <MapPin className="w-5 h-5 text-primary" />
//               <p className="text-sm font-medium">
//                 <span className="text-muted-foreground">مبدا:</span>{" "}
//                 {selectedFlight.departure}
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <MapPin className="w-5 h-5 text-primary rotate-180" />
//               <p className="text-sm font-medium">
//                 <span className="text-muted-foreground">مقصد:</span>{" "}
//                 {selectedFlight.destination}
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <CalendarDays className="w-5 h-5 text-primary" />
//               <p className="text-sm font-medium">
//                 <span className="text-muted-foreground">زمان پرواز:</span>{" "}
//                 {selectedFlight.departureTime}
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <CalendarDays className="w-5 h-5 text-primary" />
//               <p className="text-sm font-medium">
//                 <span className="text-muted-foreground">زمان فرود:</span>{" "}
//                 {selectedFlight.arrivalTime}
//               </p>
//             </div>
//             <div className="sm:col-span-2 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <DollarSign className="w-5 h-5 text-primary" />
//                 <p className="text-lg font-semibold">
//                   {selectedFlight.price.toLocaleString()} ریال {/* Price */}
//                 </p>
//               </div>
//               <Button className="bg-primary text-primary-foreground animate-shimmer">
//                 تایید {/* Confirm */}
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default SelectedFlightDetails;
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import { CalendarDays, MapPin, DollarSign } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../shadcn/accordion";

type SelectedFlightProps = {
  selectedFlight: {
    airline: string;
    flightNumber: string;
    departure: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    airlineLogo: string; // Add airlineLogo to the props
  };
};

const SelectedFlightDetails = ({ selectedFlight }: SelectedFlightProps) => {
  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="min-w-60 sm:w-96 shadow-md dark:bg-black bg-white dark:bg-grid-small-white/[0.1] bg-grid-small-black/[0.1] rounded-lg">
        <Accordion type="single" collapsible className="w-full">
          <CardHeader>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <CardTitle className=" font-bold text-primary text-center">
                  جزئیات پرواز انتخابی {/* Selected Flight Details */}
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={selectedFlight.airlineLogo}
                          alt={`${selectedFlight.airline} logo`}
                          width={50}
                          height={50}
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">
                          هواپیمایی:
                        </span>{" "}
                        {selectedFlight.airline}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">
                          شماره پرواز:
                        </span>{" "}
                        <Badge variant="secondary">
                          {selectedFlight.flightNumber}
                        </Badge>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">مبدا:</span>{" "}
                        {selectedFlight.departure}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary rotate-180" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">مقصد:</span>{" "}
                        {selectedFlight.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">
                          زمان پرواز:
                        </span>{" "}
                        {selectedFlight.departureTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">
                          زمان فرود:
                        </span>{" "}
                        {selectedFlight.arrivalTime}
                      </p>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <p className="text-lg font-semibold">
                          {selectedFlight.price.toLocaleString()} ریال{" "}
                          {/* Price */}
                        </p>
                      </div>
                      <Button className="bg-primary text-primary-foreground animate-shimmer">
                        تایید {/* Confirm */}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </CardHeader>
        </Accordion>
      </Card>
    </motion.div>
  );
};

export default SelectedFlightDetails;
