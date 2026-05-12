export default class FaqsModel {
  public readonly id?: number;
  public readonly answer: unknown[];
  public readonly question: unknown[];

  constructor(data: { id?: number; answer: unknown[]; question: unknown[] }) {
    this.id = data.id;
    this.answer = data.answer;
    this.question = data.question;

    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): FaqsModel {
    if (!json) {
      throw new Error('Cannot create FaqsModel from null or undefined');
    }

    const mapToLocaleArray = (data: unknown, key: string) => {
      if (Array.isArray(data)) return data;
      if (typeof data === 'object' && data !== null) {
        return Object.entries(data as Record<string, unknown>).map(([locale, value]) => ({
          locale,
          [key]: value,
        }));
      }
      return [
        {
          locale: 'en',
          [key]: data ?? '',
        },
      ];
    };

    const translations = (json.translations || {}) as Record<string, unknown>;
    const questionData = translations.question ?? json.question;
    const answerData = translations.answer ?? json.answer;

    return new FaqsModel({
      id: json.id as number | undefined,
      question: mapToLocaleArray(questionData, 'question'),
      answer: mapToLocaleArray(answerData, 'answer'),
    });
  }

  static get example(): FaqsModel {
    return new FaqsModel({
      id: 1,
      question: [{ locale: 'en', question: 'What is Vue?' }],
      answer: [{ locale: 'en', answer: 'A progressive framework.' }],
    });
  }

  static get examples(): FaqsModel[] {
    return [FaqsModel.example];
  }
}
