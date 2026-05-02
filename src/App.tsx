import { useEffect, useState } from "react";
import { Wizard } from "./components/Wizard";
import { decodeAnswers, isAnswersComplete } from "./lib/share";
import { track } from "./lib/analytics";
import type { Answers } from "./types";

function App() {
  const [started, setStarted] = useState(false);
  const [initialAnswers, setInitialAnswers] = useState<Answers | undefined>(
    undefined,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const decoded = decodeAnswers(params);
    if (isAnswersComplete(decoded)) {
      setInitialAnswers(decoded);
      setStarted(true);
      track.resumeFromUrl();
    } else {
      track.landingView();
    }
  }, []);

  const handleStart = () => {
    track.wizardStarted();
    setStarted(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        {!started ? (
          <Landing onStart={handleStart} />
        ) : (
          <Wizard initialAnswers={initialAnswers} />
        )}

        <footer className="mt-16 text-center text-xs text-muted space-y-2">
          <div className="space-x-2 flex flex-wrap justify-center gap-y-1">
            <a href="/guide/" className="hover:text-charcoal transition-colors">
              결혼 비용 가이드
            </a>
            <span>·</span>
            <a
              href="/sdm-prices/"
              className="hover:text-charcoal transition-colors"
            >
              스드메 가격
            </a>
            <span>·</span>
            <a
              href="/honeymoon-cost/"
              className="hover:text-charcoal transition-colors"
            >
              신혼여행 비용
            </a>
          </div>
          <div className="space-x-3">
            <a
              href="/privacy/"
              className="hover:text-charcoal transition-colors"
            >
              개인정보처리방침
            </a>
            <span>·</span>
            <a
              href="/terms/"
              className="hover:text-charcoal transition-colors"
            >
              이용약관
            </a>
          </div>
          <p>© 2026 한집</p>
        </footer>
      </div>
    </div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-10 pt-8 sm:pt-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
          결혼 비용,
          <br />
          얼마나 들까요?
        </h1>
        <p className="text-muted leading-relaxed">
          가볍게 골라보고 알아보세요
        </p>
        <p className="text-xs text-muted/70 pt-2">
          * 정확한 견적이 아니라, 대략적인 참고용 추정치예요
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full py-5 rounded-2xl bg-rose text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-rose/20"
      >
        시작하기 →
      </button>
    </div>
  );
}

export default App;
