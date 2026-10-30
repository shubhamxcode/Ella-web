/**
 * Ella's intro film: what she says and when. Both the audio
 * (public/film/ella-film.mp3) and these timings (filmTimings.json) come from
 * scripts/film/build-film-audio.py; change the script there and re-run it.
 */
import filmTimings from "./filmTimings.json";

export type FilmCue = { id: FilmSceneID; start: number; end: number; line: string };

export type FilmSceneID =
  | "hello"
  | "menubar"
  | "talk"
  | "screen"
  | "draw"
  | "mail"
  | "control"
  | "board"
  | "memory"
  | "privacy"
  | "cta";

export const FILM_DURATION: number = filmTimings.duration;

export const FILM_CUES = filmTimings.cues as FilmCue[];

/** Each spoken word and when it starts (seconds into ella-film.mp3), from pauses and syllables in each clip. */
export const FILM_WORDS = filmTimings.words as Record<FilmSceneID, { w: string; t: number }[]>;
