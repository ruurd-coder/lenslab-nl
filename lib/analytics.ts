import { createClient } from "@/lib/supabase/client";
import type { AnalyticsEventType } from "@/lib/types";

// Genereer of haal een anonieme sessie ID op
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
    const supabase = createClient();
    await supabase.from("photographer_analytics").insert({
      photographer_id: photographerId,
      event_type: eventType,
      page_context: pageContext || window.location.pathname,
      session_id: getSessionId(),
    });
  } catch {
    // Analytics fouten mogen nooit de UX breken
  }
}
