import type { SenseState, Task } from '../domain/types';
import { hashAngle, nextAction, radarSignals, SENSE_WORDS } from '../domain/logic';

const RINGS = [40, 72, 104, 128];
const SPOKES = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2 + Math.PI / 16);

interface SpiderSenseRadarProps {
  tasks: Task[];
  state: SenseState;
}

export function SpiderSenseRadar({ tasks, state }: SpiderSenseRadarProps) {
  const next = nextAction(tasks);
  const signals = radarSignals(tasks, next);
  const nextSignal = signals.find((signal) => signal.isNext);
  const word = SENSE_WORDS[state];

  return (
    <div
      className="radar"
      data-state={state}
      role="img"
      aria-label={`Spider-Sense ${word}${next ? `, próxima ação: ${next.title}` : ''}`}
    >
      <svg viewBox="0 0 260 260" className="radar-svg" aria-hidden="true">
        <g className="radar-web">
          {RINGS.map((r) => (
            <circle key={r} cx={130} cy={130} r={r} />
          ))}
          {SPOKES.map((angle) => (
            <line
              key={angle}
              x1={130}
              y1={130}
              x2={130 + 128 * Math.cos(angle)}
              y2={130 + 128 * Math.sin(angle)}
            />
          ))}
        </g>

        <g className="radar-ripples">
          <circle className="radar-ripple" cx={130} cy={130} r={110} />
          <circle className="radar-ripple r2" cx={130} cy={130} r={110} />
        </g>

        {nextSignal && (
          <line
            className="focus-vector"
            x1={130}
            y1={130}
            x2={nextSignal.x}
            y2={nextSignal.y}
          />
        )}

        <g className="radar-signals">
          {signals.map((signal) => (
            <g
              key={signal.id}
              className={`radar-signal${signal.isNext ? ' is-next' : ''}`}
              data-urgency={signal.urgency}
              transform={`translate(${signal.x} ${signal.y})`}
              style={{ ['--p-delay' as never]: `${(hashAngle(signal.id) % 8) * 0.16}s` }}
            >
              {signal.isNext && <circle className="signal-ring" r={9} />}
              <circle className="signal-halo" r={11} />
              <circle className="signal-dot" r={3.4} />
            </g>
          ))}
        </g>

        <g className="radar-core">
          <circle className="core-halo-1" cx={130} cy={130} r={32} />
          <circle className="core-halo-2" cx={130} cy={130} r={21} />
          <circle className="core-halo-3" cx={130} cy={130} r={12} />
          <circle className="core-dot" cx={130} cy={130} r={4.6} />
        </g>
      </svg>
    </div>
  );
}
