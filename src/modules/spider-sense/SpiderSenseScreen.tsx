import { useMemo, useRef, useState } from 'react';
import { useTasks } from './store/TasksContext';
import { counts, SENSE_WORDS, senseState, verdict } from './domain/logic';
import { SpiderSenseRadar } from './components/SpiderSenseRadar';
import { SenseVerdict } from './components/SenseVerdict';
import { PriorityList } from './components/PriorityList';
import { EmptyState } from './components/EmptyState';
import { AddTaskForm } from './components/AddTaskForm';
import { Sheet } from '../../core/ui/Sheet';
import { IconPlus } from '../../core/ui/Icon';
import './styles.css';

function todayLabel(): string {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(now);
  const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' })
    .format(now)
    .replace(/\./g, '');
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} · ${dayMonth}`;
}

export function SpiderSenseScreen() {
  const { tasks } = useTasks();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const state = useMemo(() => senseState(tasks), [tasks]);
  const dayCounts = useMemo(() => counts(tasks), [tasks]);
  const currentVerdict = useMemo(() => verdict(tasks), [tasks]);

  const openSheet = () => setSheetOpen(true);

  const closeSheet = () => {
    setSheetOpen(false);
    window.setTimeout(() => fabRef.current?.focus(), 120);
  };

  const handleAdded = (id: string) => {
    closeSheet();
    setLastAddedId(id);
    window.setTimeout(() => setLastAddedId(null), 800);
  };

  const inertProps = sheetOpen ? ({ inert: '' } as Record<string, string>) : {};

  return (
    <div className="screen">
      <div {...inertProps} className="screen-main">
        <header className="screen-header">
          <div className="brand">
            <span className="brand-dot" aria-hidden="true" />
            <span className="brand-name">Spider-Sense</span>
          </div>
          <span className="header-date">{todayLabel()}</span>
        </header>

        <section className="sense" aria-label="Estado do seu Spider-Sense">
          <p className="sense-kicker">Percepção em tempo real</p>
          <SpiderSenseRadar tasks={tasks} state={state} />
          <h1 className="sense-state" key={state} data-state={state}>
            {SENSE_WORDS[state]}
          </h1>
          <SenseVerdict state={state} title={currentVerdict.title} body={currentVerdict.body} />
        </section>

        <section className="priorities" aria-label="Prioridades">
          {dayCounts.active > 0 ? (
            <>
              <div className="section-head">
                <h2 className="section-title">Prioridades</h2>
                <span className="section-count">
                  {dayCounts.dueToday > 0
                    ? `${dayCounts.dueToday} hoje`
                    : `${dayCounts.active} ativos`}
                  {dayCounts.doneToday > 0
                    ? ` · ${dayCounts.doneToday} feito${dayCounts.doneToday > 1 ? 's' : ''}`
                    : ''}
                </span>
              </div>
              <PriorityList lastAddedId={lastAddedId} />
            </>
          ) : (
            <EmptyState doneToday={dayCounts.doneToday} onAdd={openSheet} />
          )}
        </section>
      </div>

      <button
        ref={fabRef}
        type="button"
        className="fab"
        onClick={openSheet}
        aria-label="Adicionar novo foco"
        hidden={sheetOpen}
      >
        <IconPlus size={22} strokeWidth={2.4} />
      </button>

      <Sheet open={sheetOpen} onClose={closeSheet} label="Novo foco">
        <AddTaskForm open={sheetOpen} onDone={handleAdded} />
      </Sheet>
    </div>
  );
}
