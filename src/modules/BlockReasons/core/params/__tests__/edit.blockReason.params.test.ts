import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import EditBlockReasonsParams from '../edit.blockReason.params';

describe('EditBlockReasonsParams', () => {
  it('maps the id and translated titles', () => {
    const params = new EditBlockReasonsParams({
      blockReasonId: 3,
      translations: new TranslationParams({ title: { en: 'Policy violation' } }),
    });
    expect(params.toMap()).toMatchObject({ block_reason_id: 3 });
  });
});
