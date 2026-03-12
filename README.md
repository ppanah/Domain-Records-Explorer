# Domain Records Explorer

## Overview

This project implements a **Domain Records Explorer**, an internal tool designed for domain operations teams to inspect and investigate domain records.

Support engineers can search, filter, and inspect domain information such as registrar, operational status, registration dates, and nameservers. The goal of the tool is to provide a clear and efficient interface for troubleshooting domain-related issues.

The application is built using **Vue 3**, **Composition API**, **TypeScript**, and **Vite**, with minimal dependencies and plain CSS for styling.

---

# Features

### Domain List

* Displays domain records in a structured table.
* Rows are clickable to inspect detailed information.
* Status indicators provide visual feedback for domain state.
* "Pagination" allows users to navigate large datasets efficiently.

### Search

* Users can search domains by domain name.
* Debounced search prevents excessive filtering on every keystroke, improving performance.

### Filtering

Filtering is supported for:

* **Registrar**
* **Status**

Filtering is implemented **client-side** for this exercise.

### Domain Details

Clicking a domain row opens a **modal dialog** displaying:

* Domain name
* Registrar
* Status
* Created date
* Expiration date
* Last updated date
* Nameservers

### UX Enhancements

* Loading state
* Empty results state
* API error handling
* Incomplete data handling
* Click outside modal to close
* ESC key to close modal
* Status color indicators
* Pagination controls for easy navigation of domain records

---

# Technology Stack

* Vue 3
* Composition API
* `<script setup>`
* TypeScript
* Vite
* Plain CSS (no UI frameworks)

No external UI libraries were used to keep dependencies minimal as requested.

---

# Project Structure

```
src
 ├─ components
 │   ├─ DomainTable.vue
 │   ├─ DomainFilters.vue
 │   ├─ DomainSearch.vue
 │   └─ DomainDetails.vue
 │
 ├─ mock
 │   └─ domains.json
 │
 ├─ utils
 │   ├─ display.ts
 │   ├─ date.ts
 │   └─ debounce.ts
 │
 ├─ views
 │   └─ Home.vue
 │
 ├─ App.vue
 └─ main.ts
```

### Key Design Decisions

**Component Separation**

The UI is broken into small reusable components:

| Component     | Responsibility              |
| ------------- | --------------------------- |
| DomainTable   | Displays the domain list    |
| DomainSearch  | Handles search input        |
| DomainFilters | Handles filtering           |
| DomainDetails | Displays domain information |

This improves maintainability and testability.

---

# Handling Incomplete Data

Domain records may contain missing fields such as:

* `updated_at`
* `nameservers`

A reusable helper function is used to safely display fallback values.

Example:

```ts
displayValue(domain.updated_at, "Unknown")
```

This prevents UI errors and ensures consistent formatting.

---

# Loading and Error Handling

The application handles several UI states:

### Loading

A loading indicator is displayed while domain data is being fetched.

### Empty Results

If filtering returns no records, a friendly message is shown.

### API Failure

An error message is displayed if data cannot be loaded.

---

# Backend API Design (Scalability)

For this exercise filtering is implemented client-side.

However, if the dataset grows significantly, filtering should be moved to the backend.

Example API:

```
GET /api/domains
```

Query parameters:

```
GET /api/domains?domain=example&status=active&registrar=GoDaddy&page=1&pageSize=50
```

Example response:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 1200
  }
}
```

Advantages:

* avoids loading large datasets in the browser
* improves performance
* enables pagination and server-side indexing

---

# Assumptions

Because the problem statement intentionally leaves some details open, the following assumptions were made:

* domain data is retrieved from a backend API
* domain status values are limited to the simplified set provided
* internal users access the tool in modern browsers
* the dataset size is small enough for client-side filtering in this exercise

---

# Tradeoffs

### Client-side filtering

Chosen for simplicity given the mock dataset.

For production systems, server-side filtering and pagination would be necessary.

### Modal interaction

Domain details are shown in a modal to allow quick inspection without navigating away from the domain list.

---

# Future Improvements

If this were a production tool, possible improvements include:

* server-side pagination
* domain sorting
* keyboard navigation
* accessibility improvements
* caching API responses

---

# Running the Project

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

---

# Conclusion

This implementation focuses on:

* clear UI for operational teams
* maintainable component structure
* resilience to incomplete data
* scalable backend design considerations
* debounced search and client-side pagination for usability

The solution demonstrates how a real internal engineering tool could be structured while keeping the implementation lightweight and easy to extend.
