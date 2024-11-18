export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
}

export interface DayTasks {
  [date: string]: Task[];
}

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  city: string;
}