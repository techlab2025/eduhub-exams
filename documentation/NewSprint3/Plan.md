# Plan Documentation

## Enums

```ts
export enum PlanStatusEnum {
  ACTIVE = '1',
  INACTIVE = '2',
  ARCHIVED = '3',
  DRAFT = '4',
}

export enum DurationTypeEnum {
  DAY = '1',
  WEEK = '2',
  MONTH = '3',
  YEAR = '4',
}

export enum LastUpdatedEnum {
  TODAY = '1',
  LAST_7_DAYS = '2',
  LAST_30_DAYS = '3',
  LAST_3_MONTHS = '4',
  CUSTOM = '5',
}

export enum PlanFeatureTypeEnum {
  REPORT = 1,
  PROGRESS_TRACKING = 2,
  HOME_STUDY_SCHEDULE = 3,
  WHAT_DID_YOU_STUDY = 4,
  LEARNING_RESOURCES = 5,
}

export enum PlanFeatureSubTypeEnum {
  SHOW_OVERALL_SCORE = 1,
  SHOW_SKILL_ANALYSIS = 2,
  SHOW_CURRICULUM_ANALYSIS = 3,
  ALLOW_REPORT_DOWNLOAD = 4,
  MAXIMUM_REPORTS_PER_STUDENT = 5,
  MAX_DOWNLOADS_PER_MONTH = 6,
  OVERALL_PROGRESS_OVERVIEW = 7,
  NEEDS_FOCUS_SECTION = 8,
  SUBJECTS_WITH_PROGRESS_TRACKING = 9,
  MAXIMUM_PROGRESS_HISTORY = 10,
  ALLOW_STUDENTS_TO_VIEW_THEIR_SCHEDULE = 11,
  ALLOW_STUDENTS_TO_SET_REMINDERS = 12,
  MAXIMUM_SCHEDULES_PER_DAY = 13,
  SHOW_SUBJECTS_STUDIED = 14,
  MAXIMUM_ITEMS_SHOWN = 15,
  MIND_MAPS = 16,
  FLASH_CARDS = 17,
  PRACTICE_EXAMS = 18,
  MAXIMUM_MIND_MAPS = 19,
  MAXIMUM_FLASH_CARD_SETS = 20,
}
```

---

# Fetch

`POST - /fetch_plans`

## Request

```ts
{
  "word"?: string,
  "with_pagination"?: number,
  "page"?: number,
  "per_page"?: number,
  "user_id"?: number,
  "from_price"?: number,
  "to_price"?: number,
  "duration"?: string,
  "has_trail"?: bool,
  "status"?: PlanStatusEnum,
  "from_date"?: string,
  "to_date"?: string,
  "last_updated"?: LastUpdatedEnum
}
```

## Response

```ts
{
  "id": number,
  "title": string,
  "duration": number,
  "duration_type": DurationTypeEnum,
  "price": number,
  "status": PlanStatusEnum,
  "trail_days": number,
  "last_updated": {
    "last_updated_date": string,
    "last_updated_person": {
      "id": number,
      "name": string,
    }
  },
}
```

---

# Store

`POST - /store_plan`

## Request

```ts
{
  "translations": {
    "title": {
      "en": "plan title",
      "ar": "خطة"
    },
    "description": {
      "en": "plan description",
      "ar": "وصف الخطة"
    }
  },
  "status": PlanStatusEnum,
  "highlight_badge": [
    number,
    number
  ],

  "pricing": [
    {
      "price": number,
      "duration": number,
      "duration_type": DurationTypeEnum,
    }
  ],

  "has_trail": bool,
  "trail_days": number,
  "features": [
    {
      "feature_type": PlanFeatureTypeEnum,
      "feature_sub_type":[
        {
            "sub_type": PlanFeatureSubTypeEnum,
            "limit"?:number
        }
      ]
    }
  ]
}
```

# show

`POST - /show_plan`

## Request

```ts
{
    "plan_id": "number",
}
```

## Response

```ts
{
  "id": number,
  "title": string,
  "status": PlanStatusEnum,
  "highlight_badge": [
    {
      "id": number,
      "title": string,
    },
    {
      "id": number,
      "title": string,
    }
  ],
  "craeted_by":{
    "id": number,
    "title": string,
  },
  "created_at": string,
  "last_update_at": string,
  "subscribers:": number,
  "trail_days": number,
  "pricing": [
    {
      "price": number,
      "duration": number,
      "duration_type": DurationTypeEnum,
    }
  ],
  "features": [
    {
      "feature_id": number,
      "feature_title": string,
      "sub_features":[
         {
            "id": number,
            "status": bool,
            "limit": number
        }
      ]
    }
  ],
  "active_log":[
    {
        "user":{
          "id": number,
          "name": string,
        },
        "date": string,
        "text": string,
    }
  ]


}
```

---

# edit

`POST - /update_plan`

## Request

```ts
{
  "plan_id": number,
  "translations": {
    "title": {
      "en": "plan title",
      "ar": "خطة"
    },
    "description": {
      "en": "plan description",
      "ar": "وصف الخطة"
    }
  },

  "duration": number,
  "duration_type": DurationTypeEnum,
  "price": number,
  "status": PlanStatusEnum,

  "highlight_badge": [
    number,
    number
  ],

  "pricing": [
    {
      "price": number,
      "duration": number,
      "duration_type": DurationTypeEnum,
    }
  ],

  "has_trail": bool,
  "trail_days": number,
  "features": [
    {
      "feature_type": PlanFeatureTypeEnum,
      "feature_sub_type": [
        {
          "sub_type": PlanFeatureSubTypeEnum,
          "limit"?: number
        }
      ]
    }
  ]
}
```

# delete

`POST - /delete_plan`

## Request

```ts
{
  "plan_id": number,
}
```
