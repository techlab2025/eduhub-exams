# Question Batch Documentation

## Enums

```ts
export enum NumberOfQuestionTypeEnum {
  ANY_NUMBER = '1',
  SPECIFIC_NUMBER = '2',
}

export enum QuestionBatchDifficultyEnum {
  ANY_DIFFICULTY = '1',
  EASY = '2',
  MEDIUM = '3',
  HARD = '4',
}
export enum QuestionTypeEnum {
  ANY_TYPE = '1',
  MCQ = '2',
  TRUE_FALSE = '3',
  RANKING = '4',
  COMPLETION = '5',
  MATCHING = '6',
}
```

# Fetch

`POST - /fetch_question_batches`

## Request

```ts
{
  "word"?: string,
  "with_pagination"?: number,
  "page"?: number,
  "per_page"?: number,
}
```

## Response

```ts
{
  "id": number,
  "title":,
  "education_type":[
    {
      "id": number,
      "title":string,
      "children":[
        {
          "id": number,
          "title":string,
        }
      ] 
    }
  ],
  "e_c_subject":{
    "id": number,
    "title":string,
  }
  ,
  "curriculum":{
    "id": number,
    "title":string,
  },
  "number_of_questions": number,
  "sources ":string[],
  "status":QuestionBatchStatusEnum,
  "created_at":{
    "id": number,
    "name":string,
  },
  "generation_date":string,
}
```

---

# Store

`POST - /store_question_batch`

## Request

```ts
{
  "education_classification_id":number,
  "e_c_subject_id":number,
  "document_id":number,
  "status":QuestionBatchStatusEnum,
  "number_of_questions_type": NumberOfQuestionTypeEnum,
  "number_of_questions": number,
  "question_type": QuestionTypeEnum,
  "question_difficulty": QuestionBatchDifficultyEnum,

}
```

## Response

```ts
{
  
}
```


---

# Show

`POST - /show_question_batch`

## Request

```ts
{
  "batch_id": number,
}
```

## Response

```ts
{
  "title": [
    {
      "locale": "en",
      "title": "batch title"
    },
    {
      "locale": "ar",
      "title": "عنوان الباتش"
    }
  ],
    "description": [
    {
      "locale": "en",
      "description": "plan description"
    },
    {
      "locale": "ar",
      "description": "وصف الخطة"
    }
  ]


}
```

# Edit

`POST - /edit_advice`

## Request

```ts
{
  "advice_id": number,
  "translations": {
    "title": {
      "en": "plan title",
      "ar": "خطة"
    },
    "description": {
      "en": "plan description",
      "ar": "وصف الخطة"
    }
  }
}
```

# delete

`POST - /delete_advice`

## Request

```ts
{
  "advice_id": number,
}
```
