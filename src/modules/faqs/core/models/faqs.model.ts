export default class FaqsModel {
  public readonly id?: number;
  public readonly answer: Record<string, string>;
  public readonly question: Record<string, string>;

  constructor(data: {
    id?: number;
    answer: Record<string, string>;
    question: Record<string, string>;
  }) {
    this.id = data.id;
    this.answer = data.answer;
    this.question = data.question;

    Object.freeze(this);
  }

  static fromJson(json: any): FaqsModel {
    if (!json) {
      throw new Error('Cannot create FaqsModel from null or undefined');
    }

    return new FaqsModel({
      id: json.id,
      answer: json.translations?.answer ?? json.answer ?? {},
      question: json.translations?.question ?? json.question ?? {},
    });
  }

  static examples: FaqsModel[] = [
    new FaqsModel({
      id: 1,
      question: { en: 'What Is This Platform?', ar: 'ما هي هذه المنصة؟' },
      answer: {
        en: 'This Platform Helps Students Practice Through Interactive Exams And Analyze Their Performance To Improve Their Learning Outcomes.',
        ar: 'تساعد هذه المنصة الطلاب على التدريب من خلال اختبارات تفاعلية وتحليل أدائهم لتحسين نتائج التعلم.',
      },
    }),
    new FaqsModel({
      id: 2,
      question: { en: 'How Can I Start A Test?', ar: 'كيف يمكنني بدء اختبار؟' },
      answer: {
        en: 'Select a subject from the dashboard, choose a test, and click Start.',
        ar: 'اختر مادة من لوحة التحكم، واختر اختباراً، ثم انقر على بدء.',
      },
    }),
    new FaqsModel({
      id: 3,
      question: { en: 'Will I Get My Results Immediately?', ar: 'هل سأحصل على نتائجي فوراً؟' },
      answer: {
        en: 'Yes, results are shown immediately after you submit the test.',
        ar: 'نعم، تظهر النتائج فور إرسال الاختبار.',
      },
    }),
    new FaqsModel({
      id: 4,
      question: {
        en: 'Can I Track My Progress Over Time?',
        ar: 'هل يمكنني تتبع تقدمي مع مرور الوقت؟',
      },
      answer: {
        en: 'Yes, the platform provides detailed progress reports and statistics.',
        ar: 'نعم، توفر المنصة تقارير تقدم مفصلة وإحصاءات.',
      },
    }),
    new FaqsModel({
      id: 5,
      question: {
        en: 'How Does The Platform Identify My Strengths And Weaknesses?',
        ar: 'كيف تحدد المنصة نقاط قوتي وضعفي؟',
      },
      answer: {
        en: 'The system analyzes your answers and generates a personalized performance report.',
        ar: 'يحلل النظام إجاباتك ويولد تقرير أداء شخصي.',
      },
    }),
    new FaqsModel({
      id: 6,
      question: { en: 'Can I Retake A Test', ar: 'هل يمكنني إعادة اختبار؟' },
      answer: {
        en: 'Yes, you can retake any test as many times as you want.',
        ar: 'نعم، يمكنك إعادة أي اختبار عدة مرات.',
      },

    }),
  ];

  // static get example(): FaqsModel {
  //   return FaqsModel.examples[0];
  // }
}
