import { useFocus } from './store/FocusContext';
import { FocusTaskSelector } from './components/FocusTaskSelector';
import { FocusTimer } from './components/FocusTimer';
import { IconTarget } from '../../core/ui/Icon';
import './styles.css';

export function FocusScreen() {
  const { state, sessions, selectedTask, progress } = useFocus();

  const isActive = state.timerState !== 'idle';
  const recentSessions = sessions.slice(0, 5);

  const formatSessionTime = (date: number): string => {
    return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return rem > 0 ? `${h}h ${rem}min` : `${h}h`;
  };

  return (
    <div className="focus-screen">
      <header className="focus-header">
        <div className="focus-brand">
          <span className="focus-brand-dot" aria-hidden="true" />
          <span className="focus-brand-name">Modo Foco</span>
        </div>
        <IconTarget size={28} strokeWidth={1.8} className="focus-header-icon" aria-hidden="true" />
      </header>

      <main className="focus-main">
        <section className="focus-task-section" aria-labelledby="task-heading">
          <h2 id="task-heading" className="focus-section-title">Tarefa em foco</h2>
          <FocusTaskSelector />
        </section>

        <section className="focus-timer-section" aria-labelledby="timer-heading">
          <h2 id="timer-heading" className="focus-section-title">Timer</h2>
          <FocusTimer />
        </section>

        {isActive && (
          <section className="focus-progress-section" aria-labelledby="progress-heading">
            <h2 id="progress-heading" className="focus-section-title">Progresso da sessão</h2>
            <div className="focus-progress-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso: ${Math.round(progress)}%`}>
              <div className="focus-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="focus-progress-label">
              {selectedTask ? `Focando em “${selectedTask.title}”` : 'Sessão de foco livre'}
            </p>
          </section>
        )}

        {recentSessions.length > 0 && (
          <section className="focus-history-section" aria-labelledby="history-heading">
            <h2 id="history-heading" className="focus-section-title">Sessões recentes</h2>
            <ul className="focus-history-list" role="list">
              {recentSessions.map((session) => (
                <li key={session.id} className="focus-history-item">
                  <div className="focus-history-info">
                    <span className="focus-history-task">{session.taskTitle}</span>
                    <span className="focus-history-time">{formatSessionTime(session.startedAt)}</span>
                  </div>
                  <div className="focus-history-meta">
                    <span className={`focus-history-duration ${session.taskCompleted ? 'completed' : ''}`}>
                      {formatDuration(session.actualDuration)}
                      {session.taskCompleted && ' ✓'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}