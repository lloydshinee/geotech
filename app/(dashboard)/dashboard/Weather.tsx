"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { getForecastByCoords } from "@/lib/weather";
import {
  MapPin,
  Navigation,
  Droplets,
  Wind,
  Eye,
  Gauge,
  RefreshCw,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
} from "lucide-react";
import { UserLocation } from "@prisma/client";
import { getUserLocations } from "@/actions/locations.action";
import { AddLocationFAB } from "../locations/new/add-location";

interface WeatherData {
  city: {
    name: string;
    country: string;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    visibility: number;
    dt_txt: string;
  }>;
}

const getWeatherIcon = (weatherMain: string) => {
  switch (weatherMain.toLowerCase()) {
    case "clear":
      return <Sun className="w-6 h-6 text-yellow-500" />;
    case "clouds":
      return <Cloud className="w-6 h-6 text-gray-500" />;
    case "rain":
    case "drizzle":
      return <CloudRain className="w-6 h-6 text-blue-500" />;
    case "snow":
      return <Snowflake className="w-6 h-6 text-blue-200" />;
    default:
      return <Cloud className="w-6 h-6 text-gray-500" />;
  }
};

const WeatherCard = ({
  title,
  lat,
  lon,
  useGeolocation = false,
  icon,
}: {
  title: string;
  lat?: number;
  lon?: number;
  useGeolocation?: boolean;
  icon: React.ReactNode;
}) => {
  const [forecast, setForecast] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getForecastByCoords(latitude, longitude);
      setForecast(data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (useGeolocation) {
      getCurrentLocation();
    } else if (lat && lon) {
      fetchForecast(lat, lon);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      setLoading(false);
      // fallback to default Iligan City coordinates
      fetchForecast(8.1713, 124.2152);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchForecast(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log(error);
        setError("Could not get your location. Using default location.");
        // fallback to default Iligan City coordinates
        fetchForecast(8.1713, 124.2152);
      }
    );
  };

  useEffect(() => {
    if (useGeolocation) {
      getCurrentLocation();
    } else if (lat && lon) {
      fetchForecast(lat, lon);
    }
  }, [lat, lon, useGeolocation]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!forecast) return null;

  const currentWeather = forecast.list[0];
  const todayForecasts = forecast.list.slice(1, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>
            {forecast.city.name}, {forecast.city.country}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(currentWeather.weather[0].main)}
            <div>
              <div className="text-3xl font-bold">
                {Math.round(currentWeather.main.temp)}°C
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {currentWeather.weather[0].description}
              </p>
              <p className="text-xs text-muted-foreground">
                Feels like {Math.round(currentWeather.main.feels_like)}°C
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>H: {Math.round(currentWeather.main.temp_max)}°</p>
            <p>L: {Math.round(currentWeather.main.temp_min)}°</p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-muted-foreground">Humidity</span>
            <span className="ml-auto font-medium">
              {currentWeather.main.humidity}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">Wind</span>
            <span className="ml-auto font-medium">
              {currentWeather.wind.speed} m/s
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-purple-500" />
            <span className="text-muted-foreground">Pressure</span>
            <span className="ml-auto font-medium">
              {currentWeather.main.pressure} hPa
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-orange-500" />
            <span className="text-muted-foreground">Visibility</span>
            <span className="ml-auto font-medium">
              {(currentWeather.visibility / 1000).toFixed(1)} km
            </span>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">
            Next 12 Hours
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {todayForecasts.map((item, idx) => (
              <div
                key={idx}
                className="text-center p-3 rounded-lg border bg-muted/50"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(item.dt * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  })}
                </p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(item.weather[0].main)}
                </div>
                <p className="text-sm font-medium">
                  {Math.round(item.main.temp)}°C
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.main.humidity}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function WeatherDashboard({ userId }: { userId: number }) {
  const [locations, setLocations] = useState<UserLocation[]>([]);

  useEffect(() => {
    const fetchUserLocations = async () => {
      const data = await getUserLocations(userId);
      setLocations(data);
    };

    fetchUserLocations();
  }, [userId]);

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader title="Dashboard" />

      <div className="container mx-auto p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <WeatherCard
            title="My Location"
            useGeolocation
            icon={<Navigation className="w-5 h-5 text-primary" />}
          />

          <WeatherCard
            title="Tubod, Iligan City"
            lat={8.1713}
            lon={124.2152}
            icon={<MapPin className="w-5 h-5 text-primary" />}
          />
          {locations.map((loc) => (
            <WeatherCard
              key={loc.id}
              title={loc.name}
              lat={loc.latitude}
              lon={loc.longitude}
              icon={<MapPin className="w-5 h-5 text-primary" />}
            />
          ))}
        </div>

        <AddLocationFAB />
      </div>
    </main>
  );
}
