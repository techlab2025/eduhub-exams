import { describe, expect, it } from 'vitest';
import DocumentIndexModel from '../document.index.model';
import DocumentModel from '@/modules/document/core/models/document.model';

describe('DocumentIndexModel', () => {
  it('uses the existing document model as its data contract', () => {
    expect(DocumentIndexModel).toBe(DocumentModel);
  });
});
