import { useEffect, useState } from "react";
import type {
  Answers,
  AttireGradeId,
  GuestId,
  HoneymoonId,
  RegionId,
  RingId,
  SdmGradeId,
  StyleId,
} from "../types";
import { ProgressBar } from "./ProgressBar";
import { StepRegion } from "./steps/StepRegion";
import { StepStyle } from "./steps/StepStyle";
import { StepGuests } from "./steps/StepGuests";
import { StepSdm } from "./steps/StepSdm";
import { StepAttire } from "./steps/StepAttire";
import { StepRing } from "./steps/StepRing";
import { StepHoneymoon } from "./steps/StepHoneymoon";
import { QuickResult } from "./QuickResult";
import { encodeAnswers, isAnswersComplete } from "../lib/share";
import { track } from "../lib/analytics";

const TOTAL_STEPS = 7;

const STEP_NAMES: Record<number, string> = {
  1: "region",
  2: "style",
  3: "guests",
  4: "sdm",
  5: "attire",
  6: "ring",
  7: "honeymoon",
};

type Props = {
  initialAnswers?: Answers;
};

export function Wizard({ initialAnswers }: Props) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(initialAnswers ?? {});
  const [showResult, setShowResult] = useState(
    !!initialAnswers && isAnswersComplete(initialAnswers),
  );

  // URL 동기화
  useEffect(() => {
    if (showResult && isAnswersComplete(answers)) {
      const params = encodeAnswers(answers);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
    } else if (!showResult && step === 1 && Object.keys(answers).length === 0) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [showResult, answers, step]);

  // 스텝 뷰 트래킹
  useEffect(() => {
    if (!showResult) {
      track.stepView(step, STEP_NAMES[step]);
    }
  }, [step, showResult]);

  const setAndNext = <K extends keyof Answers>(
    key: K,
    value: NonNullable<Answers[K]>,
  ) => {
    track.stepCompleted(step, STEP_NAMES[step], String(value));
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // 마지막 스텝 완료 → 위자드 종료
      if (isAnswersComplete(newAnswers)) {
        track.wizardCompleted({
          region: newAnswers.region,
          style: newAnswers.style,
          guests: newAnswers.guests,
          sdm: newAnswers.sdm,
          attire: newAnswers.attire,
          ring: newAnswers.ring,
          honeymoon: newAnswers.honeymoon,
        });
      }
      setShowResult(true);
    }
  };

  const restart = () => {
    track.restartClicked();
    setAnswers({});
    setStep(1);
    setShowResult(false);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (showResult && isAnswersComplete(answers)) {
    return <QuickResult answers={answers} onRestart={restart} />;
  }

  return (
    <div className="space-y-8">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <StepRegion
          value={answers.region}
          onChange={(v: RegionId) => setAndNext("region", v)}
        />
      )}
      {step === 2 && (
        <StepStyle
          value={answers.style}
          onChange={(v: StyleId) => setAndNext("style", v)}
        />
      )}
      {step === 3 && (
        <StepGuests
          value={answers.guests}
          onChange={(v: GuestId) => setAndNext("guests", v)}
        />
      )}
      {step === 4 && (
        <StepSdm
          value={answers.sdm}
          onChange={(v: SdmGradeId) => setAndNext("sdm", v)}
        />
      )}
      {step === 5 && (
        <StepAttire
          value={answers.attire}
          onChange={(v: AttireGradeId) => setAndNext("attire", v)}
        />
      )}
      {step === 6 && (
        <StepRing
          value={answers.ring}
          onChange={(v: RingId) => setAndNext("ring", v)}
        />
      )}
      {step === 7 && (
        <StepHoneymoon
          value={answers.honeymoon}
          onChange={(v: HoneymoonId) => setAndNext("honeymoon", v)}
        />
      )}

      {step > 1 && (
        <button
          type="button"
          onClick={goBack}
          className="text-sm text-muted hover:text-charcoal"
        >
          ← 이전
        </button>
      )}
    </div>
  );
}
