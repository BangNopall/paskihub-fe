# User Management Pagination Design

This document outlines the plan to add pagination to the User Management page in the Paskihub Admin Dashboard.

## 1. Goal

Implement client-side pagination for the user management table to improve performance and usability when dealing with many users.

## 2. Approach

We will use a client-side pagination approach since the data is currently mocked and fetched all at once. We will follow the established pattern in other admin dashboard pages (like Transactions and Admins).

## 3. Changes

### 3.1. State Management

- Add `currentPage` state (default: 1).
- Define a constant `itemsPerPage` (set to 20).

### 3.2. Logic

- Calculate `totalPages` based on the length of `filteredUsers`.
- Create `paginatedUsers` by slicing `filteredUsers` using `currentPage` and `itemsPerPage`.
- Add a `useEffect` to reset `currentPage` to 1 whenever `searchTerm` or `activeTab` changes.

### 3.3. UI Components

- Import `Pagination` components from `@/components/ui/pagination`.
- Add a pagination section below the `Table` inside `CardContent`.
- Include a summary text: "Menampilkan 1-20 dari 100 user" (localized).

## 4. Integration

- The `TableBody` will iterate over `paginatedUsers` instead of `filteredUsers`.
- The pagination controls will update `currentPage`.

## 5. Success Criteria

- Table displays maximum 20 users per page.
- User can navigate between pages using previous/next and page number buttons.
- Search and tab filters correctly reset the pagination to page 1.
- Layout remains consistent with other dashboard pages.
