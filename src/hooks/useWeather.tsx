
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { WeatherForecast, WeatherCondition, getMockWeatherData } from "../utils/weatherUtils";

// Using Open-Meteo API which is free and doesn't require an API key
export const useWeather = (initialLocation = "New York") => {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapCondition = (weatherCode: number): WeatherCondition => {
    // Map WMO weather codes to our app's conditions
    // https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
    if (weatherCode === 0) return 'sunny'; // Clear sky
    if (weatherCode === 1 || weatherCode === 2) return 'partly-cloudy'; // Mainly clear, partly cloudy
    if (weatherCode === 3) return 'cloudy'; // Overcast
    if (weatherCode >= 45 && weatherCode <= 48) return 'foggy'; // Fog
    if (weatherCode >= 51 && weatherCode <= 55) return 'shower'; // Drizzle
    if (weatherCode >= 56 && weatherCode <= 57) return 'shower'; // Freezing Drizzle
    if (weatherCode >= 61 && weatherCode <= 65) return 'rain'; // Rain
    if (weatherCode >= 66 && weatherCode <= 67) return 'shower'; // Freezing Rain
    if (weatherCode >= 71 && weatherCode <= 77) return 'snow'; // Snow
    if (weatherCode >= 80 && weatherCode <= 82) return 'shower'; // Rain showers
    if (weatherCode >= 85 && weatherCode <= 86) return 'snow'; // Snow showers
    if (weatherCode >= 95 && weatherCode <= 99) return 'thunderstorm'; // Thunderstorm
    return 'cloudy'; // Default
  };

  const getWeatherDescription = (code: number): string => {
    // Convert WMO weather codes to descriptions
    if (code === 0) return 'Clear sky';
    if (code === 1) return 'Mainly clear';
    if (code === 2) return 'Partly cloudy';
    if (code === 3) return 'Overcast';
    if (code >= 45 && code <= 48) return 'Fog';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 56 && code <= 57) return 'Freezing drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 66 && code <= 67) return 'Freezing rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 85 && code <= 86) return 'Snow showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Unknown';
  };

  const fetchWeather = async (searchLocation: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // First, get coordinates from the location name
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchLocation)}&count=1&language=en&format=json`);
      
      if (!geoRes.ok) {
        throw new Error("Location not found");
      }
      
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Could not find location: ${searchLocation}`);
      }
      
      const { latitude, longitude, name, country } = geoData.results[0];
      
      // Then get weather data using those coordinates, specifying Celsius
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=celsius&wind_speed_unit=mph&timezone=auto`
      );
      
      if (!weatherRes.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const weatherData = await weatherRes.json();
      
      // Process current weather data
      const currentWeatherCode = weatherData.current.weather_code;
      const condition = mapCondition(currentWeatherCode);
      
      // Process forecast data
      const forecast = weatherData.daily.time.map((date: string, index: number) => {
        const forecastCondition = mapCondition(weatherData.daily.weather_code[index]);
        return {
          date: new Date(date),
          condition: forecastCondition,
          high: Math.round(weatherData.daily.temperature_2m_max[index]),
          low: Math.round(weatherData.daily.temperature_2m_min[index]),
          description: getWeatherDescription(weatherData.daily.weather_code[index]),
          precipitation: weatherData.daily.precipitation_probability_max[index] || 0
        };
      });
      
      // Build the weather object
      const processedWeather: WeatherForecast = {
        location: name,
        country: country,
        currentWeather: {
          location: name,
          temperature: Math.round(weatherData.current.temperature_2m),
          feelsLike: Math.round(weatherData.current.apparent_temperature),
          humidity: Math.round(weatherData.current.relative_humidity_2m),
          windSpeed: Math.round(weatherData.current.wind_speed_10m),
          condition: condition,
          description: getWeatherDescription(currentWeatherCode),
          updatedAt: new Date(weatherData.current.time),
          high: forecast[0].high,
          low: forecast[0].low
        },
        forecast: forecast
      };
      
      setWeather(processedWeather);
      setLocation(name);
    } catch (err) {
      console.error("Error fetching weather:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Fallback to mock data
      const mockData = getMockWeatherData(searchLocation);
      setWeather(mockData);
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
              const { latitude, longitude } = position.coords;
              
              // Use reverse geocoding to get location name from coordinates
              const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
              );
              
              if (!geoRes.ok) {
                throw new Error("Failed to get location name");
              }
              
              const geoData = await geoRes.json();
              
              if (geoData && geoData.results && geoData.results.length > 0) {
                const locationName = geoData.results[0].name;
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
