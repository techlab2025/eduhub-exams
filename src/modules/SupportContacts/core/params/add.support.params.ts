import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type ContactsParams from './contacts.paras';

/**
 * Parameters for adding a new employee
 */
export default class AddSupportContactsParams implements Params {
  public readonly contatcs: ContactsParams[];

  public static readonly validation = new ClassValidation().setRules({});

  constructor(data: { contatcs: ContactsParams[] }) {
    this.contatcs = data.contatcs;
  }

  toMap(): { [p: string]: any } {
    return {
      contatcs: this.contatcs,
    };
  }

  validate() {
    return AddSupportContactsParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddSupportContactsParams.validation.validateOrThrow(this);
  }
}
