import type { SenseState, Task } from './types';
import { PRIORITY_WEIGHT } from './catalog';

export const isActive = (task: Task) => !task.done;

export const SENSE_WORDS: Record<SenseState, string> = {
  calm: 'Calmo',
  attentive: 'Atento',
  alert: 'Alerta',
  critical: 'Crítico',
};

export function senseState(tasks: Task[]): SenseState {
  const active = tasks.filter(isActive);
  if (active.length === 0) return 'calm';
  if (active.some((t) => t.priority === 'critical')) return 'critical';
  if (
    active.some(
      (t) => t.window === 'today' && (t.priority === 'high' || t.priority === 'medium'),
    )
  )
    return 'alert';
  if (
    active.some(
      (t) => t.priority === 'high' || (t.priority === 'medium' && t.window !== 'later'),
    )
  )
    return 'attentive';
  return 'calm';
}

export function sortByImportance(a: Task, b: Task): number {
  const weight = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
  if (weight !== 0) return weight;
  const today = (b.window === 'today' ? 1 : 0) - (a.window === 'today' ? 1 : 0);
  if (today !== 0) return today;
  return (a.time ?? '99:99').localeCompare(b.time ?? '99:99');
}

export function nextAction(tasks: Task[]): Task | undefined {
  const active = tasks.filter(isActive);
  return active.sort(sortByImportance)[0];
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export interface Counts {
  active: number;
  dueToday: number;
  doneToday: number;
}

export function counts(tasks: Task[]): Counts {
  const now = new Date();
  const active = tasks.filter(isActive);
  return {
    active: active.length,
    dueToday: active.filter((t) => t.window === 'today').length,
    doneToday: tasks.filter(
      (t) => t.done && t.doneAt && isSameDay(new Date(t.doneAt), now),
    ).length,
  };
}

export interface Verdict {
  title: string;
  body: string;
}

export function verdict(tasks: Task[]): Verdict {
  const state = senseState(tasks);
  const active = tasks.filter(isActive);
  const next = nextAction(tasks);
  const dueToday = active.filter((t) => t.window === 'today').length;
  const doneToday = counts(tasks).doneToday;

  switch (state) {
    case 'critical':
      return next
        ? {
            title: 'Seu Spider-Sense está em alerta máximo.',
            body: `“${next.title}” precisa de você agora — é o que mais exige atenção.`,
          }
        : {
            title: 'Seu Spider-Sense está em alerta máximo.',
            body: 'Algo importante espera por você.',
          };
    case 'alert':
      return dueToday > 0
        ? {
            title: 'Seu Spider-Sense está alerta.',
            body: `Você tem ${dueToday} responsabilidade${dueToday > 1 ? 's' : ''} para hoje.${
              next ? ` A próxima é “${next.title}”.` : ''
            }`,
          }
        : {
            title: 'Seu Spider-Sense está alerta.',
            body: next ? `Não ignore “${next.title}”.` : 'Algo relevante não deve ser ignorado.',
          };
    case 'attentive':
      return next
        ? {
            title: 'Seu Spider-Sense está atento.',
            body: `Há movimentação no radar. Comece por “${next.title}”.`,
          }
        : {
            title: 'Seu Spider-Sense está atento.',
            body: 'Algumas coisas importantes merecem observação.',
          };
    case 'calm':
      return doneToday > 0
        ? {
            title: 'Tudo tranquilo por aqui.',
            body: `Nenhuma ameaça no radar. Você já concluiu ${doneToday} foco${
              doneToday > 1 ? 's' : ''
            } hoje.`,
          }
        : {
            title: 'Tudo tranquilo por aqui.',
            body: 'Nenhuma ameaça detectada. Aproveite o sossego.',
          };
  }
}

const RADAR_CENTER = 130;
const RADAR_R_MIN = 26;
const RADAR_R_MAX = 104;

export interface RadarSignal {
  id: string;
  x: number;
  y: number;
  urgency: number;
  isNext: boolean;
}

export function hashAngle(id: string): number {
  let hash = 7;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return ((hash % 1000) / 1000) * Math.PI * 2;
}

export function radarSignals(tasks: Task[], next: Task | undefined): RadarSignal[] {
  return tasks
    .filter(isActive)
    .map((task) => {
      const urgency = PRIORITY_WEIGHT[task.priority];
      const t = (5 - urgency) / 4;
      const radius = RADAR_R_MIN + t * (RADAR_R_MAX - RADAR_R_MIN);
      const angle = hashAngle(task.id);
      return {
        id: task.id,
        x: RADAR_CENTER + radius * Math.cos(angle),
        y: RADAR_CENTER + radius * Math.sin(angle),
        urgency,
        isNext: next?.id === task.id,
      };
    });
}
