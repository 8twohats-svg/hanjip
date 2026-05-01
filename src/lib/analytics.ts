// GA4 + GTM dataLayer 헬퍼
// 이벤트는 GTM dataLayer + GA4(gtag) 둘 다에 푸시 (한쪽만 작동해도 데이터 수집됨)

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

function fire(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // GTM dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });

  // GA4 direct (gtag.js)
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
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
