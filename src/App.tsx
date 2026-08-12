import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './core/hooks/usePrefersReducedMotion';
import { TasksProvider } from './modules/spider-sense/store/TasksContext';
import { FocusProvider } from './modules/foco/store/FocusContext';
import { SpiderSenseScreen } from './modules/spider-sense/SpiderSenseScreen';
import { FocusScreen } from './modules/foco/FocusScreen';
import { BottomNav, type NavTabId } from './core/ui/BottomNav';

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState<NavTabId>('spider-sense');

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reduced);
  }, [reduced]);

  return (
    <TasksProvider>
      <FocusProvider>
        {activeTab === 'spider-sense' && <SpiderSenseScreen />}
        {activeTab === 'foco' && <FocusScreen />}
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </FocusProvider>
    </TasksProvider>
  );
}
