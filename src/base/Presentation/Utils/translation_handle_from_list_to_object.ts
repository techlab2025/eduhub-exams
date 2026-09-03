export const TranslationFromLidtToObject = async <
  T extends { locale: string; title?: string; description?: string; display_name?: string },
>(
  translations: T[],
  key: 'title' | 'description' | 'display_name' = 'title',
) => {
  const trans = translations
    ? translations.reduce(
        (acc, el) => {
          acc[el.locale] = el?.[key] ?? '';
          return acc;
        },
        {} as Record<string, string>,
      )
    : {};
  return trans;
};
