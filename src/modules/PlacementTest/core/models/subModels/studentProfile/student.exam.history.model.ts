export default class StudentExamHistoryModel {
  public readonly id?: number;
  public readonly title?: string;
  public readonly language?: string;
  public readonly scope?: string;
  public readonly subject?: string;
  public readonly date?: string;
  public readonly duration?: string;
  public readonly score?: number;
  public readonly status?: string;

  constructor(data: {
    id?: number;
    title?: string;
    language?: string;
    scope?: string;
    subject?: string;
    date?: string;
    duration?: string;
    score?: number;
    status?: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.language = data.language;
    this.scope = data.scope;
    this.subject = data.subject;
    this.date = data.date;
    this.duration = data.duration;
    this.score = data.score;
    this.status = data.status;
    Object.freeze(this);
  }

  static fromJson(json: any): StudentExamHistoryModel {
    return new StudentExamHistoryModel({
      id: json.id,
      title: json.title,
      language: json.language,
      scope: json.scope,
      subject: json.subject,
      date: json.date,
      duration: json.duration,
      score: json.score,
      status: json.status,
    });
  }

  static examples = [
    new StudentExamHistoryModel({
      id: 1,
      title: 'Placement Exam',
      language: 'Arabic',
      scope: 'All Subject',
      subject: 'Math',
      date: 'Oct 24, 2023',
      duration: '45m',
      score: 95,
      status: 'excellent',
    }),
    new StudentExamHistoryModel({
      id: 2,
      title: 'Placement Exam',
      language: 'Math',
      scope: 'Part Of Subject',
      subject: 'Math',
      date: 'Oct 24, 2023',
      duration: '45m',
      score: 20,
      status: 'failed',
    }),
    new StudentExamHistoryModel({
      id: 3,
      title: 'Placement Exam',
      language: 'Science',
      scope: 'All Subject',
      subject: 'Math',
      date: 'Oct 24, 2023',
      duration: '45m',
      score: 50,
      status: 'good',
    }),
  ];
}
