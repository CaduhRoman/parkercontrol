import { useRef, useState } from 'react';
import { useTasks } from '../store/TasksContext';
import { isActive, sortByImportance } from '../domain/logic';
import { PriorityItem } from './PriorityItem';

interface PriorityListProps {
  lastAddedId: string | null;
}

export function PriorityList({ lastAddedId }: PriorityListProps) {
  const { tasks, toggleTask } = useTasks();
  const [leavingIds, setLeavingIds] = useState<ReadonlySet<string>>(new Set());
  const timeouts = useRef(new Map<string, number>());

  const active = tasks.filter(isActive).sort(sortByImportance);

  const handleComplete = (id: string) => {
    if (leavingIds.has(id)) return;
    setLeavingIds((prev) => new Set(prev).add(id));
    const timer = window.setTimeout(() => {
      timeouts.current.delete(id);
      setLeavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toggleTask(id);
    }, 480);
    timeouts.current.set(id, timer);
  };

  return (
    <ul className="priority-list">
      {active.map((task) => (
        <li
          key={task.id}
          className="item-wrap"
          data-leaving={leavingIds.has(task.id) ? 'true' : undefined}
        >
          <div className="item-collapse">
            <PriorityItem
              task={task}
              isNew={task.id === lastAddedId}
              isLeaving={leavingIds.has(task.id)}
              onComplete={handleComplete}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
