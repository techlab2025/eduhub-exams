import IndexParams from '@/base/Core/Params/indexParams';
import type Params from '@/base/Core/Params/params';
import type TranslationParams from '@/modules/about/core/params/translation.params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export class IndexHighlightBadgeParams extends IndexParams {}

export class StoreHighlightBadgeParams implements Params {
  public translations: TranslationParams;
  private static readonly validation = new ClassValidation();
  constructor(translations: TranslationParams) {
    this.translations = translations;
  }
  toMap() {
    return { translations: this.translations.toMap() };
  }
  validate() {
    return StoreHighlightBadgeParams.validation.validate(this);
  }
  validateOrThrow() {
    return StoreHighlightBadgeParams.validation.validateOrThrow(this);
  }
}

export class ShowHighlightBadgeParams implements Params {
  public id: number;
  public allLocales: boolean;
  private static readonly validation = new ClassValidation().setRules({
    id: { required: true, min: 1 },
  });
  constructor(id: number, allLocales = false) {
    this.id = id;
    this.allLocales = allLocales;
  }
  toMap() {
    return { highlight_badge_id: this.id };
  }
  validate() {
    return ShowHighlightBadgeParams.validation.validate(this);
  }
  validateOrThrow() {
    return ShowHighlightBadgeParams.validation.validateOrThrow(this);
  }
}

export class UpdateHighlightBadgeParams extends StoreHighlightBadgeParams {
  public id: number;
  constructor(id: number, translations: TranslationParams) {
    super(translations);
    this.id = id;
  }
  toMap() {
    return { highlight_badge_id: this.id, ...super.toMap() };
  }
}

export class DeleteHighlightBadgeParams extends ShowHighlightBadgeParams {}
