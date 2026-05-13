import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class EditEducationSubjectSkillsParams implements Params {
  public entryId: number;
  public skillId: number;
  public percentage: string;

  public static readonly validation = new ClassValidation().setRules({});

  constructor(data: { entryId: number; skillId: number; percentage: string }) {
    this.entryId = data.entryId;
    this.skillId = data.skillId;
    this.percentage = data.percentage;
  }

  toMap(): { [p: string]: any } {
    return {
      education_classification_subject_skill_id: this.entryId,
      skill_id: this.skillId,
      percentage: this.percentage,
    };
  }

  validate() {
    return EditEducationSubjectSkillsParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditEducationSubjectSkillsParams.validation.validateOrThrow(this);
  }
}
