# User Management Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement client-side pagination (20 items per page) for the User Management table.

**Architecture:** Add React state for current page, calculate paginated subset of filtered users, and render shadcn/ui Pagination components.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS v4, shadcn/ui.

---

### Task 1: Setup State and Imports

**Files:**
- Modify: `src/app/admin/dashboard/users/page.tsx`

- [ ] **Step 1: Add Pagination component imports**

Add the following imports to `src/app/admin/dashboard/users/page.tsx`:
```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

- [ ] **Step 2: Add pagination state and constant**

Inside the `UserManagementPage` component, add the state and constant:
```tsx
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
```

- [ ] **Step 3: Commit setup**

```bash
git add src/app/admin/dashboard/users/page.tsx
git commit -m "feat(admin): add pagination state and imports to user management"
```

---

### Task 2: Implement Pagination Logic

**Files:**
- Modify: `src/app/admin/dashboard/users/page.tsx`

- [ ] **Step 1: Calculate pagination derived state**

Replace the `filteredUsers` slice logic or add calculations after `filteredUsers` definition:
```tsx
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
```

- [ ] **Step 2: Add filter reset effect**

Add an effect to reset to page 1 when search or tab changes:
```tsx
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])
```

- [ ] **Step 3: Commit logic**

```bash
git add src/app/admin/dashboard/users/page.tsx
git commit -m "feat(admin): implement pagination logic for users table"
```

---

### Task 3: Update UI and Table Body

**Files:**
- Modify: `src/app/admin/dashboard/users/page.tsx`

- [ ] **Step 1: Update TableBody to use paginatedUsers**

Find the `TableBody` and change `.map` from `filteredUsers` to `paginatedUsers`.

- [ ] **Step 2: Add Pagination controls below the table**

Insert the pagination controls and entry count summary inside `CardContent`, below the `Table` wrapper:

```tsx
            <CardContent className="p-0">
              {/* ... existing table code ... */}
              
              {/* Pagination Section */}
              {!isLoading && filteredUsers.length > 0 && (
                <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-100 p-6 md:flex-row">
                  <div className="text-sm text-neutral-500 font-poppins">
                    Menampilkan <span className="font-semibold text-neutral-700">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold text-neutral-700">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> dari <span className="font-semibold text-neutral-700">{filteredUsers.length}</span> user
                  </div>
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) setCurrentPage(currentPage - 1)
                            }}
                            className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink 
                              href="#" 
                              isActive={currentPage === i + 1}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(i + 1)
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                            }}
                            className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              )}
            </CardContent>
```

- [ ] **Step 3: Verify and Commit UI**

```bash
git add src/app/admin/dashboard/users/page.tsx
git commit -m "feat(admin): add pagination UI to user management table"
```
