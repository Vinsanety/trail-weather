/* eslint-disable @next/next/no-img-element */
"use client";
import { ReactNode, useState } from "react";
// import { callAPI } from "../api/route";

interface WeatherData {
  [x: string]: any;
  location: {
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

  return (
    <>
      <div className="hero mt-8 pt-4">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Trail Weather</h1>
            <p className="py-3">
              Search a city to begin planning your next trail adventure!
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
        <div className="">
          <div className="card my-8 mx-auto w-5/6 lg:w-2/6 bg-base-200 shadow-lg">
            {/* <h2 className="py-4 mx-auto text-3xl">
              {weatherData.location.name}
            </h2> */}
            <figure className="pt-8">
              <img alt="" src={weatherData.current.condition.icon} />
            </figure>
            <p className="m-auto">{weatherData.current.condition.text}</p>
            <div className="flex card-body">
              <h2 className="card-title mx-auto mb-6 text-5xl">
                {weatherData.current.temp_f}°F
              </h2>
              <div className="flex justify-evenly mt-4">
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
        </div>
      )}
    </>
  );
}
