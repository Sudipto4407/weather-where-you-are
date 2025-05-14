
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getMockWeatherData, WeatherForecast } from "../utils/weatherUtils";

export const useWeather = (initialLocation = "New York") => {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (searchLocation: string) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, you'd fetch from a weather API here
      // For this demo, we'll use mock data
      const data = getMockWeatherData(searchLocation);
      setWeather(data);
    } catch (err) {
      console.error("Error fetching weather:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      toast.error("Could not load weather data");
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = (newLocation: string) => {
    setLocation(newLocation);
    fetchWeather(newLocation);
  };

  // Get user's current location on initial load
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // In a real app, you would use coordinates for an API call
            // For this mock, we'll just use the default location
            fetchWeather(location);
          },
          (error) => {
            console.error("Error getting user location:", error);
            fetchWeather(location);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser");
        fetchWeather(location);
      }
    };

    getUserLocation();
  }, []);

  return {
    weather,
    loading,
    error,
    searchLocation
  };
};
