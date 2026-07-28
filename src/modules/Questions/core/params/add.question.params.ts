import type Params from '@/base/Core/Params/params';
import type { QuestionTypeEnum } from '../constant/question.type.enum';
import type { QuestionDifficultyEnum } from '../constant/question.difficulty.enum';
import type AnswersParams from './subParams/answers.params';
import type QuestionSkillParams from './subParams/question.skills.params';
import type QuestionSourceParams from './subParams/question.source.params';
import type SolutionStepsParams from './subParams/soluation.steps.params';
import type QuestionClarificationParams from './subParams/question.clarification.params';
import type TopicsParams from './subParams/topics.params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import { AnswerEvaluationTypeEnum } from '../constant/answer.evaluation.type.enum';
import type AttachmentsParams from './subParams/attachments.params';
import type { QuestionStatusEnum } from '../constant/question.status.enum';

/**
 * Parameters for adding a new employee
 */
export default class AddquestionsParams implements Params {
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
  public status?:QuestionStatusEnum| null;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true },
    // image: { required: true },
    questionType: { required: true },
    subjectId: { required: true },
    topics: { required: true },
    difficultyLevel: { required: false },
    skills: { required: true },
    questionSource: { required: true },
  });

  constructor(data: {
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

  toMap(): { [p: string]: any } {
    const attachments =
      this.image?.map((item) => item.toMap()).filter((item) => item.file && item.file.length > 0) ??
      [];

    const topics =
      this.topics
        ?.map((item) => item.toMap())
        .filter((item) => item && Object.keys(item).length > 0) ?? [];

    const skills =
      this.skills
        ?.map((item) => item.toMap())
        .filter((item) => item && Object.keys(item).length > 0) ?? [];

    const answers =
      this.answers
        ?.map((item) => item.toMap())
        .filter((item) => {
          return item.answer?.trim()?.length > 0;
        }) ?? [];

    const document = this.questionSource?.toMap();

    const hasDocument =
      document && Number(document.document_id) > 0 && document.text?.trim()?.length > 0;

    return {
      // Always send question
      ...(this.title?.length! > 0 &&{

        question: this.title
      }),

      // Send only when selected
      ...(this.questionType !== undefined &&
        this.questionType !== null && {
          question_type: this.questionType,
        }),

      // Attachments
      ...(attachments.length > 0 && {
        attachments,
      }),

      // Subject
      ...(this.subjectId !== undefined &&
        this.subjectId !== null && {
          e_c_branch_id: this.subjectId,
        }),

      // EC subject / sequence
      ...(this.questionSequenceId !== undefined &&
        this.questionSequenceId !== null && {
          e_c_subject_id: this.questionSequenceId,
          question_sequence_id: this.questionSequenceId,
        }),

      // Topics
      ...(topics.length > 0 && {
        topics,
      }),

      // Difficulty
      ...(this.difficultyLevel !== undefined &&
        this.difficultyLevel !== null && {
          difficulty_level: this.difficultyLevel,
        }),

      // Skills
      ...(skills.length > 0 && {
        skills,
      }),

      // Answers
      ...(this.answerEvaluation !== AnswerEvaluationTypeEnum.need_correct &&
        answers.length > 0 && {
          answers,
        }),

      // Question source / document
      ...(hasDocument && {
        documents: [document],
      }),

      // Clarification
      ...(this.isQuestionClarification === true && {
        is_question_clarification: true,

        ...(this.questionClarification && {
          explanation: this.questionClarification.toMap(),
        }),
      }),

      // Solution steps
      ...(this.isSolutionSteps === true && {
        is_solution_steps: true,

        ...(this.solutionSteps && {
          answer_step: this.solutionSteps.toMap(),
        }),
      }),

      // Solution hint
      ...(this.isSolutionHint === true && {
        is_solution_hint: true,

        ...(this.solutionHint && {
          answer_hint: this.solutionHint.toMap(),
        }),
      }),

      // Answer evaluation
      ...(this.answerEvaluation !== undefined &&
        this.answerEvaluation !== null && {
          correct_status: this.answerEvaluation,
        }),

      // Similar percentage
      ...(this.similarPrecentage?.trim()?.length! > 0 && {
        identicality_percentage: Number(this.similarPrecentage),
      }),

      // Parent
      ...(this.parentId !== undefined &&
        this.parentId !== null && {
          parent_id: this.parentId,
        }),

      // Draft
      ...(this.status !== undefined &&
        this.status !== null && {
          status: this.status,
        }),
    };
  }

  validate() {
    return AddquestionsParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddquestionsParams.validation.validateOrThrow(this);
  }
}
