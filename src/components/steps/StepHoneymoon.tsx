import { honeymoonOptions } from "../../data/regions";
import type { HoneymoonId } from "../../types";
import { ChoiceCard } from "../ChoiceCard";

type Props = {
  value?: HoneymoonId;
  onChange: (value: HoneymoonId) => void;
};

export function StepHoneymoon({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          신혼여행은 어디로?
        </h2>
        <p className="text-muted">결혼 전 미리 예약·결제하는 게 보통이에요</p>
      </div>

      <div className="space-y-3">
        {honeymoonOptions.map((opt) => (
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
