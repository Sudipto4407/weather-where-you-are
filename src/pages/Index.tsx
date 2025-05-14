
import React from "react";
import { useWeather } from "../hooks/useWeather";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import SearchLocation from "../components/SearchLocation";
import { Skeleton } from "@/components/ui/skeleton";
import { getBackgroundClass } from "../utils/weatherUtils";

const Index = () => {
  const { weather, loading, searchLocation } = useWeather();
  
  const bgClass = weather?.currentWeather 
    ? getBackgroundClass(weather.currentWeather.condition) 
    : "cloud-bg";

  return (
    <div className={`min-h-screen pb-8 ${bgClass}`}>
      <div className="container mx-auto px-4 pt-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Weather Forecast</h1>
          <p className="text-gray-600 dark:text-gray-300">Get the latest weather updates</p>
        </header>
        
        <SearchLocation onSearch={searchLocation} />
        
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          ) : weather ? (
            <>
              <div className="mb-6">
                <WeatherCard weather={weather.currentWeather} />
              </div>
              
              <div className="mb-6">
                <ForecastCard forecast={weather.forecast} />
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-8">
                <p>
                  Weather data is currently simulated for demonstration purposes.
                  <br />
                  In a production app, this would connect to a real weather API.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center p-10 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow">
              <p>Unable to load weather data. Please try again later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
