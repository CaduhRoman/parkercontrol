export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Window = 'today' | 'tomorrow' | 'week' | 'later';
export type SenseState = 'calm' | 'attentive' | 'alert' | 'critical';
export type CategoryId =
  | 'personal'
  | 'health'
  | 'work'
  | 'project'
  | 'study'
  | 'home';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  window: Window;
  time?: string;
  duration?: number;
  category: CategoryId;
  context?: string;
  goal?: string;
  progress?: number;
  done: boolean;
  doneAt?: number;
  createdAt: number;
}

export type NewTask = Pick<Task, 'title' | 'priority' | 'window' | 'category'> &
  Partial<
    Omit<Task, 'id' | 'title' | 'priority' | 'window' | 'category' | 'done' | 'doneAt' | 'createdAt'>
  >;
