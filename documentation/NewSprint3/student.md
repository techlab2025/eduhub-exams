# Students Documentation

---

# Enums

```ts
export enum StudentStatusEnum {
  ACTIVE = '1',
  ARCHIVE = '2',
  BLOCK = '3',
}
```

---

# Fetch

`POST - /fetch_students`

## Request

```ts
{
  "word"?: string,
  "with_pagination"?: number,
  "page"?: number,
  "per_page"?: number,
  "education_type_id"?: number,
  "year"?: number,
  "plan_id"?: number,
  "status"?: StudentStatusEnum,
  "join_date_from"?: string,
  "join_date_to"?: string,
}
```

## Response

```ts
{
  "id": number,
  "name": string,
  "image": string,
  "serial": string,

  "education_type": {
    "id": number,
    "title": string,
    "children": [
      {
        "id": number,
        "title": string,
           "children": []
      }
    ]
  },

  "current_plan": {
    "id": number,
    "title": string,
  },

  "num_of_exams": number,
  "num_of_study_plan": number,

  "status": StudentStatusEnum,
  "join_date": string,
}
```

---

# Show

`POST - /show_student_details`

## Request

```ts
{
  "student_id": number,
}
```

## Response

```ts
{
  "id": number,
  "name": string,
  "image": string,
  "serial": string,
  "status": StudentStatusEnum,

  "points": number,
  "rank": string,

  "phone": string,

  "education_type": {
    "id": number,
    "title": string,
    "children": [
        {
            "id": number,
            "title": string,
            "children": []
        }
    ]
  },

  "education_stage": {
    "id": number,
    "title": string,
  },

  "grade": {
    "id": number,
    "title": string,
  },

  "reason":string,
  "blocked_by":{
    "id":number,
    "name":string
  },
  "block_date":string,
  "registration": {
    "register_date": string,
    "authentication_method": string,
    "email": string,
    "email_verified": bool,
    "phone_verified": bool,
  },

  "application_information": {
    "registration_method": string,
    "device_used": string,
    "operation_system": string,
    "app_version": string,
    "current_status": string,
    "last_seen": string,
  },

  "plan": {
    "id": number,
    "title": string,
    "plan_status": StudentStatusEnum,
    "total_paid": number,
    "payment_method": string,
    "subscribe_date": string,
    "expire_date": string,
  },

  "performance": {
    "total_placement_tests": number,
    "placement_tests_this_month": number,
    "total_practices_plan": number,
    "total_practices_plan_this_month": number,
  },
  "placement_tests": [
    {
      "id": number,
      "title": string,
      "correct_count": number,
      "wrong_count": number,

    }
  ],
  "practices_plan":[
    {
       "id": number,
      "title": string,
      "correct_count": number,
      "wrong_count": number,
    }
  ],
  "Student schedules":[].
  "notes":[
    {
        "id": number,
        "note": string,
        "created_at": string,
        "created_by": {
            "id": number,
            "name": string,
        }
    }
  ]
}
```

---

# Fetch Statics

`POST - /fetch_students_statics`

## Request

```ts
{
}
```

## Response

```ts
{
  "total_students": number,
  "active_students": number,
  "archive_students": number,
  "blocked_students": number,
}
```

---

# Change Status

`POST - /change_student_status`

## Request

```ts
{
  "student_id": number,
  "status": StudentStatusEnum,
  "block_reason"?: string,
}
```

## Response

```ts
{
}
```

---

# Force Logout

`POST - /force_logout_student`

## Request

```ts
{
  "student_id": number,
}
```

## Response

```ts
{
}
```

---
