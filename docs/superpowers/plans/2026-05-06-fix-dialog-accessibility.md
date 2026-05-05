# Refactor Detail Modal Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure `DialogTitle` is always present in the team detail modal to satisfy Radix UI accessibility requirements.

**Architecture:** Move `DialogHeader` outside of the loading conditional block within `DialogContent`. Use conditional logic within the header to display loading states or team information.

**Tech Stack:** Next.js, React, Radix UI, Tailwind CSS.

---

### Task 1: Refactor DialogContent in TeamListClient

**Files:**

- Modify: `src/app/peserta/dashboard/team/_components/team-list-client.tsx`

- [ ] **Step 1: Move DialogHeader outside of the isLoadingDetail conditional**

Move the `DialogHeader` component so it is a direct child of `DialogContent`, ensuring it renders regardless of the loading state. Update the `DialogTitle` and logo to handle loading states.

```tsx
<<<<
      {/* DETAIL MODAL */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-h-[90vh] w-full gap-0 overflow-y-auto rounded-3xl bg-white p-0 sm:min-w-xl sm:rounded-[40px]">
          {isLoadingDetail ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : teamDetail ? (
            <div className="flex flex-col">
              <DialogHeader className="flex flex-row items-start justify-between space-y-0 border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-8">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-stone-200 bg-neutral-100 sm:h-16 sm:w-16">
                    {teamDetail.logo_path ? (
                      <img src={`${API_URL}${teamDetail.logo_path}`} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <DialogTitle className="font-poppins text-lg font-semibold text-neutral-900 sm:text-xl">{teamDetail.name}</DialogTitle>
                    <Badge variant="secondary" className="bg-sky-50 text-sky-600">{teamDetail.institution_type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/peserta/dashboard/team/edit/${teamDetail.id}`}>
                    <Button variant="ghost" size="sm" className="hidden font-poppins text-blue-500 hover:bg-blue-50 hover:text-blue-600 sm:flex">
                      <Pencil className="mr-2 h-4 w-4" /> Edit Tim
                    </Button>
                  </Link>
                </div>
              </DialogHeader>

              <div className="flex flex-col p-6 sm:px-10 sm:pt-6 sm:pb-10">
====
      {/* DETAIL MODAL */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-h-[90vh] w-full gap-0 overflow-y-auto rounded-3xl bg-white p-0 sm:min-w-xl sm:rounded-[40px]">
          <DialogHeader className="flex flex-row items-start justify-between space-y-0 border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-stone-200 bg-neutral-100 sm:h-16 sm:w-16">
                {!isLoadingDetail && teamDetail?.logo_path ? (
                  <img src={`${API_URL}${teamDetail.logo_path}`} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-neutral-400" />
                )}
              </div>
              <div className="flex flex-col items-start gap-1">
                <DialogTitle className="font-poppins text-lg font-semibold text-neutral-900 sm:text-xl">
                  {isLoadingDetail ? "Memuat Detail Tim..." : (teamDetail?.name || "Detail Tim")}
                </DialogTitle>
                {!isLoadingDetail && teamDetail && (
                  <Badge variant="secondary" className="bg-sky-50 text-sky-600">
                    {teamDetail.institution_type}
                  </Badge>
                )}
              </div>
            </div>
            {!isLoadingDetail && teamDetail && (
              <div className="flex items-center gap-4">
                <Link href={`/peserta/dashboard/team/edit/${teamDetail.id}`}>
                  <Button variant="ghost" size="sm" className="hidden font-poppins text-blue-500 hover:bg-blue-50 hover:text-blue-600 sm:flex">
                    <Pencil className="mr-2 h-4 w-4" /> Edit Tim
                  </Button>
                </Link>
              </div>
            )}
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : teamDetail ? (
            <div className="flex flex-col p-6 sm:px-10 sm:pt-6 sm:pb-10">
>>>>
```

- [ ] **Step 2: Remove the extra div and fix indentation**

The `teamDetail` block formerly started with `<div className="flex flex-col">` which wrapped the `DialogHeader`. This should be removed since `DialogHeader` is now outside.

```tsx
<<<<
              <div className="flex flex-col p-6 sm:px-10 sm:pt-6 sm:pb-10">
                <Tabs defaultValue="umum" className="w-full">
====
            <div className="flex flex-col p-6 sm:px-10 sm:pt-6 sm:pb-10">
              <Tabs defaultValue="umum" className="w-full">
>>>>
```

(and ensure closing div is adjusted)

- [ ] **Step 3: Verify build**

Run: `npm run build` or `next lint` (if available) to ensure no regressions.

- [ ] **Step 4: Commit changes**

```bash
git add src/app/peserta/dashboard/team/_components/team-list-client.tsx
git commit -m "fix(ui): ensure DialogTitle is always present in team detail modal"
```
