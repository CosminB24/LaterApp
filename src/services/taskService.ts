import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Task, TaskNotification } from '../types';

export const taskService = {
  getTasks: async (userId: string): Promise<Task[]> => {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  },

  addTask: async (userId: string, task: Omit<Task, 'id' | 'userId'>): Promise<Task> => {
    const tasksRef = collection(db, 'tasks');
    const docRef = await addDoc(tasksRef, {
      ...task,
      userId
    });
    
    return {
      id: docRef.id,
      userId,
      ...task
    };
  },

  updateTask: async (taskId: string, task: Partial<Task>): Promise<void> => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, task);
  },

  deleteTask: async (taskId: string): Promise<void> => {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  },

  updateTaskNotifications: async (taskId: string, notifications: TaskNotification): Promise<void> => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { notifications });
  }
}; 