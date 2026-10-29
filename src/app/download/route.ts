import { DOWNLOADS_ENABLED, LATEST_RELEASE } from "@/lib/release";

/** heyyella.com/download always gets the newest DMG (or the home page while downloads are off). */
export function GET(request: Request) {
  if (!DOWNLOADS_ENABLED) return Response.redirect(new URL("/#download", request.url), 302);
  return Response.redirect(LATEST_RELEASE.url, 302);
}
