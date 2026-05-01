import { ringOptions } from "../../data/regions";
import type { RingId } from "../../types";
import { ChoiceCard } from "../ChoiceCard";

type Props = {
  value?: RingId;
  onChange: (value: RingId) => void;
};

export function StepRing({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          결혼반지는 어디서?
        </h2>
        <p className="text-muted">한 쌍 기준이에요</p>
      </div>

      <div className="space-y-3">
        {ringOptions.map((opt) => (
          <ChoiceCard
            key={opt.id}
            label={opt.label}
            description={opt.description}
            selected={value === opt.id}
            onClick={() => onChange(opt.id)}
          />
        ))}
      </div>
    </div>
  );
}
