import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Globe, MapPin, Calendar, Clock, Users, Tag } from "lucide-react";

// Mock data for booked tours
// const bookedTours = [
//   {
//     id: 1,
//     name: "Wonders of Ancient Egypt",
//     destination: "Egypt",
//     startDate: "2023-11-15",
//     endDate: "2023-11-25",
//     duration: "11 days",
//     type: "Cultural",
//     travelers: 2,
//     status: "Upcoming",
//   },
//   {
//     id: 2,
//     name: "Amazon Rainforest Expedition",
//     destination: "Brazil",
//     startDate: "2023-09-05",
//     endDate: "2023-09-12",
//     duration: "8 days",
//     type: "Adventure",
//     travelers: 4,
//     status: "Completed",
//   },
//   {
//     id: 3,
//     name: "Serene Bali Retreat",
//     destination: "Indonesia",
//     startDate: "2024-02-10",
//     endDate: "2024-02-17",
//     duration: "7 days",
//     type: "Relaxation",
//     travelers: 2,
//     status: "Upcoming",
//   },
//   {
//     id: 4,
//     name: "Northern Lights Explorer",
//     destination: "Iceland",
//     startDate: "2023-12-20",
//     endDate: "2023-12-27",
//     duration: "8 days",
//     type: "Adventure",
//     travelers: 3,
//     status: "Cancelled",
//   },
// ];
const bookedTours = [
  {
    id: 1,
    name: "شگفتی‌های مصر باستان",
    destination: "مصر",
    startDate: "2023-11-15",
    endDate: "2023-11-25",
    duration: "۱۱ روز",
    type: "فرهنگی",
    travelers: 2,
    status: "منتظر پرداخت",
  },
  {
    id: 2,
    name: "سفر اکتشافی جنگل‌های بارانی آمازون",
    destination: "برزیل",
    startDate: "2023-09-05",
    endDate: "2023-09-12",
    duration: "۸ روز",
    type: "ماجراجویی",
    travelers: 4,
    status: "تکمیل‌شده",
  },
  {
    id: 3,
    name: "آرامش‌بخش بالی",
    destination: "اندونزی",
    startDate: "2024-02-10",
    endDate: "2024-02-17",
    duration: "۷ روز",
    type: "استراحت",
    travelers: 2,
    status: "منتظر پرداخت",
  },
  {
    id: 4,
    name: "کاوشگر شفق شمالی",
    destination: "ایسلند",
    startDate: "2023-12-20",
    endDate: "2023-12-27",
    duration: "۸ روز",
    type: "ماجراجویی",
    travelers: 3,
    status: "لغو شده",
  },
];

export default function ListOfTours() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">تورهای رزرو شده شما</h1>
      {bookedTours.length === 0 ? (
        <p className="text-center text-gray-500">تور رزرو شده ای وجود ندارد.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookedTours.map((tour) => (
            <Card key={tour.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>{tour.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {tour.destination}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {tour.startDate} تا {tour.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">{tour.type}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{tour.travelers} مسافر</span>
                </div>
                <Badge
                  variant={
                    tour.status === "منتظر پرداخت"
                      ? "secondary"
                      : tour.status === "تکمیل‌شده"
                      ? "success"
                      : tour.status === "لغو شده"
                      ? "destructive"
                      : "default"
                  }
                >
                  {tour.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
