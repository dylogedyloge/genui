import { Card } from "./ui/card";

type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  return (
    <Card>
      <h2 className="text-red-900">Current Weather for {location}</h2>
      <p>Condition: {weather}</p>
      <p>Temperature: {temperature}°C</p>
    </Card>
  );
};

// import { Plane, Calendar, Clock } from "lucide-react"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// type FlightProps = {
//   airline: string
//   flightNumber: string
//   departure: string
//   arrival: string
//   departureTime: string
//   arrivalTime: string
//   status: "On Time" | "Delayed" | "Cancelled"
// }

// export  function FlightCard({
//   airline,
//   flightNumber,
//   departure,
//   arrival,
//   departureTime,
//   arrivalTime,
//   status,
// }: FlightProps ) {
//   const getStatusColor = (status: FlightProps["status"]) => {
//     switch (status) {
//       case "On Time":
//         return "bg-green-500"
//       case "Delayed":
//         return "bg-yellow-500"
//       case "Cancelled":
//         return "bg-red-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   return (
//     <Card className="w-full max-w-md shadow-lg">
//       <CardHeader className="pb-4">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-2xl font-bold">{airline}</CardTitle>
//           <Badge variant="outline" className="text-sm font-medium">
//             {flightNumber}
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-2">
//             <Plane className="h-5 w-5 text-blue-500" />
//             <span className="font-semibold">{departure}</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Plane className="h-5 w-5 text-blue-500" />
//             <span className="font-semibold">{arrival}</span>
//           </div>
//         </div>
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-2">
//             <Clock className="h-4 w-4 text-gray-500" />
//             <span>{departureTime}</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Clock className="h-4 w-4 text-gray-500" />
//             <span>{arrivalTime}</span>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Calendar className="h-4 w-4 text-gray-500" />
//             <span>{new Date().toLocaleDateString()}</span>
//           </div>
//           <Badge className={`${getStatusColor(status)} text-white`}>
//             {status}
//           </Badge>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
