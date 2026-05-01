// GTM dataLayer 헬퍼
// 모든 이벤트는 dataLayer에 푸시되어 GTM이 받아서 GA4·Clarity 등으로 라우팅
// 이벤트 명명 규칙: snake_case

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function fire(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

export const track = {
  landingView: () => fire("landing_view"),

  wizardStarted: () => fire("wizard_started"),

  stepView: (stepNumber: number, stepName: string) =>
    fire("step_view", { step_number: stepNumber, step_name: stepName }),

  stepCompleted: (stepNumber: number, stepName: string, value: string) =>
    fire("step_completed", {
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
  }) => fire("wizard_completed", params),

  resultView: (totalCost: number, netCost: number) =>
    fire("result_view", {
      total_cost: totalCost,
      net_cost: netCost,
    }),

  shareClicked: () => fire("share_clicked"),

  shareCopied: () => fire("share_copied"),

  detailsExpanded: () => fire("details_expanded"),

  restartClicked: () => fire("restart_clicked"),

  resumeFromUrl: () => fire("resume_from_url"),
};
