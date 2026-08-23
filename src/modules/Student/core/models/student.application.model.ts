export default class StudentApplicationModel {
  public readonly registrationMethod: string;
  public readonly deviceUsed: string;
  public readonly operationSystem: string;
  public readonly appVersion: string;
  public readonly currentStatus: string;
  public readonly lastSeen: string;

  constructor(
    registrationMethod: string,
    deviceUsed: string,
    operationSystem: string,
    appVersion: string,
    currentStatus: string,
    lastSeen: string,
  ) {
    this.registrationMethod = registrationMethod;
    this.deviceUsed = deviceUsed;
    this.operationSystem = operationSystem;
    this.appVersion = appVersion;
    this.currentStatus = currentStatus;
    this.lastSeen = lastSeen;

    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new StudentApplicationModel(
      String(json.registration_method ?? ''),
      String(json.device_used ?? ''),
      String(json.operation_system ?? ''),
      String(json.app_version ?? ''),
      String(json.current_status ?? ''),
      String(json.last_seen ?? ''),
    );
  }

  static readonly example = StudentApplicationModel.fromJson({
    registration_method: 'web',
    device_used: 'web',
    operation_system: 'web',
    app_version: 'web',
    current_status: 'web',
    last_seen: 'web',
  });
}
