import { useEffect, useRef, type ReactNode } from 'react';
import { IconClose } from './Icon';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Sheet({ open, onClose, label, children }: SheetProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const root = rootRef.current;
        if (!root) return;
        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((el) => !el.hasAttribute('disabled'));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      className="sheet-layer"
      ref={rootRef}
      data-open={open ? 'true' : 'false'}
      aria-hidden={!open}
    >
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label}>
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-header">
          <h3 className="sheet-title">{label}</h3>
          <button
            type="button"
            className="sheet-close"
            onClick={onClose}
            aria-label="Fechar"
            tabIndex={open ? 0 : -1}
          >
            <IconClose size={18} />
          </button>
        </header>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}
