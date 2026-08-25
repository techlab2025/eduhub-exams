import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import type { QuestionBatchStatusEnum } from '../constant/question.batch.status.enum';
import QuestionBatchCreatorModel from './question.batch.creator.model';
import QuestionBatchEducationTypeModel from './question.batch.education.type.model';

export interface QuestionBatchTitleValue {
  id: number;
  title: string;
}

const localizedString = (value: unknown): string => {
  if (!Array.isArray(value)) return String(value ?? '');
  const translations = value.map(SaftyConditions.objectValue);
  const preferred = translations.find((item) => item.locale === 'en') ?? translations[0];
  return String(preferred?.title ?? preferred?.name ?? '');
};

const titleValue = (value: unknown): QuestionBatchTitleValue => {
  const data = SaftyConditions.objectValue(value);
  return {
    id: SaftyConditions.numberValue(data.id ?? data.e_c_subject_id),
    title: String(data.title ?? ''),
  };
};

export default class QuestionBatchModel {
  public readonly id: number;
  public readonly title: string;
  public readonly educationType: QuestionBatchEducationTypeModel[];
  public readonly eCSubject: QuestionBatchTitleValue;
  public readonly curriculum: QuestionBatchTitleValue;
  public readonly numberOfQuestions: number;
  public readonly sources: string[];
  public readonly status: QuestionBatchStatusEnum;
  public readonly createdAt: QuestionBatchCreatorModel;
  public readonly generationDate: string;

  constructor(data: {
    id: number;
    title: string;
    educationType: QuestionBatchEducationTypeModel[];
    eCSubject: QuestionBatchTitleValue;
    curriculum: QuestionBatchTitleValue;
    numberOfQuestions: number;
    sources: string[];
    status: QuestionBatchStatusEnum;
    createdAt: QuestionBatchCreatorModel;
    generationDate: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.educationType = data.educationType;
    this.eCSubject = data.eCSubject;
    this.curriculum = data.curriculum;
    this.numberOfQuestions = data.numberOfQuestions;
    this.sources = data.sources;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.generationDate = data.generationDate;
    Object.freeze(this);
  }

  /** @deprecated Use eCSubject, which matches the API response field. */
  get subject(): QuestionBatchTitleValue {
    return this.eCSubject;
  }

  /** @deprecated Use createdAt, which matches the API response field. */
  get createdBy(): QuestionBatchCreatorModel {
    return this.createdAt;
  }

  static fromJson(json: unknown): QuestionBatchModel {
    const data = SaftyConditions.objectValue(json);
    const rawCreator =
      (typeof data.created_at === 'object' ? data.created_at : undefined) ?? data.created_by ?? {};
    const rawSources = data.sources ?? data['sources '];
    return new QuestionBatchModel({
      id: SaftyConditions.numberValue(data.id),
      title: localizedString(data.title),
      educationType: Array.isArray(data.education_type)
        ? data.education_type.map(QuestionBatchEducationTypeModel.fromJson)
        : [],
      eCSubject: titleValue(data.e_c_subject),
      curriculum: titleValue(data.curriculum),
      numberOfQuestions: SaftyConditions.numberValue(data.number_of_questions),
      sources: Array.isArray(rawSources) ? rawSources.map(String) : [],
      status: String(data.status ?? '1') as QuestionBatchStatusEnum,
      createdAt: QuestionBatchCreatorModel.fromJson(rawCreator),
      generationDate: String(
        data.generation_date ?? (typeof data.created_at === 'string' ? data.created_at : ''),
      ),
    });
  }

  static readonly example = QuestionBatchModel.fromJson({
    id: 1,
    title: 'Batch-2026-001',
    education_type: [
      {
        id: 1,
        title: 'Governmental',
        children: [
          { id: 2, title: 'Primary' },
          { id: 3, title: 'First' },
        ],
      },
    ],
    e_c_subject: { id: 3, title: 'Arabic' },
    curriculum: { id: 1, title: 'Unit 1_chapter 2_lesson 1' },
    number_of_questions: 20,
    sources: ['School Book, Term 1'],
    status: '3',
    created_at: { id: 1, name: 'Ahmed Ali' },
    generation_date: '2022-05-09',
  });
}
