import { useFocus } from '../store/FocusContext';
import { useTasks } from '../../spider-sense/store/TasksContext';
import { isActive, sortByImportance } from '../../spider-sense/domain/logic';
import { WINDOW_LABEL, categoryLabel, PRIORITY_WEIGHT } from '../../spider-sense/domain/catalog';
import type { Task } from '../../spider-sense/domain/types';
import { Sheet } from '../../../core/ui/Sheet';
import { IconChevron } from '../../../core/ui/Icon';
import { useState } from 'react';

export function FocusTaskSelector() {
  const { tasks } = useTasks();
  const { state, selectTask } = useFocus();
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeTasks = tasks.filter(isActive).sort(sortByImportance);
  const selectedTask = state.selectedTaskId
    ? tasks.find((t) => t.id === state.selectedTaskId)
    : null;

  const openSheet = () => setSheetOpen(true);
  const closeSheet = () => setSheetOpen(false);

  const handleSelect = (taskId: string) => {
    selectTask(taskId);
    closeSheet();
  };

  const handleClear = () => {
    selectTask(null);
    closeSheet();
  };

  const metaOf = (task: Task): string => {
    const parts: string[] = [WINDOW_LABEL[task.window]];
    if (task.time) parts.push(task.time);
    else if (task.duration) parts.push(`${task.duration} min`);
    parts.push(categoryLabel(task.category));
    return parts.slice(0, 3).join(' · ');
  };

  const priorityColor = (priority: Task['priority']): string => {
    const weights = PRIORITY_WEIGHT;
    if (weights[priority] >= 4) return 'var(--red)';
    if (weights[priority] >= 3) return 'var(--red-soft)';
    if (weights[priority] >= 2) return 'var(--blue-soft)';
    return 'var(--slate)';
  };

  return (
    <>
      <button
        type="button"
        className={`focus-task-selector ${selectedTask ? 'has-task' : ''}`}
        onClick={openSheet}
        aria-label={selectedTask ? `Tarefa selecionada: ${selectedTask.title}` : 'Selecionar tarefa para foco'}
        disabled={state.timerState !== 'idle'}
      >
        <div className="task-selector-main">
          {selectedTask ? (
            <>
              <span
                className="task-selector-accent"
                style={{ background: priorityColor(selectedTask.priority) }}
                aria-hidden="true"
              />
              <div className="task-selector-info">
                <span className="task-selector-title">{selectedTask.title}</span>
                <span className="task-selector-meta">{metaOf(selectedTask)}</span>
              </div>
            </>
          ) : (
            <span className="task-selector-placeholder">Selecione uma tarefa para iniciar o foco</span>
          )}
        </div>
        <span className="task-selector-chevron-wrap">
          <IconChevron
            size={18}
            className={`task-selector-chevron ${state.timerState !== 'idle' ? 'disabled' : ''}`}
          />
        </span>
      </button>

      <Sheet open={sheetOpen} onClose={closeSheet} label="Escolher tarefa para foco">
        <div className="focus-task-sheet">
          {activeTasks.length === 0 ? (
            <div className="focus-task-empty">
              <p className="focus-task-empty-title">Nenhuma tarefa ativa</p>
              <p className="focus-task-empty-body">
                Crie uma tarefa no Spider-Sense para poder focar nela.
              </p>
            </div>
          ) : (
            <ul className="focus-task-list" role="listbox" aria-label="Tarefas disponíveis">
              {activeTasks.map((task) => (
                <li
                  key={task.id}
                  role="option"
                  aria-selected={state.selectedTaskId === task.id}
                  className={`focus-task-item ${state.selectedTaskId === task.id ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(task.id)}
                >
                  <span
                    className="focus-task-accent"
                    style={{ background: priorityColor(task.priority) }}
                    aria-hidden="true"
                  />
                  <div className="focus-task-info">
                    <span className="focus-task-title">{task.title}</span>
                    <span className="focus-task-meta">{metaOf(task)}</span>
                  </div>
                  {state.selectedTaskId === task.id && (
                    <svg
                      className="focus-task-check"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12.5l4.2 4.2L19 7" />
                    </svg>
                  )}
                </li>
              ))}
              {state.selectedTaskId && (
                <li
                  className="focus-task-item focus-task-clear"
                  onClick={handleClear}
                  role="option"
                >
                  <div className="focus-task-info">
                    <span className="focus-task-title">Remover seleção</span>
                    <span className="focus-task-meta">Focar sem tarefa específica</span>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
      </Sheet>
    </>
  );
}