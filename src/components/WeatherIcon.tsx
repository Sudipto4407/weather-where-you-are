
import React from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Cloudy,
  Sun,
  Wind
} from "lucide-react";
import { WeatherCondition } from "../utils/weatherUtils";

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 24, 
  className = "" 
}) => {
  const getIcon = () => {
    switch (condition) {
      case "sunny":
        return <Sun size={size} className={`text-weather-sunny ${className}`} />;
      case "cloudy":
        return <Cloudy size={size} className={`text-weather-cloudy ${className}`} />;
      case "partly-cloudy":
        return <Cloud size={size} className={`text-weather-cloudy ${className}`} />;
      case "rain":
        return <CloudRain size={size} className={`text-weather-rainy ${className}`} />;
      case "shower":
        return <CloudDrizzle size={size} className={`text-weather-rainy ${className}`} />;
      case "thunderstorm":
        return <CloudLightning size={size} className={`text-weather-stormy ${className}`} />;
      case "snow":
        return <CloudSnow size={size} className={`text-weather-snowy ${className}`} />;
      case "foggy":
        return <CloudFog size={size} className={`text-weather-cloudy ${className}`} />;
      case "windy":
        return <Wind size={size} className={`text-weather-cloudy ${className}`} />;
      default:
        return <Cloudy size={size} className={`text-weather-cloudy ${className}`} />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getIcon()}
    </div>
  );
};

export default WeatherIcon;
