import { useEffect, useState } from "react";
import type { Answers } from "../types";
import {
  calculateCost,
  calculateRegionalCeremonyAverage,
  getRegionalStats,
  formatKRW,
} from "../lib/calculate";
import {
  regions,
  styles,
  guestOptions,
  sdmGrades,
  attireGrades,
  ringOptions,
  honeymoonOptions,
} from "../data/regions";
import { copyToClipboard, generateShareText } from "../lib/share";
import { track } from "../lib/analytics";

type Props = {
  answers: Required<Answers>;
  onRestart: () => void;
};

export function QuickResult({ answers, onRestart }: Props) {
  const cost = calculateCost(answers);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    track.resultView(cost.total, cost.net);
  }, [cost.total, cost.net]);

  const handleShare = async () => {
    track.shareClicked();
    const text = generateShareText(answers, cost);
    const ok = await copyToClipboard(text);
    if (ok) {
      track.shareCopied();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const region = regions.find((r) => r.id === answers.region);
  const style = styles.find((s) => s.id === answers.style);
  const guests = guestOptions.find((g) => g.id === answers.guests);
  const sdm = sdmGrades.find((s) => s.id === answers.sdm);
  const attire = attireGrades.find((a) => a.id === answers.attire);
  const ring = ringOptions.find((r) => r.id === answers.ring);
  const honeymoon = honeymoonOptions.find((h) => h.id === answers.honeymoon);
  const regionalStats = getRegionalStats(answers.region);

  const regionalCeremonyAvg = calculateRegionalCeremonyAverage(
    answers.region,
    answers.style,
  );

  // 결혼식 자체 손익
  const ceremonyNet = cost.ceremonyTotal - cost.giftMoney;
  const ceremonyIsProfit = ceremonyNet < 0;

  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-900 leading-relaxed">
        💡 정확한 견적이 아니라 <strong>대략적인 참고용 추정치</strong>예요. 실제 비용은 업체·시기·옵션에 따라 크게 달라질 수 있어요.
      </div>

      {/* 핵심 숫자 2개 */}
      <div className="space-y-3">
        {/* 필요한 금액 (자기 부담) */}
        <div className="bg-charcoal text-white rounded-3xl p-7 text-center space-y-2">
          <p className="text-sm text-white/70">결혼하려면 필요한 금액</p>
          <p className="text-5xl font-bold text-rose">
            {formatKRW(cost.net)}
          </p>
          <p className="text-xs text-white/60">
            축의금 회수 후, 자기 부담
          </p>
        </div>

        {/* 총 비용 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-baseline justify-between">
          <div>
            <p className="text-xs text-muted">총 비용</p>
            <p className="text-xs text-muted">결혼식까지 들어가는 모든 비용</p>
          </div>
          <p className="text-2xl font-bold text-charcoal">
            {formatKRW(cost.total)}
          </p>
        </div>
      </div>

      {/* 자금 흐름 시간순 */}
      <div className="space-y-3">
        {/* 결혼식 전 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <p className="text-xs text-muted">① 결혼식 전</p>
              <h3 className="font-semibold text-charcoal">
                미리 결제할 비용
              </h3>
            </div>
            <span className="text-xl font-bold text-charcoal">
              {formatKRW(cost.prepTotal)}
            </span>
          </div>
          <p className="text-xs text-muted">
            상견례 · 스드메 · 예복 · 결혼반지 · 청첩장 · 신혼여행
          </p>
        </div>

        {/* 결혼식 당일 */}
        <div className="bg-rose-soft rounded-2xl p-5">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <p className="text-xs text-muted">② 결혼식 당일</p>
              <h3 className="font-semibold text-charcoal">결혼식장 정산</h3>
            </div>
            <span className="text-xl font-bold text-charcoal">
              {formatKRW(cost.ceremonyTotal)}
            </span>
          </div>
          <p className="text-xs text-muted mb-3">
            대관료 · 식대 · 답례품·부케·사회자·헬퍼
          </p>
          <div className="bg-white rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted">
                축의금 ({guests?.count}명 × 10만원)
              </span>
              <span className="text-emerald-600">
                + {formatKRW(cost.giftMoney)}
              </span>
            </div>
            <div className="flex justify-between text-sm pt-1.5 border-t border-gray-100">
              <span className="font-medium text-charcoal">
                {ceremonyIsProfit ? "✨ 결혼식 흑자" : "결혼식 부담"}
              </span>
              <span
                className={`font-bold ${ceremonyIsProfit ? "text-emerald-600" : "text-rose"}`}
              >
                {ceremonyIsProfit ? "+" : "-"}
                {formatKRW(Math.abs(ceremonyNet))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 항목별 상세 (펼쳐서) */}
      <details
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        onToggle={(e) => {
          if ((e.currentTarget as HTMLDetailsElement).open) {
            track.detailsExpanded();
          }
        }}
      >
        <summary className="p-5 cursor-pointer font-semibold text-charcoal hover:bg-gray-50">
          항목별 상세 보기
        </summary>
        <div className="p-5 pt-0 space-y-4">
          <DetailGroup
            title="결혼식 전 (사전 결제)"
            total={cost.prepTotal}
            items={[
              { label: "상견례", value: cost.sangkyenrye },
              {
                label: "스드메 + 본식 촬영",
                value: cost.sdm,
                hint: sdm?.label,
              },
              {
                label: "신랑 예복 (양복)",
                value: cost.attire,
                hint: attire?.label,
              },
              { label: "혼주 메이크업·한복", value: cost.honjuPrep },
              {
                label: "결혼반지 (한 쌍)",
                value: cost.ring,
                hint: ring?.label,
              },
              { label: "청첩장 + 청첩장 모임", value: cost.invitation },
              {
                label: "신혼여행",
                value: cost.honeymoon,
                hint: honeymoon?.label,
              },
            ]}
          />
          <DetailGroup
            title={`결혼식 당일 (${region?.label} · ${style?.label})`}
            total={cost.ceremonyTotal}
            items={[
              { label: "대관료", value: cost.venueRent },
              {
                label: `식대 (${guests?.count}명 × ${formatKRW(regionalStats.meal.mine)})`,
                value: cost.meal,
              },
              { label: "답례품·부케·사회자·헬퍼", value: cost.ceremonyExtra },
            ]}
          />
        </div>
      </details>

      {/* 지역 통계 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
        <h3 className="font-semibold text-charcoal">
          {region?.label} 의 결혼 비용 위치
        </h3>
        <div className="space-y-3 text-sm">
          <RegionStat
            label="1인당 식대"
            mine={regionalStats.meal.mine}
            min={regionalStats.meal.min}
            max={regionalStats.meal.max}
          />
          <RegionStat
            label="대관료 (일반 예식장)"
            mine={regionalStats.venue.mine}
            min={regionalStats.venue.min}
            max={regionalStats.venue.max}
          />
          <RegionStat
            label="스드메 평균"
            mine={regionalStats.sdm.mine}
            min={regionalStats.sdm.min}
            max={regionalStats.sdm.max}
          />
        </div>
        <p className="text-xs text-muted pt-2 border-t border-gray-100">
          {region?.label} · {style?.label} 평균 결혼식 비용:{" "}
          <span className="font-medium text-charcoal">
            {formatKRW(regionalCeremonyAvg)}
          </span>
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleShare}
          className="w-full py-4 rounded-2xl bg-rose text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-rose/20"
        >
          {copied ? "✓ 결과가 복사됐어요!" : "📋 결과 복사 (카톡 공유용)"}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-white text-charcoal font-semibold border border-gray-200 hover:bg-gray-50"
        >
          처음부터 다시
        </button>
      </div>

      <p className="text-xs text-muted text-center px-4 leading-relaxed">
        * 모든 금액은 평균값을 활용한 <strong>추정치</strong>예요.<br />
        실제 결혼 비용은 지역·시기·업체·개인 선택에 따라 크게 다릅니다.<br />
        참고 자료로만 활용해주세요.
      </p>
    </div>
  );
}

function DetailGroup({
  title,
  total,
  items,
}: {
  title: string;
  total: number;
  items: { label: string; value: number; hint?: string }[];
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <p className="text-sm font-medium text-charcoal">{title}</p>
        <p className="text-sm font-bold text-charcoal">{formatKRW(total)}</p>
      </div>
      <div className="space-y-1.5 pl-2 border-l-2 border-gray-100">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between text-sm pl-3">
            <span className="text-muted">
              {item.label}
              {item.hint && (
                <span className="ml-1 text-xs text-rose">({item.hint})</span>
              )}
            </span>
            <span className="text-charcoal">{formatKRW(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionStat({
  label,
  mine,
  min,
  max,
}: {
  label: string;
  mine: number;
  min: number;
  max: number;
}) {
  const position = ((mine - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-charcoal">{label}</span>
        <span className="font-medium text-rose">{formatKRW(mine)}</span>
      </div>
      <div className="relative h-1 bg-gray-200 rounded-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-rose"
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted mt-1">
        <span>최저 {formatKRW(min)}</span>
        <span>최고 {formatKRW(max)}</span>
      </div>
    </div>
  );
}
