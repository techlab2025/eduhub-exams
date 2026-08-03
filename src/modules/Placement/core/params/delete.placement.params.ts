import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for deleting an employee
 */
export default class DeletePlacementParams implements Params {
  public id: number;


  public static readonly validation = new ClassValidation().setRules({
    id: { required: true },
  });

  constructor(
    id: number,
  ) {
    this.id = id;
  }

  toMap(): { [p: string]: any } {
    return {
      id: this.id,
    };
  }

  validate() {
    return DeletePlacementParams.validation.validate(this);
  }

  validateOrThrow() {
    return DeletePlacementParams.validation.validateOrThrow(this);
  }
}
