import { seasons } from "../../data/regions";
import type { SeasonId } from "../../types";

type Props = {
  value?: SeasonId;
  onChange: (value: SeasonId) => void;
};

export function StepSeason({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          언제쯤 결혼하실 거예요?
        </h2>
        <p className="text-muted">계절에 따라 결혼식·신혼여행 비용이 달라요</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {seasons.map((season) => {
          const isSelected = value === season.id;
          return (
            <button
              key={season.id}
              type="button"
              onClick={() => onChange(season.id)}
              className={`text-left p-5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-rose bg-rose-soft"
                  : "border-gray-200 bg-white hover:border-rose hover:bg-rose-soft/30"
              }`}
            >
              <div className="text-2xl mb-2">{season.emoji}</div>
              <div className="font-semibold text-charcoal">{season.label}</div>
              <div className="text-xs text-muted mt-1 leading-relaxed">
                {season.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
