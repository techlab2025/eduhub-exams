import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { QuestionTypeEnum } from '../constant/question.type.enum';
import type { QuestionDifficultyEnum } from '../constant/question.difficulty.enum';
import type AnswersParams from './subParams/answers.params';
import type QuestionSkillParams from './subParams/question.skills.params';
import type QuestionSourceParams from './subParams/question.source.params';
import type QuestionClarificationParams from './subParams/answers.params';
import type SolutionStepsParams from './subParams/soluation.steps.params';

/**
 * Parameters for adding a new employee
 */
export default class EditquestionsParams implements Params {
  public id: number;
  public title: string;
  public image: string[];
  public questionType: QuestionTypeEnum;
  public subjectId: number | null;
  public topics: number[];
  public questionSequenceId: number | null;
  public difficultyLevel: QuestionDifficultyEnum | null;
  public skills: QuestionSkillParams[];
  public questionSource: QuestionSourceParams;
  public answers: AnswersParams[];
  public isQuestionClarification?: boolean;
  public questionClarification?: QuestionClarificationParams;
  public isSolutionSteps?: boolean;
  public solutionSteps?: SolutionStepsParams;
  public isSolutionHint?: boolean;
  public solutionHint?: SolutionStepsParams;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true },
    image: { required: true },
    questionType: { required: true },
    subjectId: { required: true },
    topics: { required: true },
    difficultyLevel: { required: true },
    skills: { required: true },
    answers: { required: true },
    questionSource: { required: true },
  });

  constructor(data: {
    id: number;
    title: string;
    image: string[];
    questionType: QuestionTypeEnum;
    subjectId: number | null;
    topics: number[];
    questionSequenceId: number | null;
    difficultyLevel: QuestionDifficultyEnum | null;
    skills: QuestionSkillParams[];
    questionSource: QuestionSourceParams;
    answers: AnswersParams[];
    isQuestionClarification?: boolean;
    questionClarification?: QuestionClarificationParams;
    isSolutionSteps?: boolean;
    solutionSteps?: SolutionStepsParams;
    isSolutionHint?: boolean;
    solutionHint?: SolutionStepsParams;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.image = data.image;
    this.questionType = data.questionType;
    this.subjectId = data.subjectId;
    this.topics = data.topics;
    this.questionSequenceId = data.questionSequenceId;
    this.difficultyLevel = data.difficultyLevel;
    this.skills = data.skills;
    this.answers = data.answers;
    this.questionSource = data.questionSource;
    this.isQuestionClarification = data.isQuestionClarification;
    this.questionClarification = data.questionClarification;
    this.isSolutionSteps = data.isSolutionSteps;
    this.solutionSteps = data.solutionSteps;
    this.isSolutionHint = data.isSolutionHint;
    this.solutionHint = data.solutionHint;
  }

  toMap(): { [p: string]: any } {
    return {
      id: this.id,
      title: this.title,
      image: this.image,
      question_type: this.questionType,
      subject_id: this.subjectId,
      question_sequence_id: this.questionSequenceId,
      topics: this.topics,
      difficulty_level: this.difficultyLevel,
      skills: this.skills,
      answers: this.answers,
      question_source: this.questionSource,
      is_question_clarification: this.isQuestionClarification,
      question_clarification: this.questionClarification,
      is_solution_steps: this.isSolutionSteps,
      solution_steps: this.solutionSteps,
      is_solution_hint: this.isSolutionHint,
      solution_hint: this.solutionHint,
    };
  }

  validate() {
    return EditquestionsParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditquestionsParams.validation.validateOrThrow(this);
  }
}
