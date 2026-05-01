import type { Answers, CostBreakdown } from "../types";
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

export function encodeAnswers(answers: Answers): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of KEYS) {
    const value = answers[key];
    if (value) params.set(key, value);
  }
  return params;
}

export function decodeAnswers(params: URLSearchParams): Answers {
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
  const honeymoon = honeymoonOptions.find((h) => h.id === answers.honeymoon)?.label ?? "";

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
    // 폴백: 옛 브라우저
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
