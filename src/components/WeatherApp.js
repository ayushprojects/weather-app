import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState("metric"); // Default to Celsius
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const recentSearchesData =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(recentSearchesData);
  }, []);

  const searchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=519b1d2780b84223df220c7bc77f0f85`
      );
      setWeatherData(response.data);
      updateRecentSearches(city);
      setError("");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 404) {
          setError("City not found");
        } else {
          setError("API error");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server");
      } else {
        // Something else happened while setting up the request
        setError("Request setup error");
      }

      setWeatherData(null);
    }
  };

  const updateRecentSearches = (cityName) => {
    const updatedSearches = [
      cityName,
      ...recentSearches.filter((item) => item !== cityName).slice(0, 4),
    ];
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    if (weatherData) {
      searchWeather();
    }
  };

  return (
    <div className="container">
      <h1 className="mt-3">Weather App</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                onClick={searchWeather}>
                Search
              </button>
            </div>
          </div>
          <div className="mt-3">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                value="metric"
                checked={unit === "metric"}
                onChange={() => handleUnitChange("metric")}
              />
              <label className="form-check-label">Celsius</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                value="imperial"
                checked={unit === "imperial"}
                onChange={() => handleUnitChange("imperial")}
              />
              <label className="form-check-label">Fahrenheit</label>
            </div>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {weatherData && (
            <div className="mt-3">
              <h2>{weatherData.name}</h2>
              <p>
                Temperature: {weatherData.main.temp}{" "}
                {unit === "metric" ? "°C" : "°F"}
              </p>
              <p>Weather: {weatherData.weather[0].main}</p>
              <p>
                Wind Speed: {weatherData.wind.speed}{" "}
                {unit === "metric" ? "m/s" : "mph"}
              </p>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <div className="mt-3">
            <h3>Recent Searches:</h3>
            <ul className="list-group">
              {recentSearches.map((search, index) => (
                <li
                  key={index}
                  className="list-group-item"
                  onClick={() => setCity(search)}>
                  {search}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
