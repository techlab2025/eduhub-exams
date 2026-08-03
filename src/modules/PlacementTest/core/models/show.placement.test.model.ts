import EducationClassificationBranchModel from '@/shared/GeneralModels/education.classification.branch.model';
import EducationClassificationSubjectModel from '@/shared/GeneralModels/education.classification.subject.model';
import StudentModel from '@/shared/GeneralModels/student.model';
import ResultAnalysisModel from './subModels/result.analysis.mode';
import TimeAnalysisModel from './subModels/time.analysis.model';
import QuestionAnswerAnalysisModel from './subModels/question.answer.analysis.model';
import PlacemntDifficultyLevelModel from './subModels/placment.difificulty.level.model';
import PlacementSkillAnalysisModel from './subModels/placment.skill.analysis.model';
import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';

export default class ShowPlcaementTestModel {
  public readonly id?: number;
  public readonly student?: StudentModel;
  public readonly result?: number;
  public readonly EducationClassificationSubject?: EducationClassificationSubjectModel;
  public readonly EducationClassificationBranch?: EducationClassificationBranchModel;
  public readonly date?: string;
  public readonly resultAnalysis?: ResultAnalysisModel;
  public readonly timeAnalysis?: TimeAnalysisModel;
  public readonly questionAnswerAnalysis?: QuestionAnswerAnalysisModel[];
  public readonly questionsAnsweredDifficultyLevel?: PlacemntDifficultyLevelModel[];
  public readonly SkillsAnalysis?: PlacementSkillAnalysisModel[];
  public readonly MostImportantSkillsAnalysis?: PlacementSkillAnalysisModel[];
  public readonly NeedDevelopSkillsAnalysis?: PlacementSkillAnalysisModel[];
  public readonly quesions?: ShowQuestionsModel[];
  public readonly createdAt?: string;

  constructor(data: {
    id?: number;
    student?: StudentModel;
    result?: number;
    EducationClassificationSubject?: EducationClassificationSubjectModel;
    EducationClassificationBranch?: EducationClassificationBranchModel;
    date?: string;
    resultAnalysis?: ResultAnalysisModel;
    timeAnalysis?: TimeAnalysisModel;
    questionAnswerAnalysis?: QuestionAnswerAnalysisModel[];
    questionsAnsweredDifficultyLevel?: PlacemntDifficultyLevelModel[];
    SkillsAnalysis?: PlacementSkillAnalysisModel[];
    MostImportantSkillsAnalysis?: PlacementSkillAnalysisModel[];
    NeedDevelopSkillsAnalysis?: PlacementSkillAnalysisModel[];
    quesions?: ShowQuestionsModel[];
    createdAt?: string;
  }) {
    this.id = data.id;
    this.student = data.student;
    this.result = data.result;
    this.EducationClassificationSubject = data.EducationClassificationSubject;
    this.EducationClassificationBranch = data.EducationClassificationBranch;
    this.date = data.date;
    this.resultAnalysis = data.resultAnalysis;
    this.timeAnalysis = data.timeAnalysis;
    this.questionAnswerAnalysis = data.questionAnswerAnalysis;
    this.questionsAnsweredDifficultyLevel = data.questionsAnsweredDifficultyLevel;
    this.SkillsAnalysis = data.SkillsAnalysis;
    this.MostImportantSkillsAnalysis = data.MostImportantSkillsAnalysis;
    this.NeedDevelopSkillsAnalysis = data.NeedDevelopSkillsAnalysis;
    this.quesions = data.quesions;
    this.createdAt = data.createdAt;
    Object.freeze(this);
  }

  static fromJson(json: any): ShowPlcaementTestModel {
    if (!json) {
      throw new Error('Cannot create PlcaementTestModel from null or undefined');
    }

    return new ShowPlcaementTestModel({
      id: json.id,
      student: json.student ? StudentModel.fromJson(json.student) : undefined,
      result: json.result,
      EducationClassificationSubject: json.e_c_subject
        ? EducationClassificationSubjectModel.fromJson(json.e_c_subject)
        : undefined,
      EducationClassificationBranch: json.e_c_branch
        ? EducationClassificationBranchModel.fromJson(json.e_c_branch)
        : undefined,
      date: json.date,
      SkillsAnalysis: json.skills_analysis
        ? json.skills_analysis.map((item: any) => PlacementSkillAnalysisModel.fromJson(item))
        : undefined,
      MostImportantSkillsAnalysis: json.most_important_skills_analysis
        ? json.most_important_skills_analysis.map((item: any) =>
            PlacementSkillAnalysisModel.fromJson(item),
          )
        : undefined,
      NeedDevelopSkillsAnalysis: json.need_develop_skills_analysis
        ? json.need_develop_skills_analysis.map((item: any) =>
            PlacementSkillAnalysisModel.fromJson(item),
          )
        : undefined,
      resultAnalysis: ResultAnalysisModel.fromJson(json.result_analysis),
      timeAnalysis: TimeAnalysisModel.fromJson(json.time_analysis),
      questionAnswerAnalysis: json.question_answer_analysis
        ? json.question_answer_analysis.map((item: any) =>
            QuestionAnswerAnalysisModel.fromJson(item),
          )
        : undefined,
      questionsAnsweredDifficultyLevel: json.questions_answered_difficulty_level
        ? json.questions_answered_difficulty_level.map((item: any) =>
            PlacemntDifficultyLevelModel.fromJson(item),
          )
        : undefined,
      quesions: json.quesions
        ? json.quesions.map((item: any) => ShowQuestionsModel.fromJson(item))
        : undefined,
      createdAt: json.created_at,
    });
  }

  static example: ShowPlcaementTestModel = new ShowPlcaementTestModel({
    id: 1,
    student: StudentModel.example,
    EducationClassificationSubject: EducationClassificationSubjectModel.example,
    EducationClassificationBranch: EducationClassificationBranchModel.example,
    resultAnalysis: ResultAnalysisModel.example,
    timeAnalysis: TimeAnalysisModel.example,
    questionAnswerAnalysis: [QuestionAnswerAnalysisModel.example],
    questionsAnsweredDifficultyLevel: [PlacemntDifficultyLevelModel.example],
    SkillsAnalysis: [PlacementSkillAnalysisModel.example],
    MostImportantSkillsAnalysis: [PlacementSkillAnalysisModel.example],
    NeedDevelopSkillsAnalysis: [PlacementSkillAnalysisModel.example],
    quesions: [ShowQuestionsModel.example],
    createdAt: '2026-08-03T10:29:01',
  });
}
