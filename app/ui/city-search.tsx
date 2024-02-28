/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Moon, Sunrise, Sunset } from "lucide-react";

interface WeatherData {
  forecast: any;
  location: {
    region: string;
    name: string;
  };
  current: {
    uv: ReactNode;
    gust_mph: ReactNode;
    feelslike_f: ReactNode;
    humidity: ReactNode;
    wind_dir: string;
    wind_mph: number;
    condition: {
      icon: string | undefined;
      text: string;
    };
    temp_f: number;
  };
}

const API_KEY = `${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;

export default function CitySearch() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const getCitySearchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: WeatherData = await response.json();
      setWeatherData(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const currentTime = new Date()
    .toLocaleTimeString()
    .replace(/(.*)\D\d+/, "$1");

  return (
    <>
      <div className="hero mt-8 pt-4">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Trail Weather</h1>
            <p className="py-3">
              Search a city or zip code to begin planning your next trail
              adventure!
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">City Search</span>
                </label>
                <input
                  className="input input-bordered"
                  type="text"
                  placeholder="Boulder, CO"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    getCitySearchWeather();
                  }}
                >
                  Send it
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {weatherData && (
        // <div className="grid grid-flow-row auto-rows-max">
        <div className="container mx-auto">
          <div className="columns-1 gap-4 lg:columns-2 grid lg:flex">
            <div className="stats my-2 lg:my-8 mx-auto w-5/6 lg:w-2/6 bg-base-200 shadow-lg">
              <div className="stat place-items-center mx-auto">
                <h2 className="stat-title flex mb-2 mx-auto justify-center items-center flex-wrap text-2xl">
                  {weatherData.location.name}, {weatherData.location.region}{" "}
                  <img alt="" src={weatherData.current.condition.icon} />
                </h2>
                <p className="stat-value mx-auto justify-center">
                  {weatherData.current.temp_f}°F
                </p>
                <p className="mx-auto">{weatherData.current.condition.text}</p>
                <div className="stat-desc flex justify-between w-full mt-8">
                  <p>
                    <b>High:</b>{" "}
                    {weatherData.forecast.forecastday[0].day.maxtemp_f}°F
                  </p>
                  <p className="text-right">
                    <b>Low:</b>{" "}
                    {weatherData.forecast.forecastday[0].day.mintemp_f}°F
                  </p>
                </div>
              </div>
            </div>
            <div className="stats mb-6 lg:my-8 mx-auto w-5/6 lg:w-4/6 bg-base-200 shadow-lg">
              <div className="stat flex justify-evenly flex-wrap">
                <div className="stat-desc flex flex-col gap-2 mb-6">
                  <h3 className="text-xl flex justify-center mb-2">Current</h3>
                  <p>
                    <b>Feels Like:</b> {weatherData.current.feelslike_f}°F
                  </p>
                  <p>
                    <b>Wind:</b> {weatherData.current.wind_mph}mph
                  </p>
                  <p>
                    <b>Wind Direction:</b> {weatherData.current.wind_dir}
                  </p>
                  <p>
                    <b>Wind Gust:</b> {weatherData.current.gust_mph}mph
                  </p>
                  <p>
                    <b>Humidity:</b> {weatherData.current.humidity}%
                  </p>
                  <p>
                    <b>UV Index:</b> {weatherData.current.uv}
                  </p>
                </div>
                <div className="stat-desc flex flex-col gap-2">
                  <h3 className="text-xl flex justify-center mb-2">Day</h3>
                  <p>
                    <b>Max Wind:</b>{" "}
                    {weatherData.forecast.forecastday[0].day.maxwind_mph}mph
                  </p>
                  <p>
                    <b>Chance of Rain:</b>{" "}
                    {
                      weatherData.forecast.forecastday[0].day
                        .daily_chance_of_rain
                    }
                    %
                  </p>
                  <p>
                    <b>Total Precipitation:</b>{" "}
                    {weatherData.forecast.forecastday[0].day.totalprecip_in}
                    in
                  </p>
                  <p>
                    <b>Chance of Snow:</b>{" "}
                    {
                      weatherData.forecast.forecastday[0].day
                        .daily_chance_of_snow
                    }
                    %
                  </p>
                  <p>
                    <b>Total Snow (cm):</b>{" "}
                    {weatherData.forecast.forecastday[0].day.totalsnow_cm}cm
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="stats flex flex-col lg:flex-row mb-8 mx-auto shadow-lg bg-base-200">
            <div className="stat pb-0 lg:pb-4">
              <div className="stat-figure text-secondary">
                <Sunrise />
              </div>
              <div className="stat-title">Sunrise</div>
              <div className="stat-value text-lg">
                {weatherData.forecast.forecastday[0].astro.sunrise}
              </div>
            </div>
            <div className="stat pb-0 lg:pb-4">
              <div className="stat-figure text-secondary">
                <Sunset />
              </div>
              <div className="stat-title">Sunset</div>
              <div className="stat-value text-lg">
                {weatherData.forecast.forecastday[0].astro.sunset}
              </div>
            </div>
            <div className="stat pb-2 lg:pb-4">
              <div className="stat-figure text-secondary">
                <Moon />
              </div>
              <div className="stat-title">Moon Phase</div>
              <div className="stat-value text-lg">
                {weatherData.forecast.forecastday[0].astro.moon_phase}
              </div>
              <div className="flex justify-between w-full">
                <div className="stat-desc">
                  Moonrise: {weatherData.forecast.forecastday[0].astro.moonrise}
                </div>
                <div className="stat-desc">
                  Moonset: {weatherData.forecast.forecastday[0].astro.moonset}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
