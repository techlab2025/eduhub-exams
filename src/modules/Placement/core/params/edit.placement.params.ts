import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for adding a new employee
 */
export default class EditPlacementParams implements Params {
  public id: number;
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
    id: number;
    numberOfQuestions?: number;
    time?: number;
    difficulties?: {
      easy: number;
      medium: number;
      hard: number;
    };
  }) {
    this.id = data.id;
    this.numberOfQuestions = data.numberOfQuestions;
    this.time = data.time;
    this.difficulties = data.difficulties;
  }

  toMap(): { [p: string]: any } {
    return {
      id: this.id,
      numberOfQuestions: this.numberOfQuestions,
      time: this.time,
      difficulties: this.difficulties,
    };
  }

  validate() {
    return EditPlacementParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditPlacementParams.validation.validateOrThrow(this);
  }
}
