import { describe, expect, it } from 'vitest';
import Repository from '../student.repository';

describe('StudentRepository', () => {
  it('uses a singleton repository', () =>
    expect(Repository.getInstance()).toBe(Repository.getInstance()));

  it('parses both documented list and details responses', () => {
    const repository = Repository.getInstance() as unknown as {
      parseItem(data: unknown): { name: string; registration: Record<string, unknown> };
      parseList(data: unknown): Array<{ examsCount: number; currentPlan: { title: string } }>;
    };
    const list = repository.parseList([
      {
        id: 1,
        name: 'Ahmed',
        current_plan: { id: 2, title: 'Basic' },
        num_of_exams: 20,
      },
    ]);
    const details = repository.parseItem({
      id: 1,
      name: 'Ahmed',
      registration: { email: 'student@example.com' },
    });

    expect(list[0]).toMatchObject({ examsCount: 20, currentPlan: { title: 'Basic' } });
    expect(details.name).toBe('Ahmed');
    expect(details.registration).toMatchObject({ email: 'student@example.com' });
  });
});
