
export default class TimeAnalysisModel {
  public readonly startTime?: string;
  public readonly endTime?: string;
  public readonly actualDuration?: string;
  public readonly timePassed?: string;
  public readonly examTime?: string;

  constructor(data: {
    startTime?: string;
    endTime?: string;
    actualDuration?: string;
    timePassed?: string;
    examTime?: string;
  }) {
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.actualDuration = data.actualDuration;
    this.timePassed = data.timePassed;
    this.examTime = data.examTime;
  }

  static fromJson(json: any): TimeAnalysisModel {
    if (!json) {
      throw new Error('Cannot create TimeAnalysisModel from null or undefined');
    }
    return new TimeAnalysisModel({
      startTime: json.start_time,
      endTime: json.end_time,
      actualDuration: json.actual_duration,
      timePassed: json.time_passed,
      examTime: json.exam_time,
    });
  }

  static example: TimeAnalysisModel = new TimeAnalysisModel({
    startTime: '2023-01-01T10:00:00Z',
    endTime: '2023-01-01T11:00:00Z',
    actualDuration: '01:00:00',
    timePassed: '00:30:00',
    examTime: '01:00:00',
  });
}
