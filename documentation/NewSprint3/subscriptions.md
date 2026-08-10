# Subscriptions Documentation

---

# Enums

```ts
export enum subscriptionStatusEnum {
  ACTIVE = '1',
  EXPIRED = '2',
  CANCELLED = '3',
}
```

---

# Fetch

`POST - /fetch_subscriptions`

## Request

```ts
{
  "word"?: string,
  "with_pagination"?: number,
  "page"?: number,
  "per_page"?: number,
  "education_type_id"?: number,
  "plan_id"?: number,
  "status"?: subscriptionStatusEnum,
  "paied_from"?: number,
  "paied_to"?: number,
  "subscription_date_from"?: string,
  "subscription_date_to"?: string,
  "expire_date_from"?: string,
  "expire_date_to"?: string,

}
```

## Response

```ts
{
  "id": number,
  "stident_name":string,
  "plane":{
    "id":number,
    "title":string
  },
  "total_price":number,
  "subscription_date":string,
  "expire_date":string,
  "status":subscriptionStatusEnum,
}
```

---

# Show

`POST - /show_subscription_details`

## Request

```ts
{
  "subscription_id": number,
}
```

## Response

```ts
{
  "user":{
    "id": number,
    "name": string,
    "serial": string,
  },
  "education_type":{
    "id": number,
    "title": string,
  },
  "plan":{
    "id": number,
    "title": string,
    "plan_status":subscriptionStatusEnum,
    "total_paied":string,
    "payment_method":string,
    "subscribe_date":string,
    "expire_date":string,
  },
}
```

# Fetch statics

`POST - /fetch_subscriptions_statics`

## Request

```ts
{
}
```

## Response

```ts
{

  "total_subscribers": number,
  "active_subscriptions": number,
  "cancelled_subscriptions": number,
  "expired_subscriptions": number,

}
```

---

# delete

`POST - /delete_subscription`

## Request

```ts
{
  "subscription_id":number,
}
```

## Response

```ts
{
}
```

---
