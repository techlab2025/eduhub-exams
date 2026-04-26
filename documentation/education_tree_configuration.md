# Education Tree Configuration

## fetch Education Classification configuration branchs

```json
{
    "education_classification_id"?: number,
    "branch_id"?: number,

}
```

## Response Education Classification configuration branchs

```json
{
    "education_classification_configuration_branches": [
        {
            "branch_id": number,
            "branch_title": string,
        }
    ]
}
```

## add Education Classification configuration branch

```json
{
  "branch_title": string,
  "branch_id"?:number
}
```
