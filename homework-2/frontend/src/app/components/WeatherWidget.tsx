import { useState } from 'react';
import { WeatherData } from '../types';
import { fetchWeather } from '../services/api';

interface WeatherWidgetProps {
  initialWeather: WeatherData;
}

export default function WeatherWidget({ initialWeather }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData>(initialWeather);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCitySearch(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await fetchWeather(city);
      if (data) {
        setWeather(data);
        setCity('');
      } else {
        setError('Failed to fetch weather data');
      }
    } catch (err) {
      setError('City not found or service unavailable');
    } finally {
      setLoading(false);
    }
  }

  const iconUrl = weather.weather && weather.weather[0]
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : '';

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-5 text-white">
      <h2 className="text-xl font-bold mb-4">Weather</h2>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h3>
          <p className="text-lg">{Math.round(weather.main.temp)}°C</p>
          <p className="text-sm">Feels like: {Math.round(weather.main.feels_like)}°C</p>
          <p className="text-sm capitalize">{weather.weather[0]?.description}</p>
        </div>
        
        {iconUrl && (
          <img 
            src={iconUrl} 
            alt={weather.weather[0]?.description || 'Weather icon'} 
            width={80} 
            height={80}
            className="w-20 h-20"
          />
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-blue-400 bg-opacity-30 p-2 rounded">
          <p className="text-xs">Humidity</p>
          <p className="text-lg font-semibold">{weather.main.humidity}%</p>
        </div>
        <div className="bg-blue-400 bg-opacity-30 p-2 rounded">
          <p className="text-xs">Wind</p>
          <p className="text-lg font-semibold">{weather.wind.speed} m/s</p>
        </div>
      </div>
      
      <form onSubmit={handleCitySearch} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-grow px-3 py-2 rounded-md text-black text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-70"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
        {error && <p className="text-red-200 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
} 