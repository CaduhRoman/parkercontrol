import {
  IconDiary,
  IconSpiderMask,
  IconTarget,
  IconTrophy,
  IconWeb,
  type IconProps,
} from './Icon';
import spideyButtonImg from '../../assets/buttonspidey.png';

export type NavTabId = 'teia' | 'diario' | 'spider-sense' | 'foco' | 'momentos';

interface NavTabDef {
  id: NavTabId;
  label: string;
  Icon: (props: IconProps) => React.ReactElement;
  center?: boolean;
}

const TABS: NavTabDef[] = [
  { id: 'teia', label: 'Teia', Icon: IconWeb },
  { id: 'diario', label: 'Diário', Icon: IconDiary },
  { id: 'spider-sense', label: 'Spider-Sense', Icon: IconSpiderMask, center: true },
  { id: 'foco', label: 'Foco', Icon: IconTarget },
  { id: 'momentos', label: 'Momentos', Icon: IconTrophy },
];

interface BottomNavProps {
  active: NavTabId;
  onChange: (tab: NavTabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const classes = ['nav-item'];
        if (tab.center) classes.push('is-center');
        if (isActive) classes.push('is-active');
        return (
          <button
            key={tab.id}
            type="button"
            className={classes.join(' ')}
            aria-current={isActive ? 'page' : undefined}
            aria-label={tab.label}
            onClick={() => !isActive && onChange(tab.id)}
          >
            {tab.center ? (
              <span className="nav-sphere" aria-hidden="true">
                <img src={spideyButtonImg} alt="" className="nav-sphere-img" />
              </span>
            ) : (
              <>
                <tab.Icon size={22} strokeWidth={2} />
                <span className="nav-label">{tab.label}</span>
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
}
