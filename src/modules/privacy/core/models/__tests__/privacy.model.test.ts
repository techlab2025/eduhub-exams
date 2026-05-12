import { describe, it, expect } from 'vitest';
import PrivacyModel from '../privacy.model';

describe('PrivacyModel', () => {
  describe('fromJson', () => {
    it('should parse simple flat JSON correctly', () => {
      const json = {
        id: 1,
        title: [{ locale: 'en', title: 'Privacy Title' }],
        description: [{ locale: 'en', description: 'Privacy Description' }],
      };

      const model = PrivacyModel.fromJson(json as any);

      expect(model.id).toBe(1);
      expect(model.title).toEqual([{ locale: 'en', title: 'Privacy Title' }]);
      expect(model.description).toEqual([{ locale: 'en', description: 'Privacy Description' }]);
    });

    it('should parse nested translations correctly', () => {
      const json = {
        id: 2,
        translations: {
          title: { en: 'Nested Title' },
          description: { en: 'Nested Description' },
        },
      };

      const model = PrivacyModel.fromJson(json as any);

      expect(model.id).toBe(2);
      expect(model.title).toEqual([{ locale: 'en', title: 'Nested Title' }]);
    });

    it('should throw on null input', () => {
      expect(() => PrivacyModel.fromJson(null as any)).toThrow(
        'Cannot create PrivacyModel from null or undefined',
      );
    });
  });

  describe('example', () => {
    it('should provide a valid example instance', () => {
      expect(PrivacyModel.example).toBeInstanceOf(PrivacyModel);
      expect(PrivacyModel.example.id).toBe(1);
    });
  });
});
