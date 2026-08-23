import { StudentStatusEnum, type StudentTitleModel } from './student.model';

export default class StudentPlanModel implements StudentTitleModel {
  public readonly id!: number;
  public readonly title!: string;
  public readonly price!: number;
  public readonly planStatus!: StudentStatusEnum;
  public readonly totalPaid!: number;
  public readonly paymentMethod!: string;
  public readonly subscribeDate!: string;
  public readonly expireDate!: string;

  constructor(data: {
    id: number;
    title: string;
    price: number;
    planStatus: StudentStatusEnum;
    totalPaid: number;
    paymentMethod: string;
    subscribeDate: string;
    expireDate: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.price = data.price;
    this.planStatus = data.planStatus;
    this.totalPaid = data.totalPaid;
    this.paymentMethod = data.paymentMethod;
    this.subscribeDate = data.subscribeDate;
    this.expireDate = data.expireDate;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): StudentPlanModel {
    return new StudentPlanModel({
      id: Number(json.id ?? 0),
      title: String(json.title ?? ''),
      price: Number(json.price ?? 0),
      planStatus: String(json.plan_status ?? '') as StudentStatusEnum,
      totalPaid: Number(json.total_paid ?? 0),
      paymentMethod: String(json.payment_method ?? ''),
      subscribeDate: String(json.subscribe_date ?? ''),
      expireDate: String(json.expire_date ?? ''),
    });
  }

  static readonly example = StudentPlanModel.fromJson({
    id: 1,
    title: 'Premium',
    price: 1000,
    planStatus: StudentStatusEnum.ACTIVE,
    totalPaid: 10,
    paymentMethod: 'USD',
    subscribeDate: '09 May 2022',
    expireDate: '09 May 2023',
  });
}
