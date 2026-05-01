type Props = {
  label: string;
  description?: string;
  emoji?: string;
  selected?: boolean;
  onClick: () => void;
};

export function ChoiceCard({ label, description, emoji, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
        selected
          ? "border-rose bg-rose-soft"
          : "border-gray-200 bg-white hover:border-rose hover:bg-rose-soft/30"
      }`}
    >
      <div className="flex items-center gap-3">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <div className="flex-1">
          <div className="font-semibold text-charcoal">{label}</div>
          {description && (
            <div className="text-sm text-muted mt-1">{description}</div>
          )}
        </div>
      </div>
    </button>
  );
}
