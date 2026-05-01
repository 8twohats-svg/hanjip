import { sdmGrades } from "../../data/regions";
import type { SdmGradeId } from "../../types";
import { ChoiceCard } from "../ChoiceCard";

type Props = {
  value?: SdmGradeId;
  onChange: (value: SdmGradeId) => void;
};

export function StepSdm({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          스드메는 어떤 등급으로?
        </h2>
        <p className="text-muted">스튜디오·드레스·메이크업 패키지</p>
      </div>

      <div className="space-y-3">
        {sdmGrades.map((grade) => (
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
