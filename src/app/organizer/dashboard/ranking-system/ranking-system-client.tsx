"use client"

import React, { useState } from "react"
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react"

// --- SHADCN UI COMPONENTS ---
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  limitRank: number
  scoreCategoryIds: string[]
  eventLevelId: string
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
  const [activeLevelId, setActiveLevelId] = useState<string>(
    eventLevels[0]?.id || ""
  )

  // --- MODAL STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAward, setSelectedAward] = useState<RankingAward | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- FORM STATES ---
  const [formName, setFormName] = useState("")
  const [formLimit, setFormLimit] = useState(3)
  const [formCategoryIds, setFormCategoryIds] = useState<string[]>([])

  const resetForm = () => {
    setFormName("")
    setFormLimit(3)
    setFormCategoryIds([])
  }

  const handleOpenAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (award: RankingAward) => {
    setSelectedAward(award)
    setFormName(award.name)
    setFormLimit(award.limitRank)
    setFormCategoryIds(award.scoreCategoryIds)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (award: RankingAward) => {
    setSelectedAward(award)
    setIsDeleteModalOpen(true)
  }

  const handleCategoryToggle = (checked: boolean, id: string) => {
    if (checked) setFormCategoryIds((prev) => [...prev, id])
    else setFormCategoryIds((prev) => prev.filter((k) => k !== id))
  }

  // Filter categories by active level
  const activeLevelCategories = scoreCategories.filter(
    (c) => c.eventLevelId === activeLevelId
  )

  // Filter awards by active level
  const currentLevelAwards = data.filter(
    (a) => a.eventLevelId === activeLevelId
  )

  // --- HANDLERS: SUBMISSIONS (SSR Actions) ---

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await createRankingAwardAction(eventId, {
        name: formName,
        limit_rank: formLimit,
        score_category_ids: formCategoryIds,
        event_level_id: activeLevelId,
      })

      if (result.success) {
        toast.success(result.message)
        // Sementara update local state karena backend award belum ada
        const newAward: RankingAward = {
          id: Math.random().toString(36).substr(2, 9),
          name: formName,
          limitRank: formLimit,
          scoreCategoryIds: formCategoryIds,
          eventLevelId: activeLevelId,
        }
        setData((prev) => [...prev, newAward])
        setIsAddModalOpen(false)
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
      const result = await updateRankingAwardAction(eventId, selectedAward.id, {
        name: formName,
        limit_rank: formLimit,
        score_category_ids: formCategoryIds,
        event_level_id: activeLevelId,
      })

      if (result.success) {
        toast.success(result.message)
        setData((prev) =>
          prev.map((a) =>
            a.id === selectedAward.id
              ? {
                  ...a,
                  name: formName,
                  limitRank: formLimit,
                  scoreCategoryIds: formCategoryIds,
                }
              : a
          )
        )
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
        setData((prev) => prev.filter((a) => a.id !== selectedAward.id))
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
      {/* PILIH JENJANG TINGKAT */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <span className="font-poppins text-sm font-medium text-slate-900">
          Pilih Jenjang Tingkat:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {eventLevels.map((level) => (
            <Button
              key={level.id}
              variant={activeLevelId === level.id ? "default" : "outline"}
              onClick={() => setActiveLevelId(level.id)}
              className={cn(
                "h-9 rounded-lg px-4 py-2 font-poppins text-sm",
                activeLevelId === level.id
                  ? "border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
                  : "border-gray-200 bg-white text-zinc-600 hover:bg-gray-50"
              )}
            >
              {level.name}
            </Button>
          ))}
        </div>
      </div>

      {/* MAIN LIST CARD */}
      <div className="flex flex-col gap-6 rounded-2xl border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-poppins text-lg font-medium text-slate-900">
            Konfigurasi Juara{" "}
            {eventLevels.find((l) => l.id === activeLevelId)?.name}
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
          {currentLevelAwards.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center">
              <p className="font-poppins text-sm text-neutral-500">
                Belum ada peringkat juara yang dikonfigurasi.
              </p>
            </div>
          ) : (
            currentLevelAwards.map((award) => (
              <div
                key={award.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-sky-200 sm:flex-row sm:items-center"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="font-poppins text-base font-medium text-neutral-700">
                    {award.name}
                  </span>
                  <span className="font-poppins text-xs leading-relaxed font-normal text-neutral-500">
                    Urutan: {generateUrutanString(award.limitRank)}{" "}
                    &nbsp;|&nbsp; Kategori:{" "}
                    {scoreCategories
                      .filter((c) => award.scoreCategoryIds.includes(c.id))
                      .map((c) => c.name)
                      .join(" + ")}
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
                <Label>Kategori Penilaian yang Dihitung</Label>
                <div className="grid grid-cols-2 gap-4">
                  {activeLevelCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={formCategoryIds.includes(cat.id)}
                        onCheckedChange={(checked) =>
                          handleCategoryToggle(checked as boolean, cat.id)
                        }
                      />
                      <Label
                        htmlFor={`cat-${cat.id}`}
                        className="cursor-pointer font-normal"
                      >
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {activeLevelCategories.length === 0 && (
                  <p className="text-xs text-amber-600 italic">
                    Belum ada kategori penilaian di jenjang ini.
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
                    isSubmitting || !formName || formCategoryIds.length === 0
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
