export interface TaskNotification {
  enabled: boolean;
  intervals: string[]; // ["24h", "12h", "6h", "1h", "30m", "15m"]
}

export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  notifications?: TaskNotification;
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