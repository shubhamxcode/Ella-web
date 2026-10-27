"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MayaFace } from "./MayaFace";

/** Plays a real clip of Maya's voice (Simran on Sarvam, rendered by Maya's own worker). */
export function VoiceClip({
  src,
  label,
  caption,
  tone = "paper",
}: {
  src: string;
  label: string;
  caption: string;
  tone?: "paper" | "star";
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const stop = () => setIsPlaying(false);
    audio.addEventListener("ended", stop);
    audio.addEventListener("pause", stop);
    return () => {
      audio.removeEventListener("ended", stop);
      audio.removeEventListener("pause", stop);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      return;
    }
    // Only one Maya talks at a time.
    document.querySelectorAll("audio").forEach((otherAudio) => {
      if (otherAudio !== audio) otherAudio.pause();
    });
    audio.currentTime = 0;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isPlaying}
      className={`press cut group flex cursor-pointer items-center gap-3 rounded-2xl py-2 pr-4 pl-2 text-left text-ink ${
        tone === "star" ? "bg-star" : "bg-paper"
      }`}
    >
      <span className="-my-4 -ml-2 shrink-0">
        <MayaFace mood={isPlaying ? "speaking" : "resting"} size={34} />
      </span>
      <span className="flex flex-col">
        <span className="flex items-center gap-1.5 font-label text-[17px] font-bold uppercase tracking-wide">
          {isPlaying ? <Pause size={15} strokeWidth={3} /> : <Play size={15} strokeWidth={3} />}
          {label}
        </span>
        <span className="text-[13px] text-ink/70">{caption}</span>
      </span>
      <audio ref={audioRef} src={src} preload="none" />
    </button>
  );
}
