import { expect, it } from 'vitest';
import Service from '../plan.api-service';
it('uses a singleton API service', () => expect(Service.getInstance()).toBe(Service.getInstance()));
