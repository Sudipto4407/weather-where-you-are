
export type WeatherCondition = 
  | 'sunny'
  | 'cloudy'
  | 'partly-cloudy'
  | 'rain'
  | 'shower'
  | 'thunderstorm'
  | 'snow'
  | 'foggy'
  | 'windy';

export interface WeatherData {
  location: string;
  country?: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  description: string;
  updatedAt: Date;
  high: number;
  low: number;
}

export interface ForecastDay {
  date: Date;
  condition: WeatherCondition;
  high: number;
  low: number;
  description: string;
  precipitation: number;
}

export interface WeatherForecast {
  location: string;
  country?: string;
  currentWeather: WeatherData;
  forecast: ForecastDay[];
}

export const getBackgroundClass = (condition: WeatherCondition): string => {
  switch (condition) {
    case 'sunny':
      return 'sunny-bg';
    case 'partly-cloudy':
    case 'cloudy':
      return 'cloud-bg';
    case 'rain':
    case 'shower':
      return 'rain-bg';
    case 'thunderstorm':
      return 'storm-bg';
    case 'snow':
      return 'snow-bg';
    default:
      return 'cloud-bg';
  }
};

export const getConditionColor = (condition: WeatherCondition): string => {
  switch (condition) {
    case 'sunny':
      return 'text-weather-sunny';
    case 'partly-cloudy':
    case 'cloudy':
    case 'foggy':
      return 'text-weather-cloudy';
    case 'rain':
    case 'shower':
      return 'text-weather-rainy';
    case 'thunderstorm':
      return 'text-weather-stormy';
    case 'snow':
      return 'text-weather-snowy';
    case 'windy':
      return 'text-weather-cloudy';
    default:
      return 'text-gray-500';
  }
};

// Mock weather data for development
export const getMockWeatherData = (location = 'New York'): WeatherForecast => {
  const currentDate = new Date();
  
  const forecast: ForecastDay[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(currentDate.getDate() + i);
    
    const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'partly-cloudy', 'rain', 'thunderstorm', 'snow'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const high = Math.round(65 + Math.random() * 20);
    const low = Math.round(high - 5 - Math.random() * 15);
    
    return {
      date,
      condition,
      high,
      low,
      description: getDescriptionFromCondition(condition),
      precipitation: Math.floor(Math.random() * 100),
    };
  });
  
  const currentCondition = forecast[0].condition;
  
  return {
    location,
    country: 'United States',
    currentWeather: {
      location,
      temperature: forecast[0].high,
      feelsLike: forecast[0].high - 2,
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 30),
      condition: currentCondition,
      description: getDescriptionFromCondition(currentCondition),
      updatedAt: new Date(),
      high: forecast[0].high,
      low: forecast[0].low
    },
    forecast
  };
};

function getDescriptionFromCondition(condition: WeatherCondition): string {
  switch (condition) {
    case 'sunny':
      return 'Clear sky';
    case 'partly-cloudy':
      return 'Partly cloudy';
    case 'cloudy':
      return 'Cloudy';
    case 'rain':
      return 'Rain';
    case 'shower':
      return 'Showers';
    case 'thunderstorm':
      return 'Thunderstorm';
    case 'snow':
      return 'Snow';
    case 'foggy':
      return 'Foggy';
    case 'windy':
      return 'Windy';
    default:
      return 'Unknown';
  }
}

export const formatDay = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};
