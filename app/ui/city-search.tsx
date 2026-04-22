/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CloudRain,
  Compass,
  Eye,
  LocateFixed,
  Moon,
  Search,
  Sun,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";

interface WeatherData {
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_f: number;
        mintemp_f: number;
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_f: number;
        avgtemp_c: number;
        condition: { text: string; icon: string };
        daily_chance_of_rain: number;
        daily_chance_of_snow: number;
        maxwind_mph: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moon_phase: string;
        moonrise: string;
        moonset: string;
      };
      hour: HourForecast[];
    }>;
  };
  location: {
    region: string;
    name: string;
  };
  current: {
    uv: number;
    gust_mph: number;
    feelslike_f: number;
    feelslike_c: number;
    humidity: number;
    wind_dir: string;
    wind_mph: number;
    condition: {
      icon: string | undefined;
      text: string;
    };
    temp_f: number;
    temp_c: number;
    pressure_in: number;
    vis_miles: number;
  };
}

interface HourForecast {
  time: string;
  temp_f: number;
  temp_c: number;
  chance_of_rain: number;
  wind_dir: string;
  wind_mph: number;
  condition: {
    icon: string;
  };
}

const API_KEY = `${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;
const RECENT_SEARCHES_KEY = "trail-weather-recent-searches";

export default function CitySearch() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unit, setUnit] = useState<"F" | "C">("F");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  // Ref for Current Conditions section
  const currentConditionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item) => typeof item === "string"));
      }
    } catch (error) {
      console.error("Failed to parse recent searches", error);
    }
  }, []);

  const getCitySearchWeather = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
          query,
        )}&days=3`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: WeatherData = await response.json();
      const resolvedLocation = [data.location.name, data.location.region]
        .filter(Boolean)
        .join(", ");
      const displayLocation = resolvedLocation || query;
      setWeatherData(data);
      setCity(displayLocation);
      setErrorMsg("");

      const updatedRecent = [
        displayLocation,
        ...recentSearches.filter((entry) => entry !== displayLocation),
      ].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedRecent));

      // Scroll to Current Conditions after data loads
      setTimeout(() => {
        currentConditionsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } catch (error) {
      console.error(error);
      setErrorMsg('Please try again with a valid "City, State", or Zip Code.');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherForCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        await getCitySearchWeather(`${coords.latitude},${coords.longitude}`);
      },
      () => setErrorMsg("Unable to retrieve your location right now."),
    );
  };

  // Current Day
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
  // Used to display in Current Conditions Card
  const date = new Date();
  const currentTime = date.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
  const currentDay = days[date.getDay()];
  const currentMonth = months[date.getMonth()];
  const dayOfMonth = date.getDate();

  // Convert 24h format to 12h
  const convertTo12HourFormat = (time24: string) => {
    const hours24 = parseInt(time24, 10);
    const hours12 = ((hours24 + 11) % 12) + 1;
    const suffix = hours24 >= 12 ? "pm" : "am";
    return `${hours12}:${time24.slice(-2)} ${suffix}`;
  };

  // Find current hour index
  const currentHourIndex = weatherData?.forecast.forecastday[0].hour.findIndex(
    (hour: HourForecast) => {
      const hourTime = new Date(hour.time);
      return hourTime.getHours() === date.getHours();
    },
  );

  // Format Date: 2024-01-01 format and converts to Jan 1 (used in 3 Day Forecast Table)
  function formatForecastDayDate(inputDate: string) {
    const [year, month, day] = inputDate.split("-");
    const monthAbbreviation = months[parseInt(month) - 1];
    const formattedDate = `${monthAbbreviation} ${parseInt(day)}`;
    return formattedDate;
  }

  const trailReadiness = useMemo(() => {
    if (!weatherData) return null;

    const rain = weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
    const wind = weatherData.current.wind_mph;
    const uv = weatherData.current.uv;
    const temperature =
      unit === "F" ? weatherData.current.temp_f : weatherData.current.temp_c;

    let score = 100 - rain * 0.6 - wind * 1.5 - uv * 2;
    if (temperature < (unit === "F" ? 40 : 4)) score -= 12;
    if (temperature > (unit === "F" ? 90 : 32)) score -= 15;
    score = Math.max(0, Math.min(100, Math.round(score)));

    const label = score >= 75 ? "Great" : score >= 55 ? "Fair" : "Poor";
    return { score, label };
  }, [weatherData, unit]);

  const riskCards = useMemo(() => {
    if (!weatherData) return [];

    const rainChance =
      weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
    const windSpeed = Math.round(weatherData.current.wind_mph);
    const uv = weatherData.current.uv;
    const visibility = weatherData.current.vis_miles;

    const getLevel = (value: number, safe: number, fairMax: number) => {
      if (value <= safe) return "Safe";
      if (value <= fairMax) return "Fair";
      return "Poor";
    };

    return [
      {
        title: "Footing Risk",
        value: `${rainChance}%`,
        detail: "Chance of wet or slick trail sections",
        level: getLevel(rainChance, 30, 60),
        icon: <CloudRain className="h-5 w-5" />,
      },
      {
        title: "Wind Exposure",
        value: `${windSpeed} mph`,
        detail: `Wind from ${weatherData.current.wind_dir}`,
        level: getLevel(windSpeed, 12, 20),
        icon: <Wind className="h-5 w-5" />,
      },
      {
        title: "Heat/UV Load",
        value: `${uv} / 11`,
        detail: "Sun stress during your run window",
        level: getLevel(uv, 3, 6),
        icon: <Sun className="h-5 w-5" />,
      },
      {
        title: "Visibility",
        value: `${visibility} mi`,
        detail: "Distance clarity",
        level: visibility >= 8 ? "Safe" : visibility >= 4 ? "Fair" : "Poor",
        icon: <Eye className="h-5 w-5" />,
      },
    ];
  }, [weatherData]);

  const nextHours = useMemo(() => {
    if (!weatherData || currentHourIndex === undefined || currentHourIndex < 0)
      return [];

    const todayHours = weatherData.forecast.forecastday[0].hour.slice(
      currentHourIndex,
      currentHourIndex + 8,
    );
    if (todayHours.length >= 8) return todayHours;

    const needed = 8 - todayHours.length;
    return [
      ...todayHours,
      ...weatherData.forecast.forecastday[1].hour.slice(0, needed),
    ];
  }, [weatherData, currentHourIndex]);

  const bestRunWindowIndex = useMemo(() => {
    if (!nextHours.length) return -1;
    let bestIndex = 0;
    let bestScore = Number.POSITIVE_INFINITY;

    nextHours.forEach((hour, index) => {
      const score = hour.chance_of_rain * 1.6 + hour.wind_mph * 1.1;
      if (score < bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    return bestIndex;
  }, [nextHours]);

  const displayTemp = (f: number, c: number) =>
    `${Math.round(unit === "F" ? f : c)}°${unit}`;

  const levelClasses: Record<string, string> = {
    Safe: "tw-status-safe",
    Fair: "tw-status-fair",
    Poor: "tw-status-caution",
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-2 pb-16 pt-2 sm:px-4 md:pb-20 md:pt-4">
      {/* Hero Section */}
      {!weatherData && (
        <div className="tw-dashboard-shell p-6 md:p-8">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="text-center lg:text-left">
              <p className="tw-eyebrow">Forecast Dashboard</p>
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Trail Weather
              </h1>
              <p className="mt-2 max-w-2xl text-lg text-base-content/85">
                Plan your next trail run with quick-glance weather, footing risk
                signals, and time-based condition changes.
              </p>
            </div>
            <div className="tw-card-shell w-full p-4">
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  getCitySearchWeather(city);
                  setErrorMsg("");
                }}
              >
                <div className="form-control gap-2">
                  <label
                    htmlFor="city-search-input"
                    className="tw-eyebrow !mb-0"
                  >
                    City, State or Zip Code
                  </label>
                  <input
                    id="city-search-input"
                    className="tw-input-outlined"
                    type="text"
                    placeholder="i.e. Boulder, CO"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "i.e. Boulder, CO")}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <button
                    className="tw-btn-min tw-btn-min-primary w-full sm:w-auto sm:flex-1"
                    type="submit"
                    disabled={isLoading}
                  >
                    <Search className="h-4 w-4" />
                    {isLoading ? "Loading..." : "Get Forecast"}
                  </button>
                  <button
                    className="tw-btn-min w-full sm:w-auto"
                    type="button"
                    onClick={getWeatherForCurrentLocation}
                  >
                    <LocateFixed className="h-4 w-4" />
                    Near Me
                  </button>
                </div>
              </form>
              <div className="tw-recents-row">
                <span className="tw-recents-label mr-1">Recent:</span>
                {recentSearches.length ? (
                  recentSearches.map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => getCitySearchWeather(entry)}
                      className="tw-recent-pill"
                    >
                      {entry}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-base-content/60">
                    No recent searches yet.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div
          role="alert"
          className="alert alert-warning my-6 mx-auto max-w-3xl whitespace-pre-line"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="pb-4 sm:pb-0">{errorMsg}</span>
        </div>
      )}

      {/* Weather Data */}
      {weatherData && !errorMsg && trailReadiness && (
        <div className="tw-page-grid mt-6">
          <section className="tw-content-band">
            <form
              className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end md:gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                getCitySearchWeather(city);
                setErrorMsg("");
              }}
            >
              <div className="form-control min-w-0 flex-1 gap-2">
                <label
                  htmlFor="city-search-input-inline"
                  className="tw-eyebrow !mb-0"
                >
                  City, State or Zip Code
                </label>
                <input
                  id="city-search-input-inline"
                  className="tw-input-outlined"
                  type="text"
                  placeholder="i.e. Boulder, CO"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "i.e. Boulder, CO")}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="flex w-full flex-col gap-2 md:w-auto md:shrink-0 md:flex-row md:flex-wrap">
                <button
                  className="tw-btn-min tw-btn-min-primary w-full md:w-auto md:min-w-[10rem]"
                  type="submit"
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4" />
                  {isLoading ? "Loading..." : "Get Forecast"}
                </button>
                <button
                  className="tw-btn-min w-full md:w-auto"
                  type="button"
                  onClick={getWeatherForCurrentLocation}
                >
                  <LocateFixed className="h-4 w-4" />
                  Near Me
                </button>
              </div>
            </form>
            <div className="tw-recents-row mt-3">
              <span className="tw-recents-label">Recent:</span>
              {recentSearches.length ? (
                recentSearches.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => getCitySearchWeather(entry)}
                    className="tw-recent-pill"
                  >
                    {entry}
                  </button>
                ))
              ) : (
                <span className="text-sm text-base-content/60">
                  No recent searches yet.
                </span>
              )}
            </div>
          </section>

          <section
            className="tw-hero-shell scroll-mt-8"
            ref={currentConditionsRef}
          >
            <div className="mb-5 flex flex-wrap items-center justify-end">
              <div
                className="tw-unit-toggle-group"
                role="group"
                aria-label="Temperature unit"
              >
                <button
                  type="button"
                  className={`tw-unit-toggle ${unit === "F" ? "tw-unit-toggle--active" : ""}`}
                  onClick={() => setUnit("F")}
                >
                  °F
                </button>
                <button
                  type="button"
                  className={`tw-unit-toggle ${unit === "C" ? "tw-unit-toggle--active" : ""}`}
                  onClick={() => setUnit("C")}
                >
                  °C
                </button>
              </div>
            </div>
            <div className="tw-hero-grid">
              <div>
                <p className="tw-section-kicker">Current Conditions</p>
                <h2 className="tw-hero-location">
                  {weatherData.location.name}, {weatherData.location.region}
                </h2>
                <p className="mt-2 text-base text-base-content/70">
                  {currentDay}, {currentMonth} {dayOfMonth} - {currentTime}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <p className="tw-value-primary">
                    {displayTemp(
                      weatherData.current.temp_f,
                      weatherData.current.temp_c,
                    )}
                  </p>
                  <img
                    alt="Weather condition"
                    aria-hidden="true"
                    src={weatherData.current.condition.icon}
                    className="h-16 w-16 md:h-20 md:w-20"
                  />
                </div>
                <p className="mt-2 text-xl font-semibold">
                  {weatherData.current.condition.text}
                </p>
              </div>
            </div>
          </section>

          <section className="tw-section-shell">
            <div className="tw-tier-supporting">
              <div className="tw-card-shell tw-card-primary p-4 md:p-6">
                <p className="tw-section-kicker">Trail Readiness</p>
                <div className="tw-readiness-row mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 md:items-start">
                  <div
                    className="tw-readiness-gauge-panel flex w-full flex-col items-stretch gap-5 py-2"
                    aria-label={`Run readiness ${trailReadiness.score} out of 100, ${trailReadiness.label}`}
                  >
                    <div className="tw-readiness-spectrum w-full space-y-4">
                      <div className="text-left">
                        <p className="text-4xl font-bold tabular-nums leading-none tracking-tight md:text-5xl">
                          {trailReadiness.score}
                          <span className="text-xl font-semibold text-base-content/45 md:text-2xl">
                            /100
                          </span>
                        </p>
                        <span
                          className={`mt-3 inline-flex tw-chip-min text-sm font-semibold md:text-base ${levelClasses[trailReadiness.label] || "tw-status-safe"}`}
                        >
                          {trailReadiness.label}
                        </span>
                      </div>

                      <div>
                        <p className="mb-2 text-left text-xs font-medium text-base-content/55">
                          Where your score falls (0–55 poor · 55–75 fair · 75+
                          great)
                        </p>
                        <div className="relative px-0.5 pt-1">
                          <div className="flex h-3.5 overflow-hidden rounded-full ring-1 ring-base-content/15">
                            <div
                              className="min-w-0 flex-[55] bg-error/35"
                              title="Poor zone: 0–55"
                            />
                            <div
                              className="min-w-0 flex-[20] bg-warning/35"
                              title="Fair zone: 55–75"
                            />
                            <div
                              className="min-w-0 flex-[25] bg-success/35"
                              title="Great zone: 75–100"
                            />
                          </div>
                          <div
                            className={`tw-readiness-spectrum-marker ${
                              trailReadiness.label === "Great"
                                ? "tw-readiness-spectrum-marker--great"
                                : trailReadiness.label === "Fair"
                                  ? "tw-readiness-spectrum-marker--fair"
                                  : "tw-readiness-spectrum-marker--poor"
                            }`}
                            style={{
                              left: `${Math.min(100, Math.max(0, trailReadiness.score))}%`,
                            }}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-2 grid grid-cols-[55fr_20fr_25fr] gap-0.5 text-center text-[10px] font-bold uppercase leading-tight tracking-wide">
                          <span className="text-error">Poor</span>
                          <span className="text-warning">Fair</span>
                          <span className="text-success">Great</span>
                        </div>
                        <div className="mt-1 flex justify-between px-0.5 font-mono text-[10px] tabular-nums text-base-content/45">
                          <span>0</span>
                          <span>55</span>
                          <span>75</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                    <p className="max-w-md text-left text-xs text-base-content/55">
                      One number from rain, wind, UV, and temperature
                      comfort—higher is generally better for easy trail miles.
                    </p>
                  </div>

                  <div className="min-w-0 md:border-l md:border-base-content/10 md:pl-10">
                    <div className="tw-flat-list gap-0">
                      {riskCards.map((card) => (
                        <div
                          key={card.title}
                          className="tw-flat-row flex flex-col gap-2 border-b border-base-content/10 py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                        >
                          <div className="flex min-w-0 items-start gap-2.5">
                            <span className="mt-0.5 text-base-content/80">
                              {card.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold leading-snug">
                                {card.title}
                              </p>
                              <p className="mt-0.5 text-xs text-base-content/65">
                                {card.detail}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end sm:text-right">
                            <span
                              className={`tw-chip-min ${levelClasses[card.level] || "tw-status-safe"}`}
                            >
                              {card.level}
                            </span>
                            <p className="text-sm font-semibold tabular-nums">
                              {card.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="tw-card-shell tw-card-secondary mt-4 p-4 md:p-5 md:mt-5">
                <p className="tw-section-kicker">Run Window (Next 8 Hours)</p>
                <div className="tw-run-window-table mt-3">
                  <div
                    className="tw-run-window-header grid grid-cols-[0.8fr_1fr_0.8fr_0.8fr] items-center gap-2 px-1"
                    role="row"
                  >
                    <span className="tw-run-window-th" role="columnheader">
                      Time
                    </span>
                    <span className="tw-run-window-th" role="columnheader">
                      Temp
                    </span>
                    <span className="tw-run-window-th" role="columnheader">
                      Rain
                    </span>
                    <span className="tw-run-window-th" role="columnheader">
                      Wind
                    </span>
                  </div>
                  <div
                    className="tw-flat-list tw-run-window-body"
                    role="rowgroup"
                  >
                    {nextHours.map((hour, index) => (
                      <div
                        key={hour.time}
                        role="row"
                        className={`tw-flat-row grid grid-cols-[0.8fr_1fr_0.8fr_0.8fr] items-center gap-2 text-base ${
                          index === bestRunWindowIndex ? "tw-highlight-row" : ""
                        }`}
                      >
                        <span className="font-medium">
                          {index === 0
                            ? "Now"
                            : convertTo12HourFormat(hour.time.split(" ")[1])}
                        </span>
                        <span className="flex items-center gap-1">
                          {displayTemp(hour.temp_f, hour.temp_c)}
                          <img
                            className="inline h-8 w-8"
                            alt="Weather condition"
                            aria-hidden="true"
                            src={hour.condition.icon}
                          />
                        </span>
                        <span className="text-base-content/80">
                          {hour.chance_of_rain}%
                        </span>
                        <span className="text-base-content/80">
                          {hour.wind_dir} {Math.round(hour.wind_mph)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-base-content/65">
                  Highlight shows the lowest rain + wind combination in this
                  window.
                </p>
              </div>

              <div className="tw-card-shell tw-card-secondary tw-quick-summary mt-4 p-5 md:mt-5 md:p-6">
                <p className="tw-section-kicker">Today&apos;s Summary</p>
                <div className="tw-quick-summary-body">
                  <div className="tw-quick-summary-block">
                    <p className="tw-quick-summary-label">At a glance</p>
                    <div className="tw-quick-summary-grid">
                      <div className="tw-metric-chip tw-quick-summary-metric">
                        <span>Feels Like</span>
                        <strong>
                          {displayTemp(
                            weatherData.current.feelslike_f,
                            weatherData.current.feelslike_c,
                          )}
                        </strong>
                      </div>
                      <div className="tw-metric-chip tw-quick-summary-metric">
                        <span>Wind</span>
                        <strong>
                          {weatherData.current.wind_dir}{" "}
                          {Math.round(weatherData.current.wind_mph)} mph
                        </strong>
                      </div>
                      <div className="tw-metric-chip tw-quick-summary-metric">
                        <span>Humidity</span>
                        <strong>{weatherData.current.humidity}%</strong>
                      </div>
                      <div className="tw-metric-chip tw-quick-summary-metric">
                        <span>High / Low</span>
                        <strong>
                          {displayTemp(
                            weatherData.forecast.forecastday[0].day.maxtemp_f,
                            weatherData.forecast.forecastday[0].day.maxtemp_c,
                          )}{" "}
                          /{" "}
                          {displayTemp(
                            weatherData.forecast.forecastday[0].day.mintemp_f,
                            weatherData.forecast.forecastday[0].day.mintemp_c,
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="tw-quick-summary-block">
                    <p className="tw-quick-summary-label">Air and visibility</p>
                    <div className="tw-quick-summary-grid tw-quick-summary-grid--pair">
                      <div className="tw-metric-chip tw-quick-summary-metric">
                        <span>Pressure</span>
                        <strong>{weatherData.current.pressure_in} in</strong>
                      </div>
                      <div className="tw-metric-chip tw-quick-summary-metric">
                        <span>Visibility</span>
                        <strong>{weatherData.current.vis_miles} mi</strong>
                      </div>
                    </div>
                  </div>
                  <div className="tw-quick-summary-block">
                    <p className="tw-quick-summary-label">Sun and moon</p>
                    <div className="tw-quick-summary-grid tw-quick-summary-grid--sky">
                      <div className="tw-metric-chip tw-quick-summary-metric">
                        <span className="inline-flex items-center gap-1">
                          <Sunrise className="h-3.5 w-3.5 shrink-0" /> Sunrise
                        </span>
                        <strong className="font-semibold">
                          {weatherData.forecast.forecastday[0].astro.sunrise}
                        </strong>
                      </div>
                      <div className="tw-metric-chip tw-quick-summary-metric">
                        <span className="inline-flex items-center gap-1">
                          <Sunset className="h-3.5 w-3.5 shrink-0" /> Sunset
                        </span>
                        <strong className="font-semibold">
                          {weatherData.forecast.forecastday[0].astro.sunset}
                        </strong>
                      </div>
                      <div className="tw-metric-chip tw-quick-summary-metric">
                        <span className="inline-flex items-center gap-1">
                          <Moon className="h-3.5 w-3.5 shrink-0" /> Moonrise
                        </span>
                        <strong className="font-semibold">
                          {weatherData.forecast.forecastday[0].astro.moonrise}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="tw-section-shell tw-section-day-outlook">
            <p className="tw-section-kicker">3 Day outlook</p>
            <div className="tw-forecast-grid">
              {weatherData.forecast.forecastday.map((forecastday, index) => (
                <div
                  key={forecastday.date}
                  className={`tw-forecast-day ${
                    index === 0 ? "tw-forecast-today" : ""
                  }`}
                >
                  <div className="tw-forecast-day-header">
                    <p className="inline-flex items-center gap-2 text-lg font-semibold">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      {index === 0
                        ? "Today"
                        : formatForecastDayDate(forecastday.date)}
                    </p>
                  </div>
                  <div className="tw-forecast-day-condition">
                    <p className="inline-flex min-w-0 items-center gap-2 text-base leading-snug">
                      {forecastday.day.condition.text}
                      <img
                        className="h-12 w-12 shrink-0"
                        alt=""
                        aria-hidden="true"
                        src={forecastday.day.condition.icon}
                      />
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-base-content/75">
                      <Compass className="h-4 w-4 shrink-0" />
                      {Math.round(forecastday.day.maxwind_mph)} mph
                    </span>
                  </div>
                  <div className="tw-forecast-day-stats">
                    <div className="tw-forecast-stat">
                      <span className="tw-forecast-stat-label">High</span>
                      <span className="tw-forecast-stat-value">
                        {displayTemp(
                          forecastday.day.maxtemp_f,
                          forecastday.day.maxtemp_c,
                        )}
                      </span>
                    </div>
                    <div className="tw-forecast-stat">
                      <span className="tw-forecast-stat-label">Low</span>
                      <span className="tw-forecast-stat-value">
                        {displayTemp(
                          forecastday.day.mintemp_f,
                          forecastday.day.mintemp_c,
                        )}
                      </span>
                    </div>
                    <div className="tw-forecast-stat">
                      <span className="tw-forecast-stat-label">Rain</span>
                      <span className="tw-forecast-stat-value">
                        {forecastday.day.daily_chance_of_rain}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
