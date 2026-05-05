# Spec: Fix Dialog Accessibility (DialogTitle)

**Date:** 2026-05-06
**Status:** Approved
**Topic:** Fixing "DialogContent requires a DialogTitle" error in `TeamListClient.tsx`

## 1. Problem Description

The `TeamListClient` component uses `Dialog` from shadcn/ui (Radix UI). Radix UI requires every `DialogContent` to contain a `DialogTitle` for screen reader accessibility.

Currently, the implementation fails this in two places:

1.  **Detail Modal:** When `isLoadingDetail` is true, only a `Loader2` is rendered. The `DialogTitle` is only rendered once data is loaded, leaving a window where the requirement is violated.
2.  **Delete Modal:** Uses a standard `<h2>` tag instead of the `<DialogTitle>` component.

## 2. Proposed Solution (Approach A)

### 2.1 Detail Modal Refactoring

Restructure the `DialogContent` to ensure `DialogHeader` and `DialogTitle` are always present, regardless of the loading state.

- **Title Logic:**
  - If loading: "Detail Tim..."
  - If loaded: The team name (e.g., "Paskibra Elang Jaya").
- **Header Structure:** Move the `DialogHeader` outside the `isLoadingDetail` conditional block.
- **Body:** Keep the loading spinner or the `Tabs` content inside the conditional block below the header.

### 2.2 Delete Modal Refactoring

Standardize the modal header to use the correct Radix primitive component.

- **Title Change:** Replace `<h2>` with `<DialogTitle>`.
- **Description Change:** Wrap the confirmation message in `<DialogDescription>` for complete accessibility.
- **Styling Preservation:** Ensure existing Montserrat and font-bold styles are applied to the new components to maintain visual design.

## 3. Technical Changes

### File: `src/app/peserta/dashboard/team/_components/team-list-client.tsx`

#### Detail Modal Section:

```tsx
<DialogContent ...>
  <DialogHeader className="...">
    {/* Always present Title */}
    <DialogTitle className="...">
      {isLoadingDetail ? "Detail Tim..." : (teamDetail?.name || "Detail Tim")}
    </DialogTitle>
    {/* Other header elements like logo can be conditional or placeholder */}
  </DialogHeader>
  {isLoadingDetail ? (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="..." />
    </div>
  ) : teamDetail ? (
    /* Tabs and Content */
  ) : null}
</DialogContent>
```

#### Delete Modal Section:

```tsx
<DialogContent ...>
  <form ...>
    <div className="...">
      <div className="...">
        <Trash2 className="..." />
      </div>
      <DialogTitle className="font-montserrat text-2xl font-bold text-neutral-800">
        Hapus Tim
      </DialogTitle>
      <DialogDescription className="font-poppins text-sm text-neutral-600 text-center">
        Apakah kamu yakin ingin menghapus tim ini?<br />
        Tindakan ini tidak dapat dibatalkan.
      </DialogDescription>
    </div>
    ...
  </form>
</DialogContent>
```

## 4. Verification Plan

1.  **Console Check:** Open the Detail Modal and Delete Modal, verify the "requires a DialogTitle" error no longer appears in the console.
2.  **Visual Audit:** Ensure the layout of both modals remains consistent with the original design.
3.  **Loading State Check:** Verify the Detail Modal shows a clear title ("Detail Tim...") while the loader is active.
