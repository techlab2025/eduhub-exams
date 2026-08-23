export interface JsonModel<T> {
  fromJson(json: Record<string, unknown>): T;
}

export interface SafeTitleValue {
  id: number;
  title: string;
}

export class SaftyConditions {
  //  Check On Object That Return From Backend (if no model)
  static objectValue(value: unknown): Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  }

  //  Check On Object That Return From Backend (if there is model already)
  //   this return default values if no data
  static modelValue<T>(value: unknown, model: JsonModel<T>): T {
    return model.fromJson(this.objectValue(value));
  }

  //  Check On Object That May Null And Return From Backend
  //   this return nul if no data
  static nullableModelValue<T>(value: unknown, model: JsonModel<T>): T | null {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return null;

    return model.fromJson(value as Record<string, unknown>);
  }

  //  Check On List That Maybe Null And Return From Backend
  //   if back return title ot etxt or null return []
  static modelListCheck<T>(value: unknown, model: JsonModel<T>): T[] {
    return Array.isArray(value) ? value.map((item) => this.modelValue(item, model)) : [];
  }

  //  Check On Title Value That Return From Backend
  static titleValueCheck(value: unknown): SafeTitleValue | null {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return null;

    const json = this.objectValue(value);
    return { id: Number(json.id ?? 0), title: String(json.title ?? '') };
  }
}
