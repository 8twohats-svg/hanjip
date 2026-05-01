import { regions } from "../../data/regions";
import type { RegionId } from "../../types";
import { ChoiceCard } from "../ChoiceCard";

type Props = {
  value?: RegionId;
  onChange: (value: RegionId) => void;
};

export function StepRegion({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          결혼식은 어디서 하실 거예요?
        </h2>
        <p className="text-muted">지역에 따라 평균 비용이 크게 달라요</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {regions.map((region) => (
          <ChoiceCard
            key={region.id}
            label={region.label}
            emoji={region.emoji}
            selected={value === region.id}
            onClick={() => onChange(region.id)}
          />
        ))}
      </div>
    </div>
  );
}
