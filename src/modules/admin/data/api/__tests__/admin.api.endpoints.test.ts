import { describe, it, expect } from 'vitest';
import { AdminEndpoints } from '../admin.api.endpoints';
import { baseUrl } from '@/base/Core/NetworkStructure/baseUrl';

describe('AdminEndpoints', () => {
  const endpoints = new AdminEndpoints();

  it('should generate correct index endpoint', () => {
    expect(endpoints.index).toBe(`${baseUrl}general/fetch_admins`);
  });

  it('should generate correct show endpoint', () => {
    expect(endpoints.show).toBe(`${baseUrl}general/show_admin`);
  });

  it('should generate correct store endpoint', () => {
    expect(endpoints.store).toBe(`${baseUrl}general/store_admin`);
  });

  it('should generate correct update endpoint', () => {
    expect(endpoints.update).toBe(`${baseUrl}general/update_admin`);
  });

  it('should generate correct delete endpoint', () => {
    expect(endpoints.delete).toBe(`${baseUrl}general/delete_admin`);
  });
});
