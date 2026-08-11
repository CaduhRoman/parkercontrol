import type { SenseState } from '../domain/types';

interface SenseVerdictProps {
  state: SenseState;
  title: string;
  body: string;
}

export function SenseVerdict({ state, title, body }: SenseVerdictProps) {
  return (
    <div className="verdict" key={state} aria-live="polite">
      <p className="verdict-title">{title}</p>
      <p className="verdict-body">{body}</p>
    </div>
  );
}
