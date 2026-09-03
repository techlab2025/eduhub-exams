# Notification Plan Documentation


## Enums

```ts
export enum StatusNotificationPlanEnum {
  inactive = '0',
  active = '1',
}
```
---


# Fetch

`POST - /fetch_notification_plans`

## Request

```ts
{
  "word"?: string,
  "with_pagination"?: number,
  "page"?: number,
  "per_page"?: number,
  "status"?: StatusNotificationPlanEnum,
  "employee_id"?: number,
  "action"?: enum, 
  "feature"?: enum,
}
```

## Response

```ts
{
  "id": number,
  "title": string,
  "recipients_number": number,
  "actions_number": number,
  "status": StatusNotificationPlanEnum,
  "created_by": string,
  "created_at": string,
  
} 
```

---

# Store

`POST - /store_notification_plan`

## Request

```ts
{
"plan_title":string,
"employee_ids":number[],
"action":[
  {
    "action_ids":enum[],
    "message":string,
  },
  {
    "action_ids":enum[],
    "message":string,
  }
],
"status"?: StatusNotificationPlanEnum,
}
```

---

# Show

`POST - /show_notification_plan`

## Request

```ts
{
  "notification_plan_id": number,
}
```

## Response

```ts
{
  "id": number,
"plan_title":string,
"employees":[{id:number,name:string}],
"actions":
[{
  "action_ids":enum[],
  "message":string,
}]
"status": StatusNotificationPlanEnum,
"created_by": string,
"created_at": string,
"updated_by": string,
"updated_at": string,
}
```

# Edit

`POST - /edit_notification_plan`

## Request

```ts
{
"plan_title":string,
"employee_ids":number[],
"action":[
  {
    "action_ids":enum[],
    "message":string,
  },
  {
    "action_ids":enum[],
    "message":string,
  }
],
"status"?: StatusNotificationPlanEnum,
}
```

# delete

`POST - /delete_notification_plan`

## Request

```ts
{
  "notification_plan_id": number,
}
```
