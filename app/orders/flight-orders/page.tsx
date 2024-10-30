import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, PlaneTakeoff } from "lucide-react";

// Mock data for reserved flights

const reservedFlights = [
  {
    id: 1,
    flightNumber: "FL123",
    departure: "نیویورک (JFK)",
    arrival: "لندن (LHR)",
    date: "2023-11-15",
    time: "14:30",
    airline: "هواپیمایی جهانی",
    status: "منتظر پرداخت",
  },
  {
    id: 2,
    flightNumber: "FL456",
    departure: "پاریس (CDG)",
    arrival: "توکیو (HND)",
    date: "2023-10-20",
    time: "09:45",
    airline: "هواپیمایی یورو-آسیا",
    status: "تکمیل‌شده",
  },
  {
    id: 3,
    flightNumber: "FL789",
    departure: "لس آنجلس (LAX)",
    arrival: "سیدنی (SYD)",
    date: "2023-12-05",
    time: "22:15",
    airline: "مسیرهای اقیانوس آرام",
    status: "منتظر پرداخت",
  },
  {
    id: 4,
    flightNumber: "FL101",
    departure: "دبی (DXB)",
    arrival: "نیویورک (JFK)",
    date: "2023-11-30",
    time: "01:20",
    airline: "امارات",
    status: "لغو شده",
  },
];

export default function ListOfFlights() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">پروازهای رزرو شده شما</h1>
      {reservedFlights.length === 0 ? (
        <p className="text-center text-gray-500">
          پرواز رزرو شده ای وجود ندارد
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reservedFlights.map((flight) => (
            <Card key={flight.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  پرواز {flight.flightNumber}
                </CardTitle>
                <Plane className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-2xl font-bold ">{flight.departure}</div>
                  <PlaneTakeoff className="h-4 w-4 text-muted-foreground mx-2" />
                  <div className="text-2xl font-bold">{flight.arrival}</div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {flight.date} ساعت {flight.time}
                </div>
                <div className="text-sm mb-4">{flight.airline}</div>

                <Badge
                  variant={
                    flight.status === "منتظر پرداخت"
                      ? "secondary"
                      : flight.status === "تکمیل‌شده"
                      ? "success"
                      : flight.status === "لغو شده"
                      ? "destructive"
                      : "default"
                  }
                >
                  {flight.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
