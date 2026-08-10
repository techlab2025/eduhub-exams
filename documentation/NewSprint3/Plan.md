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
      "feature_id": number,
      "status"?: bool,
      "limit"?: number,
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
      "feature_id": number,
      "status"?: bool,
      "limit"?: number,
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
