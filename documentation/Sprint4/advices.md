# Advice Documentation

---

# Fetch

`POST - /fetch_advices`

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
}
```

---

# Store

`POST - /store_advice`

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

}
```

---

# Show

`POST - /show_advice`

## Request

```ts
{
  "advice_id": number,
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
