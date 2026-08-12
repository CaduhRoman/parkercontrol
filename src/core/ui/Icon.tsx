export interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function svgProps({ size = 20, strokeWidth = 2, className }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };
}

export function IconPlus(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconClose(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconChevron(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconWeb(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.6" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
      <path d="M6.9 6.9c-1 2.6-1.8 5.1-2.9 7.3M17.1 6.9c1 2.6 1.8 5.1 2.9 7.3" />
      <path d="M6.9 17.1c2.6-1 5.1-1.8 7.3-2.9M17.1 17.1c-2.6 1-5.1 1.8-7.3 2.9" />
    </svg>
  );
}

export function IconDiary(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function IconTarget(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTrophy(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

export function IconPlay(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <path d="M5 3v18l14-9-14-9Z" />
    </svg>
  );
}

export function IconPause(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

export function IconStop(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

export function IconForward(p: IconProps) {
  return (
    <svg {...svgProps(p)}>
      <path d="M5 18V6l12 6-12 6Z" />
      <path d="M17 18V6l12 6-12 6Z" />
    </svg>
  );
}

export function IconSpiderMask({ size = 46 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="#a02632" strokeWidth="1.1" opacity="0.55">
        <path d="M50 50V5M50 50V95M50 50H5M50 50H95" />
        <path d="M50 50 18 18M50 50 82 18M50 50 18 82M50 50 82 82" />
        <circle cx="50" cy="50" r="16" />
        <circle cx="50" cy="50" r="28" />
        <circle cx="50" cy="50" r="40" />
      </g>

      <g fill="#ffffff" stroke="#19060b" strokeWidth="2" strokeLinejoin="round">
        <path d="M15 28C11 32 11 40 16 45L44 35Z" />
        <path d="M85 28C89 32 89 40 84 45L56 35Z" />
      </g>

      <g transform="translate(50 64) scale(0.82) translate(-50 -64)">
        <g fill="none" stroke="#19060b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M46 55 29 48 20 51" />
          <path d="M45 59 28 58 18 62" />
          <path d="M45 65 29 70 19 68" />
          <path d="M46 71 33 78 23 82" />
          <path d="M54 55 71 48 80 51" />
          <path d="M55 59 72 58 82 62" />
          <path d="M55 65 71 70 81 68" />
          <path d="M54 71 67 78 77 82" />
        </g>

        <g fill="#19060b">
          <ellipse cx="50" cy="53" rx="4.2" ry="4.6" />
          <path d="M50 57.5C46 57.5 43.6 61 44.5 65.5C45.2 69.5 47.2 72.5 50 72.5C52.8 72.5 54.8 69.5 55.5 65.5C56.4 61 54 57.5 50 57.5Z" />
        </g>
      </g>
    </svg>
  );
}
