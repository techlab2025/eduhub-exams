export default class FetchMyZonesController {
  state = { value: { data: [] } };
  static getInstance() {
    return new FetchMyZonesController();
  }
  async FetchMyZones(_params?: unknown) {
    return {};
  }
}
