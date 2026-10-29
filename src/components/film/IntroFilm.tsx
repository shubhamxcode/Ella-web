"use client";

/**
 * The intro film: the first thing a new visitor sees. It starts by itself
 * when the site opens: a half-minute motion film in Ella's own voice,
 * built live in the browser (SVG + GSAP), so it's sharp on every screen
 * and weighs under a megabyte. Browsers don't let a new site play sound
 * before the visitor interacts, so it starts muted and the first click,
 * tap or key press anywhere turns the sound on (every word is on screen
 * meanwhile). Sites the browser already trusts get sound straight away. The GSAP timeline follows the audio's clock, so
 * picture and voice never drift. Skip is always there; the film shows once
 * per visitor, and "Watch the film" plays it again.
 */
import Link from "next/link";
import { Play, Volume2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EllaFace } from "@/components/EllaFace";
import { buildFilm, FilmStage } from "./FilmStage";
import { FILM_CUES, FILM_DURATION, FILM_WORDS } from "./filmScript";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;
const SEEN_KEY = "ella-film-seen";
export const PLAY_FILM_EVENT = "ella:play-film";
const FILM_SECONDS = Math.round(FILM_DURATION);

/** "blocked": the browser won't play even muted, so a play button takes over. */
type Phase = "hidden" | "playing" | "ended" | "blocked";

export function IntroFilm() {
  const [phase, setPhase] = useState<Phase>("playing");
  const [isMuted, setIsMuted] = useState(false);
  const [caption, setCaption] = useState("");
  const [stageScale, setStageScale] = useState(1);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // A <video> carries the soundtrack: browsers let a muted video autoplay, but not a muted <audio>.
  const audioRef = useRef<HTMLVideoElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const audioMeterRef = useRef<{ context: AudioContext; analyser: AnalyserNode } | null>(null);
  /** The film's time in seconds. Its own clock, so phones that pause or refuse a muted video can't freeze the film. */
  const filmTimeRef = useRef<(() => number) | null>(null);
  /** Reads the real loudness of her voice once sound is on (needs a click to set up). */
  const voiceLevelRef = useRef<(() => number) | null>(null);

  // Returning visitors go straight to the site; "Watch the film" brings it back.
  const hasSeenFilm = useSyncExternalStore(subscribeToNothing, readHasSeenFilm, () => false);
  const [isReopened, setIsReopened] = useState(false);
  const isShown = phase !== "hidden" && (!hasSeenFilm || isReopened);

  // The 1280x720 stage scales to fit any window.
  useEffect(() => {
    const fit = () => setStageScale(Math.min(window.innerWidth / STAGE_WIDTH, (window.innerHeight - 40) / STAGE_HEIGHT));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // No page scrolling under the film.
  useEffect(() => {
    if (!isShown) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [isShown]);

  const close = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    audioRef.current?.pause();
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {}
    const overlay = overlayRef.current;
    if (!overlay) return setPhase("hidden");
    overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: "ease-in" }).onfinish = () => setPhase("hidden");
  }, []);

  useEffect(() => {
    if (!isShown) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isShown, close]);

  /** Sound on, from a click: unmute and start reading her voice for the mouth. */
  const turnSoundOn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // The voice joins the film where it is now.
    const filmTime = filmTimeRef.current?.() ?? 0;
    if (Math.abs(audio.currentTime - filmTime) > 0.25) audio.currentTime = filmTime;
    audio.muted = false;
    voiceLevelRef.current = connectVoiceMeter(audio, audioMeterRef);
    setIsMuted(false);
    if (audio.paused) void audio.play().catch(() => undefined);
  }, []);

  // Muted (the browser wouldn't play sound yet): the first click, tap or key press anywhere turns the sound on.
  // Skip and Esc are left alone, so leaving never blares sound for a moment.
  useEffect(() => {
    if (!isMuted || phase !== "playing") return;
    const onFirstInteraction = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") return;
      if (event.target instanceof Element && event.target.closest("[data-film-skip]")) return;
      turnSoundOn();
    };
    const interactionEvents = ["pointerdown", "keydown", "touchend"] as const;
    for (const eventName of interactionEvents) window.addEventListener(eventName, onFirstInteraction, { capture: true });
    return () => {
      for (const eventName of interactionEvents) window.removeEventListener(eventName, onFirstInteraction, { capture: true });
    };
  }, [isMuted, phase, turnSoundOn]);

  /** Starts the film from the top. With a click behind it, sound comes on at once; without, it tries, then plays muted. */
  const start = useCallback(async (hasUserGesture: boolean) => {
    const audio = audioRef.current;
    const stage = stageRef.current;
    if (!audio || !stage) return;
    cleanupRef.current?.();
    setPhase("playing");
    audio.currentTime = 0;
    audio.muted = false;
    if (hasUserGesture) {
      voiceLevelRef.current = connectVoiceMeter(audio, audioMeterRef);
      setIsMuted(false);
    }
    // Development only: ?filmMuted=1 starts muted, like a brand-new visitor's browser.
    const startsMutedForTesting = process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).has("filmMuted");
    const playsWithSound = startsMutedForTesting && !hasUserGesture ? false : await audio.play().then(() => true, () => false);
    if (!playsWithSound) {
      // No sound before a click: the picture runs anyway (muted video if the browser allows it, else silent), and the first tap brings the voice in.
      audio.muted = true;
      setIsMuted(true);
      void audio.play().catch(() => undefined);
    }

    const gsap = await loadGsap();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timeline: ReturnType<typeof gsap.timeline> | undefined;
    const context = gsap.context(() => {
      timeline = buildFilm(gsap, reduceMotion);
    }, stage);

    // Ella's mouth opens with her voice: its real loudness once sound is on, her words' rhythm while muted.
    const mouth = stage.querySelector<SVGGElement>(".actor-mouth");
    // While her voice is audibly playing it sets the time (so lips and words stay on it); otherwise a steady clock does.
    let clockStartedAt = performance.now() / 1000 - (playsWithSound ? audio.currentTime : 0);
    const filmTime = () => {
      if (!audio.muted && !audio.paused && audio.readyState >= 2) {
        clockStartedAt = performance.now() / 1000 - audio.currentTime;
        return audio.currentTime;
      }
      return performance.now() / 1000 - clockStartedAt;
    };
    filmTimeRef.current = filmTime;
    let lastCaption = "";
    let hasEnded = false;
    const follow = () => {
      const time = filmTime();
      timeline?.time(Math.min(time, FILM_DURATION));
      if (time >= FILM_DURATION && !hasEnded) {
        hasEnded = true;
        setPhase("ended");
      }
      const level = voiceLevelRef.current && !audio.muted && !audio.paused ? Math.min(voiceLevelRef.current() * 5, 1) : rhythmLevel(time);
      if (mouth) mouth.style.transform = `scaleY(${(0.32 + level * 0.95).toFixed(3)})`;
      const cue = FILM_CUES.find((filmCue) => time >= filmCue.start - 0.15 && time <= filmCue.end + 0.4);
      const nextCaption = cue?.line ?? "";
      if (nextCaption !== lastCaption) setCaption((lastCaption = nextCaption));
    };
    gsap.ticker.add(follow);
    cleanupRef.current = () => {
      gsap.ticker.remove(follow);
      filmTimeRef.current = null;
      context.revert();
    };
  }, []);

  // A new visitor: the film starts by itself as the site opens.
  useEffect(() => {
    if (hasSeenFilm || new URLSearchParams(window.location.search).has("filmAt")) return;
    const startFrame = requestAnimationFrame(() => void start(false));
    return () => cancelAnimationFrame(startFrame);
  }, [hasSeenFilm, start]);

  // "Watch the film" (a click) plays it again, with sound, once the overlay is back on screen.
  const [replayRequest, setReplayRequest] = useState(0);
  useEffect(() => {
    const replay = () => {
      setIsReopened(true);
      setPhase("playing");
      setReplayRequest((request) => request + 1);
    };
    window.addEventListener(PLAY_FILM_EVENT, replay);
    return () => window.removeEventListener(PLAY_FILM_EVENT, replay);
  }, []);
  useEffect(() => {
    if (replayRequest === 0) return;
    const startFrame = requestAnimationFrame(() => void start(true));
    return () => cancelAnimationFrame(startFrame);
  }, [replayRequest, start]);

  useEffect(() => () => cleanupRef.current?.(), []);

  // Development only: ?filmAt=12.5 freezes the film at that second, for checking frames.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const frozenAt = Number(new URLSearchParams(window.location.search).get("filmAt"));
    if (!Number.isFinite(frozenAt) || frozenAt <= 0) return;
    let isCancelled = false;
    (async () => {
      const gsap = await loadGsap();
      if (isCancelled || !stageRef.current) return;
      setIsReopened(true);
      setPhase("playing");
      const context = gsap.context(() => {
        buildFilm(gsap, false).time(frozenAt);
      }, stageRef.current);
      setCaption(FILM_CUES.find((cue) => frozenAt >= cue.start - 0.15 && frozenAt <= cue.end + 0.4)?.line ?? "");
      cleanupRef.current = () => context.revert();
    })();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (!isShown) return null;

  return (
    <div
      ref={overlayRef}
      id="ella-intro-film"
      data-reopened={isReopened || undefined}
      role="dialog"
      aria-modal="true"
      aria-label={`Meet Ella, a ${FILM_SECONDS}-second film`}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-clip bg-night text-moon"
      style={{ backgroundImage: "radial-gradient(ellipse at 50% 35%, #2b2858 0%, #100f24 62%)" }}
    >
      <video
        ref={audioRef}
        src="/film/ella-film.mp3"
        preload="auto"
        playsInline
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-px opacity-[0.01]"
      />
      <p aria-live="polite" className="sr-only">{caption}</p>
      <FilmStars />

      {/* The film */}
      <div
        className="relative shrink-0"
        style={{ width: STAGE_WIDTH * stageScale, height: STAGE_HEIGHT * stageScale, visibility: phase === "blocked" ? "hidden" : "visible" }}
      >
        <div
          ref={stageRef}
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${stageScale})` }}
        >
          <FilmStage />
        </div>
      </div>

      {phase === "playing" && isMuted && (
        <button
          type="button"
          onClick={turnSoundOn}
          className="press cut absolute bottom-6 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-2.5 rounded-full bg-lav px-6 py-3 font-display text-xl tracking-wide text-ink uppercase"
        >
          <Volume2 size={22} strokeWidth={2.6} aria-hidden className="film-sound-pulse" /> Click anywhere for sound
        </button>
      )}

      {phase === "blocked" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <EllaFace size={150} mood="resting" title="Ella" />
          <h1 className="mt-10 font-display text-[clamp(3rem,9vw,6.5rem)] leading-none tracking-[0.005em] uppercase">
            Meet <span className="cut-sm inline-block -rotate-2 rounded-lg bg-lav px-3 text-ink">Ella</span>
          </h1>
          <button
            type="button"
            onClick={() => void start(true)}
            className="press cut mt-9 flex cursor-pointer items-center gap-3 rounded-2xl bg-lav px-8 py-4 font-display text-[clamp(1.4rem,2.4vw,1.8rem)] tracking-wide text-ink uppercase"
          >
            <Play size={26} strokeWidth={2.8} fill="currentColor" aria-hidden />
            Play the film
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={close}
        data-film-skip
        className="absolute top-5 right-5 flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[15px] font-medium text-moon/85 backdrop-blur hover:bg-white/10"
      >
        {phase === "ended" ? "Enter the site" : "Skip"} <X size={16} aria-hidden />
      </button>

      {phase === "ended" && (
        <div className="absolute bottom-8 flex flex-wrap items-center justify-center gap-4 px-4">
          <Link href="/download" className="press cut flex items-center gap-2 rounded-2xl bg-lav px-7 py-3.5 font-display text-2xl tracking-wide text-ink uppercase">
            Download for Mac
          </Link>
          <button type="button" onClick={close} className="press cut-sm cursor-pointer rounded-2xl bg-paper px-6 py-3.5 font-display text-xl tracking-wide text-ink uppercase">
            Explore the site
          </button>
        </div>
      )}
    </div>
  );
}

/** While muted: the mouth moves with her words (opens on each, closes between lines). */
const ALL_WORD_TIMES = Object.values(FILM_WORDS).flat().map((spokenWord) => spokenWord.t).sort((first, second) => first - second);
function rhythmLevel(time: number) {
  if (!FILM_CUES.some((cue) => time >= cue.start && time <= cue.end)) return 0;
  const lastWordStart = ALL_WORD_TIMES.findLast((wordTime) => wordTime <= time) ?? 0;
  const sinceWord = time - lastWordStart;
  return Math.max(0.25, Math.exp(-sinceWord / 0.09)) * (0.7 + 0.3 * Math.abs(Math.sin(time * 23)));
}

function subscribeToNothing() {
  return () => {};
}

function readHasSeenFilm() {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** A "Watch the film" button for the page, which reopens the intro. */
export function WatchFilmButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(PLAY_FILM_EVENT))}
      className={`flex cursor-pointer items-center gap-2 text-[15px] font-semibold text-lav-l hover:text-moon hover:underline ${className}`}
    >
      <Play size={15} fill="currentColor" aria-hidden /> Watch the {FILM_SECONDS}-second film
    </button>
  );
}

// MARK: - Stars

const STARS = Array.from({ length: 46 }, (_, starIndex) => {
  // A fixed scatter, so the sky is the same on every visit.
  const seed = Math.sin(starIndex * 91.7) * 10000;
  const random = (offset: number) => Math.abs(Math.sin(seed + offset)) % 1;
  const rounded = (value: number) => Math.round(value * 100) / 100;
  return { left: rounded(random(1) * 100), top: rounded(random(2) * 100), size: rounded(1 + random(3) * 2.2), delay: rounded(random(4) * 4) };
});

function FilmStars() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {STARS.map((star, starIndex) => (
        <span
          key={starIndex}
          className="film-twinkle absolute rounded-full bg-moon"
          style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }}
        />
      ))}
    </div>
  );
}

// MARK: - Helpers

type GSAP = typeof import("gsap").gsap;

async function loadGsap(): Promise<GSAP> {
  const [{ gsap }, { DrawSVGPlugin }, { TextPlugin }, { MotionPathPlugin }] = await Promise.all([
    import("gsap"),
    import("gsap/DrawSVGPlugin"),
    import("gsap/TextPlugin"),
    import("gsap/MotionPathPlugin"),
  ]);
  gsap.registerPlugin(DrawSVGPlugin, TextPlugin, MotionPathPlugin);
  return gsap;
}

/** The voice's loudness (0 to about 0.3), from a Web Audio analyser on the film's audio. One per audio element. */
function connectVoiceMeter(audio: HTMLMediaElement, meterRef: React.RefObject<{ context: AudioContext; analyser: AnalyserNode } | null>) {
  try {
    if (!meterRef.current) {
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaElementSource(audio).connect(analyser);
      analyser.connect(context.destination);
      meterRef.current = { context, analyser };
    }
    const { context, analyser } = meterRef.current;
    if (context.state === "suspended") void context.resume();
    const samples = new Uint8Array(analyser.fftSize);
    return () => {
      analyser.getByteTimeDomainData(samples);
      let sumOfSquares = 0;
      for (const sample of samples) sumOfSquares += ((sample - 128) / 128) ** 2;
      return Math.sqrt(sumOfSquares / samples.length);
    };
  } catch {
    return () => 0;
  }
}
