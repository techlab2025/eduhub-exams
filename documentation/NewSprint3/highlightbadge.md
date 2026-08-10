# Hightlight Badge Documentation

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
}
```

---

# Store

`POST - /store_highlight_badge`

## Request

```ts
{
  "translations": {
    "title": {
      "en": "plan title",
      "ar": "خطة"
    },

  },

}
```

---

# Show

`POST - /show_highlight_badge`

## Request

```ts
{
  "highlight_badge_id": number,
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


}
```

# Edit

`POST - /edit_highlight_badge`

## Request

```ts
{
  "highlight_badge_id": number,
  "translations": {
    "title": {
      "en": "plan title",
      "ar": "خطة"
    },
  }
}
```

# delete

`POST - /delete_highlight_badge`

## Request

```ts
{
  "highlight_badge_id": number,
}
```
