import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { ref } from 'vue';
import SubjectIndex from '../SubjectIndex.vue';
import SubjectController from '../../controllers/subject.controller';

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({
    params: { country_code: 'eg' },
    query: {},
  }),
}));

vi.mock('../../controllers/subject.controller', () => ({
  default: { getInstance: vi.fn() },
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('@/base/Presentation/Utils/debouced', () => ({
  debounce: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

vi.mock('@/stores/formsStore', () => ({
  useFormsStore: () => ({ formData: {} }),
}));

const educationTree = [
  {
    id: 103,
    title: 'New EducationClassification',
    branches: [
      {
        id: 235,
        e_c_branch_id: 235,
        title: 'branch 1',
        children: [
          {
            id: 236,
            e_c_branch_id: 236,
            title: 'branch2',
            children: [
              {
                id: 237,
                e_c_branch_id: 237,
                title: 'branch 3',
                children: [],
                subjects: [
                  {
                    id: 219,
                    e_c_subject_id: 219,
                    title: 'subject 1',
                    children: [
                      {
                        id: 220,
                        e_c_subject_id: 220,
                        title: 'subject2',
                        children: [
                          {
                            id: 221,
                            e_c_subject_id: 221,
                            title: 'subject 3',
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
            subjects: [],
          },
        ],
        subjects: [],
      },
      {
        id: 300,
        e_c_branch_id: 300,
        title: 'branch leaf',
        children: [],
        subjects: [],
      },
    ],
  },
];

describe('SubjectIndex.vue', () => {
  let mockFetchList: ReturnType<typeof vi.fn>;
  let mockIndexSubjects: ReturnType<typeof vi.fn>;
  let mockDeleteSubject: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    mockFetchList = vi.fn().mockResolvedValue({ data: educationTree });
    mockIndexSubjects = vi.fn().mockResolvedValue({ data: educationTree });
    mockDeleteSubject = vi.fn().mockResolvedValue({});
    vi.mocked(SubjectController.getInstance).mockReturnValue({
      fetchList: mockFetchList,
      indexSubjects: mockIndexSubjects,
      delete: mockDeleteSubject,
      pagination: ref(null),
      listState: ref({ status: 'success', data: educationTree }),
    } as unknown as ReturnType<typeof SubjectController.getInstance>);
  });

  const mountOptions = {
    global: {
      mocks: { $t: (msg: string) => msg },
      stubs: {
        DataStatusBuilder: { template: '<div><slot name="success" /><slot name="empty" /></div>' },
        AppTable: {
          template:
            '<div class="app-table-stub"><slot v-for="item in items" name="actions" :item="item" /></div>',
          props: ['headers', 'items'],
        },
        UpdatedCustomInputSelect: {
          template: `<button
            class="education-filter"
            :data-label="label"
            :data-placeholder="placeholder"
            :data-selected="modelValue?.title ?? ''"
            @click="$emit('update:modelValue', staticOptions[0] ?? null)"
          />`,
          props: ['modelValue', 'label', 'staticOptions', 'placeholder', 'reload'],
          emits: ['update:modelValue'],
        },
        DropList: {
          template: `
            <div>
              <button class="delete-action" @click="actionList[0].action()" />
              <button
                v-for="action in actionList.slice(1)"
                :key="action.text"
                :data-action="action.text"
                @click="action.action()"
              />
            </div>
          `,
          props: ['actionList', 'deleteDialogTitle', 'deleteDialogMessage'],
        },
        SkillsDialog: {
          name: 'SkillsDialog',
          props: ['visible', 'level', 'branchName', 'branchId'],
          emits: ['update:visible'],
          template: '<div v-if="visible" class="skills-dialog-stub" />',
        },
        RenameSubjectDialog: true,
        DeleteDialog: true,
        'router-link': { template: '<a><slot /></a>', props: ['to'] },
      },
    },
  };

  it('renders the index wrapper', () => {
    const wrapper = mount(SubjectIndex, mountOptions);
    expect(wrapper.find('.subject-page').exists()).toBe(true);
  });

  it('renders the classification filter from the fetched tree', async () => {
    const wrapper = mount(SubjectIndex, mountOptions);
    await flushPromises();

    const filter = wrapper.find('.education-filter');
    expect(wrapper.findAll('.education-filter')).toHaveLength(1);
    expect(filter.exists()).toBe(true);
    expect(filter.attributes('data-placeholder')).toBe('select subject ');
  });

  it('updates the selected classification value', async () => {
    const wrapper = mount(SubjectIndex, mountOptions);
    await flushPromises();

    await wrapper.find('.education-filter').trigger('click');

    expect(wrapper.find('.education-filter').attributes('data-selected')).toBe(
      'New EducationClassification',
    );
  });

  it('deletes the selected subject with the subject endpoint', async () => {
    const wrapper = mount(SubjectIndex, mountOptions);
    await flushPromises();

    const deleteButtons = wrapper.findAll('.delete-action');
    await deleteButtons[0]?.trigger('click');
    await flushPromises();

    expect(mockDeleteSubject).toHaveBeenCalledTimes(1);
    expect(mockDeleteSubject.mock.calls[0][0].toMap()).toMatchObject({
      education_classification_subject_id: 103,
    });
  });

  it('loads table data and filter data using their pagination contracts', async () => {
    mount(SubjectIndex, mountOptions);
    await flushPromises();

    expect(mockFetchList).toHaveBeenCalledTimes(1);
    expect(mockFetchList.mock.calls[0][0].toMap()).toMatchObject({ with_pagination: 0 });
    expect(mockIndexSubjects).toHaveBeenCalledTimes(1);
    expect(mockIndexSubjects.mock.calls[0][0].toMap()).toMatchObject({ with_pagination: 1 });
  });

  it('shows add button link', () => {
    const wrapper = mount(SubjectIndex, mountOptions);
    const links = wrapper.findAll('a');
    expect(links.length).toBeGreaterThan(0);
  });

  it('opens one skills dialog for only the selected subject', async () => {
    const wrapper = mount(SubjectIndex, mountOptions);
    await flushPromises();

    await wrapper.find('[data-action="skills"]').trigger('click');

    const dialogs = wrapper.findAllComponents({ name: 'SkillsDialog' });
    expect(dialogs).toHaveLength(1);
    expect(dialogs[0]?.props()).toMatchObject({
      visible: true,
      branchId: 103,
      branchName: 'New EducationClassification',
    });

    await dialogs[0]?.vm.$emit('update:visible', false);

    expect(wrapper.findComponent({ name: 'SkillsDialog' }).exists()).toBe(false);
  });
});
