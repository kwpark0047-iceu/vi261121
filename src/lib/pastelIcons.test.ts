import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { ContentType } from '../types/vibeatlas';
import {
  getContentTypePastelStyle,
  getRolePastelStyle,
  PASTEL_TONE_STYLES,
  type PastelIconRole,
} from './pastelIcons.ts';

describe('pastelIcons', () => {
  it('assigns distinct readable pastel tokens with light and dark classes for every content type', () => {
    const types: ContentType[] = [
      'web_app',
      'ai_tool',
      'mcp_server',
      'ai_skill',
      'ai_agent',
      'template',
      'open_source',
    ];
    for (const contentType of types) {
      const style = getContentTypePastelStyle(contentType);
      assert.ok(style.containerClass.includes('dark:'));
      assert.ok(style.surfaceGradientClass.includes('from-'));
      assert.ok(PASTEL_TONE_STYLES[style.tone]);
    }
  });

  it('resolves section role pastel tokens consistently', () => {
    const roles: PastelIconRole[] = [
      'brand',
      'promo',
      'activity',
      'trending',
      'mcp',
      'stacks',
      'makers',
      'submit',
      'newsletter',
      'discover',
      'stars',
      'edit',
    ];
    for (const role of roles) {
      const style = getRolePastelStyle(role);
      assert.ok(style.iconClass.length > 0);
      assert.ok(style.ringClass.includes('ring-'));
    }
  });
});
