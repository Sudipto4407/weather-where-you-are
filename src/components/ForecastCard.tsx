
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ForecastDay, formatDay } from "../utils/weatherUtils";
import WeatherIcon from "./WeatherIcon";

interface ForecastCardProps {
  forecast: ForecastDay[];
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <Card className="forecast-card shadow-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl border-none overflow-hidden">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-3">7-Day Forecast</h3>
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between py-2 ${
                index < forecast.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""
              }`}
            >
              <div className="w-16 font-medium">
                {index === 0 ? "Today" : formatDay(day.date)}
              </div>
              <div className="flex items-center">
                <WeatherIcon condition={day.condition} size={24} />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                  {day.description}
                </span>
              </div>
              <div className="flex space-x-2">
                <span className="font-medium">{Math.round(day.high)}°</span>
                <span className="text-gray-500">{Math.round(day.low)}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
