import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type FaqsDetailsParams from './faqs.details.params';

/**
 * Parameters for adding a new country
 */
export default class AddFaqsParams implements Params {
  public faqs: FaqsDetailsParams[];
  public static readonly validation = new ClassValidation().setRules({
    faqs: { required: true, minLength: 1 },
  });

  constructor(data: { faqs: FaqsDetailsParams[] }) {
    this.faqs = data.faqs;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      faqs: this.faqs.map((el) => el.toMap()),
    };
    return map;
  }

  validate() {
    return AddFaqsParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddFaqsParams.validation.validateOrThrow(this);
  }
}
