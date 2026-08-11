import type { CategoryId, Priority, Window } from './types';

export const PRIORITIES: { value: Priority; label: string; hint: string }[] = [
  { value: 'low', label: 'Baixa', hint: 'Pode esperar' },
  { value: 'medium', label: 'Média', hint: 'Merece atenção' },
  { value: 'high', label: 'Alta', hint: 'Não ignore' },
  { value: 'critical', label: 'Crítica', hint: 'Exige você agora' },
];

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const WINDOW_OPTIONS: { value: Window; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: 'tomorrow', label: 'Amanhã' },
  { value: 'week', label: 'Semana' },
  { value: 'later', label: 'Depois' },
];

export const WINDOW_LABEL: Record<Window, string> = {
  today: 'Hoje',
  tomorrow: 'Amanhã',
  week: 'Esta semana',
  later: 'Sem data',
};

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'personal', label: 'Pessoal' },
  { id: 'health', label: 'Saúde' },
  { id: 'work', label: 'Trabalho' },
  { id: 'project', label: 'Projeto' },
  { id: 'study', label: 'Estudo' },
  { id: 'home', label: 'Casa' },
];

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? 'Outro';
}
