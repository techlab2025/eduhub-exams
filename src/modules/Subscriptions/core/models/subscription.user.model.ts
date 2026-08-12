export default class SubscriptionUserModel {
  public readonly id: number;
  public readonly name: string;
  public readonly serial: string;

  constructor(id: number, name: string, serial: string) {
    this.id = id;
    this.name = name;
    this.serial = serial;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new SubscriptionUserModel(
      Number(json.id ?? 0),
      String(json.name ?? ''),
      String(json.serial ?? ''),
    );
  }
}
