import { describe, expect, it } from 'vitest';
import DocumentIndexSourcePagesModel from '../document.index.source.pages.model';

describe('DocumentIndexSourcePagesModel', () => {
  it('maps page values safely', () => {
    expect(DocumentIndexSourcePagesModel.fromJson({ start: '7', end: 31 })).toEqual({
      start: 7,
      end: 31,
    });
  });
});
