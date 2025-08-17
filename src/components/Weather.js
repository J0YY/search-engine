import React, { useEffect, useState } from 'react';

export default function Weather() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

    useEffect(() => {
        if (!apiKey) return; // optional feature
        if (!navigator.geolocation) return;
        const onSuccess = async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const rsp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
                const json = await rsp.json();
                if (json && json.main) setWeather(json);
            } catch (e) {
                setError('Weather unavailable');
            }
        };
        const onError = () => setError('Location blocked');
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 600000, timeout: 5000 });
    }, [apiKey]);

    if (!apiKey || !weather) return null;

    const temp = Math.round(weather.main.temp);
    const city = weather.name;
    const desc = weather.weather && weather.weather[0] && weather.weather[0].main;

    return (
        <div className="weather-widget" title={desc}>
            <div className="weather-widget__temp">{temp}°C</div>
            <div className="weather-widget__city">{city}</div>
        </div>
    );
}


