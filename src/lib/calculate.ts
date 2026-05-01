import type { Answers, CostBreakdown, RegionId, StyleId } from "../types";
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

  // 결혼식 준비
  const sangkyenrye = fixedAverages.sangkyenrye;
  const sdm = Math.round(region.sdmBase * sdmGrade.multiplier) + fixedAverages.bonsikExtra;
  const attire = attireGrade.value;
  const honjuPrep = fixedAverages.honjuPrep;
  const ring = ringOpt.value;
  const invitation = fixedAverages.invitation;
  const honeymoon = honeymoonOpt.value;

  // 결혼식 당일
  const venueRent = Math.round(region.venueRent * venueMul);
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
