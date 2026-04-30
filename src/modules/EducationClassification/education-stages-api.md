# Education Stages API

## Endpoints

### Fetch Stages — `GET organization/fetch_education_stages`

Returns the direct children of a classification root or a specific parent stage.

**Query Parameters**

| Parameter           | Type     | Required | Description                                          |
| ------------------- | -------- | -------- | ---------------------------------------------------- |
| `classification_id` | `number` | Yes      | ID of the education classification tree              |
| `parent_id`         | `number` | No       | ID of the parent stage. Omit to fetch root stages    |

**Success Response `200`**

```json
{
  "data": [
    {
      "stage_id": 1,
      "stage_title": "جامعى",
      "has_children": true
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

**Response Fields**

| Field          | Type      | Description                                      |
| -------------- | --------- | ------------------------------------------------ |
| `stage_id`     | `number`  | Unique identifier for the stage                  |
| `stage_title`  | `string`  | Display name of the stage                        |
| `has_children` | `boolean` | Whether this stage has child stages in the tree  |

**Params class:** [FetchEducationStageParams](./core/params/EducationStages/fetch.education.stage.params.ts)

**Model class:** [EducationStageModel](./core/models/EducationStage/education.stages.model.ts)

---

### Add Stage — `POST organization/store_education_stage`

Creates a new stage under a classification, optionally nested under a parent stage.

**Request Body**

| Field               | Type     | Required | Validation             | Description                                        |
| ------------------- | -------- | -------- | ---------------------- | -------------------------------------------------- |
| `title`             | `string` | Yes      | min 2, max 100 chars   | Display name for the new stage                     |
| `classification_id` | `number` | Yes      | —                      | ID of the education classification tree            |
| `parent_id`         | `number` | No       | —                      | ID of the parent stage. Omit to create a root stage|

**Example Request**

```json
{
  "title": "Primary School",
  "classification_id": 3,
  "parent_id": 1
}
```

**Success Response `201`**

```json
{
  "data": {
    "stage_id": 12,
    "stage_title": "Primary School",
    "has_children": false
  }
}
```

**Params class:** [AddEducationStageParams](./core/params/EducationStages/add.education.stage.params.ts)

---

## Tree Fetch Behaviour

The component fetches stages lazily:

- **Root fetch** — on mount, calls `fetch_education_stages` with only `classification_id`. Runs once; if `rootNodes` is already populated the call is skipped.
- **Expand node** — triggered when the user toggles a node open for the first time (`isLoaded === false`). Calls `fetch_education_stages` with `parent_id`.
- **Select node** — triggered when the user clicks a node. Fetches children only if `has_children === true` **and** the node has not already been loaded (`isLoaded === false` or `children` is empty). Children are **never updated** when the API returns an error or non-`200` response.

If `fetch_education_stages` returns any non-success state (`DataFailed`, `DataTimeout`, `DataNoNetwork`, etc.) the existing `children` array is left unchanged and `isLoaded` remains `false`, allowing the user to retry by clicking again.
