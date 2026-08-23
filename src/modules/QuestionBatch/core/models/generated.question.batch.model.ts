import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import AnswerModel from '@/modules/Questions/core/models/subModels/answer.model';
import QuestionDocumentModel from '@/modules/Questions/core/models/subModels/question.document.model';
import { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';
import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';

const normalizeQuestion = (value: unknown): Record<string, unknown> => {
  const data = SaftyConditions.objectValue(value);
  return {
    ...data,
    topics: Array.isArray(data.topics) ? data.topics : [],
    answers: Array.isArray(data.answers) ? data.answers : [],
    documents: Array.isArray(data.documents) ? data.documents : [],
    explanation: SaftyConditions.objectValue(data.explanation),
  };
};

export default class GeneratedQuestionBatchModel {
  public readonly batchId?: number;
  public readonly questions: ShowQuestionsModel[];

  constructor(data: { batchId?: number; questions: ShowQuestionsModel[] }) {
    this.batchId = data.batchId;
    this.questions = data.questions;
    Object.freeze(this);
  }

  static fromJson(json: unknown): GeneratedQuestionBatchModel {
    const data = SaftyConditions.objectValue(json);
    const nestedData = SaftyConditions.objectValue(data.data);
    const nestedBatch = SaftyConditions.objectValue(data.question_batch ?? data.batch);
    const candidates: unknown[] = [
      json,
      data.questions,
      data.items,
      nestedData.questions,
      nestedData.items,
      nestedBatch.questions,
    ];
    const rawQuestions = candidates.find(Array.isArray) as unknown[] | undefined;

    return new GeneratedQuestionBatchModel({
      batchId: SaftyConditions.numberValue(data.batch_id ?? data.id ?? nestedBatch.id) || undefined,
      questions: (rawQuestions ?? []).map((question) =>
        ShowQuestionsModel.fromJson(normalizeQuestion(question)),
      ),
    });
  }

  static readonly example = new GeneratedQuestionBatchModel({
    batchId: 1,
    questions: [
      new ShowQuestionsModel({
        id: 1,
        questionType: QuestionTypeEnum.mcq,
        difficulty: QuestionDifficultyEnum.hard,
        questionTitle: 'What Is The Basic Building Block Of A Living Organism?',
        answers: [
          new AnswerModel({ answer: 'Heart' }),
          new AnswerModel({ answer: 'Cell', is_right_answer: true }),
          new AnswerModel({ answer: 'Stomach' }),
          new AnswerModel({ answer: 'Bones' }),
        ],
        questionDocuments: [new QuestionDocumentModel({ title: 'School Book', source: 'Page 76' })],
        similarPrecentage: 0,
      }),
      new ShowQuestionsModel({
        id: 2,
        questionType: QuestionTypeEnum.mcq,
        difficulty: QuestionDifficultyEnum.hard,
        questionTitle: 'What Is The Basic Building Block Of A Living Organism?',
        answers: [
          new AnswerModel({ answer: 'Heart' }),
          new AnswerModel({ answer: 'Cell', is_right_answer: true }),
          new AnswerModel({ answer: 'Stomach' }),
          new AnswerModel({ answer: 'Bones' }),
        ],
        questionDocuments: [new QuestionDocumentModel({ title: 'School Book', source: 'Page 76' })],
        similarPrecentage: 86,
      }),
    ],
  });
}
