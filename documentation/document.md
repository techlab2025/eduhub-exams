# Document

## Document Type

```json enumr
[
    "id": 1,
    "title": "Document Type 1",
    "id": 2,
    "title": "Document Type 2",
    "id": 3,
    "title": "Document Type 3",
]
```

## Add Document

```json
{
    "title": string,
    "subject_id": number,
    "stage_id": number,
    "unit_ids": number[],
    "document_type_id": number,
    "isAllUnits": boolean
}
```

## Edit Document

```json
{
    "document_id": number,
    "title": string,
    "subject_id": number,
    "stage_id": number,
    "unit_ids": number[],
    "document_type_id": number,
    "isAllUnits": boolean
}
```

## Delete Document

```json
{
    "document_id": number
}
```

## Show Document

```json
{
    "document_id": number
}
```

## Documents Index

```json
{
    "word": string,
    "pageNumber": number,
    "perPage": number,
    "withPage": number
}
```
