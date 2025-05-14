
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { WeatherForecast, WeatherCondition } from "../utils/weatherUtils";

const API_KEY = ""; // You'll need to add your OpenWeatherMap API key here

export const useWeather = (initialLocation = "New York") => {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapCondition = (weatherId: number): WeatherCondition => {
    // Map OpenWeatherMap weather codes to our app's conditions
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 400) return 'shower';
    if (weatherId >= 500 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'foggy';
    if (weatherId === 800) return 'sunny';
    if (weatherId > 800) return 'partly-cloudy';
    return 'cloudy';
  };

  const fetchWeather = async (searchLocation: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!API_KEY) {
        toast.error("Please add your OpenWeatherMap API key to use real weather data");
        throw new Error("API key is missing");
      }

      // Fetch current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=imperial&appid=${API_KEY}`
      );
      
      if (!currentRes.ok) {
        const errorData = await currentRes.json();
        throw new Error(errorData.message || "Failed to fetch current weather");
      }
      
      const currentData = await currentRes.json();
      
      // Fetch forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchLocation}&units=imperial&appid=${API_KEY}`
      );
      
      if (!forecastRes.ok) {
        const errorData = await forecastRes.json();
        throw new Error(errorData.message || "Failed to fetch forecast");
      }
      
      const forecastData = await forecastRes.json();
      
      // Process the data
      const condition = mapCondition(currentData.weather[0].id);
      
      // Process forecast data (OpenWeatherMap returns forecast in 3-hour intervals)
      const processedForecast = [];
      const dailyForecasts = new Map();
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const day = date.toDateString();
        
        // Only take one forecast per day
        if (!dailyForecasts.has(day)) {
          const condition = mapCondition(item.weather[0].id);
          dailyForecasts.set(day, {
            date: date,
            condition: condition,
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            description: item.weather[0].description,
            precipitation: item.pop * 100 // Probability of precipitation as percentage
          });
        }
      }
      
      // Convert to array and take only next 7 days
      const forecast = Array.from(dailyForecasts.values()).slice(0, 7);
      
      // Build the weather object
      const weatherData: WeatherForecast = {
        location: currentData.name,
        country: currentData.sys.country,
        currentWeather: {
          location: currentData.name,
          temperature: Math.round(currentData.main.temp),
          feelsLike: Math.round(currentData.main.feels_like),
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed),
          condition: condition,
          description: currentData.weather[0].description,
          updatedAt: new Date(),
          high: Math.round(currentData.main.temp_max),
          low: Math.round(currentData.main.temp_min)
        },
        forecast: forecast
      };
      
      setWeather(weatherData);
    } catch (err) {
      console.error("Error fetching weather:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      toast.error(errorMessage);
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
          async (position) => {
            try {
              if (!API_KEY) {
                fetchWeather(location);
                return;
              }
              
              // Use reverse geocoding to get location name from coordinates
              const { latitude, longitude } = position.coords;
              const geoRes = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
              );
              
              if (!geoRes.ok) {
                throw new Error("Failed to get location name");
              }
              
              const geoData = await geoRes.json();
              if (geoData && geoData.length > 0) {
                const locationName = geoData[0].name;
                setLocation(locationName);
                fetchWeather(locationName);
              } else {
                fetchWeather(location);
              }
            } catch (error) {
              console.error("Error getting user location:", error);
              fetchWeather(location);
            }
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

