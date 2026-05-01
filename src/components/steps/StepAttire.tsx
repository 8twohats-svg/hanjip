import { attireGrades } from "../../data/regions";
import type { AttireGradeId } from "../../types";
import { ChoiceCard } from "../ChoiceCard";

type Props = {
  value?: AttireGradeId;
  onChange: (value: AttireGradeId) => void;
};

export function StepAttire({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          신랑 예복은 어떻게?
        </h2>
        <p className="text-muted">결혼식 입을 양복</p>
      </div>

      <div className="space-y-3">
        {attireGrades.map((grade) => (
          <ChoiceCard
            key={grade.id}
            label={grade.label}
            description={grade.description}
            selected={value === grade.id}
            onClick={() => onChange(grade.id)}
          />
        ))}
      </div>
    </div>
  );
}
