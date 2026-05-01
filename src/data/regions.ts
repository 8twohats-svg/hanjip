import type {
  RegionId,
  StyleId,
  GuestId,
  SdmGradeId,
  AttireGradeId,
  RingId,
  HoneymoonId,
} from "../types";

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
  { id: "convention", label: "컨벤션", description: "넓고 화려한 공간" },
  { id: "small", label: "스몰웨딩", description: "가까운 분들만" },
  { id: "house", label: "하우스웨딩", description: "프라이빗한 공간" },
  { id: "public", label: "공공시설", description: "구민회관·교회 등" },
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
  { id: "asia", label: "일본·동남아", description: "오키나와·다낭·발리 등", value: 5_000_000 },
  { id: "europe", label: "유럽·호주", description: "이탈리아·스페인·시드니 등", value: 10_000_000 },
  { id: "americas", label: "미주·하와이·몰디브", description: "장거리·럭셔리 리조트", value: 15_000_000 },
  { id: "none", label: "안 가요", description: "신혼여행 생략", value: 0 },
];

export const regionAverages: Record<
  RegionId,
  { mealPerPerson: number; venueRent: number; sdmBase: number }
> = {
  gangnam: { mealPerPerson: 85_000, venueRent: 7_000_000, sdmBase: 3_300_000 },
  seoul: { mealPerPerson: 70_000, venueRent: 5_000_000, sdmBase: 3_000_000 },
  metro: { mealPerPerson: 60_000, venueRent: 3_500_000, sdmBase: 2_700_000 },
  chungcheong: { mealPerPerson: 50_000, venueRent: 2_000_000, sdmBase: 2_700_000 },
  jeolla: { mealPerPerson: 50_000, venueRent: 1_500_000, sdmBase: 3_400_000 },
  gyeongsang: { mealPerPerson: 44_000, venueRent: 1_500_000, sdmBase: 3_300_000 },
  "gangwon-jeju": { mealPerPerson: 50_000, venueRent: 1_000_000, sdmBase: 2_500_000 },
};

export const styleVenueMultiplier: Record<StyleId, number> = {
  hotel: 3.0,
  general: 1.0,
  convention: 1.8,
  small: 0.7,
  house: 1.2,
  public: 0.3,
};

export const styleMealMultiplier: Record<StyleId, number> = {
  hotel: 1.4,
  general: 1.0,
  convention: 1.2,
  small: 0.9,
  house: 1.1,
  public: 0.7,
};

export const fixedAverages = {
  sangkyenrye: 1_000_000,
  bonsikExtra: 1_000_000,
  honjuPrep: 1_500_000,
  invitation: 1_000_000,
  ceremonyExtra: 2_000_000,
  giftPerGuest: 100_000,
};
