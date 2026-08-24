import { describe, expect, it } from 'vitest';
import AdviceModel from '../advice.model';

describe('AdviceModel', () => {
  it('maps advice responses with a title and description', () => {
    expect(
      AdviceModel.fromJson({
        advice_id: 4,
        title: 'Plan title',
        description: 'Plan description',
        advice_category: { id: 8, title: 'Planning' },
      }),
    ).toMatchObject({
      id: 4,
      title: 'Plan title',
      description: 'Plan description',
      adviceCategory: { id: 8, title: 'Planning' },
    });
  });
});
