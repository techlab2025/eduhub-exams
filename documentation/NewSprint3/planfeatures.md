# Plan Feature Documentation

---

## Enums

```ts
export enum PlanFeatureTypeEnum {
  SWITCH = '1',
  NUMBER = '2',
}
```

---

# Fetch

`POST - /fetch_plan_feature`

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
  "description": string,
  "plan_feature_type": PlanFeatureTypeEnum,
}
```

---

# Store

`POST - /store_plan_feature`

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

  "parent_id": number,
  "plan_feature_type": PlanFeatureTypeEnum,
}
```

---

# Show

`POST - /show_plan_feature`

## Request

```ts
{
  "plan_feature_id": number,
}
```

## Response

```ts
{
  "title": [
    {
      "locale": "en",
      "title": "plan feature title"
    },
    {
      "locale": "ar",
      "title": "عنوان الميزة"
    }
  ],

  "plan_feature_type": PlanFeatureTypeEnum,
}
```

# Edit

`POST - /edit_plan_feature`

## Request

```ts
{
  "plan_feature_id": number,
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

  "parent_id": number,
  "plan_feature_type": PlanFeatureTypeEnum,
}
```

# delete

`POST - /edit_plan_feature`

## Request

```ts
{
  "plan_feature_id": number,
}
```
