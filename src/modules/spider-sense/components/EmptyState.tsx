interface EmptyStateProps {
  doneToday: number;
  onAdd: () => void;
}

export function EmptyState({ doneToday, onAdd }: EmptyStateProps) {
  return (
    <div className="empty">
      <p className="empty-title">
        {doneToday > 0 ? 'Você está em dia.' : 'Tudo tranquilo por aqui.'}
      </p>
      <p className="empty-body">
        {doneToday > 0
          ? `Nenhuma ameaça no radar. Você já cuidou de ${doneToday} foco${
              doneToday > 1 ? 's' : ''
            } hoje.`
          : 'Nenhuma ameaça detectada. Quando surgir algo, é aqui que ele aparece.'}
      </p>
      <button type="button" className="empty-cta" onClick={onAdd}>
        Adicionar primeiro foco
      </button>
    </div>
  );
}
