import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";
import "./index.css";

function App() {
  const [city, setCity] = useState("Paris");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getFormattedWeatherData(city, units);
        setWeather(data);

        // dynamic bg
        const threshold = units === "metric" ? 20 : 60;
        if (data.temp <= threshold) setBg(coldBg);
        else setBg(hotBg);
        
        setError(null); // Reset error if fetch was successful
      } catch (error) {
        const updatedRecent = recent.slice(1, 4);
      setRecent(updatedRecent);
      localStorage.setItem("recents", JSON.stringify(updatedRecent));
        alert("No city found!"); // Set error message if city not found
      }
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      const newCity = e.currentTarget.value;
      setCity(newCity);
      e.currentTarget.blur();

      if(newCity !== recent?.[0]?.city){
      const updatedRecent = [{ city: newCity }, ...recent.slice(0, 4)];
      setRecent(updatedRecent);
      localStorage.setItem("recents", JSON.stringify(updatedRecent));
      }
    }
  };

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("recents")) || [];
    setRecent(localData);
  }, []);

  // const handleSearchSelect = (selectedCity) => {
  //   setCity(selectedCity);
  // };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                list="city"
                placeholder="Enter City..."
              />
              <datalist id="city">
                {
                  recent?.map((item,idx)=>(
                    <option key={idx} value={item?.city}></option>
                  ))
                }
              </datalist>

              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
              
            </div>

            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} ${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>

            {/* bottom description */}
            <Descriptions weather={weather} units={units} />
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
