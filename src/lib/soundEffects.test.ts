import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isSoundEnabled,
  playUiSound,
  readSoundPreference,
  saveSoundPreference,
  setSoundEnabled,
  SOUND_PRESETS,
  STORAGE_SOUND_KEY,
  type UiSoundEffect,
} from './soundEffects.ts';

describe('soundEffects', () => {
  it('defines gentle pastel sound presets with bounded non-fatiguing gain', () => {
    const effects: UiSoundEffect[] = ['tap', 'pop', 'bookmark', 'chime', 'sparkle', 'close'];
    for (const eff of effects) {
      const steps = SOUND_PRESETS[eff];
      assert.ok(steps.length >= 1, `Expected preset steps for ${eff}`);
      for (const step of steps) {
        assert.ok(step.frequency >= 180 && step.frequency <= 1600);
        assert.ok(step.durationMs > 0 && step.durationMs <= 200);
        assert.ok(step.gain > 0 && step.gain <= 0.08);
      }
    }
  });

  it('defaults sound preference to enabled and persists updates safely', () => {
    const backing = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => backing.get(k) ?? null,
      setItem: (k: string, v: string) => {
        backing.set(k, v);
      },
    };

    assert.equal(readSoundPreference(mockStorage), true);
    saveSoundPreference(false, mockStorage);
    assert.equal(backing.get(STORAGE_SOUND_KEY), 'false');
    assert.equal(readSoundPreference(mockStorage), false);

    saveSoundPreference(true, mockStorage);
    assert.equal(readSoundPreference(mockStorage), true);

    setSoundEnabled(false);
    assert.equal(isSoundEnabled(), false);
    setSoundEnabled(true);
    assert.equal(isSoundEnabled(), true);
  });

  it('no-ops cleanly in Node SSR environments without AudioContext', () => {
    assert.equal(playUiSound('pop'), false);
    assert.equal(playUiSound('sparkle', { force: true }), false);
  });
});
