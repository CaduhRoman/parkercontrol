export type FocusTimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface FocusPreset {
  label: string;
  minutes: number;
}

export const FOCUS_PRESETS: FocusPreset[] = [
  { label: '25 min', minutes: 25 },
  { label: '50 min', minutes: 50 },
  { label: '90 min', minutes: 90 },
];

export interface FocusSession {
  id: string;
  taskId: string;
  taskTitle: string;
  plannedDuration: number;
  actualDuration: number;
  startedAt: number;
  endedAt?: number;
  completed: boolean;
  taskCompleted: boolean;
}

export interface FocusState {
  selectedTaskId: string | null;
  timerState: FocusTimerState;
  plannedDuration: number;
  elapsed: number;
  sessionId: string | null;
}

export type FocusAction =
  | { type: 'selectTask'; taskId: string | null }
  | { type: 'setPlannedDuration'; minutes: number }
  | { type: 'startTimer' }
  | { type: 'pauseTimer' }
  | { type: 'resumeTimer' }
  | { type: 'tick'; elapsed: number }
  | { type: 'completeTimer'; taskCompleted: boolean }
  | { type: 'resetTimer' }
  | { type: 'restoreSession'; state: FocusState; session: FocusSession | null };

export function focusReducer(state: FocusState, action: FocusAction): FocusState {
  switch (action.type) {
    case 'selectTask':
      if (state.timerState !== 'idle') return state;
      return { ...state, selectedTaskId: action.taskId };

    case 'setPlannedDuration':
      if (state.timerState !== 'idle') return state;
      return { ...state, plannedDuration: action.minutes };

    case 'startTimer':
      if (!state.selectedTaskId || state.timerState !== 'idle') return state;
      return {
        ...state,
        timerState: 'running',
        elapsed: 0,
        sessionId: newId(),
      };

    case 'pauseTimer':
      if (state.timerState !== 'running') return state;
      return { ...state, timerState: 'paused' };

    case 'resumeTimer':
      if (state.timerState !== 'paused') return state;
      return { ...state, timerState: 'running' };

    case 'tick':
      if (state.timerState !== 'running') return state;
      const newElapsed = Math.min(action.elapsed, state.plannedDuration * 60);
      return { ...state, elapsed: newElapsed };

    case 'completeTimer':
      return {
        ...state,
        timerState: 'completed',
        elapsed: state.plannedDuration * 60,
      };

    case 'resetTimer':
      return {
        ...state,
        timerState: 'idle',
        elapsed: 0,
        sessionId: null,
      };

    case 'restoreSession':
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
}

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const FOCUS_STORAGE_KEY = 'parker.foco.sessions.v1';

export function loadFocusSessions(): FocusSession[] {
  try {
    const raw = localStorage.getItem(FOCUS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FocusSession[]) : [];
  } catch {
    return [];
  }
}

export function saveFocusSessions(sessions: FocusSession[]): void {
  try {
    localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // armazenamento indisponível
  }
}

export function addFocusSession(sessions: FocusSession[], session: FocusSession): FocusSession[] {
  return [session, ...sessions].slice(0, 100);
}