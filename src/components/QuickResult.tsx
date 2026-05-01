import { useEffect, useState } from "react";
import type { Answers } from "../types";
import {
  calculateCost,
  calculateRegionalCeremonyAverage,
  calculateRange,
  getOverallTier,
  getItemTiers,
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
  seasons,
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
  const season = seasons.find((s) => s.id === answers.season);
  const regionalStats = getRegionalStats(answers.region);

  const regionalCeremonyAvg = calculateRegionalCeremonyAverage(
    answers.region,
    answers.style,
  );

  const ceremonyNet = cost.ceremonyTotal - cost.giftMoney;
  const ceremonyIsProfit = ceremonyNet < 0;

  const range = calculateRange(
    answers.season,
    answers.region,
    answers.style,
    answers.guests,
  );
  const { tier, percentile } = getOverallTier(cost.total, range);
  const itemTiers = getItemTiers(answers);

  // 카테고리별 분류 (결혼식 전 사전 결제)
  const SDM_PHOTO_VALUE = 800_000; // 본식 촬영 분리
  const SDM_ONLY_VALUE = cost.sdm - SDM_PHOTO_VALUE;

  const categories = [
    {
      emoji: "🤝",
      title: "상견례",
      total: cost.sangkyenrye,
      details: [{ label: "양가 식사·인사 선물", value: cost.sangkyenrye }],
    },
    {
      emoji: "📷",
      title: "스드메",
      total: cost.sdm,
      details: [
        {
          label: `스튜디오·드레스·메이크업 (${sdm?.label})`,
          value: SDM_ONLY_VALUE,
        },
        { label: "본식 촬영·영상", value: SDM_PHOTO_VALUE },
      ],
    },
    {
      emoji: "👔",
      title: "의복",
      total: cost.attire + cost.honjuPrep,
      details: [
        {
          label: `신랑 예복 (${attire?.label})`,
          value: cost.attire,
        },
        {
          label: "양가 부모 한복·정장·메이크업",
          value: cost.honjuPrep,
        },
      ],
    },
    {
      emoji: "💍",
      title: "결혼반지",
      total: cost.ring,
      details: [{ label: `한 쌍 (${ring?.label})`, value: cost.ring }],
    },
    {
      emoji: "📩",
      title: "청첩장",
      total: cost.invitation,
      details: [
        { label: "청첩장 디자인·제작", value: 400_000 },
        { label: "청첩장 모임 (지인 식사)", value: cost.invitation - 400_000 },
      ],
    },
    {
      emoji: "✈️",
      title: "신혼여행",
      total: cost.honeymoon,
      details: [
        {
          label: `${honeymoon?.label} (${season?.label} 시즌)`,
          value: cost.honeymoon,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-3xl border border-gray-200 p-7 sm:p-9 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-muted">
              결혼식 전 미리 필요한 돈
            </p>
            <p className="text-4xl sm:text-5xl font-bold text-rose tracking-tight mt-1.5">
              {formatKRW(cost.prepTotal)}
            </p>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              상견례·스드메·의복·반지·청첩장·신혼여행 사전 결제
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted">평가</p>
            <p className="text-2xl mt-1.5">{tier.emoji}</p>
            <p className="font-bold text-sm sm:text-base text-charcoal">
              {tier.label}
            </p>
          </div>
        </div>

        {/* 위치바 */}
        <div>
          <div className="relative h-2 bg-white rounded-full overflow-hidden border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-300" />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-charcoal border-2 border-white shadow"
              style={{ left: `${Math.max(2, Math.min(98, percentile))}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted mt-2">
            <span>가성비</span>
            <span>표준</span>
            <span>럭셔리</span>
          </div>
          <p className="text-xs text-muted mt-3 leading-relaxed">
            같은 조건 가능 범위 {formatKRW(range.min)} ~ {formatKRW(range.max)}{" "}
            —{" "}
            <span className="text-charcoal font-medium">
              상위 {100 - percentile}%
            </span>
          </p>
        </div>

        {/* 지역 통계 */}
        <div className="pt-5 border-t border-gray-200">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-xs text-muted uppercase tracking-wider font-medium">
              {region?.label} 결혼 비용
            </p>
            <p className="text-xs text-muted">전국 평균 대비</p>
          </div>
          <div className="space-y-3">
            <RegionStat
              label="1인당 식대"
              mine={regionalStats.meal.mine}
              min={regionalStats.meal.min}
              max={regionalStats.meal.max}
            />
            <RegionStat
              label="대관료"
              mine={regionalStats.venue.mine}
              min={regionalStats.venue.min}
              max={regionalStats.venue.max}
            />
            <RegionStat
              label="스드메"
              mine={regionalStats.sdm.mine}
              min={regionalStats.sdm.min}
              max={regionalStats.sdm.max}
            />
          </div>
          <p className="text-xs text-muted mt-3 leading-relaxed">
            {region?.label} · {style?.label} 평균:{" "}
            <span className="font-medium text-charcoal">
              {formatKRW(regionalCeremonyAvg)}
            </span>
          </p>
        </div>

        {/* 항목별 선택 스타일 */}
        <div className="pt-5 border-t border-gray-200">
          <p className="text-xs text-muted mb-3 uppercase tracking-wider font-medium">
            항목별 선택 스타일
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <ItemTierRow
              label="스드메"
              choice={sdm?.label}
              tier={itemTiers.sdm}
            />
            <ItemTierRow
              label="신랑 예복"
              choice={attire?.label}
              tier={itemTiers.attire}
            />
            <ItemTierRow
              label="결혼반지"
              choice={ring?.label}
              tier={itemTiers.ring}
            />
            <ItemTierRow
              label="신혼여행"
              choice={honeymoon?.label}
              tier={itemTiers.honeymoon}
            />
          </div>
        </div>
      </div>

      {/* 결혼식 사전 결제 (Hero와 같은 패턴) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-7 sm:p-9 space-y-5">
        <div>
          <p className="text-xs sm:text-sm text-muted">사전 결제 금액</p>
          <p className="text-3xl sm:text-4xl font-bold text-rose tracking-tight mt-1.5">
            - {formatKRW(cost.prepTotal)}
          </p>
        </div>

        {/* 2열 카테고리 (테두리 없이, - 빨강) */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 pt-4 border-t border-gray-200">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="flex items-center justify-between text-sm gap-2"
            >
              <span className="flex items-center gap-1.5 text-charcoal min-w-0">
                <span className="text-base shrink-0">{cat.emoji}</span>
                <span className="truncate">{cat.title}</span>
              </span>
              <span className="font-medium text-rose shrink-0">
                - {formatKRW(cat.total)}
              </span>
            </div>
          ))}
        </div>

        {/* 상세 보기 */}
        <details
          className="group pt-2 border-t border-gray-200"
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) {
              track.detailsExpanded();
            }
          }}
        >
          <summary className="cursor-pointer text-sm text-muted hover:text-charcoal flex items-center justify-center gap-1 list-none py-2">
            <span>상세 보기</span>
            <span className="transition-transform group-open:rotate-180 text-xs">
              ▾
            </span>
          </summary>
          <div className="pt-4 space-y-4">
            {categories.map((cat) => (
              <div key={cat.title}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-sm font-medium text-charcoal">
                    {cat.title}
                  </span>
                </div>
                <div className="space-y-1.5 pl-7">
                  {cat.details.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted">{d.label}</span>
                      <span className="text-charcoal">
                        {formatKRW(d.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* 결혼식 당일 비용 (흑자/적자 메인) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-7 sm:p-9 space-y-5">
        <div>
          <p className="text-xs sm:text-sm text-muted">결혼식 당일 비용</p>
          <p
            className={`text-3xl sm:text-4xl font-bold tracking-tight mt-1.5 ${
              ceremonyIsProfit ? "text-blue-600" : "text-rose"
            }`}
          >
            {ceremonyIsProfit ? "+" : "-"}
            {formatKRW(Math.abs(ceremonyNet))}
            <span className="text-base ml-2 font-medium text-charcoal">
              {ceremonyIsProfit ? "흑자" : "추가 부담"}
            </span>
          </p>
        </div>

        {/* 비용 항목 (- 빨간색) */}
        <div className="space-y-2 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal">대관료</span>
            <span className="font-medium text-rose">
              - {formatKRW(cost.venueRent)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal">
              식대 ({Math.round(regionalStats.meal.mine / 10_000)}만원 ×{" "}
              {guests?.count}명)
            </span>
            <span className="font-medium text-rose">
              - {formatKRW(cost.meal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal">답례품·부케·사회자·헬퍼</span>
            <span className="font-medium text-rose">
              - {formatKRW(cost.ceremonyExtra)}
            </span>
          </div>

          {/* 축의금 (+ 초록색, 분리) */}
          <div className="flex items-center justify-between text-sm pt-3 mt-1 border-t border-gray-200">
            <span className="text-charcoal">
              축의금 (10만원 × {guests?.count}명)
            </span>
            <span className="font-medium text-blue-600">
              + {formatKRW(cost.giftMoney)}
            </span>
          </div>
        </div>
      </div>

      {/* 액션 */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleShare}
          className="w-full py-4 rounded-2xl bg-rose text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {copied ? "✓ 결과가 복사됐어요" : "결과 공유하기"}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-3 text-sm text-muted hover:text-charcoal transition-colors"
        >
          처음부터 다시
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted/70 text-center px-4 leading-relaxed pt-2">
        대략적인 참고용 추정치예요.
        <br />
        실제 비용은 업체·시기·옵션에 따라 달라집니다.
      </p>
    </div>
  );
}

function ItemTierRow({
  label,
  choice,
  tier,
}: {
  label: string;
  choice?: string;
  tier: { label: string; emoji: string; tier: string };
}) {
  const colorClass =
    tier.tier === "thrifty"
      ? "text-emerald-700 bg-emerald-50"
      : tier.tier === "standard"
        ? "text-amber-700 bg-amber-50"
        : "text-rose bg-white";
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="text-charcoal text-sm font-medium">{label}</div>
        <div className="text-muted text-xs mt-0.5 truncate">{choice}</div>
      </div>
      <span
        className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}
      >
        {tier.emoji} {tier.label}
      </span>
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
      <div className="flex justify-between mb-1.5 text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-charcoal">{formatKRW(mine)}</span>
      </div>
      <div className="relative h-1 bg-gray-100 rounded-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose"
          style={{ left: `${position}%` }}
        />
      </div>
    </div>
  );
}
