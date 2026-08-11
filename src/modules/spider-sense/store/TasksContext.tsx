import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { NewTask, Task } from '../domain/types';
import { taskReducer } from '../domain/reducer';

const STORAGE_KEY = 'parker.spider-sense.tasks.v1';

interface TasksContextValue {
  tasks: Task[];
  addTask: (input: NewTask) => Task;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, loadTasks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // armazenamento indisponível: segue em memória
    }
  }, [tasks]);

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      addTask: (input) => {
        const task: Task = {
          id: newId(),
          done: false,
          createdAt: Date.now(),
          ...input,
        };
        dispatch({ type: 'add', task });
        return task;
      },
      toggleTask: (id) => dispatch({ type: 'toggle', id }),
      removeTask: (id) => dispatch({ type: 'remove', id }),
      updateTask: (id, patch) => dispatch({ type: 'update', id, patch }),
    }),
    [tasks],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const value = useContext(TasksContext);
  if (!value) throw new Error('useTasks deve ser usado dentro de TasksProvider');
  return value;
}
