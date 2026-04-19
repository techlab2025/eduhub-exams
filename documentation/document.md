# Document

## Add Document

```json
{
    "title": string,
    "subject_id": number,
    "stage_id": number,
    "unit_ids": number[],
    "documentType": number,
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
    "documentType": number,
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
