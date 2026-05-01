import type {
  RegionId,
  StyleId,
  GuestId,
  SdmGradeId,
  AttireGradeId,
  RingId,
  HoneymoonId,
  SeasonId,
} from "../types";

export const seasons: {
  id: SeasonId;
  label: string;
  description: string;
  emoji: string;
}[] = [
  {
    id: "spring",
    label: "봄 (3~5월)",
    description: "결혼 성수기 · 대관료 ↑",
    emoji: "🌸",
  },
  {
    id: "summer",
    label: "여름 (6~8월)",
    description: "결혼 비수기 · 신혼여행 성수기",
    emoji: "🌞",
  },
  {
    id: "autumn",
    label: "가을 (9~11월)",
    description: "결혼 성수기 · 대관료 ↑",
    emoji: "🍂",
  },
  {
    id: "winter",
    label: "겨울 (12~2월)",
    description: "결혼 비수기 · 명절 영향",
    emoji: "❄️",
  },
];

// 결혼식 성수기·비수기 할증/할인
export const seasonVenueMultiplier: Record<SeasonId, number> = {
  spring: 1.15,
  summer: 0.85,
  autumn: 1.15,
  winter: 0.85,
};

// 신혼여행 성수기·비수기 — 목적지 × 계절
export const seasonHoneymoonMultiplier: Record<
  HoneymoonId,
  Record<SeasonId, number>
> = {
  domestic: { spring: 1.0, summer: 1.3, autumn: 1.0, winter: 0.85 },
  asia: { spring: 1.0, summer: 1.4, autumn: 1.0, winter: 1.1 },
  europe: { spring: 1.1, summer: 1.5, autumn: 1.0, winter: 0.85 },
  americas: { spring: 1.0, summer: 1.3, autumn: 0.95, winter: 1.2 },
  none: { spring: 1.0, summer: 1.0, autumn: 1.0, winter: 1.0 },
};

export const regions: { id: RegionId; label: string; emoji: string }[] = [
  { id: "gangnam", label: "서울 강남권", emoji: "🌆" },
  { id: "seoul", label: "서울 (강남 외)", emoji: "🏙️" },
  { id: "metro", label: "수도권 (경기·인천)", emoji: "🚇" },
  { id: "chungcheong", label: "충청", emoji: "🌳" },
  { id: "jeolla", label: "전라", emoji: "🌾" },
  { id: "gyeongsang", label: "경상", emoji: "⛰️" },
  { id: "gangwon-jeju", label: "강원·제주", emoji: "🏝️" },
];

export const styles: {
  id: StyleId;
  label: string;
  description: string;
}[] = [
  { id: "hotel", label: "호텔 예식", description: "고급 호텔에서" },
  { id: "general", label: "일반 예식장", description: "가장 흔한 선택" },
  { id: "small", label: "스몰웨딩", description: "가까운 분들만" },
  { id: "house", label: "하우스웨딩", description: "프라이빗한 공간" },
  { id: "public", label: "공공시설·종교시설", description: "구민회관·성당·교회 등" },
];

export const guestOptions: {
  id: GuestId;
  label: string;
  count: number;
  description: string;
}[] = [
  { id: "few", label: "적은 편", count: 120, description: "100~150명 정도" },
  { id: "normal", label: "보통", count: 200, description: "150~250명 정도" },
  { id: "many", label: "많은 편", count: 320, description: "300명 이상" },
];

export const sdmGrades: {
  id: SdmGradeId;
  label: string;
  description: string;
  multiplier: number;
}[] = [
  { id: "budget", label: "가성비", description: "기본 패키지", multiplier: 0.6 },
  { id: "standard", label: "표준", description: "평균적인 패키지", multiplier: 1.0 },
  { id: "premium", label: "프리미엄", description: "고급 스튜디오·드레스", multiplier: 1.6 },
];

export const attireGrades: {
  id: AttireGradeId;
  label: string;
  description: string;
  value: number;
}[] = [
  { id: "rental", label: "대여", description: "예식만 빌려 입어요", value: 500_000 },
  { id: "ready", label: "기성복", description: "기성 정장 구입", value: 1_500_000 },
  { id: "custom", label: "맞춤", description: "맞춤 정장 제작", value: 4_000_000 },
];

export const ringOptions: {
  id: RingId;
  label: string;
  description: string;
  value: number; // 한 쌍 기준
}[] = [
  {
    id: "myungpum",
    label: "명품",
    description: "까르띠에·티파니·불가리 등 해외 브랜드",
    value: 12_000_000,
  },
  {
    id: "cheongdam",
    label: "청담",
    description: "다이아몬드 위주 고급 주얼리",
    value: 6_000_000,
  },
  {
    id: "jongno",
    label: "종로",
    description: "귀금속 거리, 가성비",
    value: 2_000_000,
  },
  {
    id: "dongne",
    label: "동네 금은방",
    description: "간단히 한 쌍",
    value: 800_000,
  },
  {
    id: "none",
    label: "안 해요",
    description: "결혼반지 생략",
    value: 0,
  },
];

export const honeymoonOptions: {
  id: HoneymoonId;
  label: string;
  description: string;
  value: number;
}[] = [
  { id: "domestic", label: "국내", description: "제주·강원 등", value: 3_000_000 },
  { id: "asia", label: "일본·동남아", description: "오키나와·다낭·발리 등", value: 6_000_000 },
  { id: "europe", label: "유럽·호주", description: "이탈리아·스페인·시드니 등", value: 10_000_000 },
  { id: "americas", label: "미주·하와이·몰디브", description: "장거리·럭셔리 리조트", value: 15_000_000 },
  { id: "none", label: "안 가요", description: "신혼여행 생략", value: 0 },
];

export const regionAverages: Record<
  RegionId,
  { mealPerPerson: number; venueRent: number; sdmBase: number }
> = {
  gangnam: { mealPerPerson: 90_000, venueRent: 7_000_000, sdmBase: 3_300_000 },
  seoul: { mealPerPerson: 70_000, venueRent: 5_000_000, sdmBase: 3_000_000 },
  metro: { mealPerPerson: 60_000, venueRent: 3_500_000, sdmBase: 2_700_000 },
  chungcheong: { mealPerPerson: 50_000, venueRent: 2_500_000, sdmBase: 2_700_000 },
  jeolla: { mealPerPerson: 50_000, venueRent: 2_000_000, sdmBase: 3_400_000 },
  gyeongsang: { mealPerPerson: 44_000, venueRent: 2_000_000, sdmBase: 3_300_000 },
  "gangwon-jeju": { mealPerPerson: 50_000, venueRent: 2_000_000, sdmBase: 2_500_000 },
};

export const styleVenueMultiplier: Record<StyleId, number> = {
  hotel: 3.0,
  general: 1.0,
  small: 0.7,
  house: 1.2,
  public: 0.3,
};

export const styleMealMultiplier: Record<StyleId, number> = {
  hotel: 1.4,
  general: 1.0,
  small: 0.9,
  house: 1.1,
  public: 0.7,
};

export const fixedAverages = {
  sangkyenrye: 1_000_000, // 상견례 (양가 식사 + 인사 선물)
  bonsikExtra: 800_000, // 본식 촬영·영상
  honjuPrep: 2_900_000, // 양가 어머니 한복 + 양가 아버지 정장(대여·구매 혼합) + 메이크업·헤어
  invitation: 1_500_000, // 청첩장(30~50만) + 청첩장 모임(평균 116만, 디지틀조선·가연 통계)
  ceremonyExtra: 1_500_000, // 답례품·부케·사회자·헬퍼
  giftPerGuest: 100_000, // 1인당 평균 축의금
};
