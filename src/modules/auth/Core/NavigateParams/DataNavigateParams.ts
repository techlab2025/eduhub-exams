import { NavigateParams } from "~/base/core/NavigateParams/navigate_params";

class DataNavigateParams extends NavigateParams<string> {
  private static instance: DataNavigateParams;
  private _data: string | null = null;
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DataNavigateParams();
    }
    return this.instance;
  }

  get data(): string | null {
    let returnedData = this._data;
    if (!(returnedData != null)) {
      returnedData = this.getFromLocalStorage("data");
    }
    return returnedData;
  }

  public setData(data: string | null) {
    this.clear();
    this._data = data;
    const returnedData = this.saveToLocalStorage("data", this._data ?? "");
    // TODO :: Mapping
    return returnedData;
  }

  public clear() {
    this._data = null;
  }
}

export { DataNavigateParams };
