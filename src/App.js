import "./styles.css";
import { Search, MapPin, Wind } from "react-feather";
import getWeather from "./api/api";
import { useState, useEffect } from "react";
import dateFormat from "dateformat";
import DarkMode from "./components/DarkMode/DarkMode";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(() => {
    const savedWeather = localStorage.getItem("weatherData");
    return savedWeather ? JSON.parse(savedWeather) : {};
  });

  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

  useEffect(() => {
    localStorage.setItem("weatherData", JSON.stringify(weather));
  }, [weather]);

  const getWeatherbyCity = async () => {
    const weatherData = await getWeather(city);
    setWeather(weatherData);
    setCity("");
  };

  const renderDate = () => {
    let now = new Date();
    return dateFormat(now, "dddd, mmmm dS, h:MM TT");
  };

  return (
    <div className="app">
      <div>{isAuthenticated && <p>Welcome, {user.name}!</p>}</div>

      <div className="toggle-functionality flex d-flex">
        <h1>Weather App</h1>
        <DarkMode />
      </div>

      {isAuthenticated ? (
        <>
          <div className="input-wrapper">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter City Name"
            />
            <button onClick={getWeatherbyCity}>
              <Search />
            </button>
          </div>

          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <p>Please log in to search for weather data.</p>
          <button onClick={loginWithRedirect} className="login-btn">
            Log In
          </button>
        </>
      )}

      {weather && weather.weather ? (
        <div className="content">
          <div className="location d-flex">
            <MapPin />
            <h2>
              {weather.name} <span>({weather.sys.country})</span>
            </h2>
          </div>
          <p className="datetext">{renderDate()}</p>
          <div className="weatherdesc d-flex flex-c">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />
            <h3>{weather.weather[0].description}</h3>
          </div>
          <div className="tempstats d-flex flex-c">
            <h1>
              {weather.main.temp} <span>&deg;C</span>
            </h1>
            <h3>
              Feels Like {weather.main.feels_like} <span>&deg;C</span>
            </h3>
          </div>
          <div className="windstats d-flex">
            <Wind />
            <h3>Wind Speed: {weather.wind.speed} km/h</h3>
          </div>
          <div className="windstats d-flex">
            <h3>Humidity: {weather.main.humidity} %</h3>
          </div>
        </div>
      ) : (
        <div className="content">
          <h4>No Data Found!</h4>
        </div>
      )}
    </div>
  );
}

export default App;
