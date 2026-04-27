# Education Classification Configuration

```json
{
  "education_classification_id": number,
  "number_of_branches": number,
  "branches": [
    {
      "level_number": number,
      "translation": {
        "singular_title": {
          "ar": string,
          "en": string
        },
        "plural_title": {
          "ar": string,
          "en": string
        }
      }
    }
  ]
}
```

## Add Education Classification Subjects

```json
{
  "education_classification_id": number,
  "translation": {
    "singular_title": {
      ar: string,
      en: string
    },
    "plural_title": {
      ar: string,
      en: string
    },
  },
  "number_of_subjects_branches": number,
  "branches": [
    {
      "singular_title": {
        ar: string,
        en: string
      },
      "plural_title": {
        ar: string,
        en: string
      },
    }
  ],
}
```
