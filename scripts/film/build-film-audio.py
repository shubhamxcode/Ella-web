#!/usr/bin/env python3
"""
Builds the intro film's soundtrack and timings:
  1. Simran's voice for each line (Sarvam bulbul:v4-flash, the upbeat "ads" persona),
  2. when each word starts (from the pauses in each clip, then syllables),
  3. an original 128 BPM beat (kick, clap, hats, pumping bass and chords,
     an arp, whooshes on every scene change, a riser and drops),
  4. the mix, with the beat ducking under her voice,
and writes public/film/ella-film.mp3 and src/components/film/filmTimings.json.

Usage (from the website repo):
  SARVAM_API_KEY=... python3 scripts/film/build-film-audio.py
The key is read from the environment only. Voice clips are cached in
scripts/film/.cache, so re-running to tweak the music costs nothing.
Needs ffmpeg and numpy.
"""
import base64
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path(__file__).resolve().parent / ".cache"
OUT_AUDIO = ROOT / "public" / "film" / "ella-film.mp3"
OUT_TIMINGS = ROOT / "src" / "components" / "film" / "filmTimings.json"
RATE = 44100

VOICE = {"speaker": "simran_en_ads", "pace": 1.6, "temperature": 0.85}
# The film's moves are keyed to word positions (FilmStage.tsx): change a line, then check its word(...) indices there.
SCRIPT = [
    ("hello", "Hi! I'm Ella!"),
    ("menubar", "I live in your Mac's menu bar! Hold control and shift, and just talk to me!"),
    ("talk", "Ask me anything! In English, or in Hindi, and I'll answer you out loud!"),
    ("screen", "Stuck on something? Hold control and option, I'll see your screen, and explain it, with my pen!"),
    ("draw", "Reading a book online? Draw on it, or highlight a line! I'll see it, explain it, and help you read!"),
    ("mail", "I read your Gmail, tell you what really needs you, and put your interviews on your calendar!"),
    ("control", "I open your apps, run your browser, and I can even type for you!"),
    ("board", "Want to see it? I'll sketch it for you, on my whiteboard!"),
    ("memory", "I remember what matters to you, and I'll help you hit your goals!"),
    ("privacy", "And don't worry! I only listen while you hold the keys."),
    ("cta", "I'm Ella! Made for your Mac! Let's talk!"),
]
LEAD = 1.25      # the riser before "Hi!"
GAP = 0.26       # breath between lines
TAIL = 1.8
BPM = 128.0


def tts(text: str) -> bytes:
    """One line in Simran's voice, cached by its text and voice settings."""
    CACHE.mkdir(exist_ok=True)
    cache_key = hashlib.sha256(json.dumps([text, VOICE]).encode()).hexdigest()[:20]
    cached = CACHE / f"{cache_key}.mp3"
    if cached.exists():
        return cached.read_bytes()
    api_key = os.environ.get("SARVAM_API_KEY")
    if not api_key:
        sys.exit("Set SARVAM_API_KEY (the clips aren't cached yet).")
    body = {"text": text, "model": "bulbul:v4-flash", "language_code": "en-IN", "output_audio_codec": "mp3", "enable_preprocessing": True, **VOICE}
    request = urllib.request.Request("https://api.sarvam.ai/text-to-speech", data=json.dumps(body).encode(), headers={"api-subscription-key": api_key, "content-type": "application/json"})
    audio = base64.b64decode("".join(json.load(urllib.request.urlopen(request, timeout=60))["audios"]))
    cached.write_bytes(audio)
    return audio


def decode(mp3: bytes) -> np.ndarray:
    """Mono float samples at RATE."""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", "pipe:0", "-f", "s16le", "-ac", "1", "-ar", str(RATE), "pipe:1"], input=mp3, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768


def speech_spans(samples: np.ndarray) -> list:
    """Where she's speaking: 10 ms frames above a quiet threshold, joined across tiny gaps."""
    frame = RATE // 100
    frames = samples[: len(samples) // frame * frame].reshape(-1, frame)
    loud = 20 * np.log10(np.sqrt((frames ** 2).mean(axis=1)) + 1e-9) > -36
    spans, start, quiet = [], None, 0
    for index, is_loud in enumerate(loud):
        if is_loud:
            if start is None:
                start = index
            quiet = 0
        elif start is not None:
            quiet += 1
            if quiet >= 9:  # a 90 ms pause ends a phrase
                spans.append([start / 100, (index - quiet + 1) / 100])
                start, quiet = None, 0
    if start is not None:
        spans.append([start / 100, len(loud) / 100])
    return spans


def syllables(word: str) -> int:
    letters = re.sub(r"[^a-z]", "", word.lower()) or "a"
    return max(1, len(re.findall(r"[aeiouy]+", letters)))


def word_times(text: str, samples: np.ndarray, offset: float) -> list:
    phrases = [phrase for phrase in re.split(r"(?<=[,.!?])\s+", text) if phrase.strip()]
    spans = speech_spans(samples) or [[0, len(samples) / RATE]]
    while len(spans) > len(phrases):  # merge across the smallest pauses
        gaps = [spans[i + 1][0] - spans[i][1] for i in range(len(spans) - 1)]
        merge_at = gaps.index(min(gaps))
        spans[merge_at][1] = spans[merge_at + 1][1]
        del spans[merge_at + 1]
    if len(spans) < len(phrases):  # fewer pauses than phrases: share the whole span by syllables
        begin, end = spans[0][0], spans[-1][1]
        weights = [sum(syllables(w) for w in phrase.split()) for phrase in phrases]
        spans, cursor = [], begin
        for weight in weights:
            length = (end - begin) * weight / sum(weights)
            spans.append([cursor, cursor + length])
            cursor += length
    words = []
    for phrase, (begin, end) in zip(phrases, spans):
        phrase_words = phrase.split()
        weights = [syllables(w) + 0.6 for w in phrase_words]
        cursor = begin
        for spoken_word, weight in zip(phrase_words, weights):
            words.append({"w": spoken_word, "t": round(offset + cursor, 3)})
            cursor += (end - begin) * weight / sum(weights)
    return words


# ── The beat ────────────────────────────────────────────────────────────────

rng = np.random.default_rng(7)


def place(track: np.ndarray, sound: np.ndarray, at: float, gain: float = 1.0):
    start = int(at * RATE)
    if start >= len(track) or start + len(sound) <= 0:
        return
    sound = sound[max(0, -start):]
    start = max(0, start)
    end = min(len(track), start + len(sound))
    track[start:end] += sound[: end - start] * gain


def envelope(length: float, decay: float, attack: float = 0.002) -> np.ndarray:
    t = np.arange(int(length * RATE)) / RATE
    return np.minimum(t / attack, 1) * np.exp(-t / decay)


def band_noise(length: float, low: float, high: float) -> np.ndarray:
    count = int(length * RATE)
    spectrum = np.fft.rfft(rng.standard_normal(count))
    freqs = np.fft.rfftfreq(count, 1 / RATE)
    spectrum[(freqs < low) | (freqs > high)] = 0
    noise = np.fft.irfft(spectrum, count)
    return noise / (np.abs(noise).max() + 1e-9)


def kick() -> np.ndarray:
    t = np.arange(int(0.42 * RATE)) / RATE
    frequency = 45 + 115 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(frequency) / RATE) * np.exp(-t / 0.16)
    click = band_noise(0.01, 2000, 8000) * 0.25
    body[: len(click)] += click
    return body


def clap() -> np.ndarray:
    noise = band_noise(0.25, 900, 6000)
    shape = np.zeros_like(noise)
    for burst_at in (0.0, 0.011, 0.022):
        start = int(burst_at * RATE)
        burst = envelope(0.25, 0.012 if burst_at < 0.02 else 0.09)[: len(shape) - start]
        shape[start:start + len(burst)] += burst
    return noise * shape * 0.6


def hat(length: float = 0.05) -> np.ndarray:
    return band_noise(length, 7000, 16000) * envelope(length, length / 3.5)


def saw(frequency: float, length: float, harmonics: int = 14) -> np.ndarray:
    t = np.arange(int(length * RATE)) / RATE
    wave = np.zeros_like(t)
    for n in range(1, harmonics + 1):
        if frequency * n > 12000:
            break
        wave += np.sin(2 * np.pi * frequency * n * t) / n
    return wave


def square(frequency: float, length: float) -> np.ndarray:
    t = np.arange(int(length * RATE)) / RATE
    return sum(np.sin(2 * np.pi * frequency * n * t) / n for n in (1, 3, 5, 7))


def note(name: str) -> float:
    names = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
    return 440 * 2 ** ((names[name[0]] + 12 * (int(name[-1]) - 4)) / 12)


# I–V–vi–IV in C: bright and upbeat.
CHORDS = [("C2", ["C4", "E4", "G4"]), ("G2", ["B3", "D4", "G4"]), ("A2", ["A3", "C4", "E4"]), ("F2", ["A3", "C4", "F4"])]


def whoosh() -> np.ndarray:
    length = 0.55
    noise = band_noise(length, 400, 9000)
    t = np.arange(len(noise)) / RATE
    shape = np.sin(np.pi * np.clip(t / length, 0, 1)) ** 2
    return noise * shape * 0.5


def riser(length: float) -> np.ndarray:
    t = np.arange(int(length * RATE)) / RATE
    sweep = np.sin(2 * np.pi * np.cumsum(180 + 900 * (t / length) ** 2) / RATE) * 0.35
    noise = band_noise(length, 2000, 12000) * 0.45
    return (sweep + noise) * (t / length) ** 2


def impact() -> np.ndarray:
    t = np.arange(int(1.6 * RATE)) / RATE
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t / 0.08)) / RATE) * np.exp(-t / 0.5)
    crash = band_noise(1.6, 3000, 15000) * np.exp(-t / 0.35) * 0.35
    return boom + crash


def build_beat(total: float, drop: float, breakdown: tuple, final_drop: float, cue_starts: list) -> np.ndarray:
    music = np.zeros(int(total * RATE) + RATE)
    beat = 60 / BPM
    place(music, riser(drop), 0, 0.8)
    place(music, impact(), drop, 0.9)
    pump = np.ones_like(music)  # the kick ducks the bass and chords: the classic "pump"
    beat_index = 0
    time = drop
    while time < total - 0.2:
        in_breakdown = breakdown[0] <= time < breakdown[1]
        bar, step = divmod(beat_index, 4)
        root, chord = CHORDS[bar % 4]
        if not in_breakdown:
            place(music, kick(), time, 0.95)
            start = int(time * RATE)
            duck = 1 - 0.75 * np.exp(-np.arange(int(beat * RATE)) / RATE / 0.09)
            pump[start:start + len(duck)] = duck[: len(pump) - start]
            if step in (1, 3):
                place(music, clap(), time, 0.55)
            place(music, hat(0.06), time + beat / 2, 0.32)  # off-beat hats
            for sixteenth in (0.25, 0.75):
                place(music, hat(0.03), time + beat * sixteenth, 0.12)
            # Bass on the off-beats.
            bass = saw(note(root), beat / 2, 8) * envelope(beat / 2, 0.12, 0.004)
            place(music, bass, time + beat / 2, 0.32)
        # Chords: a pad that pumps, softer in the breakdown.
        if step == 0:
            pad = sum(saw(note(chord_note), beat * 4, 6) for chord_note in chord) / 3
            pad *= np.minimum(np.arange(len(pad)) / RATE / 0.03, 1) * np.exp(-np.arange(len(pad)) / RATE / 3)
            place(music, pad, time, 0.12 if not in_breakdown else 0.16)
        # An arp of the chord, sixteenths.
        if not in_breakdown:
            for sixteenth in range(4):
                arp_note = chord[(beat_index * 4 + sixteenth) % 3]
                tone = square(note(arp_note) * 2, beat / 4) * envelope(beat / 4, 0.05)
                place(music, tone, time + sixteenth * beat / 4, 0.045)
        time += beat
        beat_index += 1
    music *= pump[: len(music)]
    for cue_start in cue_starts[1:]:
        place(music, whoosh(), cue_start - 0.42, 0.55)
    place(music, riser(breakdown[1] - breakdown[0]), breakdown[0], 0.55)
    place(music, impact(), final_drop, 0.8)
    fade = int(1.2 * RATE)
    music[int(total * RATE) - fade:int(total * RATE)] *= np.linspace(1, 0, fade)
    music[int(total * RATE):] = 0
    return music[: int(total * RATE)]


def main():
    voices = []
    for scene_id, line in SCRIPT:
        samples = decode(tts(line))
        # Trim the clip's own leading and trailing silence, so the pacing stays tight.
        loud = np.where(np.abs(samples) > 0.01)[0]
        samples = samples[max(0, loud[0] - int(0.02 * RATE)): loud[-1] + int(0.06 * RATE)] if len(loud) else samples
        voices.append((scene_id, line, samples))

    cues, words, cursor = [], {}, LEAD
    for scene_id, line, samples in voices:
        if scene_id == "cta":
            cursor += 0.2
        length = len(samples) / RATE
        cues.append({"id": scene_id, "start": round(cursor, 3), "end": round(cursor + length, 3), "line": line})
        words[scene_id] = word_times(line, samples, cursor)
        cursor += length + GAP
    total = round(cursor + TAIL, 3)

    voice_track = np.zeros(int(total * RATE) + RATE)
    for cue, (_, _, samples) in zip(cues, voices):
        place(voice_track, samples, cue["start"])
    voice_track = voice_track[: int(total * RATE)]

    privacy = next(cue for cue in cues if cue["id"] == "privacy")
    cta = next(cue for cue in cues if cue["id"] == "cta")
    music = build_beat(total, LEAD - 0.02, (privacy["start"] - 0.3, cta["start"] - 0.05), cta["start"] - 0.05, [cue["start"] for cue in cues])
    music /= np.abs(music).max() + 1e-9

    # The beat ducks under her voice so every word stays clear.
    frame = RATE // 100
    level = np.sqrt(np.convolve(voice_track ** 2, np.ones(frame) / frame, mode="same"))
    follower = np.zeros_like(level)
    attack, release = np.exp(-1 / (0.01 * RATE)), np.exp(-1 / (0.25 * RATE))
    value = 0.0
    for index in range(0, len(level), 64):  # a fast, chunked envelope follower
        target = level[index]
        value = target + (value - target) * (attack ** 64 if target > value else release ** 64)
        follower[index:index + 64] = value
    duck = 1 - 0.55 * np.clip(follower / 0.06, 0, 1)
    mix = voice_track * 1.0 + music * 0.42 * duck
    mix /= np.abs(mix).max() / 0.92

    stereo = np.repeat((mix * 32767).astype(np.int16)[:, None], 2, axis=1)
    OUT_AUDIO.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(RATE), "-ac", "2", "-i", "pipe:0", "-b:a", "160k", str(OUT_AUDIO)], input=stereo.tobytes(), check=True)
    OUT_TIMINGS.write_text(json.dumps({"duration": total, "cues": cues, "words": words}, indent=1, ensure_ascii=False) + "\n")
    print(f"✅ {OUT_AUDIO.relative_to(ROOT)} ({total:.1f} s, {OUT_AUDIO.stat().st_size // 1024} KB) and {OUT_TIMINGS.relative_to(ROOT)}")
    for cue in cues:
        print(f"  {cue['id']:8} {cue['start']:6.2f}–{cue['end']:6.2f}  {cue['line']}")


if __name__ == "__main__":
    main()
