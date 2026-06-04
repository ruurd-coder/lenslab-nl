import type { AnalyticsEventType } from "@/lib/types";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "ll_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export async function trackEvent(
  photographerId: string,
  eventType: AnalyticsEventType,
  pageContext?: string
) {
  try {
    // Route through server API so Vercel geo headers (city/country) are captured
    await fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photographer_id: photographerId,
        event_type: eventType,
        page_context: pageContext || window.location.pathname,
        session_id: getSessionId(),
      }),
    });
  } catch {
    // Analytics errors must never break UX
  }
}
