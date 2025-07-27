import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import clear from '../assets/clear.png'
import cloudy from '../assets/cloud.png'
import drizzle from '../assets/drizzle.png'
import humidity from '../assets/humidity.png'
import rain from '../assets/rain.png'
import snow from '../assets/snow.png'
import wind from '../assets/wind.png'




const Weather = () => {
    const inputRef = useRef();
    const [weatherData , setWeatherData] = useState(false);
    // Add search function to trigger weather fetch
    const search = (city) => {
        getWeatherData(city);
    };

    // Add Enter key support for input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search(inputRef.current.value);
        }
    };
    const allIcons = {
        "01d": clear,
        "01n": clear,
        "02d": cloudy,
        "02n": cloudy,
        "03d": cloudy,
        "03n": cloudy,
        "04d": drizzle,
        "04n": drizzle,
        "09d": rain,
        "09n": rain,
        "10d": rain,
        "10n": rain,
        "13d": snow,
        "13n": snow,
    }

  

    const getWeatherData =async (city) => {
        try {
            if(city === ""){
                alert("Please enter a city name");
                return;
            }
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API}`;
            const response = await fetch(url);
            const data = await response.json();
            // Defensive checks for API response
            const iconCode = allIcons[data.weather && data.weather[0] && data.weather[0].icon ? data.weather[0].icon : "01d"] || clear;

            setWeatherData({
                humidity: data.main && data.main.humidity !== undefined ? data.main.humidity : "N/A",
                windSpeed: data.wind && data.wind.speed !== undefined ? data.wind.speed : "N/A",
                temperature: data.main && data.main.temp !== undefined ? Math.floor(data.main.temp) : "N/A",
                city: data.name || city,
                icon: iconCode,
            });
        } catch (error) {
            console.log("Error fetching weather data:", error);
            setWeatherData(false);
        }
    }

    //useEffect 
    useEffect(()=>{
        getWeatherData("Gujrat");
    }, [])


  return (
    <div className='weather-container'>
        <div className="search-bar">
            <input type="text" placeholder='Search'  ref={inputRef} onKeyDown={handleKeyDown}/>
            <img src="./src/assets/search.png" alt="Search_Icon"  onClick={() => search(inputRef.current.value)}/>
        </div>
        {weatherData ?
         <><img src={weatherData.icon} alt="weather status image"  className='weather-status-icon'/>
        <p className='temperature'>{weatherData.temperature}°C  </p>
        <p className='city-name'>{weatherData.city}</p>

        <div className="weather-data">
            <div className="col">
                <img src={humidity} alt="Humidity Icon" />
               <div>
                 <p>{weatherData.humidity} % </p>
                 <span>Humidity</span>
               </div>
            </div>

             <div className="col">
                <img src={wind} alt="Wind Icon" />
               <div>
                 <p>{weatherData.windSpeed} Km/h </p>
                 <span>Wind</span>
               </div>
            </div>

        </div></> : <><p>API Key Issue</p></>}
        
    </div>
  )
}

export default Weather