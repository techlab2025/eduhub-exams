# Education Classification Configuration

## Add Education Classification Configuration

```json
{
  "education_classification_id": number,
  "number_of_branches": number,
  "education_classification_configuration_branches": [
    {
      "level_number": number,
      "education_classification_singular_title": {
        ar: string,
        en: string
      },
      "education_classification_plural_title": {
        ar: string,
        en: string
      },
    }
  ],
}
```

## Add Education Classification Subjects

```json
{
  "education_classification_configuration_id": number,
  "education_classification_subject_title": {
    "education_classification_singular_title": {
      ar: string,
      en: string
    },
    "education_classification_plural_title": {
      ar: string,
      en: string
    },
  },
  "number_of_subjects_branches": number,
  "education_classification_subjects_branches": [
    {
      "education_classification_subject_singular_title": {
        ar: string,
        en: string
      },
      "education_classification_subject_plural_title": {
        ar: string,
        en: string
      },
    }
  ],
}
```
