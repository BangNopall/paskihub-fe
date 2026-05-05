"use client"

import React, { useState, useMemo } from "react"
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react"

// --- SHADCN UI COMPONENTS ---
import { cn } from "@/lib/utils"
import { getLevelLabel } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

import {
  createRankingAwardAction,
  updateRankingAwardAction,
  deleteRankingAwardAction,
} from "@/actions/ranking.actions"
import { toast } from "sonner"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export interface RankingAward {
  id: string
  name: string
  limit_rank: number
  score_category_ids: string[]
  event_level_ids: string[]
  levels?: { id: string; name: string }[]
  score_categories?: { id: string; name: string }[]
}

interface RankingSystemClientProps {
  initialData: RankingAward[]
  eventLevels: { id: string; name: string }[]
  scoreCategories: { id: string; name: string; eventLevelId: string }[]
  eventId: string
}

// ==========================================
// 2. UI HELPER
// ==========================================

const generateUrutanString = (value: number) => {
  if (value <= 0) return "Tidak ada urutan valid"
  const limit = Math.min(value, 20)
  return (
    Array.from({ length: limit }, (_, i) => i + 1).join(", ") +
    (value > 20 ? ", ..." : "")
  )
}

// ==========================================
// 3. MAIN CLIENT COMPONENT
// ==========================================

export function RankingSystemClient({
  initialData,
  eventLevels,
  scoreCategories,
  eventId,
}: RankingSystemClientProps) {
  const [data, setData] = useState<RankingAward[]>(initialData)

  // Sync data with initialData from SSR
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  // --- MODAL STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAward, setSelectedAward] = useState<RankingAward | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- FORM STATES ---
  const [formName, setFormName] = useState("")
  const [formLimit, setFormLimit] = useState(3)
  const [formLevelIds, setFormLevelIds] = useState<string[]>([])
  const [formCategoryIds, setFormCategoryIds] = useState<string[]>([])

  const resetForm = () => {
    setFormName("")
    setFormLimit(3)
    setFormLevelIds([])
    setFormCategoryIds([])
  }

  const handleOpenAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (award: RankingAward) => {
    setSelectedAward(award)
    setFormName(award.name)
    setFormLimit(award.limit_rank)
    setFormLevelIds(award.event_level_ids)
    setFormCategoryIds(award.score_category_ids)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (award: RankingAward) => {
    setSelectedAward(award)
    setIsDeleteModalOpen(true)
  }

  const handleLevelToggle = (checked: boolean, id: string) => {
    if (checked) {
      setFormLevelIds((prev) => [...prev, id])
    } else {
      setFormLevelIds((prev) => prev.filter((k) => k !== id))
    }
  }

  // --- FAIRNESS RULE LOGIC ---
  // Only category names that exist in ALL selected levels
  const availableCategoryNames = useMemo(() => {
    if (formLevelIds.length === 0) return []

    const nameToLevelMap: Record<string, Set<string>> = {}
    scoreCategories.forEach((cat) => {
      if (formLevelIds.includes(cat.eventLevelId)) {
        if (!nameToLevelMap[cat.name]) nameToLevelMap[cat.name] = new Set()
        nameToLevelMap[cat.name].add(cat.eventLevelId)
      }
    })

    return Object.keys(nameToLevelMap).filter(
      (name) => nameToLevelMap[name].size === formLevelIds.length
    )
  }, [formLevelIds, scoreCategories])

  const handleCategoryNameToggle = (checked: boolean, name: string) => {
    const idsForName = scoreCategories
      .filter(
        (cat) => cat.name === name && formLevelIds.includes(cat.eventLevelId)
      )
      .map((cat) => cat.id)

    if (checked) {
      setFormCategoryIds((prev) => [...new Set([...prev, ...idsForName])])
    } else {
      setFormCategoryIds((prev) =>
        prev.filter((id) => !idsForName.includes(id))
      )
    }
  }

  const isCategoryNameChecked = (name: string) => {
    const idsForName = scoreCategories
      .filter(
        (cat) => cat.name === name && formLevelIds.includes(cat.eventLevelId)
      )
      .map((cat) => cat.id)

    return (
      idsForName.length > 0 &&
      idsForName.every((id) => formCategoryIds.includes(id))
    )
  }

  // --- HANDLERS: SUBMISSIONS (SSR Actions) ---

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Ensure only categories in the current intersection are sent
      const validIds = scoreCategories
        .filter(
          (cat) =>
            availableCategoryNames.includes(cat.name) &&
            formLevelIds.includes(cat.eventLevelId)
        )
        .map((cat) => cat.id)

      const submissionCategoryIds = formCategoryIds.filter((id) =>
        validIds.includes(id)
      )

      const result = await createRankingAwardAction(eventId, {
        name: formName,
        limit_rank: formLimit,
        score_category_ids: submissionCategoryIds,
        event_level_ids: formLevelIds,
      })

      if (result.success) {
        toast.success(result.message)
        setIsAddModalOpen(false)
        resetForm()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAward) return
    setIsSubmitting(true)
    try {
      const validIds = scoreCategories
        .filter(
          (cat) =>
            availableCategoryNames.includes(cat.name) &&
            formLevelIds.includes(cat.eventLevelId)
        )
        .map((cat) => cat.id)

      const submissionCategoryIds = formCategoryIds.filter((id) =>
        validIds.includes(id)
      )

      const result = await updateRankingAwardAction(eventId, selectedAward.id, {
        name: formName,
        limit_rank: formLimit,
        score_category_ids: submissionCategoryIds,
        event_level_ids: formLevelIds,
      })

      if (result.success) {
        toast.success(result.message)
        setIsEditModalOpen(false)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui data")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAward) return
    setIsSubmitting(true)
    try {
      const result = await deleteRankingAwardAction(eventId, selectedAward.id)

      if (result.success) {
        toast.success(result.message)
        setIsDeleteModalOpen(false)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-8">
      {/* MAIN LIST CARD */}
      <div className="flex flex-col gap-6 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-poppins text-lg font-medium text-slate-900">
            Daftar Konfigurasi Juara
          </h2>
          <Button
            onClick={handleOpenAddModal}
            variant="outline"
            className="rounded-full border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Tambah Juara
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {data.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center">
              <p className="font-poppins text-sm text-neutral-500">
                Belum ada peringkat juara yang dikonfigurasi.
              </p>
            </div>
          ) : (
            data.map((award) => (
              <div
                key={award.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-sky-200 sm:flex-row sm:items-center"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-poppins text-base font-medium text-neutral-700">
                      {award.name}
                    </span>
                    <div className="flex gap-1">
                      {award.levels?.map((lvl) => (
                        <Badge
                          key={lvl.id}
                          variant="secondary"
                          className="h-5 px-2 text-[10px] font-medium"
                        >
                          {getLevelLabel(lvl.name)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <span className="font-poppins text-xs leading-relaxed font-normal text-neutral-500">
                    Urutan: {generateUrutanString(award.limit_rank)}{" "}
                    &nbsp;|&nbsp; Kategori:{" "}
                    {award.score_categories
                      ? Array.from(
                          new Set(award.score_categories.map((c) => c.name))
                        ).join(" + ")
                      : "-"}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEditModal(award)}
                    className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDeleteModal(award)}
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODALS */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
          }
        }}
      >
        <DialogContent className="max-h-[90vh] w-full max-w-xl gap-0 overflow-y-auto rounded-3xl p-0 sm:rounded-[32px]">
          <form
            onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit}
            className="flex flex-col"
          >
            <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
              <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                {isEditModalOpen
                  ? "Edit Peringkat Juara"
                  : "Tambah Peringkat Juara"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6 p-6 sm:p-10">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nama Juara</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Misal: Juara Umum"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="limit">Jumlah Urutan</Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  value={formLimit}
                  onChange={(e) => setFormLimit(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-blue-500">
                  Akan menghasilkan: {generateUrutanString(formLimit)}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Label>Jenjang Juara</Label>
                <div className="flex flex-wrap gap-4">
                  {eventLevels.map((lvl) => (
                    <div key={lvl.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lvl-${lvl.id}`}
                        checked={formLevelIds.includes(lvl.id)}
                        onCheckedChange={(checked) =>
                          handleLevelToggle(checked as boolean, lvl.id)
                        }
                      />
                      <Label
                        htmlFor={`lvl-${lvl.id}`}
                        className="cursor-pointer font-normal"
                      >
                        {getLevelLabel(lvl.name)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label>Kategori Penilaian yang Dihitung</Label>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-amber-600"
                  >
                    Fairness Rule Active
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {availableCategoryNames.map((name) => (
                    <div key={name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${name}`}
                        checked={isCategoryNameChecked(name)}
                        onCheckedChange={(checked) =>
                          handleCategoryNameToggle(checked as boolean, name)
                        }
                      />
                      <Label
                        htmlFor={`cat-${name}`}
                        className="cursor-pointer font-normal"
                      >
                        {name}
                      </Label>
                    </div>
                  ))}
                </div>
                {availableCategoryNames.length === 0 && (
                  <p className="text-xs text-amber-600 italic">
                    {formLevelIds.length === 0
                      ? "Pilih jenjang terlebih dahulu."
                      : "Tidak ada kategori yang sama di semua jenjang terpilih."}
                  </p>
                )}
                {formLevelIds.length > 1 && (
                  <p className="text-[10px] text-muted-foreground">
                    * Menampilkan kategori yang tersedia di seluruh{" "}
                    {formLevelIds.length} jenjang terpilih.
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setIsEditModalOpen(false)
                  }}
                  className="flex-1 rounded-full"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || !formName || formLevelIds.length === 0
                  }
                  className="flex-1 rounded-full bg-red-400 hover:bg-red-500"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
          <form onSubmit={handleDeleteSubmit} className="flex flex-col">
            <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
              <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                Konfirmasi Hapus
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-8 p-6 sm:p-10">
              <p className="text-center text-sm text-neutral-600">
                Yakin ingin menghapus juara{" "}
                <span className="font-semibold text-red-500">
                  {selectedAward?.name}
                </span>
                ?
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-full"
                  >
                    Batal
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-red-500 hover:bg-red-600"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Hapus"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
