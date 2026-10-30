/**
 * Whether people can download Ella from the site. Off until paid plans are
 * ready: the button shows "Coming soon" and /download goes back to the home
 * page. Turn it on by setting this to true (the download Worker has its own
 * switch, DOWNLOADS_ENABLED in ella/download-worker/wrangler.toml).
 */
export const DOWNLOADS_ENABLED = true;

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
