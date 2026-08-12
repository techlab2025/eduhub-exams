export default class SubscriptionUserModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly serial: string,
  ) {
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
