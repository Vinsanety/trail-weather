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
        <div className="container mx-auto">
          <div className="columns-1 gap-4 lg:columns-2 grid lg:flex">
            <div className="stats border-2 rounded-2xl border-slate-100 my-2 lg:my-8 mx-auto w-5/6 lg:w-2/6 bg-base-200 shadow-lg">
              <div className="stat place-items-center mx-auto">
                <h2 className="stat-title flex mb-2 mx-auto justify-center items-center flex-wrap text-2xl">
                  {weatherData.location.name}, {weatherData.location.region}
                </h2>
                <p className="flex justify-evenly w-full">
                  {currentDay}, {currentMonth} {dayOfMonth}
                  <span>{currentTime}</span>
                </p>
                <p className="stat-value flex items-center mt-4 mx-auto justify-center">
                  {Math.round(weatherData.current.temp_f)}°F
                  <img alt="" src={weatherData.current.condition.icon} />
                </p>
                <p className="mx-auto">{weatherData.current.condition.text}</p>
                <p className="flex mx-auto">
                  <Wind />
                  {weatherData.current.wind_dir}
                  {Math.round(weatherData.current.wind_mph)} mph
                </p>
                <div className="stat-desc flex justify-between w-full mt-8">
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
            <div className="overflow-x-auto my-8 my-2 lg:my-8 mx-auto w-11/12 h-96">
              <table className="table table-lg table-zebra table-pin-rows">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Temp (°F)</th>
                    <th>Condition</th>
                    <th>Wind</th>
                  </tr>
                </thead>
                <tbody>
                  {weatherData?.forecast.forecastday[0].hour.map(
                    (hour: any) => (
                      <tr key={hour.time}>
                        <td>
                          {convertTo12HourFormat(hour.time.split(" ")[1])}
                        </td>
                        <td>{Math.round(hour.temp_f)}°</td>
                        <td>{hour.condition.text}</td>
                        <td>
                          {hour.wind_dir} {Math.round(hour.wind_mph)} mph
                        </td>
                      </tr>
                    )
                  )}
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
