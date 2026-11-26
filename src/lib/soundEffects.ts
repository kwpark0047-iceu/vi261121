export type UiSoundEffect = 'tap' | 'pop' | 'bookmark' | 'chime' | 'sparkle' | 'close';

export const STORAGE_SOUND_KEY = 'vibeatlas_sound_enabled_v1';

export interface SoundToneStep {
  frequency: number;
  endFrequency?: number;
  delayMs: number;
  durationMs: number;
  gain: number;
  waveform: OscillatorType;
}

export const SOUND_PRESETS: Record<UiSoundEffect, ReadonlyArray<SoundToneStep>> = {
  tap: [
    {
      frequency: 520,
      endFrequency: 390,
      delayMs: 0,
      durationMs: 48,
      gain: 0.035,
      waveform: 'sine',
    },
  ],
  pop: [
    {
      frequency: 440,
      endFrequency: 660,
      delayMs: 0,
      durationMs: 85,
      gain: 0.048,
      waveform: 'sine',
    },
  ],
  bookmark: [
    {
      frequency: 523.25,
      delayMs: 0,
      durationMs: 75,
      gain: 0.04,
      waveform: 'triangle',
    },
    {
      frequency: 659.25,
      delayMs: 55,
      durationMs: 110,
      gain: 0.042,
      waveform: 'sine',
    },
  ],
  chime: [
    {
      frequency: 587.33,
      endFrequency: 783.99,
      delayMs: 0,
      durationMs: 115,
      gain: 0.04,
      waveform: 'sine',
    },
  ],
  sparkle: [
    {
      frequency: 523.25,
      delayMs: 0,
      durationMs: 65,
      gain: 0.036,
      waveform: 'sine',
    },
    {
      frequency: 659.25,
      delayMs: 45,
      durationMs: 75,
      gain: 0.038,
      waveform: 'sine',
    },
    {
      frequency: 783.99,
      delayMs: 90,
      durationMs: 115,
      gain: 0.04,
      waveform: 'triangle',
    },
  ],
  close: [
    {
      frequency: 440,
      endFrequency: 311.13,
      delayMs: 0,
      durationMs: 72,
      gain: 0.032,
      waveform: 'sine',
    },
  ],
};

let cachedAudioContext: AudioContext | null = null;
let cachedEnabled: boolean | null = null;

export function readSoundPreference(storage?: Pick<Storage, 'getItem'> | null): boolean {
  try {
    const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return true;
    const raw = store.getItem(STORAGE_SOUND_KEY);
    if (raw === 'false' || raw === '0' || raw === 'off') return false;
    if (raw === 'true' || raw === '1' || raw === 'on') return true;
    return true;
  } catch {
    return true;
  }
}

export function saveSoundPreference(
  enabled: boolean,
  storage?: Pick<Storage, 'setItem'> | null
): boolean {
  cachedEnabled = enabled;
  try {
    const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return false;
    store.setItem(STORAGE_SOUND_KEY, enabled ? 'true' : 'false');
    return true;
  } catch {
    return false;
  }
}

export function isSoundEnabled(): boolean {
  if (cachedEnabled === null) {
    cachedEnabled = readSoundPreference();
  }
  return cachedEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  saveSoundPreference(enabled);
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (cachedAudioContext) return cachedAudioContext;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  try {
    cachedAudioContext = new AudioCtx();
    return cachedAudioContext;
  } catch {
    return null;
  }
}

export function prefersReducedMotionEnabled(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function playUiSound(
  effect: UiSoundEffect,
  options?: { force?: boolean }
): boolean {
  if (!options?.force && !isSoundEnabled()) return false;
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => {});
    }
    const baseTime = ctx.currentTime;
    const steps = SOUND_PRESETS[effect];
    for (const step of steps) {
      const startAt = baseTime + step.delayMs / 1000;
      const stopAt = startAt + step.durationMs / 1000;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = step.waveform;
      osc.frequency.setValueAtTime(step.frequency, startAt);
      if (step.endFrequency && step.endFrequency > 0) {
        osc.frequency.exponentialRampToValueAtTime(step.endFrequency, stopAt);
      }
      gainNode.gain.setValueAtTime(0.0001, startAt);
      gainNode.gain.exponentialRampToValueAtTime(step.gain, startAt + 0.012);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, stopAt);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(stopAt + 0.01);
    }
    return true;
  } catch {
    return false;
  }
}
