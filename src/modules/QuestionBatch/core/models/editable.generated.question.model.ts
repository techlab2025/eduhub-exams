import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import AnswerModel from '@/modules/Questions/core/models/subModels/answer.model';
import ExplanationModel from '@/modules/Questions/core/models/subModels/explanation.model';
import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
import { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';

export interface EditableGeneratedAnswer {
  id?: number;
  answer: string;
  image: AnswerModel['image'];
  isCorrect: boolean;
  match?: string;
  rank?: number;
  similar?: string;
  evaluationType?: AnswerModel['EvaluationType'];
}

export default class EditableGeneratedQuestionModel {
  public questionType: QuestionTypeEnum;
  public difficulty: QuestionDifficultyEnum;
  public title: string;
  public answers: EditableGeneratedAnswer[];
  public explanation: string;

  constructor(data: {
    questionType: QuestionTypeEnum;
    difficulty: QuestionDifficultyEnum;
    title: string;
    answers: EditableGeneratedAnswer[];
    explanation: string;
  }) {
    this.questionType = data.questionType;
    this.difficulty = data.difficulty;
    this.title = data.title;
    this.answers = data.answers;
    this.explanation = data.explanation;
  }

  static fromQuestion(question: ShowQuestionsModel): EditableGeneratedQuestionModel {
    return new EditableGeneratedQuestionModel({
      questionType: question.questionType ?? QuestionTypeEnum.mcq,
      difficulty: question.difficulty ?? QuestionDifficultyEnum.easy,
      title: question.questionTitle ?? question.question ?? '',
      answers: (question.answers ?? []).map((answer) => ({
        id: answer.id,
        answer: answer.answer ?? '',
        image: answer.image,
        isCorrect: Boolean(answer.is_right_answer),
        match: answer.match,
        rank: answer.rank,
        similar: answer.similar,
        evaluationType: answer.EvaluationType,
      })),
      explanation: question.explanation?.explanation ?? question.question_description ?? '',
    });
  }

  toQuestion(original: ShowQuestionsModel): ShowQuestionsModel {
    return new ShowQuestionsModel({
      ...original,
      questionType: this.questionType,
      difficulty: this.difficulty,
      questionTitle: this.title,
      question: this.title,
      question_description: this.explanation,
      answers: this.answers.map(
        (answer) =>
          new AnswerModel({
            id: answer.id,
            answer: answer.answer,
            image: answer.image,
            is_right_answer: answer.isCorrect,
            match: answer.match,
            rank: answer.rank,
            similar: answer.similar,
            EvaluationType: answer.evaluationType,
          }),
      ),
      explanation: new ExplanationModel({
        id: original.explanation?.id,
        explanation: this.explanation,
        source_text: original.explanation?.source_text,
        document_id: original.explanation?.document_id,
        attachments: original.explanation?.attachments,
      }),
    });
  }
}
