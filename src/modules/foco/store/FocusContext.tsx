import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useTasks } from '../../spider-sense/store/TasksContext';
import type { Task } from '../../spider-sense/domain/types';
import type {
  FocusState,
  FocusSession,
  FocusPreset,
} from '../domain/types';
import { focusReducer, loadFocusSessions, addFocusSession, FOCUS_PRESETS } from '../domain/types';

const SESSION_STORAGE_KEY = 'parker.foco.session.v1';

interface FocusContextValue {
  state: FocusState;
  selectTask: (taskId: string | null) => void;
  setPlannedDuration: (minutes: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  completeTimer: (taskCompleted: boolean) => void;
  resetTimer: () => void;
  sessions: FocusSession[];
  presets: FocusPreset[];
  selectedTask: Task | null;
  progress: number;
  remaining: number;
  formattedElapsed: string;
  formattedRemaining: string;
  formattedPlanned: string;
  plannedDuration: number;
}

const FocusContext = createContext<FocusContextValue | null>(null);

function loadPersistedSession(): FocusState | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.timerState === 'running') {
      return { ...parsed, timerState: 'paused' };
    }
    return parsed;
  } catch {
    return null;
  }
}

function savePersistedSession(state: FocusState): void {
  try {
    if (state.timerState === 'idle') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // armazenamento indisponível
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function FocusProvider({ children }: { children: ReactNode }) {
  const { tasks, updateTask } = useTasks();
  const [sessions, setSessions] = useState<FocusSession[]>(() => loadFocusSessions());
  const tickRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const persisted = useMemo(loadPersistedSession, []);
  const [state, dispatch] = useReducer(focusReducer, {
    selectedTaskId: null,
    timerState: 'idle',
    plannedDuration: 25,
    elapsed: 0,
    sessionId: null,
    ...persisted,
  });

  useEffect(() => {
    savePersistedSession(state);
  }, [state]);

  useEffect(() => {
    if (state.timerState === 'running') {
      startTimeRef.current = Date.now() - state.elapsed * 1000;
      tickRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        dispatch({ type: 'tick', elapsed });
      }, 500);
    } else {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    }
    return () => {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
      }
    };
  }, [state.timerState]);

  useEffect(() => {
    if (state.timerState === 'running' && state.elapsed >= state.plannedDuration * 60) {
      completeTimer(false);
    }
  }, [state.timerState, state.elapsed, state.plannedDuration]);

  const selectTask = (taskId: string | null) => dispatch({ type: 'selectTask', taskId });
  const setPlannedDuration = (minutes: number) => dispatch({ type: 'setPlannedDuration', minutes });
  const startTimer = () => dispatch({ type: 'startTimer' });
  const pauseTimer = () => dispatch({ type: 'pauseTimer' });
  const resumeTimer = () => dispatch({ type: 'resumeTimer' });

  const completeTimer = (taskCompleted: boolean) => {
    if (!state.sessionId || !state.selectedTaskId) {
      dispatch({ type: 'resetTimer' });
      return;
    }
    const session: FocusSession = {
      id: state.sessionId,
      taskId: state.selectedTaskId,
      taskTitle: state.selectedTaskId ? tasks.find((t) => t.id === state.selectedTaskId)?.title ?? '' : '',
      plannedDuration: state.plannedDuration,
      actualDuration: state.elapsed,
      startedAt: Date.now() - state.elapsed * 1000,
      endedAt: Date.now(),
      completed: true,
      taskCompleted,
    };
    setSessions((prev) => addFocusSession(prev, session));
    if (taskCompleted) {
      updateTask(state.selectedTaskId, { done: true, doneAt: Date.now() });
    }
    dispatch({ type: 'resetTimer' });
  };

  const resetTimer = () => dispatch({ type: 'resetTimer' });

  const selectedTask = state.selectedTaskId
    ? tasks.find((t) => t.id === state.selectedTaskId) ?? null
    : null;

  const progress = state.plannedDuration > 0
    ? Math.min(100, (state.elapsed / (state.plannedDuration * 60)) * 100)
    : 0;

  const remaining = Math.max(0, state.plannedDuration * 60 - state.elapsed);

  const value = useMemo<FocusContextValue>(
    () => ({
      state,
      selectTask,
      setPlannedDuration,
      startTimer,
      pauseTimer,
      resumeTimer,
      completeTimer,
      resetTimer,
      sessions,
      presets: FOCUS_PRESETS,
      selectedTask,
      progress,
      remaining,
      formattedElapsed: formatTime(state.elapsed),
      formattedRemaining: formatTime(remaining),
      formattedPlanned: formatTime(state.plannedDuration * 60),
      plannedDuration: state.plannedDuration,
    }),
    [
      state,
      sessions,
      selectedTask,
      progress,
      remaining,
    ],
  );

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

export function useFocus(): FocusContextValue {
  const value = useContext(FocusContext);
  if (!value) throw new Error('useFocus deve ser usado dentro de FocusProvider');
  return value;
}