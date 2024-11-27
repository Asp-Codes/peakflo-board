import { v4 as uuidv4 } from 'uuid';
import { Column, Task } from '../types';

// Default Kanban columns with generated IDs
const DEFAULT_COLUMNS: Column[] = [
  { id: uuidv4(), title: 'Not Started'},
  { id: uuidv4(), title: 'In Progress'},
  { id: uuidv4(), title: 'Completed' },
];

// Function to save the Kanban columns and tasks to localStorage
export const saveToLocalStorage = (columns: Column[], tasks: Task[]) => {
  try {
    localStorage.setItem('kanban_columns', JSON.stringify(columns));
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};

// Function to load the Kanban columns and tasks from localStorage
export const loadFromLocalStorage = (): { columns: Column[], tasks: Task[] } => {
  try {
    const columns = localStorage.getItem('kanban_columns');
    const tasks = localStorage.getItem('kanban_tasks');

    return {
      columns: columns ? JSON.parse(columns) : DEFAULT_COLUMNS,
      tasks: tasks ? JSON.parse(tasks) : [],
    };
  } catch (error) {
    console.error('Failed to load from localStorage', error);
    return { columns: DEFAULT_COLUMNS, tasks: [] }; // Return default columns if error occurs
  }
};

// Function to clear the Kanban data from localStorage
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem('kanban_columns');
    localStorage.removeItem('kanban_tasks');
  } catch (error) {
    console.error('Failed to clear localStorage', error);
  }
};
