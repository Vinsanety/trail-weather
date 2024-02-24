/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

interface WeatherData {
  [x: string]: any;
  location: {
    region: string;
    name: string;
  };
  current: {
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
        <div className="grid grid-flow-row auto-rows-max">
          <div className="stats my-8 mx-auto bg-base-200 shadow-xl">
            <div className="stat place-items-center mx-auto">
              <h2 className="stat-title flex mb-2 mx-auto justify-center items-center flex-wrap text-2xl">
                {weatherData.location.name}, {weatherData.location.region}{" "}
                <img alt="" src={weatherData.current.condition.icon} />
              </h2>
              <p className="stat-value mx-auto justify-center">
                {weatherData.current.temp_f}°F
              </p>
              <p className="mx-auto">{weatherData.current.condition.text}</p>
              <div className="stat-desc flex justify-between mt-8">
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
          <div className="stats flex flex-col lg:flex-row mb-8 mx-auto shadow-xl bg-base-200">
            <div className="stat pb-0 lg:pb-4">
              <div className="stat-figure text-secondary"></div>
              <div className="stat-title">Sunrise</div>
              <div className="stat-value text-lg">
                {weatherData.forecast.forecastday[0].astro.sunrise}
              </div>
            </div>
            <div className="stat pb-0 lg:pb-4">
              <div className="stat-figure text-secondary"></div>
              <div className="stat-title">Sunset</div>
              <div className="stat-value text-lg">
                {weatherData.forecast.forecastday[0].astro.sunset}
              </div>
            </div>
            <div className="stat pb-2 lg:pb-4">
              <div className="stat-figure text-secondary"></div>
              <div className="stat-title">Moon Phase</div>
              <div className="stat-value text-lg">
                {weatherData.forecast.forecastday[0].astro.moon_phase}
              </div>
              <div className="flex justify-between">
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
