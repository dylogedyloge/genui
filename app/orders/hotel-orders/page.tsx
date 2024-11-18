import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { House, Users, CalendarDays } from "lucide-react";

// Mock data for reserved hotels
// const reservedHotels = [
//   {
//     id: 1,
//     name: "Grand Plaza Hotel",
//     location: "New York City, USA",
//     checkIn: "2023-11-15",
//     checkOut: "2023-11-20",
//     roomType: "Deluxe Suite",
//     guests: 2,
//     status: "Upcoming",
//   },
//   {
//     id: 2,
//     name: "Sunset Beach Resort",
//     location: "Bali, Indonesia",
//     checkIn: "2023-10-01",
//     checkOut: "2023-10-07",
//     roomType: "Ocean View Villa",
//     guests: 4,
//     status: "Completed",
//   },
//   {
//     id: 3,
//     name: "Mountain Lodge",
//     location: "Aspen, Colorado, USA",
//     checkIn: "2023-12-20",
//     checkOut: "2023-12-27",
//     roomType: "Family Cabin",
//     guests: 6,
//     status: "Upcoming",
//   },
//   {
//     id: 4,
//     name: "City Center Inn",
//     location: "London, UK",
//     checkIn: "2023-11-05",
//     checkOut: "2023-11-08",
//     roomType: "Standard Double",
//     guests: 2,
//     status: "Cancelled",
//   },
// ];
const reservedHotels = [
  {
    id: 1,
    name: "هتل گرند پلازا",
    location: "نیویورک، ایالات متحده آمریکا",
    checkIn: "2023-11-15",
    checkOut: "2023-11-20",
    roomType: "سوییت دلوکس",
    guests: 2,
    status: "منتظر پرداخت",
  },
  {
    id: 2,
    name: "استراحتگاه سانست بیچ",
    location: "بالی، اندونزی",
    checkIn: "2023-10-01",
    checkOut: "2023-10-07",
    roomType: "ویلا با منظره اقیانوس",
    guests: 4,
    status: "تکمیل‌شده",
  },
  {
    id: 3,
    name: "لودج کوهستانی",
    location: "آسپن، کلرادو، ایالات متحده آمریکا",
    checkIn: "2023-12-20",
    checkOut: "2023-12-27",
    roomType: "کلبه خانوادگی",
    guests: 6,
    status: "منتظر پرداخت",
  },
  {
    id: 4,
    name: "هتل مرکز شهر",
    location: "لندن، بریتانیا",
    checkIn: "2023-11-05",
    checkOut: "2023-11-08",
    roomType: "اتاق دو نفره استاندارد",
    guests: 2,
    status: "لغو شده",
  },
];

export default function ListOfHotels() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">هتل های رزرو شده شما</h1>
      {reservedHotels.length === 0 ? (
        <p className="text-center text-gray-500">
          هتل رزرو شده ای وجود ندارد..
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reservedHotels.map((hotel) => (
            <Card key={hotel.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <House className="h-5 w-5" />
                  <span>{hotel.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">
                  {hotel.location}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm">
                    {hotel.checkIn} تا {hotel.checkOut}
                  </span>
                </div>
                <div className="text-sm mb-2">{hotel.roomType}</div>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{hotel.guests} مهمان</span>
                </div>
                <Badge
                  variant={
                    hotel.status === "منتظر پرداخت"
                      ? "secondary"
                      : hotel.status === "تکمیل‌شده"
                      ? "success"
                      : hotel.status === "لغو شده"
                      ? "destructive"
                      : "default"
                  }
                >
                  {hotel.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
