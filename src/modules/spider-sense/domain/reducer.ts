import type { Task } from './types';

export type Action =
  | { type: 'add'; task: Task }
  | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'update'; id: string; patch: Partial<Task> };

export function taskReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'add':
      return [action.task, ...state];
    case 'toggle':
      return state.map((task) =>
        task.id === action.id
          ? { ...task, done: !task.done, doneAt: !task.done ? Date.now() : undefined }
          : task,
      );
    case 'remove':
      return state.filter((task) => task.id !== action.id);
    case 'update':
      return state.map((task) =>
        task.id === action.id ? { ...task, ...action.patch } : task,
      );
  }
}
