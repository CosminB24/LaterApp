import { sendEmail } from './emailService';
import { Task } from '../types';

export const notificationService = {
  scheduleNotifications: async (task: Task, userEmail: string) => {
    if (!task.notifications?.enabled) return;

    const taskDate = new Date(task.date + 'T' + task.time);
    const now = new Date();

    for (const interval of task.notifications.intervals) {
      const [value, unit] = interval.match(/(\d+)(\w)/).slice(1);
      const milliseconds = unit === 'h' 
        ? parseInt(value) * 60 * 60 * 1000
        : parseInt(value) * 60 * 1000;

      const notificationTime = new Date(taskDate.getTime() - milliseconds);
      
      // Verifică dacă timpul de notificare nu a trecut și este în următoarele 24 de ore
      if (notificationTime > now && notificationTime <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
        console.log(`Programare notificare pentru ${task.title} la ${notificationTime}`);
        
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        setTimeout(async () => {
          try {
            console.log(`Trimitere notificare pentru ${task.title}`);
            await sendEmail(
              userEmail,
              `Reminder: ${task.title}`,
              `Ai un task programat pentru ${taskDate.toLocaleString('ro-RO')}\n\n` +
              `Titlu: ${task.title}\n` +
              `Ora: ${task.time}\n` +
              `${task.description ? `Descriere: ${task.description}\n` : ''}`
            );
            console.log(`Notificare trimisă cu succes pentru ${task.title}`);
          } catch (error) {
            console.error(`Eroare la trimiterea notificării pentru ${task.title}:`, error);
          }
        }, timeUntilNotification);
      }
    }
  }
}; 