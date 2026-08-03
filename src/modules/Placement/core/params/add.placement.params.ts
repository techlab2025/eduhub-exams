import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for adding a new employee
 */
export default class AddPlacementParams implements Params {
  public numberOfQuestions?: number;
  public time?: number;
  public difficulties?: {
    easy: number;
    medium: number;
    hard: number;
  };

  public static readonly validation = new ClassValidation().setRules({
    numberOfQuestions: { required: false },
    time: { required: false },
    difficulties: { required: false },
  });

  constructor(data: {
    numberOfQuestions?: number;
    time?: number;
    difficulties?: { easy: number; medium: number; hard: number };
  }) {
    this.numberOfQuestions = data.numberOfQuestions;
    this.time = data.time;
    this.difficulties = data.difficulties;
  }

  toMap(): { [p: string]: any } {
    return {
      numberOfQuestions: this.numberOfQuestions,
      time: this.time,
      difficulties: this.difficulties,
    };
  }

  validate() {
    return AddPlacementParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddPlacementParams.validation.validateOrThrow(this);
  }
}
