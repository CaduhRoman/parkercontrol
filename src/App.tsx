import { useEffect } from 'react';
import { usePrefersReducedMotion } from './core/hooks/usePrefersReducedMotion';
import { TasksProvider } from './modules/spider-sense/store/TasksContext';
import { SpiderSenseScreen } from './modules/spider-sense/SpiderSenseScreen';
import { BottomNav } from './core/ui/BottomNav';

export default function App() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reduced);
  }, [reduced]);

  return (
    <TasksProvider>
      <SpiderSenseScreen />
      <BottomNav />
    </TasksProvider>
  );
}
