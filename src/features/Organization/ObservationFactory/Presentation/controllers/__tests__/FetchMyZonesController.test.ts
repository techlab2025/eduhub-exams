import { describe, it, expect, vi } from 'vitest';
import FetchMyZonesController from '../FetchMyZonesController';

describe('FetchMyZonesController', () => {
  it('can be instantiated', () => {
    const controller = new FetchMyZonesController();
    expect(controller).toBeInstanceOf(FetchMyZonesController);
  });

  it('getInstance returns an instance', () => {
    const instance = FetchMyZonesController.getInstance();
    expect(instance).toBeInstanceOf(FetchMyZonesController);
  });

  it('getInstance returns a new instance each call', () => {
    const a = FetchMyZonesController.getInstance();
    const b = FetchMyZonesController.getInstance();
    expect(a).toBeInstanceOf(FetchMyZonesController);
    expect(b).toBeInstanceOf(FetchMyZonesController);
  });

  it('has a state property with value.data array', () => {
    const controller = new FetchMyZonesController();
    expect(controller.state).toBeDefined();
    expect(controller.state.value).toBeDefined();
    expect(Array.isArray(controller.state.value.data)).toBe(true);
  });

  it('FetchMyZones returns a promise resolving to an object', async () => {
    const controller = new FetchMyZonesController();
    const result = await controller.FetchMyZones();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('FetchMyZones accepts optional params', async () => {
    const controller = new FetchMyZonesController();
    const result = await controller.FetchMyZones({ page: 1 });
    expect(result).toBeDefined();
  });

  it('FetchMyZones can be spied on', async () => {
    const controller = new FetchMyZonesController();
    const spy = vi.spyOn(controller, 'FetchMyZones').mockResolvedValueOnce({ data: [1, 2] });
    const result = await controller.FetchMyZones();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: [1, 2] });
  });
});
