import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../services/weatherService';
import { Loader2, CloudSun } from 'lucide-react';
import { Task } from '../types';
import { format, addHours, setHours, setMinutes } from 'date-fns';
import { ro } from 'date-fns/locale';

interface WeatherWidgetProps {
  selectedDate: Date;
  selectedTask: Task | null;
}

export default function WeatherWidget({ selectedDate, selectedTask }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        setLoading(true);
        
        // Verificăm dacă browserul suportă geolocația
        if (!navigator.geolocation) {
          throw new Error('Browserul nu suportă geolocația');
        }

        // Coordonate default pentru București în cazul în care nu avem acces la locație
        let latitude = 44.4268;
        let longitude = 26.1025;

        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            );
          });
          
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (locationError) {
          console.warn('Nu s-a putut obține locația:', locationError);
          // Continuăm cu coordonatele default pentru București
        }

        // Dacă avem un task selectat, folosim data și ora acestuia
        let targetDate = selectedDate;
        if (selectedTask) {
          const [hours, minutes] = selectedTask.time.split(':').map(Number);
          targetDate = setHours(setMinutes(new Date(selectedTask.date), minutes), hours);
        }

        const isCurrentDay = format(targetDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
        
        const weatherData = await getCurrentWeather(latitude, longitude, targetDate, !isCurrentDay);
        setWeather(weatherData);
        setError(null);
      } catch (err) {
        setError('Nu am putut obține datele meteo');
        console.error('Eroare la obținerea datelor meteo:', err);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, [selectedDate, selectedTask]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Se încarcă datele meteo...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
          <CloudSun className="w-5 h-5" />
          <span>
            {error === 'PERMISSION_DENIED' 
              ? 'Te rugăm să permiți accesul la locație pentru a vedea vremea locală' 
              : error}
          </span>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Vremea {selectedTask ? `la ora ${selectedTask.time}` : 'astăzi'}
        </h3>
      </div>
      
      <div className="flex items-center gap-4">
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-16 h-16"
        />
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {weather.temperature}°C
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {weather.city} • {weather.description}
          </div>
          {selectedTask && (
            <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              {format(new Date(selectedTask.date), 'dd MMMM yyyy', { locale: ro })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 