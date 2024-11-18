interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  city: string;
}

export async function getCurrentWeather(
  lat: number, 
  lon: number, 
  targetDate: Date,
  isForecast: boolean
): Promise<WeatherData> {
  const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
  
  try {
    let url;
    if (isForecast) {
      // Folosim API-ul de prognoză pentru date viitoare
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ro`;
    } else {
      // Folosim API-ul pentru vremea curentă
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ro`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Eroare la obținerea datelor meteo');
    }

    const data = await response.json();
    
    if (isForecast) {
      // Găsim prognoza cea mai apropiată de data și ora dorită
      const targetTimestamp = targetDate.getTime();
      const closestForecast = data.list.reduce((prev: any, curr: any) => {
        const prevDiff = Math.abs(new Date(prev.dt * 1000).getTime() - targetTimestamp);
        const currDiff = Math.abs(new Date(curr.dt * 1000).getTime() - targetTimestamp);
        return currDiff < prevDiff ? curr : prev;
      });
      
      return {
        temperature: Math.round(closestForecast.main.temp),
        description: closestForecast.weather[0].description,
        icon: closestForecast.weather[0].icon,
        city: data.city.name
      };
    }
    
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name
    };
  } catch (error) {
    console.error('Eroare:', error);
    throw error;
  }
} 