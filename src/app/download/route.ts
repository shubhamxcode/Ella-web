import { LATEST_RELEASE } from "@/lib/release";

/** heyyella.com/download always gets the newest DMG. */
export function GET() {
  return Response.redirect(LATEST_RELEASE.url, 302);
}
