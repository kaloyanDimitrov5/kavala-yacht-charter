import type { RouteId } from "@/config/site";

export type RequestRoute = RouteId | "other";

export const REQUEST_ROUTE_EVENT = "request:route";

/** Preselects a route in the request panel. The caller's link handles scrolling to #request. */
export function requestRoute(route: RequestRoute) {
  window.dispatchEvent(new CustomEvent<RequestRoute>(REQUEST_ROUTE_EVENT, { detail: route }));
}
