import { useState } from 'react';
import type { Task } from '../domain/types';
import { categoryLabel, PRIORITIES, WINDOW_LABEL } from '../domain/catalog';
import { useTasks } from '../store/TasksContext';
import { IconChevron } from '../../../core/ui/Icon';
import { Segmented } from '../../../core/ui/Segmented';

interface PriorityItemProps {
  task: Task;
  isNew?: boolean;
  isLeaving?: boolean;
  onComplete: (id: string) => void;
}

function metaOf(task: Task): string {
  const parts: string[] = [WINDOW_LABEL[task.window]];
  if (task.time) parts.push(task.time);
  else if (task.duration) parts.push(`${task.duration} min`);
  parts.push(categoryLabel(task.category));
  return parts.slice(0, 3).join(' · ');
}

export function PriorityItem({ task, isNew, isLeaving, onComplete }: PriorityItemProps) {
  const { updateTask, removeTask } = useTasks();
  const [open, setOpen] = useState(false);

  const deadline = [WINDOW_LABEL[task.window], task.time].filter(Boolean).join(' · ');

  return (
    <div
      className={`priority-item${isNew ? ' is-new' : ''}`}
      data-open={open ? 'true' : 'false'}
      data-priority={task.priority}
    >
      <span className="item-accent" aria-hidden="true" />
      <div className="item-row">
        <button
          type="button"
          className={`item-toggle${isLeaving ? ' is-done' : ''}`}
          onClick={() => onComplete(task.id)}
          aria-label={`Concluir “${task.title}”`}
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path className="check-path" pathLength={1} d="M5 12.5l4.2 4.2L19 7" />
          </svg>
        </button>

        <button
          type="button"
          className="item-main"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={`${task.title}, ${metaOf(task)}`}
        >
          <span className="item-copy">
            <span className="item-title">{task.title}</span>
            <span className="item-meta">{metaOf(task)}</span>
          </span>
          <span className="item-chevron" aria-hidden="true">
            <IconChevron size={16} />
          </span>
        </button>
      </div>

      <div className="item-detail">
        <div className="item-detail-inner">
          <div className="item-detail-body">
            {(task.context || task.goal) && (
              <div className="detail-notes">
                {task.context && (
                  <p className="detail-note">
                    <span className="detail-label">Por que importa</span>
                    {task.context}
                  </p>
                )}
                {task.goal && (
                  <p className="detail-note">
                    <span className="detail-label">Conexão</span>
                    {task.goal}
                  </p>
                )}
              </div>
            )}

            <dl className="detail-grid">
              <div>
                <dt>Prazo</dt>
                <dd>{deadline}</dd>
              </div>
              <div>
                <dt>Categoria</dt>
                <dd>{categoryLabel(task.category)}</dd>
              </div>
              {task.duration && (
                <div>
                  <dt>Duração</dt>
                  <dd>{task.duration} min</dd>
                </div>
              )}
            </dl>

            {typeof task.progress === 'number' && task.progress > 0 && (
              <div className="detail-progress">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${task.progress}%` }} />
                </div>
                <span>{task.progress}%</span>
              </div>
            )}

            <div className="detail-priority">
              <span className="detail-label">Prioridade</span>
              <Segmented
                options={PRIORITIES.map((p) => ({
                  value: p.value,
                  label: p.label,
                  title: p.hint,
                }))}
                value={task.priority}
                onChange={(value) => updateTask(task.id, { priority: value })}
                aria-label="Prioridade"
              />
            </div>

            <button
              type="button"
              className="detail-delete"
              onClick={() => removeTask(task.id)}
            >
              Excluir foco
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
