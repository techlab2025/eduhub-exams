import EducationClassificationBranchModel from '@/shared/GeneralModels/education.classification.branch.model';
import EducationClassificationSubjectModel from '@/shared/GeneralModels/education.classification.subject.model';
import StudentModel from '@/shared/GeneralModels/student.model';
import ResultAnalysisModel from './subModels/result.analysis.mode';
import TimeAnalysisModel from './subModels/time.analysis.model';
import QuestionAnswerAnalysisModel from './subModels/question.answer.analysis.model';
import PlacemntDifficultyLevelModel from './subModels/placment.difificulty.level.model';
import PlacementSkillAnalysisModel from './subModels/placment.skill.analysis.model';
import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import PlacemntAllocationModel, {
  PlacemntAllocationQuestionModel,
} from './subModels/placementallocation.model';
import TitleInterface from '@/base/Data/Models/titleInterface';
import { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';
import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
import AnswerModel from '@/modules/Questions/core/models/subModels/answer.model';

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
  public readonly allocation?: PlacemntAllocationModel;

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
    allocation?: PlacemntAllocationModel;
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
    this.allocation = data.allocation;
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
      resultAnalysis: json.result_analysis
        ? ResultAnalysisModel.fromJson(json.result_analysis)
        : undefined,
      timeAnalysis: json.time_analysis ? TimeAnalysisModel.fromJson(json.time_analysis) : undefined,
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
      quesions: json.questions
        ? json.questions.map((item: any) => ShowQuestionsModel.fromJson(item))
        : json.quesions
          ? json.quesions.map((item: any) => ShowQuestionsModel.fromJson(item))
          : undefined,
      createdAt: json.created_at ?? json.date,
      allocation: json.allocation
        ? PlacemntAllocationModel.fromJson(json.allocation)
        : ShowPlcaementTestModel.createAllocation(json),
    });
  }

  private static createAllocation(json: any): PlacemntAllocationModel | undefined {
    const questions = Array.isArray(json.questions) ? json.questions : [];
    if (!questions.length) return undefined;

    const answerAnalysis = Array.isArray(json.question_answer_analysis)
      ? json.question_answer_analysis
      : [];
    const totals = { easy: 0, medium: 0, hard: 0 };
    const correct = { easy: 0, medium: 0, hard: 0 };

    const allTime = questions.map((question: any, index: number) => {
      const questionId = question.question_id ?? question.id;
      const analysis = answerAnalysis.find(
        (item: any) => (item.question?.id ?? item.question?.question_id) === questionId,
      );
      const difficulty = question.difficulty_level;
      const difficultyKey =
        difficulty === QuestionDifficultyEnum.easy
          ? 'easy'
          : difficulty === QuestionDifficultyEnum.medium
            ? 'medium'
            : difficulty === QuestionDifficultyEnum.hard
              ? 'hard'
              : undefined;

      if (difficultyKey) {
        totals[difficultyKey] += 1;
        if (question.correct_status === 1) correct[difficultyKey] += 1;
      }

      return new PlacemntAllocationQuestionModel({
        time: analysis?.question_answer_duration ?? 0,
        difficultyLevel: difficulty,
        correctStatus: question.correct_status,
        questionNumber: index + 1,
      });
    });

    return new PlacemntAllocationModel({
      allTime,
      totalQuestions: questions.length,
      Easy: correct.easy,
      totalnumberEasy: totals.easy,
      Medium: correct.medium,
      totalnumberMedium: totals.medium,
      Hard: correct.hard,
      totalnumberHard: totals.hard,
    });
  }

  static example: ShowPlcaementTestModel = new ShowPlcaementTestModel({
    id: 1,
    student: StudentModel.example,
    EducationClassificationSubject: EducationClassificationSubjectModel.example,
    EducationClassificationBranch: EducationClassificationBranchModel.example,
    resultAnalysis: ResultAnalysisModel.example,
    timeAnalysis: TimeAnalysisModel.example,
    questionAnswerAnalysis: [
      new QuestionAnswerAnalysisModel({
        question: new TitleInterface({ id: 1, title: 'Anatomy question one' }),
        questionAnswerDuration: 80,
      }),
      new QuestionAnswerAnalysisModel({
        question: new TitleInterface({ id: 2, title: 'Anatomy question two' }),
        questionAnswerDuration: 65,
      }),
      new QuestionAnswerAnalysisModel({
        question: new TitleInterface({ id: 3, title: 'Anatomy question three' }),
        questionAnswerDuration: 95,
      }),
      new QuestionAnswerAnalysisModel({
        question: new TitleInterface({ id: 41, title: 'Article question one' }),
        questionAnswerDuration: 80,
      }),
      new QuestionAnswerAnalysisModel({
        question: new TitleInterface({ id: 42, title: 'Article question two' }),
        questionAnswerDuration: 72,
      }),
      new QuestionAnswerAnalysisModel({
        question: new TitleInterface({ id: 43, title: 'Article question three' }),
        questionAnswerDuration: 91,
      }),
    ],
    questionsAnsweredDifficultyLevel: [PlacemntDifficultyLevelModel.example],
    SkillsAnalysis: [
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 1, title: 'Understanding' }),
        precentage: 90,
      }),
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 2, title: 'Application' }),
        precentage: 10,
      }),
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 3, title: 'Proficient' }),
        precentage: 40,
      }),
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 4, title: 'Struggling' }),
        precentage: 20,
      }),
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 5, title: 'Assessment' }),
        precentage: 80,
      }),
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 6, title: 'Creativity' }),
        precentage: 30,
      }),
    ],
    MostImportantSkillsAnalysis: [
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 1, title: 'Understanding' }),
        precentage: 90,
      }),
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 5, title: 'Assessment' }),
        precentage: 80,
      }),
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 3, title: 'Proficient' }),
        precentage: 40,
      }),
    ],
    NeedDevelopSkillsAnalysis: [
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 2, title: 'Application' }),
        precentage: 10,
      }),
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 4, title: 'Struggling' }),
        precentage: 20,
      }),
      new PlacementSkillAnalysisModel({
        skill: new TitleInterface({ id: 6, title: 'Creativity' }),
        precentage: 30,
      }),
    ],
    quesions: [
      new ShowQuestionsModel({
        id: 1,
        questionTitle: 'Which structure forms the outer layer of a cell?',
        questionType: QuestionTypeEnum.mcq,
        difficulty: QuestionDifficultyEnum.hard,
        correctStatus: 1,
        note: 'High',
        answers: [
          new AnswerModel({ id: 1, answer: 'Heart', is_right_answer: true }),
          new AnswerModel({ id: 2, answer: 'Cell', is_right_answer: false }),
          new AnswerModel({ id: 3, answer: 'Stomach', is_right_answer: false }),
          new AnswerModel({ id: 4, answer: 'Bones', is_right_answer: false }),
        ],
        questionLogHistory: [
          { time: '5:15 PM', status: 'Select', createdBy: 'Third Answer (Stomach)' },
          { time: '5:15 PM', status: 'Select', createdBy: 'First Answer (Heart)' },
          { time: '5:15 PM', status: 'Select', createdBy: 'Second Answer (Cell)' },
          { time: '5:15 PM', status: 'Submit', createdBy: 'Second Answer (Cell)' },
        ],
        subjectTree: new TitleInterface({
          id: 1,
          title: 'The Human Body',
          full_title:
            'Unit1:The Human Body / Chapter1: Introduction To Anatomy / Lesson1: Cell Structure',
        }),
        topics: [
          new TitleInterface({ id: 11, title: 'Topic1: Epithelial Tissue', subtitle: 1 }),
          new TitleInterface({ id: 12, title: 'Topic2: Connective Tissue', subtitle: 3 }),
          new TitleInterface({ id: 13, title: 'Topic3: Muscle Tissue', subtitle: 2 }),
          new TitleInterface({ id: 14, title: 'Topic4: Nervous Tissue', subtitle: 3 }),
          new TitleInterface({ id: 15, title: 'Topic5: Cell Membrane', subtitle: 1 }),
        ],
      }),
      new ShowQuestionsModel({
        id: 2,
        questionTitle: 'What is the primary function of epithelial tissue?',
        questionType: QuestionTypeEnum.mcq,
        difficulty: QuestionDifficultyEnum.medium,
        correctStatus: 0,
        note: 'Medium',
        answers: [
          new AnswerModel({ id: 5, answer: 'Protection', is_right_answer: true }),
          new AnswerModel({ id: 6, answer: 'Movement', is_right_answer: false }),
        ],
        questionLogHistory: [
          { time: '5:17 PM', status: 'Submit', createdBy: 'Second Answer (Movement)' },
        ],
        subjectTree: new TitleInterface({
          id: 2,
          title: 'The Human Body',
          full_title:
            'Unit1:The Human Body / Chapter1: Introduction To Anatomy / Lesson1: Cell Structure',
        }),
        topics: [
          new TitleInterface({ id: 21, title: 'Topic1: Epithelial Tissue', subtitle: 3 }),
          new TitleInterface({ id: 22, title: 'Topic2: Tissue Functions', subtitle: 1 }),
        ],
      }),
      new ShowQuestionsModel({
        id: 3,
        questionTitle: 'Which tissue is responsible for body movement?',
        questionType: QuestionTypeEnum.true_false,
        difficulty: QuestionDifficultyEnum.easy,
        correctStatus: 1,
        note: 'Low',
        answers: [
          new AnswerModel({ id: 7, answer: 'True', is_right_answer: true }),
          new AnswerModel({ id: 8, answer: 'False', is_right_answer: false }),
        ],
        questionLogHistory: [
          { time: '5:19 PM', status: 'Submit', createdBy: 'First Answer (True)' },
        ],
        subjectTree: new TitleInterface({
          id: 3,
          title: 'The Human Body',
          full_title:
            'Unit1:The Human Body / Chapter1: Introduction To Anatomy / Lesson1: Cell Structure',
        }),
        topics: [
          new TitleInterface({ id: 31, title: 'Topic1: Muscle Tissue', subtitle: 2 }),
          new TitleInterface({ id: 32, title: 'Topic2: Skeletal Tissue', subtitle: 2 }),
          new TitleInterface({ id: 33, title: 'Topic3: Nervous Tissue', subtitle: 1 }),
          new TitleInterface({ id: 34, title: 'Topic4: Connective Tissue', subtitle: 3 }),
          new TitleInterface({ id: 35, title: 'Topic5: Cell Structure', subtitle: 1 }),
        ],
      }),
      new ShowQuestionsModel({
        id: 15245,
        questionTitle: 'Tourism Article',
        question_description:
          'Egypt is a country located in North Africa. It is famous for its ancient civilization and historical landmarks such as the pyramids and the Nile River. Cairo is the capital of Egypt and one of the largest cities in Africa.',
        number_of_questions: 3,
        questions: [
          new ShowQuestionsModel({
            id: 41,
            questionTitle: 'Which river is mentioned in the article?',
            questionType: QuestionTypeEnum.mcq,
            difficulty: QuestionDifficultyEnum.hard,
            correctStatus: 0,
            note: 'High',
            answers: [
              new AnswerModel({ id: 411, answer: 'The Nile River', is_right_answer: true }),
              new AnswerModel({ id: 412, answer: 'The Amazon River', is_right_answer: false }),
            ],
            questionLogHistory: [
              {
                time: '5:21 PM',
                status: 'Submit',
                createdBy: 'Second Answer (The Amazon River)',
              },
            ],
          }),
          new ShowQuestionsModel({
            id: 42,
            questionTitle: 'Where is Egypt located?',
            questionType: QuestionTypeEnum.mcq,
            difficulty: QuestionDifficultyEnum.hard,
            correctStatus: 1,
            note: 'High',
            answers: [
              new AnswerModel({ id: 421, answer: 'North Africa', is_right_answer: true }),
              new AnswerModel({ id: 422, answer: 'South America', is_right_answer: false }),
            ],
            questionLogHistory: [
              { time: '5:23 PM', status: 'Submit', createdBy: 'First Answer (North Africa)' },
            ],
          }),
          new ShowQuestionsModel({
            id: 43,
            questionTitle: 'What is the capital of Egypt?',
            questionType: QuestionTypeEnum.mcq,
            difficulty: QuestionDifficultyEnum.hard,
            correctStatus: 0,
            note: 'High',
            answers: [
              new AnswerModel({ id: 431, answer: 'Cairo', is_right_answer: true }),
              new AnswerModel({ id: 432, answer: 'Alexandria', is_right_answer: false }),
            ],
            questionLogHistory: [
              { time: '5:25 PM', status: 'Submit', createdBy: 'Second Answer (Alexandria)' },
            ],
          }),
        ],
      }),
    ],
    createdAt: '2026-08-03T10:29:01',
    allocation: PlacemntAllocationModel.example,
  });
}
