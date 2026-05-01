import { guestOptions } from "../../data/regions";
import type { GuestId } from "../../types";
import { ChoiceCard } from "../ChoiceCard";

type Props = {
  value?: GuestId;
  onChange: (value: GuestId) => void;
};

export function StepGuests({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          하객은 어느 정도 예상하세요?
        </h2>
        <p className="text-muted">양가 합쳐서 대략적인 수예요</p>
      </div>

      <div className="space-y-3">
        {guestOptions.map((guest) => (
          <ChoiceCard
            key={guest.id}
            label={guest.label}
            description={guest.description}
            selected={value === guest.id}
            onClick={() => onChange(guest.id)}
          />
        ))}
      </div>
    </div>
  );
}
