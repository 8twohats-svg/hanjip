// GTM dataLayer 푸시 헬퍼
// 이벤트 명명 규칙: snake_case
// 모든 이벤트는 GTM 대시보드에서 GA4 태그/트리거로 매핑 가능

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type EventPayload = {
  event: string;
  [key: string]: unknown;
};

function push(payload: EventPayload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

// 페이지/뷰 이벤트
export const track = {
  landingView: () => push({ event: "landing_view" }),

  wizardStarted: () => push({ event: "wizard_started" }),

  stepView: (stepNumber: number, stepName: string) =>
    push({ event: "step_view", step_number: stepNumber, step_name: stepName }),

  stepCompleted: (stepNumber: number, stepName: string, value: string) =>
    push({
      event: "step_completed",
      step_number: stepNumber,
      step_name: stepName,
      step_value: value,
    }),

  wizardCompleted: (params: {
    region: string;
    style: string;
    guests: string;
    sdm: string;
    attire: string;
    ring: string;
    honeymoon: string;
  }) => push({ event: "wizard_completed", ...params }),

  resultView: (totalCost: number, netCost: number) =>
    push({
      event: "result_view",
      total_cost: totalCost,
      net_cost: netCost,
    }),

  shareClicked: () => push({ event: "share_clicked" }),

  shareCopied: () => push({ event: "share_copied" }),

  detailsExpanded: () => push({ event: "details_expanded" }),

  restartClicked: () => push({ event: "restart_clicked" }),

  resumeFromUrl: () => push({ event: "resume_from_url" }),
};
