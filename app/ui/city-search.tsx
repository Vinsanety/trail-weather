/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import {
  CloudRain,
  Droplets,
  Moon,
  Snowflake,
  Sun,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";

interface WeatherData {
  forecast: any;
  location: {
    region: string;
    name: string;
  };
  current: {
    uv: number;
    gust_mph: number;
    feelslike_f: number;
    humidity: number;
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
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=2`
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

  const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date();
  const currentTime = date.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
  const currentMonth = months[date.getMonth()];
  const currentDay = days[date.getDay()];
  const dayOfMonth = date.getDate();

  const convertTo12HourFormat = (time24: string) => {
    const hours24 = parseInt(time24, 10);
    const hours12 = ((hours24 + 11) % 12) + 1;
    const suffix = hours24 >= 12 ? "pm" : "am";
    return `${hours12}:${time24.slice(-2)} ${suffix}`;
  };

  const currentHourIndex = weatherData?.forecast.forecastday[0].hour.findIndex(
    (hour: any) => {
      const hourTime = new Date(hour.time);
      return hourTime.getHours() === date.getHours();
    }
  );

  return (
    <>
      <div className="hero mt-8 pt-4">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Trail Weather</h1>
            <p className="py-3">
              Search for a City, State or Zip Code to begin planning your next
              trail adventure!
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-xl bg-base-100 border-2 rounded-2xl border-slate-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">City Search</span>
                </label>
                <input
                  className="input input-bordered"
                  type="text"
                  placeholder="City, State"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "City, State")}
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
        <div className="container mb-16 mx-auto">
          <hr className="my-6 mx-auto w-11/12 border-neutral" />
          <h2 className="flex my-4 justify-center md:justify-start items-center flex-wrap text-4xl">
            {weatherData.location.name}, {weatherData.location.region}
          </h2>
          <div className="columns-1 gap-4 lg:columns-2 grid lg:flex">
            <div className="card mx-auto border-2 rounded-2xl border-slate-100 mb-2 lg:mb-8 w-5/6 lg:w-2/6 bg-base-200 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between flex-wrap gap-x-4">
                  <p className="text-xl grow-0">
                    {currentDay}, {currentMonth} {dayOfMonth}
                  </p>
                  <p className="text-xl grow-0">{currentTime}</p>
                </div>
                <p className="flex items-center justify-center mt-8 text-6xl font-bold">
                  {Math.round(weatherData.current.temp_f)}°F
                  <img
                    alt="Weather condition"
                    aria-hidden="true"
                    src={weatherData.current.condition.icon}
                  />
                </p>
                <div className="mx-auto text-center">
                  <p className="grow-0 text-lg">
                    {weatherData.current.condition.text}
                  </p>
                  <p className="inline-flex grow-0 text-lg">
                    <Wind /> {weatherData.current.wind_dir}{" "}
                    {Math.round(weatherData.current.wind_mph)} mph
                  </p>
                </div>
                <div className="flex justify-between w-full mt-16">
                  <p>
                    <b>High:</b>{" "}
                    <span className="text-base-content">
                      {weatherData.forecast.forecastday[0].day.maxtemp_f}°F
                    </span>
                  </p>
                  <p className="text-right">
                    <b>Low:</b>{" "}
                    <span className="text-base-content">
                      {weatherData.forecast.forecastday[0].day.mintemp_f}°F
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="card overflow-x-auto mb-2 lg:mb-8 mx-auto w-11/12 h-96 border-2 rounded-2xl border-slate-100 shadow-lg">
              <table className="table table-sm md:table-lg table-zebra table-pin-rows">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Temp (°F)</th>
                    <th>Rain (%)</th>
                    <th className="hidden sm:table-cell">Wind</th>
                  </tr>
                </thead>
                <tbody>
                  {weatherData?.forecast.forecastday[0].hour
                    .slice(currentHourIndex, currentHourIndex + 23)
                    .map((hour: any, index: number) => (
                      <tr key={hour.time}>
                        <td>
                          {index === 0
                            ? "Now"
                            : convertTo12HourFormat(hour.time.split(" ")[1])}
                        </td>
                        <td>
                          {Math.round(hour.temp_f)}°{" "}
                          <img
                            className="inline h-10 w-10"
                            alt="Weather condition"
                            aria-hidden="true"
                            src={hour.condition.icon}
                          />
                        </td>
                        <td>{hour.chance_of_rain}%</td>
                        <td className="hidden sm:table-cell">
                          {hour.wind_dir} {Math.round(hour.wind_mph)} mph
                        </td>
                      </tr>
                    ))}
                  <td className="font-bold">Tomorrow</td>
                  {weatherData?.forecast.forecastday[1].hour
                    .slice(0, currentHourIndex)
                    .map((hour: any) => (
                      <tr key={hour.time}>
                        <td>
                          {convertTo12HourFormat(hour.time.split(" ")[1])}
                        </td>
                        <td>
                          {Math.round(hour.temp_f)}°{" "}
                          <img
                            className="inline h-10 w-10"
                            alt="Weather condition"
                            aria-hidden="true"
                            src={hour.condition.icon}
                          />
                        </td>
                        <td>{hour.chance_of_rain}%</td>
                        <td className="hidden sm:table-cell">
                          {hour.wind_dir} {Math.round(hour.wind_mph)} mph
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="stats border-2 rounded-2xl border-slate-100 flex flex-col lg:flex-row mt-4 lg:mt-0 mb-8 mx-auto w-11/12 lg:w-full shadow-lg bg-base-200">
            <div className="stat pb-0 lg:pb-4">
              <div className="stat-title">Sunrise</div>
              <div className="stat-value text-lg flex mb-2">
                {weatherData.forecast.forecastday[0].astro.sunrise}
                <Sunrise className="ml-4 stroke-secondary" />
              </div>
              <div className="stat-title">Sunset</div>
              <div className="stat-value text-lg flex">
                {weatherData.forecast.forecastday[0].astro.sunset}
                <Sunset className="ml-4 stroke-secondary" />
              </div>
            </div>
            <div className="stat pb-0 lg:pb-4">
              <div className="stat-title">Humidity</div>
              <div className="stat-value text-lg flex mb-2">
                {weatherData.current.humidity}%
                <Droplets className="ml-4 stroke-secondary" />
              </div>
              <div className="stat-title">UV Index</div>
              <div className="stat-value text-lg flex">
                {weatherData.current.uv} of 11
                <Sun className="ml-4 stroke-secondary" />
              </div>
            </div>
            <div className="stat pb-0 lg:pb-4">
              <div className="stat-title">Chance of rain</div>
              <div className="stat-value text-lg flex mb-2">
                {weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%
                <CloudRain className="ml-4 stroke-secondary" />
              </div>
              <div className="stat-title">Chance of snow</div>
              <div className="stat-value text-lg flex">
                {weatherData.forecast.forecastday[0].day.daily_chance_of_snow}%
                <Snowflake className="ml-4 stroke-secondary" />
              </div>
            </div>
            <div className="stat pb-2 lg:pb-4">
              <div className="stat-title">Moon Phase</div>
              <div className="stat-value text-lg flex mb-2">
                {weatherData.forecast.forecastday[0].astro.moon_phase}
                <Moon className="ml-4 stroke-secondary" />
              </div>
              <div className="flex justify-between flex-wrap w-full">
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
