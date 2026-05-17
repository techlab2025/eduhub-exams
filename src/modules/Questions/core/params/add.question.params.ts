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
export default class AddquestionsParams implements Params {
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
    subjectId: { required: false },
    topics: { required: true },
    difficultyLevel: { required: false },
    skills: { required: true },
    answers: { required: true },
    questionSource: { required: true },
  });

  constructor(data: {
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
      title: this.title,
      image: this.image,
      question_type: this.questionType,
      subject_id: this.subjectId,
      topics: this.topics,
      question_sequence_id: this.questionSequenceId,
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
    return AddquestionsParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddquestionsParams.validation.validateOrThrow(this);
  }
}
