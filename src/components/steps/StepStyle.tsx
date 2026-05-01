import { styles } from "../../data/regions";
import type { StyleId } from "../../types";
import { ChoiceCard } from "../ChoiceCard";

type Props = {
  value?: StyleId;
  onChange: (value: StyleId) => void;
};

export function StepStyle({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          어떤 스타일의 결혼식이에요?
        </h2>
        <p className="text-muted">예식 형태에 따라 분위기와 비용이 달라져요</p>
      </div>

      <div className="space-y-3">
        {styles.map((style) => (
          <ChoiceCard
            key={style.id}
            label={style.label}
            description={style.description}
            selected={value === style.id}
            onClick={() => onChange(style.id)}
          />
        ))}
      </div>
    </div>
  );
}
