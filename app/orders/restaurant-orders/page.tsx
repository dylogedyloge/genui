import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UtensilsCrossed,
  MapPin,
  Calendar,
  Users,
  StickyNote,
} from "lucide-react";

// Mock data for reserved restaurants
// const reservedRestaurants = [
//   {
//     id: 1,
//     name: "La Bella Italia",
//     location: "Rome, Italy",
//     date: "2023-11-15",
//     time: "19:30",
//     guests: 2,
//     specialRequests: "Window table if possible",
//     status: "Upcoming",
//   },
//   {
//     id: 2,
//     name: "Sushi Delight",
//     location: "Tokyo, Japan",
//     date: "2023-10-20",
//     time: "20:00",
//     guests: 4,
//     specialRequests: "One vegetarian meal",
//     status: "Completed",
//   },
//   {
//     id: 3,
//     name: "Le Petit Bistro",
//     location: "Paris, France",
//     date: "2023-12-05",
//     time: "18:45",
//     guests: 2,
//     specialRequests: "Gluten-free options needed",
//     status: "Upcoming",
//   },
//   {
//     id: 4,
//     name: "Steakhouse 66",
//     location: "New York City, USA",
//     date: "2023-11-30",
//     time: "21:00",
//     guests: 6,
//     specialRequests: "Celebrating a birthday",
//     status: "Cancelled",
//   },
// ];
const reservedRestaurants = [
  {
    id: 1,
    name: "لا بلا ایتالیا",
    location: "رم، ایتالیا",
    date: "2023-11-15",
    time: "19:30",
    guests: 2,
    specialRequests: "در صورت امکان میز کنار پنجره",
    status: "منتظر پرداخت",
  },
  {
    id: 2,
    name: "سوشی دِلایت",
    location: "توکیو، ژاپن",
    date: "2023-10-20",
    time: "20:00",
    guests: 4,
    specialRequests: "یک وعده غذایی گیاهی",
    status: "تکمیل‌شده",
  },
  {
    id: 3,
    name: "لو پتی بیسترو",
    location: "پاریس، فرانسه",
    date: "2023-12-05",
    time: "18:45",
    guests: 2,
    specialRequests: "نیاز به گزینه‌های بدون گلوتن",
    status: "منتظر پرداخت",
  },
  {
    id: 4,
    name: "استیک هاوس ۶۶",
    location: "نیویورک، ایالات متحده آمریکا",
    date: "2023-11-30",
    time: "21:00",
    guests: 6,
    specialRequests: "در حال جشن تولد",
    status: "لغو شده",
  },
];

export default function ListOfRestaurants() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">رستوران های رزرو شده شما</h1>
      {reservedRestaurants.length === 0 ? (
        <p className="text-center text-gray-500">
          رستوران رزرو شده ای وجود ندارد.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reservedRestaurants.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  <span>{reservation.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {reservation.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {reservation.date} ساعت {reservation.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{reservation.guests} مهمان</span>
                </div>
                {reservation.specialRequests && (
                  <div className="flex items-start gap-2 mb-4">
                    <StickyNote className="h-4 w-4 mt-1" />
                    <span className="text-sm">
                      {reservation.specialRequests}
                    </span>
                  </div>
                )}
                <Badge
                  variant={
                    reservation.status === "منتظر پرداخت"
                      ? "secondary"
                      : reservation.status === "تکمیل‌شده"
                      ? "success"
                      : reservation.status === "لغو شده"
                      ? "destructive"
                      : "default"
                  }
                >
                  {reservation.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
