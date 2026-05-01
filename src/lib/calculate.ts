import type {
  Answers,
  CostBreakdown,
  RegionId,
  StyleId,
  SeasonId,
  SdmGradeId,
  AttireGradeId,
  RingId,
  HoneymoonId,
} from "../types";
import {
  regionAverages,
  styleVenueMultiplier,
  styleMealMultiplier,
  fixedAverages,
  guestOptions,
  sdmGrades,
  attireGrades,
  ringOptions,
  honeymoonOptions,
  seasonVenueMultiplier,
  seasonHoneymoonMultiplier,
} from "../data/regions";

const DEFAULT_GUESTS = 200;

export function calculateCost(answers: Required<Answers>): CostBreakdown {
  const region = regionAverages[answers.region];
  const venueMul = styleVenueMultiplier[answers.style];
  const mealMul = styleMealMultiplier[answers.style];
  const guestCount =
    guestOptions.find((g) => g.id === answers.guests)?.count ?? DEFAULT_GUESTS;

  const sdmGrade = sdmGrades.find((s) => s.id === answers.sdm)!;
  const attireGrade = attireGrades.find((a) => a.id === answers.attire)!;
  const ringOpt = ringOptions.find((r) => r.id === answers.ring)!;
  const honeymoonOpt = honeymoonOptions.find((h) => h.id === answers.honeymoon)!;
  const venueSeasonMul = seasonVenueMultiplier[answers.season];
  const honeymoonSeasonMul =
    seasonHoneymoonMultiplier[answers.honeymoon][answers.season];

  // 결혼식 준비
  const sangkyenrye = fixedAverages.sangkyenrye;
  const sdm = Math.round(region.sdmBase * sdmGrade.multiplier) + fixedAverages.bonsikExtra;
  const attire = attireGrade.value;
  const honjuPrep = fixedAverages.honjuPrep;
  const ring = ringOpt.value;
  const invitation = fixedAverages.invitation;
  const honeymoon = Math.round(honeymoonOpt.value * honeymoonSeasonMul);

  // 결혼식 당일 (성수기·비수기 할증·할인 적용)
  const venueRent = Math.round(region.venueRent * venueMul * venueSeasonMul);
  const meal = Math.round(guestCount * region.mealPerPerson * mealMul);
  const ceremonyExtra = fixedAverages.ceremonyExtra;

  const giftMoney = guestCount * fixedAverages.giftPerGuest;

  const prepTotal =
    sangkyenrye + sdm + attire + honjuPrep + ring + invitation + honeymoon;
  const ceremonyTotal = venueRent + meal + ceremonyExtra;

  const total = prepTotal + ceremonyTotal;
  const net = total - giftMoney;

  return {
    sangkyenrye,
    sdm,
    attire,
    honjuPrep,
    ring,
    invitation,
    honeymoon,
    venueRent,
    meal,
    ceremonyExtra,
    giftMoney,
    total,
    net,
    prepTotal,
    ceremonyTotal,
  };
}

export function calculateRegionalCeremonyAverage(
  regionId: RegionId,
  styleId: StyleId,
): number {
  const region = regionAverages[regionId];
  const venueMul = styleVenueMultiplier[styleId];
  const mealMul = styleMealMultiplier[styleId];
  const venueRent = Math.round(region.venueRent * venueMul);
  const meal = Math.round(DEFAULT_GUESTS * region.mealPerPerson * mealMul);
  return venueRent + meal + fixedAverages.ceremonyExtra;
}

export function getRegionalStats(regionId: RegionId) {
  const region = regionAverages[regionId];
  const allRegions = Object.entries(regionAverages);
  const meals = allRegions.map(([_, r]) => r.mealPerPerson);
  const venues = allRegions.map(([_, r]) => r.venueRent);
  const sdms = allRegions.map(([_, r]) => r.sdmBase);
  return {
    meal: {
      mine: region.mealPerPerson,
      max: Math.max(...meals),
      min: Math.min(...meals),
    },
    venue: {
      mine: region.venueRent,
      max: Math.max(...venues),
      min: Math.min(...venues),
    },
    sdm: {
      mine: region.sdmBase,
      max: Math.max(...sdms),
      min: Math.min(...sdms),
    },
  };
}

// ─────────────────────────────────────────────────────────
// 종합 평가
// ─────────────────────────────────────────────────────────

export type TierId = "thrifty" | "standard" | "luxury";

export type Tier = {
  tier: TierId;
  label: string;
  emoji: string;
  description: string;
};

const TIERS: Record<TierId, Tier> = {
  thrifty: {
    tier: "thrifty",
    label: "가성비형",
    emoji: "💰",
    description: "야무지게 잘 골라낸 알뜰 결혼",
  },
  standard: {
    tier: "standard",
    label: "표준형",
    emoji: "⚖️",
    description: "또래 신혼부부 평균 정도",
  },
  luxury: {
    tier: "luxury",
    label: "럭셔리형",
    emoji: "👑",
    description: "한 번뿐인 결혼, 욕심 좀 내는 스타일",
  },
};

// 같은 시즌·지역·형태·하객수 조건에서 가능한 최저~최고 비용
export function calculateRange(
  season: SeasonId,
  region: RegionId,
  style: StyleId,
  guests: Required<Answers>["guests"],
): { min: number; max: number } {
  const minAnswers: Required<Answers> = {
    season, region, style, guests,
    sdm: "budget",
    attire: "rental",
    ring: "none",
    honeymoon: "none",
  };
  const maxAnswers: Required<Answers> = {
    season, region, style, guests,
    sdm: "premium",
    attire: "custom",
    ring: "myungpum",
    honeymoon: "americas",
  };
  return {
    min: calculateCost(minAnswers).total,
    max: calculateCost(maxAnswers).total,
  };
}

export function getTierFromPercentile(percentile: number): Tier {
  if (percentile < 33) return TIERS.thrifty;
  if (percentile < 67) return TIERS.standard;
  return TIERS.luxury;
}

export function getOverallTier(
  userTotal: number,
  range: { min: number; max: number },
): { tier: Tier; percentile: number } {
  const span = range.max - range.min;
  const position = Math.max(0, userTotal - range.min);
  const percentile = span > 0 ? Math.round((position / span) * 100) : 50;
  return { tier: getTierFromPercentile(percentile), percentile };
}

// 항목별 등급 (가성비/표준/럭셔리)
const SDM_RANK: Record<SdmGradeId, TierId> = {
  budget: "thrifty",
  standard: "standard",
  premium: "luxury",
};
const ATTIRE_RANK: Record<AttireGradeId, TierId> = {
  rental: "thrifty",
  ready: "standard",
  custom: "luxury",
};
const RING_RANK: Record<RingId, TierId> = {
  none: "thrifty",
  dongne: "thrifty",
  jongno: "standard",
  cheongdam: "luxury",
  myungpum: "luxury",
};
const HONEYMOON_RANK: Record<HoneymoonId, TierId> = {
  none: "thrifty",
  domestic: "thrifty",
  asia: "standard",
  europe: "luxury",
  americas: "luxury",
};

export function getItemTiers(answers: Required<Answers>) {
  return {
    sdm: TIERS[SDM_RANK[answers.sdm]],
    attire: TIERS[ATTIRE_RANK[answers.attire]],
    ring: TIERS[RING_RANK[answers.ring]],
    honeymoon: TIERS[HONEYMOON_RANK[answers.honeymoon]],
  };
}

export function formatKRW(amount: number): string {
  if (amount === 0) return "0원";
  if (amount >= 100_000_000) {
    const eok = Math.floor(amount / 100_000_000);
    const man = Math.floor((amount % 100_000_000) / 10_000);
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man.toLocaleString()}만원`;
  }
  if (amount >= 10_000) {
    return `${Math.round(amount / 10_000).toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}
