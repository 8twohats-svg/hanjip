import type {
  Answers,
  CostBreakdown,
  SeasonId,
  RegionId,
  StyleId,
  GuestId,
  SdmGradeId,
  AttireGradeId,
  RingId,
  HoneymoonId,
} from "../types";
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
import { formatKRW } from "./calculate";

const KEYS: (keyof Answers)[] = [
  "season",
  "region",
  "style",
  "guests",
  "sdm",
  "attire",
  "ring",
  "honeymoon",
];

// 짧은 URL 인코딩 — 각 답을 한 글자(0~9)로
const CODES = {
  season: ["spring", "summer", "autumn", "winter"] as const satisfies readonly SeasonId[],
  region: [
    "gangnam",
    "seoul",
    "metro",
    "chungcheong",
    "jeolla",
    "gyeongsang",
    "gangwon-jeju",
  ] as const satisfies readonly RegionId[],
  style: ["hotel", "general", "small", "house", "public"] as const satisfies readonly StyleId[],
  guests: ["few", "normal", "many"] as const satisfies readonly GuestId[],
  sdm: ["budget", "standard", "premium"] as const satisfies readonly SdmGradeId[],
  attire: ["rental", "ready", "custom"] as const satisfies readonly AttireGradeId[],
  ring: [
    "myungpum",
    "cheongdam",
    "jongno",
    "dongne",
    "none",
  ] as const satisfies readonly RingId[],
  honeymoon: [
    "domestic",
    "asia",
    "europe",
    "americas",
    "none",
  ] as const satisfies readonly HoneymoonId[],
};

function encodeShort(answers: Required<Answers>): string {
  return [
    CODES.season.indexOf(answers.season),
    CODES.region.indexOf(answers.region),
    CODES.style.indexOf(answers.style),
    CODES.guests.indexOf(answers.guests),
    CODES.sdm.indexOf(answers.sdm),
    CODES.attire.indexOf(answers.attire),
    CODES.ring.indexOf(answers.ring),
    CODES.honeymoon.indexOf(answers.honeymoon),
  ].join("");
}

function decodeShort(code: string): Answers | null {
  if (!/^\d{8}$/.test(code)) return null;
  const indices = code.split("").map(Number);
  const result: Partial<Answers> = {
    season: CODES.season[indices[0]],
    region: CODES.region[indices[1]],
    style: CODES.style[indices[2]],
    guests: CODES.guests[indices[3]],
    sdm: CODES.sdm[indices[4]],
    attire: CODES.attire[indices[5]],
    ring: CODES.ring[indices[6]],
    honeymoon: CODES.honeymoon[indices[7]],
  };
  if (Object.values(result).some((v) => v === undefined)) return null;
  return result as Answers;
}

export function encodeAnswers(answers: Answers): URLSearchParams {
  const params = new URLSearchParams();
  if (isAnswersComplete(answers)) {
    params.set("c", encodeShort(answers));
  } else {
    for (const key of KEYS) {
      const value = answers[key];
      if (value) params.set(key, value);
    }
  }
  return params;
}

export function decodeAnswers(params: URLSearchParams): Answers {
  // 우선 단축 코드 시도
  const c = params.get("c");
  if (c) {
    const decoded = decodeShort(c);
    if (decoded) return decoded;
  }

  // 옛 긴 URL 형식 fallback
  const answers: Answers = {};
  for (const key of KEYS) {
    const value = params.get(key);
    if (value) (answers as Record<string, string>)[key] = value;
  }
  return answers;
}

export function isAnswersComplete(answers: Answers): answers is Required<Answers> {
  return KEYS.every((key) => !!answers[key]);
}

export function generateShareText(
  answers: Required<Answers>,
  cost: CostBreakdown,
): string {
  const season = seasons.find((s) => s.id === answers.season)?.label ?? "";
  const region = regions.find((r) => r.id === answers.region)?.label ?? "";
  const style = styles.find((s) => s.id === answers.style)?.label ?? "";
  const guests = guestOptions.find((g) => g.id === answers.guests)?.label ?? "";
  const sdm = sdmGrades.find((s) => s.id === answers.sdm)?.label ?? "";
  const attire = attireGrades.find((a) => a.id === answers.attire)?.label ?? "";
  const ring = ringOptions.find((r) => r.id === answers.ring)?.label ?? "";
  const honeymoon =
    honeymoonOptions.find((h) => h.id === answers.honeymoon)?.label ?? "";

  const url = `${window.location.origin}${window.location.pathname}?${encodeAnswers(answers).toString()}`;

  return `🏠 한집 — 결혼 비용 진단

💰 결혼하려면 필요한 금액: ${formatKRW(cost.net)}
📊 총 비용: ${formatKRW(cost.total)}

· ${season} · ${region} · ${style} · 하객 ${guests}
· 스드메 ${sdm} · 예복 ${attire}
· 결혼반지 ${ring} · 신혼여행 ${honeymoon}

자세히 보기 👉 ${url}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}
