# Document Index Documentation

---

# Fetch

`POST - /create_document_index`

## Request

```ts
{
  "document_id": string,
}
```

## Response

```ts
{
  "book_id": number,
  "book_status": string,
  "chapters": [
    {
      "id": number,
      "position": number,
      "number": string,
      "title": string,
      "description": string | null,
      "source_pages": {
        "start": number,
        "end": number,
      },
      "source_hash": string,
      "source_url_json": string,
      "source_url_txt": string,
      "confidence": number,
      "is_inferred": boolean,
      "inference_level": string,
      "lessons": [
        {
          "id": number,
          "position": number,
          "number": string,
          "title": string,
          "description": string | null,
          "source_pages": {
            "start": number,
            "end": number,
          },
          "source_hash": string,
          "source_url_json": string,
          "source_url_txt": string,
          "confidence": number,
          "is_inferred": boolean,
          "inference_level": string,
          "topics": [
            {
              "id": number,
              "position": number,
              "title": string,
              "description": string | null,
              "important_concepts": unknown[],
              "subtopics": unknown[],
              "source_pages": {
                "start": number,
                "end": number,
              },
              "source_hash": string,
              "source_url_json": string,
              "source_url_txt": string,
              "confidence": number,
              "is_inferred": boolean,
              "inference_level": string,
            },
          ],
        },
      ],
    },
  ],
}
```

---

# Update Document Index

`POST - /update_document_index`

## Request

```ts
{
  "document_id": string,
  "data":[
    {
      "chapter_id":number,
      "chapter_title":string,
      "chapter_from_pdf":number,
      "chapter_to_pdf":number,
      "chapter_printed_page":string,
    },
    {
      "lesson_id":number,
      "lesson_title":string,
      "lesson_from_pdf":number,
      "lesson_to_pdf":number,
      "lesson_printed_page":string,
    },
    {
      "topic_id":number,
      "topic_title":string,
      "topic_from_pdf":number,
      "topic_to_pdf":number,
      "topic_printed_page":string,
    }
  ]

}
```

## Response

```ts
{
  "book_id": number,
  "book_status": string,
  "chapters": [
    {
      "id": number,
      "position": number,
      "number": string,
      "title": string,
      "description": string | null,
      "source_pages": {
        "start": number,
        "end": number,
      },
      "source_hash": string,
      "source_url_json": string,
      "source_url_txt": string,
      "confidence": number,
      "is_inferred": boolean,
      "inference_level": string,
      "lessons": [
        {
          "id": number,
          "position": number,
          "number": string,
          "title": string,
          "description": string | null,
          "source_pages": {
            "start": number,
            "end": number,
          },
          "source_hash": string,
          "source_url_json": string,
          "source_url_txt": string,
          "confidence": number,
          "is_inferred": boolean,
          "inference_level": string,
          "topics": [
            {
              "id": number,
              "position": number,
              "title": string,
              "description": string | null,
              "important_concepts": unknown[],
              "subtopics": unknown[],
              "source_pages": {
                "start": number,
                "end": number,
              },
              "source_hash": string,
              "source_url_json": string,
              "source_url_txt": string,
              "confidence": number,
              "is_inferred": boolean,
              "inference_level": string,
            },
          ],
        },
      ],
    },
  ],
}
```

---

# Save Document Index

`POST - /save_document_index`

## Request

```ts
{
  "document_id": string,
}
```
