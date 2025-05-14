
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherData, getBackgroundClass, formatDate } from "../utils/weatherUtils";
import WeatherIcon from "./WeatherIcon";
import { Droplets, Wind } from "lucide-react";

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const bgClass = getBackgroundClass(weather.condition);

  return (
    <Card className={`weather-card rounded-xl shadow-lg overflow-hidden ${bgClass}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-1">{weather.location}</h2>
            {weather.country && (
              <p className="text-gray-600 dark:text-gray-300">{weather.country}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(weather.updatedAt)}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-2">
              <WeatherIcon condition={weather.condition} size={64} className="animate-float" />
            </div>
            <p className="text-lg capitalize">{weather.description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <span className="text-6xl font-bold">{Math.round(weather.temperature)}°C</span>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
              Feels like {Math.round(weather.feelsLike)}°C
            </div>
            <div className="mt-1">
              <span className="text-gray-700 dark:text-gray-200">H: {Math.round(weather.high)}°C </span>
              <span className="text-gray-700 dark:text-gray-200">L: {Math.round(weather.low)}°C</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg">
              <div className="flex items-center text-blue-600 dark:text-blue-300 mb-1">
                <Droplets size={16} />
                <span className="ml-1">Humidity</span>
              </div>
              <span className="text-lg font-semibold">{weather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg">
              <div className="flex items-center text-blue-600 dark:text-blue-300 mb-1">
                <Wind size={16} />
                <span className="ml-1">Wind</span>
              </div>
              <span className="text-lg font-semibold">{weather.windSpeed} mph</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
