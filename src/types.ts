export type RegionId =
  | "gangnam"
  | "seoul"
  | "metro"
  | "chungcheong"
  | "jeolla"
  | "gyeongsang"
  | "gangwon-jeju";

export type StyleId =
  | "hotel"
  | "general"
  | "convention"
  | "small"
  | "house"
  | "public";

export type GuestId = "few" | "normal" | "many";

export type SdmGradeId = "budget" | "standard" | "premium";
export type AttireGradeId = "rental" | "ready" | "custom";
export type RingId = "myungpum" | "cheongdam" | "jongno" | "dongne" | "none";
export type HoneymoonId = "domestic" | "asia" | "europe" | "americas" | "none";

export type Answers = {
  region?: RegionId;
  style?: StyleId;
  guests?: GuestId;
  sdm?: SdmGradeId;
  attire?: AttireGradeId;
  ring?: RingId;
  honeymoon?: HoneymoonId;
};

export type CostBreakdown = {
  // 결혼식 준비
  sangkyenrye: number;
  sdm: number;
  attire: number;
  honjuPrep: number;
  ring: number;
  invitation: number;
  honeymoon: number;

  // 결혼식 당일
  venueRent: number;
  meal: number;
  ceremonyExtra: number;

  // 합산
  giftMoney: number;
  total: number; // 결혼식까지 들어가는 모든 비용
  net: number; // 자기 부담 (= total - giftMoney)

  prepTotal: number; // 결혼식 전 사전 결제
  ceremonyTotal: number; // 결혼식 당일
};
