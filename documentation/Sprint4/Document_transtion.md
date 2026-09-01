# Advice Documentation

---

# Fetch

`POST - /fetch_document_transactions`

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
  "created_by":string,
  "education_type": string,
  "subject_configuration": string,
  "applied": boolean,
  "status": string,
}
```