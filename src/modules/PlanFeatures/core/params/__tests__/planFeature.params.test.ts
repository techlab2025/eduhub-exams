import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import { PlanFeatureTypeEnum } from '../../models/planFeature.model';
import { StorePlanFeatureParams } from '../planFeature.params';
describe('plan feature params', () => {
  it('maps translated feature payloads', () => {
    expect(
      new StorePlanFeatureParams({
        translations: new TranslationParams({
          title: { en: 'Exams' },
          description: { en: 'Access' },
        }),
        parentId: 3,
        type: PlanFeatureTypeEnum.SWITCH,
      }).toMap(),
    ).toMatchObject({
      parent_id: 3,
      plan_feature_type: '1',
      translations: { title: { en: 'Exams' } },
    });
  });
});
