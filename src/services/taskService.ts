import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Task } from '../types';

class TaskService {
  async getTasks(userId: string): Promise<Task[]> {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  }

  async addTask(userId: string, task: Omit<Task, 'id' | 'userId'>): Promise<Task> {
    const tasksRef = collection(db, 'tasks');
    const taskWithUser = { ...task, userId };
    const docRef = await addDoc(tasksRef, taskWithUser);
    
    return {
      id: docRef.id,
      ...taskWithUser
    };
  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, task);
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  }
}

export const taskService = new TaskService(); 