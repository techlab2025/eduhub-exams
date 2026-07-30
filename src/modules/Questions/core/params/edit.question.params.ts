import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { QuestionTypeEnum } from '../constant/question.type.enum';
import type { QuestionDifficultyEnum } from '../constant/question.difficulty.enum';
import type AnswersParams from './subParams/answers.params';
import type QuestionSkillParams from './subParams/question.skills.params';
import type QuestionSourceParams from './subParams/question.source.params';
import type SolutionStepsParams from './subParams/soluation.steps.params';
import type QuestionClarificationParams from './subParams/question.clarification.params';
import type TopicsParams from './subParams/topics.params';
import type { AnswerEvaluationTypeEnum } from '../constant/answer.evaluation.type.enum';
import type AttachmentsParams from './subParams/attachments.params';
import type { QuestionStatusEnum } from '../constant/question.status.enum';

/**
 * Parameters for adding a new employee
 */
export default class EditquestionsParams implements Params {
  public id: number;
  public title?: string;
  public image?: AttachmentsParams[];
  public questionType?: QuestionTypeEnum;
  public subjectId?: number | null;
  public topics?: TopicsParams[] | null;
  public questionSequenceId?: number | null;
  public difficultyLevel?: QuestionDifficultyEnum | null;
  public skills?: QuestionSkillParams[];
  public questionSource?: QuestionSourceParams;
  public answers?: AnswersParams[];
  public isQuestionClarification?: boolean;
  public questionClarification?: QuestionClarificationParams;
  public isSolutionSteps?: boolean;
  public solutionSteps?: SolutionStepsParams;
  public isSolutionHint?: boolean;
  public solutionHint?: SolutionStepsParams;
  public answerEvaluation?: AnswerEvaluationTypeEnum;
  public similarPrecentage?: string;
  public parentId?: number | null;
  public status?: QuestionStatusEnum | null;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true },
    // image: { required: true },
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
    title?: string;
    image?: AttachmentsParams[];
    questionType?: QuestionTypeEnum;
    subjectId?: number | null;
    topics?: TopicsParams[] | null;
    questionSequenceId?: number | null;
    difficultyLevel?: QuestionDifficultyEnum | null;
    skills?: QuestionSkillParams[];
    questionSource?: QuestionSourceParams;
    answers?: AnswersParams[];
    isQuestionClarification?: boolean;
    questionClarification?: QuestionClarificationParams;
    isSolutionSteps?: boolean;
    solutionSteps?: SolutionStepsParams;
    isSolutionHint?: boolean;
    solutionHint?: SolutionStepsParams;
    answerEvaluation?: AnswerEvaluationTypeEnum;
    similarPrecentage?: string;
    parentId?: number | null;
    status?: QuestionStatusEnum | null;
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
    this.answerEvaluation = data.answerEvaluation;
    this.similarPrecentage = data.similarPrecentage;
    this.parentId = data.parentId;
    this.status = data.status;
  }

  toMap(): Record<string, unknown> {
    const attachments =
      this.image?.map((f) => f.toMap()).filter((f) => f.file && f.file.length > 0) ?? [];
    return {
      question_id: this.id,
      question: this.title,
      ...(attachments.length > 0 && {
        attachments,
      }),
      question_type: this.questionType,
      e_c_subject_id: this.questionSequenceId,
      e_c_branch_id: this.subjectId,
      topics: this.topics?.map((item) => item.toMap()),
      question_sequence_id: this.questionSequenceId,
      difficulty_level: this.difficultyLevel,
      skills: this.skills?.map((item) => item.toMap()),
      answers: this.answers?.map((item) => item.toMap()),
      documents: [this.questionSource?.toMap()],
      is_question_clarification: this.isQuestionClarification,
      explanation: this.isQuestionClarification ? this.questionClarification?.toMap() : null,
      is_solution_steps: this.isSolutionSteps,
      answer_step: this.isSolutionSteps ? this.solutionSteps?.toMap() : null,
      is_solution_hint: this.isSolutionHint,
      answer_hint: this.isSolutionHint ? this.solutionHint?.toMap() : null,
      correct_status: this.answerEvaluation,
      parent_id: this.parentId ?? null,
      ...(this.status !== undefined &&
        this.status !== null && {
          review_status: this.status,
        }),
      identicality_percentage: this.similarPrecentage?.length
        ? Number(this.similarPrecentage)
        : null,
    };
  }

  validate() {
    return EditquestionsParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditquestionsParams.validation.validateOrThrow(this);
  }
}
