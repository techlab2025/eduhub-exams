export default class PlacementResultModel {
  public readonly id?: number;
  public readonly totalQuestions?: number;
  public readonly totalTime?: number;
  public readonly studentName?: string;
  public readonly studentImg?: string;
  public readonly studentResult?: number;
  public readonly totalResult?: number;
  public readonly numberOfExams?: number;
  public readonly subject?: string;
  public readonly date?: string;
  public readonly status?: string;
  public readonly plane?: string;

  constructor(data: {
    id?: number;
    totalQuestions?: number;
    totalTime?: number;
    studentName?: string;
    studentImg?: string;
    studentResult?: number;
    totalResult?: number;
    numberOfExams?: number;
    subject?: string;
    date?: string;
    status?: string;
    plane?: string;
  }) {
    this.id = data.id;
    this.totalQuestions = data.totalQuestions;
    this.totalTime = data.totalTime;
    this.studentName = data.studentName;
    this.studentImg = data.studentImg;
    this.studentResult = data.studentResult;
    this.totalResult = data.totalResult;
    this.numberOfExams = data.numberOfExams;
    this.subject = data.subject;
    this.date = data.date;
    this.status = data.status;
    this.plane = data.plane;

    Object.freeze(this);
  }

  static fromJson(json: any): PlacementResultModel {
    if (!json) {
      throw new Error('Cannot create PlacementResultModel from null or undefined');
    }

    return new PlacementResultModel({
      id: json.id,
      totalQuestions: json.total_questions,
      totalTime: json.total_time,
      studentName: json.student_name,
      studentImg: json.image,
      studentResult: json.student_result,
      totalResult: json.total_result,
      numberOfExams: json.number_of_exams,
      subject: json.subject,
      date: json.date,
      status: json.status,
      plane: json.plane,
    });
  }

  static example: PlacementResultModel = new PlacementResultModel({
    id: 5,
    totalQuestions: 20,
    totalTime: 40,
    studentName: 'John Doe',
    studentImg: 'https://cyber.comolho.com/static/img/avatar.png',
    studentResult: 50,
    totalResult: 100,
    subject: 'Math',
    date: '2022-01-01',
    status: 'completed',
    plane: 'yes',
  });
  static example2: PlacementResultModel = new PlacementResultModel({
    id: 6,
    totalQuestions: 20,
    totalTime: 40,
    studentName: 'Mohamed Abdelmoneam',
    studentImg: 'https://cyber.comolho.com/static/img/avatar.png',
    studentResult: 95,
    totalResult: 100,
    subject: 'english',
    numberOfExams: 8,
    date: '2022-01-01',
    status: 'not reviewed',
    plane: 'no',
  });
  static example3: PlacementResultModel = new PlacementResultModel({
    id: 15,
    totalQuestions: 20,
    totalTime: 40,
    studentName: 'Ahmed abdo',
    studentImg: 'https://cyber.comolho.com/static/img/avatar.png',
    studentResult: 30,
    totalResult: 100,
    subject: 'english',
    numberOfExams: 8,
    date: '2022-01-01',
    status: 'not reviewed',
    plane: 'no',
  });
}
