import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { CategoryId, Priority, Window } from '../domain/types';
import { CATEGORIES, PRIORITIES, WINDOW_OPTIONS } from '../domain/catalog';
import { useTasks } from '../store/TasksContext';
import { Segmented } from '../../../core/ui/Segmented';

interface AddTaskFormProps {
  open: boolean;
  onDone: (id: string) => void;
}

export function AddTaskForm({ open, onDone }: AddTaskFormProps) {
  const { addTask } = useTasks();
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [when, setWhen] = useState<Window>('today');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState<CategoryId>('personal');
  const [context, setContext] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setPriority('medium');
    setWhen('today');
    setTime('');
    setDuration('');
    setCategory('personal');
    setContext('');
    const timer = window.setTimeout(() => titleRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const clean = title.trim();
    if (!clean) {
      titleRef.current?.focus();
      return;
    }
    const task = addTask({
      title: clean,
      priority,
      window: when,
      time: when === 'today' && time ? time : undefined,
      duration: duration ? Number(duration) : undefined,
      category,
      context: context.trim() || undefined,
    });
    onDone(task.id);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field">
        <label className="field-label" htmlFor="af-title">
          O que é?
        </label>
        <input
          id="af-title"
          ref={titleRef}
          className="field-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: Estudar Python"
          maxLength={80}
          autoComplete="off"
        />
      </div>

      <div className="field">
        <span className="field-label" id="af-priority-label">
          Prioridade
        </span>
        <Segmented
          options={PRIORITIES.map((p) => ({
            value: p.value,
            label: p.label,
            title: p.hint,
          }))}
          value={priority}
          onChange={setPriority}
          aria-label="Prioridade"
        />
      </div>

      <div className="field">
        <span className="field-label" id="af-window-label">
          Prazo
        </span>
        <Segmented
          options={WINDOW_OPTIONS}
          value={when}
          onChange={setWhen}
          aria-label="Prazo"
        />
      </div>

      <div className="field-row">
        {when === 'today' && (
          <div className="field">
            <label className="field-label" htmlFor="af-time">
              Horário
            </label>
            <input
              id="af-time"
              type="time"
              className="field-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        )}
        <div className="field">
          <label className="field-label" htmlFor="af-duration">
            Duração (min)
          </label>
          <input
            id="af-duration"
            type="number"
            inputMode="numeric"
            min={5}
            step={5}
            className="field-input"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="45"
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="af-category">
          Categoria
        </label>
        <select
          id="af-category"
          className="field-input field-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="af-context">
          Por que isso importa?
        </label>
        <textarea
          id="af-context"
          className="field-input"
          rows={2}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Contexto ou conexão com um objetivo maior (opcional)"
        />
      </div>

      <button type="submit" className="task-submit" disabled={!title.trim()}>
        Adicionar foco
      </button>
    </form>
  );
}
