/**
 * The Ella build people download. Update this with every release
 * (`./release.sh <version>` in the app repo prints the size and checksum).
 */
export const LATEST_RELEASE = {
  version: "1.0.1",
  /** The notarized DMG, served from Cloudflare R2 through the download Worker. */
  url: "https://ella-downloads.shubh-varshneycode.workers.dev/Ella-1.0.1.dmg",
  sizeLabel: "13 MB",
  minimumMacOS: "macOS 14.2",
};
