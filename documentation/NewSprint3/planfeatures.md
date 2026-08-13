# Plan Feature Documentation

---



# Fetch

`POST - /fetch_plan_features`

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
[
   {
    "id": number,
    "title":,
    "sub_features": [
      {
        "id": number,
        "title":,
      }
    ]
   }
]
```

---

