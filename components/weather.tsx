import { Card } from "./ui/card";

type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  return (
    <Card className="border border-gray-300 rounded-lg p-4 text-center shadow-md ">
      <h2 className="text-2xl font-semibold mb-2">Current Weather for {location}</h2>
      <p className="text-lg mb-1">Condition: <strong>{weather}</strong></p>
      <p className="text-lg">Temperature: <strong>{temperature}°C</strong></p>
    </Card>
  );
};
