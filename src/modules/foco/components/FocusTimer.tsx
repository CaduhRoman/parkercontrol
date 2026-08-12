import { useFocus } from '../store/FocusContext';
import { IconPlay, IconPause, IconStop, IconForward } from '../../../core/ui/Icon';

export function FocusTimer() {
  const {
    state,
    plannedDuration,
    formattedElapsed,
    formattedRemaining,
    formattedPlanned,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    completeTimer,
    resetTimer,
    setPlannedDuration,
    presets,
  } = useFocus();

  const isRunning = state.timerState === 'running';
  const isPaused = state.timerState === 'paused';
  const isCompleted = state.timerState === 'completed';
  const canStart = state.selectedTaskId && state.timerState === 'idle';

  const handlePresetClick = (minutes: number) => {
    if (state.timerState === 'idle') {
      setPlannedDuration(minutes);
    }
  };

  const handleStart = () => {
    if (canStart) startTimer();
  };

  const handlePause = () => pauseTimer();
  const handleResume = () => resumeTimer();
  const handleReset = () => resetTimer();

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="focus-timer">
      <div className="timer-presets" aria-label="Durações pré-definidas">
        {presets.map((preset) => (
          <button
            key={preset.minutes}
            type="button"
            className={`preset-btn ${plannedDuration === preset.minutes && state.timerState === 'idle' ? 'is-active' : ''}`}
            onClick={() => handlePresetClick(preset.minutes)}
            disabled={state.timerState !== 'idle'}
            aria-pressed={plannedDuration === preset.minutes && state.timerState === 'idle'}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="timer-circle-wrap">
        <svg className="timer-circle-svg" viewBox={`0 0 ${radius * 2} ${radius * 2}`} role="img" aria-label={`Tempo restante: ${formattedRemaining}`}>
          <circle
            className="timer-circle-bg"
            cx={radius}
            cy={radius}
            r={radius - 4}
            fill="none"
            strokeWidth="8"
          />
          <circle
            className="timer-circle-progress"
            cx={radius}
            cy={radius}
            r={radius - 4}
            fill="none"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s var(--ease-out)' }}
          />
          <circle
            className="timer-circle-center"
            cx={radius}
            cy={radius}
            r={radius * 0.6}
            fill="none"
            strokeWidth="1"
          />
        </svg>

        <div className="timer-display" role="timer" aria-live="polite" aria-label={`Tempo decorrido: ${formattedElapsed} de ${formattedPlanned}`}>
          <div className="timer-time">{formattedElapsed}</div>
          <div className="timer-of">
            <span className="timer-slash">/</span>
            <span className="timer-total">{formattedPlanned}</span>
          </div>
        </div>

        {isCompleted && (
          <div className="timer-completed" aria-live="polite">
            Sessão concluída
          </div>
        )}
      </div>

      <div className="timer-controls">
        {state.timerState === 'idle' && (
          <button
            type="button"
            className="control-btn control-btn-primary"
            onClick={handleStart}
            disabled={!canStart}
            aria-label="Iniciar sessão de foco"
          >
            <IconPlay size={22} />
            <span>Iniciar</span>
          </button>
        )}

        {isRunning && (
          <button
            type="button"
            className="control-btn control-btn-secondary"
            onClick={handlePause}
            aria-label="Pausar timer"
          >
            <IconPause size={22} />
            <span>Pausar</span>
          </button>
        )}

        {isPaused && (
          <>
            <button
              type="button"
              className="control-btn control-btn-primary"
              onClick={handleResume}
              aria-label="Retomar timer"
            >
              <IconPlay size={22} />
              <span>Retomar</span>
            </button>
            <button
              type="button"
              className="control-btn control-btn-ghost"
              onClick={handleReset}
              aria-label="Cancelar sessão"
            >
              <IconStop size={22} />
              <span>Cancelar</span>
            </button>
          </>
        )}

        {isCompleted && (
          <>
            <button
              type="button"
              className="control-btn control-btn-primary"
              onClick={() => completeTimer(true)}
              aria-label="Marcar tarefa como concluída e finalizar"
            >
              <IconForward size={22} />
              <span>Concluir tarefa</span>
            </button>
            <button
              type="button"
              className="control-btn control-btn-ghost"
              onClick={handleReset}
              aria-label="Finalizar sessão sem concluir tarefa"
            >
              <IconStop size={22} />
              <span>Finalizar</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}