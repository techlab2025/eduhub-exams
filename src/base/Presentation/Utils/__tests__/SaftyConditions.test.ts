import { describe, expect, it } from 'vitest';
import { SaftyConditions } from '../SaftyConditions';

class ExampleModel {
  constructor(public readonly id: number) {}

  static fromJson(json: Record<string, unknown>): ExampleModel {
    return new ExampleModel(Number(json.id ?? 0));
  }
}

describe('SaftyConditions', () => {
  it('maps object values through any compatible model', () => {
    expect(SaftyConditions.modelValue({ id: '4' }, ExampleModel)).toEqual(new ExampleModel(4));
    expect(SaftyConditions.modelValue(null, ExampleModel)).toEqual(new ExampleModel(0));
  });

  it('maps nullable models and model lists safely', () => {
    expect(SaftyConditions.nullableModelValue(null, ExampleModel)).toBeNull();
    expect(SaftyConditions.nullableModelValue({ id: 2 }, ExampleModel)).toEqual(
      new ExampleModel(2),
    );
    expect(SaftyConditions.modelList([{ id: 1 }, null, { id: 3 }], ExampleModel)).toEqual([
      new ExampleModel(1),
      new ExampleModel(0),
      new ExampleModel(3),
    ]);
    expect(SaftyConditions.modelList('invalid', ExampleModel)).toEqual([]);
  });

  it('maps title values and rejects non-object values', () => {
    expect(SaftyConditions.titleValue({ id: '7', title: 'Admin' })).toEqual({
      id: 7,
      title: 'Admin',
    });
    expect(SaftyConditions.titleValue([])).toBeNull();
    expect(SaftyConditions.objectValue([])).toEqual({});
  });

  it('safely converts backend number and boolean values', () => {
    expect(SaftyConditions.numberValue('17')).toBe(17);
    expect(SaftyConditions.numberValue('invalid', 4)).toBe(4);
    expect(SaftyConditions.booleanValue('needs_review')).toBe(true);
    expect(SaftyConditions.booleanValue(false)).toBe(false);
  });
});
