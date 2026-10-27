import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * The owner's hoodie character, one pose per transparent PNG in
 * public/avatar/ (wave.png, thinking.png, magnifier.png, finger-guns.png).
 * Until a pose's file exists, development shows a labelled empty slot and
 * production shows nothing, so the live site never carries a stand-in.
 */
export type AvatarPose = "wave" | "thinking" | "magnifier" | "finger-guns";

const POSE_DESCRIPTIONS: Record<AvatarPose, string> = {
  wave: "waving hi",
  thinking: "hand on chin, thinking",
  magnifier: "holding a magnifying glass",
  "finger-guns": "finger guns and a wink",
};

export function OwnerAvatar({
  pose,
  height,
  className = "",
  priority = false,
}: {
  pose: AvatarPose;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  const fileName = `${pose}.png`;
  const hasArt = fs.existsSync(path.join(process.cwd(), "public", "avatar", fileName));

  if (hasArt) {
    return (
      <Image
        src={`/avatar/${fileName}`}
        alt=""
        width={Math.round(height * 0.8)}
        height={height}
        priority={priority}
        className={`sticker h-auto w-auto select-none ${className}`}
        style={{ height, width: "auto" }}
      />
    );
  }

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      className={`grid place-items-center rounded-[28px] border-[3px] border-dashed border-lav/60 p-4 text-center font-label text-sm uppercase tracking-wider text-lav ${className}`}
      style={{ height, width: Math.round(height * 0.72) }}
    >
      Avatar slot
      <br />
      public/avatar/{fileName}
      <br />({POSE_DESCRIPTIONS[pose]})
    </div>
  );
}
