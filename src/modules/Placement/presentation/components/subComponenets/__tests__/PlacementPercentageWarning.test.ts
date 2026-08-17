import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import PlacementPercentageWarning from '../PlacementPercentageWarning.vue';

const messages = {
  en: {
    'The percentage exceeds the 100% limit. Please adjust the values to ensure the total does not exceed 100%.':
      'Percentage is over 100%',
    'The percentage is less than 100%. To ensure a balanced distribution of questions, please adjust the values so the total reaches 100%.':
      'Percentage is under 100%',
    'okay i understand': 'Okay',
  },
};

const mountWarning = (percentage: number) =>
  mount(PlacementPercentageWarning, {
    props: { percentage },
    global: {
      plugins: [createI18n({ legacy: false, locale: 'en', messages })],
      stubs: {
        Dialog: {
          template: '<section><slot /></section>',
        },
      },
    },
  });

describe('PlacementPercentageWarning', () => {
  it('describes a total above the allowed limit', () => {
    expect(mountWarning(101).text()).toContain('Percentage is over 100%');
  });

  it('emits close when the user acknowledges the warning', async () => {
    const wrapper = mountWarning(90);

    expect(wrapper.text()).toContain('Percentage is under 100%');
    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});
