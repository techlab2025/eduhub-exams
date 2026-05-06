# Standalone Admin & Country Modules - Implementation Plan & Summary

## Architecture Overview

| Context                | Routes                                             | API Prefix        | Sidebar                         |
| ---------------------- | -------------------------------------------------- | ----------------- | ------------------------------- |
| **Standalone Admin**   | `/admin`, `/admin/add`, `/admin/edit/:id`          | `general/`        | Admin-only                      |
| **Standalone Country** | `/country`, `/country/add`, `/country/edit/:id`    | `general/`        | Country-only                    |
| **Country-specific**   | `/:country_code/...` (employees, docs, FAQs, etc.) | Existing prefixes | Full menu (minus admin/country) |
| **General Login**      | `/login`                                           | `general/`        | —                               |
| **Country Login**      | `/:country_code/login` (kept as-is)                | `dashboard/`      | —                               |

---

## 1. Router & Guards

### Changes

- **`src/router/index.ts`**
  - Added `/login` → `GeneralLogin.vue`
  - Added `/admin` layout route with children: `/admin`, `/admin/add`, `/admin/edit/:id`
  - Added `/country` layout route with children: `/country`, `/country/add`, `/country/edit/:id`
  - Updated `/:country_code` redirect from `Countries` to `Employees` (since country is now standalone)
  - Kept existing `/:country_code/login` unchanged

- **`src/router/guards.ts`**
  - Added `/login` to public routes
  - Standalone routes (`/admin/*`, `/country/*`) skip `country_code` validation
  - Standalone routes redirect unauthenticated users to `/login`
  - Country-specific routes keep existing behavior

### New Route Files

- `src/router/routes/modules/admin.ts` — Admin standalone routes
- `src/router/routes/modules/country-standalone.ts` — Country standalone routes

---

## 2. Admin Module — Full CRUD UI

### Backend Updates

- **`src/modules/admin/data/api/admin.api.endpoints.ts`**
  - Changed `prefix` from `organization/` → `general/`

- **`src/modules/admin/presentation/controllers/admin.controller.ts`**
  - Updated redirects from named route to `router.push({ path: '/admin' })`

### New Components

| File                                                       | Purpose                                             |
| ---------------------------------------------------------- | --------------------------------------------------- |
| `src/modules/admin/presentation/components/AdminIndex.vue` | Table list with search, pagination, delete          |
| `src/modules/admin/presentation/components/AdminForm.vue`  | Form fields: name, email, phone, password           |
| `src/modules/admin/presentation/components/AdminAdd.vue`   | Wraps form + save → `controller.create()`           |
| `src/modules/admin/presentation/components/AdminEdit.vue`  | Wraps form + fetch + update → `controller.update()` |

### New Views (thin wrappers)

| File                             | Purpose                  |
| -------------------------------- | ------------------------ |
| `src/views/Admin/IndexAdmin.vue` | Imports `AdminIndex.vue` |
| `src/views/Admin/AddAdmin.vue`   | Imports `AdminAdd.vue`   |
| `src/views/Admin/EditAdmin.vue`  | Imports `AdminEdit.vue`  |

### New Tests

| File                                                                     | Tests                    |
| ------------------------------------------------------------------------ | ------------------------ |
| `src/modules/admin/presentation/components/__tests__/AdminIndex.test.ts` | Renders without crashing |
| `src/modules/admin/presentation/components/__tests__/AdminForm.test.ts`  | Renders without crashing |
| `src/modules/admin/presentation/components/__tests__/AdminAdd.test.ts`   | Renders without crashing |
| `src/modules/admin/presentation/components/__tests__/AdminEdit.test.ts`  | Renders without crashing |

---

## 3. Country Module — Standalone Routes

### New Standalone Controller

- **`src/modules/country/presentation/controllers/country.standalone.controller.ts`**
  - Extends `BaseController` using shared `CountryRepository`
  - Overrides `create`/`update` to redirect to `/country` instead of `/:country_code/countries`

### New Standalone Components

| File                                                                     | Purpose                        |
| ------------------------------------------------------------------------ | ------------------------------ |
| `src/modules/country/presentation/components/CountryIndexStandalone.vue` | Copy with `/country/...` links |
| `src/modules/country/presentation/components/CountryAddStandalone.vue`   | Uses standalone controller     |
| `src/modules/country/presentation/components/CountryEditStandalone.vue`  | Uses standalone controller     |

### New Views

| File                                           | Purpose                            |
| ---------------------------------------------- | ---------------------------------- |
| `src/views/Country/IndexCountryStandalone.vue` | Wraps `CountryIndexStandalone.vue` |
| `src/views/Country/AddCountryStandalone.vue`   | Wraps `CountryAddStandalone.vue`   |
| `src/views/Country/EditCountryStandalone.vue`  | Wraps `CountryEditStandalone.vue`  |

### Removed From Dashboard

- **`src/router/routes/modules/index.ts`**
  - Removed `countryRoutes` from `dashboardRoutes`

---

## 4. General Login System

### New Login Endpoint

- **`src/modules/auth/data/api/login.api.endpoints.ts`**
  - Added `GeneralLoginEndpoints` class with `prefix = 'general/'`

### New API Service Method

- **`src/modules/auth/data/api/login.api-service.ts`**
  - Added `generalLogin()` method

### New Repository Method

- **`src/modules/auth/data/repositories/login.repository.ts`**
  - Added `generalLogin()` method

### New Controller Method

- **`src/modules/auth/presentation/controllers/login.controller.ts`**
  - Added `generalLogin()` — on success redirects to `/country`

### New Login UI

| File                                                            | Purpose                                 |
| --------------------------------------------------------------- | --------------------------------------- |
| `src/modules/auth/presentation/components/GeneralLoginForm.vue` | Login form calling `generalLogin()`     |
| `src/views/auth/GeneralLogin.vue`                               | Thin wrapper for `GeneralLoginForm.vue` |

---

## 5. Sidebar Navigation — Context Aware

### Changes

- **`src/shared/LayoutComponents/SubComponents/SidebarNavigation.vue`**
  - Computes menu based on current route prefix:
    - `/admin/*` → `[Admins]`
    - `/country/*` → `[Countries]`
    - `/:country_code/*` → All current items except admin/country
  - Country code prefix injection skipped for standalone routes

### Updated Test

- **`src/shared/LayoutComponents/SubComponents/__tests__/SidebarNavigation.test.ts`**
  - Removed assertion expecting `Countries` in base menu (now standalone)

---

## 6. API / Header Layer

### Changes

- **`src/base/Core/NetworkStructure/networking/utils/headerHandler.ts`**
  - `x-country` header omitted for standalone routes (`/admin`, `/country`, `/login`)
  - For country-specific routes, injects country code from store (fallback: `sa`)

---

## 7. i18n Updates

### Added Keys

- `admin_name`, `admin_email`, `admin_phone`, `admin_password`
- `no_admins_yet`, `add_first_admin`, `add_admin`
- `search_by_name_or_email`
- `edit_admin`, `update_admin_details`, `fill_admin_details`
- `save_admin`, `update_admin`

### Files Updated

- `src/locales/en.json`
- `src/locales/ar.json`

---

## Quality Gates

| Gate                            | Result            |
| ------------------------------- | ----------------- |
| `npm run type-check`            | ✅ Pass           |
| `npm run lint` (new files only) | ✅ No errors      |
| Admin component tests           | ✅ 4/4 pass       |
| SidebarNavigation test          | ✅ Updated & pass |

### Note on Pre-existing Test Failures

The full test suite has 10 failures in unrelated modules (`EducationClassification`, `Stages`, `Subjects`, `Unit`, `DeleteReasons`) that existed before these changes.

---

## Files Created

```
src/modules/admin/presentation/components/AdminIndex.vue
src/modules/admin/presentation/components/AdminForm.vue
src/modules/admin/presentation/components/AdminAdd.vue
src/modules/admin/presentation/components/AdminEdit.vue
src/modules/admin/presentation/components/__tests__/AdminIndex.test.ts
src/modules/admin/presentation/components/__tests__/AdminForm.test.ts
src/modules/admin/presentation/components/__tests__/AdminAdd.test.ts
src/modules/admin/presentation/components/__tests__/AdminEdit.test.ts
src/views/Admin/IndexAdmin.vue
src/views/Admin/AddAdmin.vue
src/views/Admin/EditAdmin.vue
src/modules/country/presentation/components/CountryIndexStandalone.vue
src/modules/country/presentation/components/CountryAddStandalone.vue
src/modules/country/presentation/components/CountryEditStandalone.vue
src/modules/country/presentation/controllers/country.standalone.controller.ts
src/views/Country/IndexCountryStandalone.vue
src/views/Country/AddCountryStandalone.vue
src/views/Country/EditCountryStandalone.vue
src/modules/auth/presentation/components/GeneralLoginForm.vue
src/views/auth/GeneralLogin.vue
src/router/routes/modules/admin.ts
src/router/routes/modules/country-standalone.ts
```

## Files Modified

```
src/modules/admin/data/api/admin.api.endpoints.ts
src/modules/admin/presentation/controllers/admin.controller.ts
src/modules/auth/data/api/login.api.endpoints.ts
src/modules/auth/data/api/login.api-service.ts
src/modules/auth/data/repositories/login.repository.ts
src/modules/auth/presentation/controllers/login.controller.ts
src/router/index.ts
src/router/guards.ts
src/router/routes/modules/index.ts
src/shared/LayoutComponents/SubComponents/SidebarNavigation.vue
src/shared/LayoutComponents/SubComponents/__tests__/SidebarNavigation.test.ts
src/base/Core/NetworkStructure/networking/utils/headerHandler.ts
src/locales/en.json
src/locales/ar.json
```
