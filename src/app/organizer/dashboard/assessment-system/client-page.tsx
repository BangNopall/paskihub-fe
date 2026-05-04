"use client"

import React, { useState, useEffect } from "react"
import { Pencil, Plus, Trash2, Loader2, X } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { getLevelLabel } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  UnifiedAssessment,
  ViolationType,
  ScoreCategory,
  ScoreSubCategory,
} from "@/schemas/assessment.schema"
import {
  createViolationAction,
  updateViolationAction,
  deleteViolationAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  createSubCategoryAction,
  updateSubCategoryAction,
  deleteSubCategoryAction,
} from "@/actions/assessment.actions"

// ==========================================
// 1. CONSTANTS
// ==========================================

const GRADE_CONFIG = [
  { key: "Kurang", label: "Kurang", bgColor: "bg-red-400 hover:bg-red-500" },
  { key: "Cukup", label: "Cukup", bgColor: "bg-amber-400 hover:bg-amber-500" },
  { key: "Baik", label: "Baik", bgColor: "bg-green-400 hover:bg-green-500" },
  {
    key: "Sangat Baik",
    label: "Sangat Baik",
    bgColor: "bg-blue-400 hover:bg-blue-500",
  },
] as const

type GradeKey = (typeof GRADE_CONFIG)[number]["key"]

interface AssessmentSystemClientProps {
  eventId: string
  levels: { id: string; name: string }[]
  activeLevelId: string
  initialData: UnifiedAssessment
}

// ==========================================
// 2. MAIN CLIENT COMPONENT
// ==========================================

export default function AssessmentSystemClient({
  eventId,
  levels,
  activeLevelId,
  initialData,
}: AssessmentSystemClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleLevelChange = (levelId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("level", levelId)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* --- SECTION 1: PELANGGARAN --- */}
      <ViolationsSection
        eventId={eventId}
        levelId={activeLevelId}
        violations={initialData.violations}
      />

      {/* --- SECTION 2: KATEGORI & SUB KATEGORI PENILAIAN --- */}
      <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6">
        {/* PILIH JENJANG TINGKAT */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <span className="font-poppins text-sm font-medium text-slate-900">
            Pilih Jenjang Tingkat:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {levels.map((level) => (
              <Button
                key={level.id}
                variant={activeLevelId === level.id ? "default" : "outline"}
                onClick={() => handleLevelChange(level.id)}
                className={cn(
                  "h-9 rounded-lg px-4 py-2 font-poppins text-sm transition-all",
                  activeLevelId === level.id
                    ? "border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
                    : "border-gray-200 bg-white text-zinc-600 hover:bg-gray-50"
                )}
              >
                {getLevelLabel(level.name)}
              </Button>
            ))}
          </div>
        </div>

        {/* CATEGORIES SECTION */}
        <CategoriesSection
          eventId={eventId}
          levelId={activeLevelId}
          categories={initialData.categories}
        />
      </div>
    </div>
  )
}

// ==========================================
// 3. COMPONENTS: VIOLATIONS SECTION
// ==========================================

function ViolationsSection({
  eventId,
  levelId,
  violations,
}: {
  eventId: string
  levelId: string
  violations: ViolationType[]
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedViolation, setSelectedViolation] =
    useState<ViolationType | null>(null)

  const [formName, setFormName] = useState("")
  const [formPoints, setFormPoints] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenModal = (violation?: ViolationType) => {
    if (violation) {
      setSelectedViolation(violation)
      setFormName(violation.name)
      setFormPoints(violation.point.toString())
    } else {
      setSelectedViolation(null)
      setFormName("")
      setFormPoints("")
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      name: formName,
      point: Number(formPoints),
      event_level_id: levelId,
    }

    let res
    if (selectedViolation) {
      res = await updateViolationAction(eventId, selectedViolation.id, payload)
    } else {
      res = await createViolationAction(eventId, payload)
    }

    setIsSubmitting(false)
    if (res.success) {
      toast.success(res.message)
      setIsModalOpen(false)
    } else {
      toast.error(res.message)
    }
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedViolation) return
    setIsSubmitting(true)

    const res = await deleteViolationAction(eventId, selectedViolation.id)

    setIsSubmitting(false)
    if (res.success) {
      toast.success(res.message)
      setIsDeleteModalOpen(false)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-4 shadow-sm backdrop-blur-md md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-poppins text-lg font-medium text-slate-900">
          Pelanggaran
        </h2>
        <Button
          onClick={() => handleOpenModal()}
          variant="outline"
          className="rounded-full border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Tambah Pelanggaran
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {violations.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white py-8 text-center font-poppins text-sm text-neutral-500">
            Belum ada data pelanggaran.
          </div>
        ) : (
          violations.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:border-sky-200 sm:p-6"
            >
              <div className="flex flex-col gap-1">
                <span className="font-poppins text-base font-medium text-neutral-700">
                  {v.name}
                </span>
                <span className="font-poppins text-xs text-neutral-500">
                  Pengurangan{" "}
                  <span className="font-medium text-red-500">
                    {v.point} poin
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenModal(v)}
                  className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedViolation(v)
                    setIsDeleteModalOpen(true)
                  }}
                  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL TAMBAH/EDIT */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
              <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                {selectedViolation ? "Edit Pelanggaran" : "Tambah Pelanggaran"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6 p-6 sm:p-10">
              <div className="flex flex-col gap-2">
                <Label className="font-poppins text-sm text-neutral-500">
                  Nama Pelanggaran
                </Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Masukkan Nama Pelanggaran"
                  className="h-12 bg-white"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-poppins text-sm text-neutral-500">
                  Poin Pelanggaran
                </Label>
                <Input
                  type="number"
                  value={formPoints}
                  onChange={(e) => setFormPoints(e.target.value)}
                  placeholder="Contoh: 5"
                  className="h-12 bg-white"
                  required
                />
                <span className="font-poppins text-xs text-neutral-400">
                  Poin yang akan dikurangi dari total skor
                </span>
              </div>
              <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
                  >
                    Batal
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 flex-1 rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL HAPUS */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
          <form onSubmit={handleDelete} className="flex flex-col">
            <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
              <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                Konfirmasi Hapus
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-8 p-6 sm:p-10">
              <p className="text-center font-poppins text-sm text-neutral-600">
                Apakah Anda yakin hapus pelanggaran <br />
                <span className="font-semibold text-red-500">
                  {selectedViolation?.name}
                </span>
                ?
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
                  >
                    Batal
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 flex-1 rounded-full bg-red-500 font-poppins text-base font-bold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
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

// ==========================================
// 4. COMPONENTS: CATEGORIES & SUBCATEGORIES
// ==========================================

function CategoriesSection({
  eventId,
  levelId,
  categories,
}: {
  eventId: string
  levelId: string
  categories: ScoreCategory[]
}) {
  // -- Kategori Modal State --
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [catName, setCatName] = useState("")
  const [selectedCat, setSelectedCat] = useState<ScoreCategory | null>(null)

  const [isDeleteCatModalOpen, setIsDeleteCatModalOpen] = useState(false)
  const [catToDelete, setCatToDelete] = useState<ScoreCategory | null>(null)

  // -- Sub Kategori Modal State --
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)
  const [targetCatId, setTargetCatId] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<ScoreSubCategory | null>(null)

  const [isDeleteSubModalOpen, setIsDeleteSubModalOpen] = useState(false)
  const [subToDelete, setSubToDelete] = useState<{
    catId: string
    sub: ScoreSubCategory
  } | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Handlers Kategori ---
  const handleAddCategory = () => {
    setSelectedCat(null)
    setCatName("")
    setIsCatModalOpen(true)
  }

  const handleEditCategory = (cat: ScoreCategory) => {
    setSelectedCat(cat)
    setCatName(cat.name)
    setIsCatModalOpen(true)
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      name: catName,
      event_level_id: levelId,
    }

    let res
    if (selectedCat) {
      res = await updateCategoryAction(eventId, selectedCat.id, payload)
    } else {
      res = await createCategoryAction(eventId, payload)
    }

    setIsSubmitting(false)
    if (res.success) {
      toast.success(res.message)
      setIsCatModalOpen(false)
    } else {
      toast.error(res.message)
    }
  }

  const confirmDeleteCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catToDelete) return
    setIsSubmitting(true)

    const res = await deleteCategoryAction(eventId, catToDelete.id)

    setIsSubmitting(false)
    if (res.success) {
      toast.success(res.message)
      setIsDeleteCatModalOpen(false)
    } else {
      toast.error(res.message)
    }
  }

  // --- Handlers Sub-Kategori ---
  const handleOpenSubModal = (catId: string, sub?: ScoreSubCategory) => {
    setTargetCatId(catId)
    setSelectedSub(sub || null)
    setIsSubModalOpen(true)
  }

  const handleSaveSubCategory = async (catId: string, subPayload: any) => {
    let res
    if (selectedSub) {
      res = await updateSubCategoryAction(eventId, selectedSub.id, subPayload)
    } else {
      res = await createSubCategoryAction(eventId, subPayload)
    }

    if (res.success) {
      toast.success(res.message)
      setIsSubModalOpen(false)
    } else {
      toast.error(res.message)
    }
  }

  const confirmDeleteSubCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subToDelete) return
    setIsSubmitting(true)

    const res = await deleteSubCategoryAction(eventId, subToDelete.sub.id)

    setIsSubmitting(false)
    if (res.success) {
      toast.success(res.message)
      setIsDeleteSubModalOpen(false)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-poppins text-lg font-medium text-slate-900">
          Kategori dan Sub Kategori Penilaian
        </h2>
        <Button
          onClick={handleAddCategory}
          variant="outline"
          className="rounded-full border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-10 text-center font-poppins text-sm text-neutral-500">
          Belum ada kategori.
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={[categories[0]?.id]}
          className="w-full space-y-4"
        >
          {categories.map((cat) => {
            const totalScore =
              cat.sub_categories?.reduce(
                (acc, curr) => acc + curr.max_score,
                0
              ) || 0
            return (
              <AccordionItem
                key={cat.id}
                value={cat.id}
                className="overflow-hidden rounded-2xl border-none bg-white shadow-sm"
              >
                <div className="flex w-full items-center border border-sky-100 bg-sky-100/50 transition-colors">
                  <AccordionTrigger className="flex-1 px-4 py-4 hover:no-underline sm:px-6 sm:py-5">
                    <div className="flex flex-col gap-1 text-left sm:flex-row sm:items-center sm:gap-3">
                      <span className="font-poppins text-base font-medium text-neutral-800">
                        {cat.name}
                      </span>
                      <Separator
                        orientation="vertical"
                        className="hidden h-5 w-px bg-neutral-400 sm:block"
                      />
                      <span className="font-poppins text-xs font-normal text-neutral-500">
                        {cat.sub_categories?.length || 0} Sub-Kategori | Total:{" "}
                        {totalScore} poin
                      </span>
                    </div>
                  </AccordionTrigger>
                  <div className="flex items-center gap-1 pr-4 sm:pr-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCategory(cat)
                      }}
                      className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCatToDelete(cat)
                        setIsDeleteCatModalOpen(true)
                      }}
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <AccordionContent className="h-full border-x border-b border-gray-100 bg-gray-50/50 pb-0">
                  <div className="flex w-full flex-col gap-4 p-4 sm:p-6">
                    {!cat.sub_categories || cat.sub_categories.length === 0 ? (
                      <div className="py-4 text-center font-poppins text-sm text-neutral-500">
                        Belum ada sub-kategori.
                      </div>
                    ) : (
                      cat.sub_categories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:border-sky-200 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="font-poppins text-sm font-semibold text-neutral-800">
                                {sub.name}
                              </span>
                              <span className="font-poppins text-xs text-neutral-500">
                                Skor maksimal:{" "}
                                <span className="font-medium text-blue-500">
                                  {sub.max_score} poin
                                </span>
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {GRADE_CONFIG.map(({ key, label, bgColor }) => {
                                const ranges = sub.grades?.[key]
                                if (!ranges) return null
                                const rangeText = ranges.join(", ")
                                return (
                                  <Badge
                                    key={key}
                                    className={`${bgColor} rounded-full px-2.5 py-0.5 font-poppins font-medium text-white`}
                                  >
                                    {label}: {rangeText}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenSubModal(cat.id, sub)}
                              className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSubToDelete({ catId: cat.id, sub })
                                setIsDeleteSubModalOpen(true)
                              }}
                              className="h-8 w-8 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}

                    <div className="mt-2">
                      <Button
                        onClick={() => handleOpenSubModal(cat.id)}
                        variant="outline"
                        className="w-full rounded-full border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600 sm:w-auto"
                      >
                        <Plus className="mr-1.5 h-4 w-4" /> Tambah Sub-Kategori
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}

      {/* --- MODAL AREA (KATEGORI & SUB KATEGORI) --- */}

      {/* Modal Tambah/Edit Kategori */}
      <Dialog open={isCatModalOpen} onOpenChange={setIsCatModalOpen}>
        <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
          <form
            onSubmit={handleSaveCategory}
            className="flex flex-col gap-8 p-6 sm:p-10"
          >
            <DialogHeader>
              <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                {selectedCat ? "Edit Kategori" : "Tambah Kategori"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label className="font-poppins text-sm text-neutral-600">
                Nama Kategori
              </Label>
              <Input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Contoh: PBB Dasar"
                required
                className="h-12 bg-white font-poppins focus-visible:ring-sky-200"
              />
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
                >
                  Batal
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting || !catName.trim()}
                className="h-12 flex-1 rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Kategori */}
      <Dialog
        open={isDeleteCatModalOpen}
        onOpenChange={setIsDeleteCatModalOpen}
      >
        <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
          <form onSubmit={confirmDeleteCategory} className="flex flex-col">
            <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
              <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                Konfirmasi Hapus
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-8 p-6 sm:p-10">
              <p className="text-center font-poppins text-sm text-neutral-600">
                Apakah Anda yakin hapus kategori <br />
                <span className="font-semibold text-red-500">
                  {catToDelete?.name}
                </span>
                ?
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
                  >
                    Batal
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 flex-1 rounded-full bg-red-500 font-poppins text-base font-bold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Hapus"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Sub Kategori */}
      <Dialog
        open={isDeleteSubModalOpen}
        onOpenChange={setIsDeleteSubModalOpen}
      >
        <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
          <form onSubmit={confirmDeleteSubCategory} className="flex flex-col">
            <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
              <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                Konfirmasi Hapus
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-8 p-6 sm:p-10">
              <p className="text-center font-poppins text-sm text-neutral-600">
                Apakah Anda yakin hapus sub-kategori <br />
                <span className="font-semibold text-red-500">
                  {subToDelete?.sub.name}
                </span>
                ?
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
                  >
                    Batal
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 flex-1 rounded-full bg-red-500 font-poppins text-base font-bold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Hapus"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Tambah/Edit Sub Kategori */}
      <SubCategoryFormModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        catId={targetCatId}
        subCategory={selectedSub}
        onSave={handleSaveSubCategory}
      />
    </div>
  )
}

// ==========================================
// 5. COMPLEX FORM: SUB CATEGORY MODAL
// ==========================================

function SubCategoryFormModal({
  isOpen,
  onClose,
  catId,
  subCategory,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  catId: string | null
  subCategory: ScoreSubCategory | null
  onSave: (catId: string, payload: any) => Promise<void>
}) {
  const [name, setName] = useState("")
  const [grades, setGrades] = useState<Record<string, string[]>>({
    Kurang: [""],
    Cukup: [""],
    Baik: [""],
    "Sangat Baik": [""],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-populate / Reset form
  useEffect(() => {
    if (isOpen) {
      if (subCategory) {
        setName(subCategory.name)
        setGrades({
          Kurang: subCategory.grades?.["Kurang"] || [""],
          Cukup: subCategory.grades?.["Cukup"] || [""],
          Baik: subCategory.grades?.["Baik"] || [""],
          "Sangat Baik": subCategory.grades?.["Sangat Baik"] || [""],
        })
      } else {
        setName("")
        setGrades({
          Kurang: [""],
          Cukup: [""],
          Baik: [""],
          "Sangat Baik": [""],
        })
      }
    }
  }, [isOpen, subCategory])

  const handleInputChange = (grade: string, index: number, value: string) => {
    if (value.length > 5) return // Format maks "xx-xx"
    setGrades((prev) => {
      const newCodes = [...prev[grade]]
      newCodes[index] = value
      return { ...prev, [grade]: newCodes }
    })
  }

  const handleAddInput = (grade: string) => {
    setGrades((prev) =>
      prev[grade].length < 5 ? { ...prev, [grade]: [...prev[grade], ""] } : prev
    )
  }

  const handleRemoveInput = (grade: string, index: number) => {
    setGrades((prev) =>
      prev[grade].length > 1
        ? { ...prev, [grade]: prev[grade].filter((_, i) => i !== index) }
        : prev
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !catId) return
    setIsSubmitting(true)

    // Auto-calculate Max Score based on all inputted grades
    let calculatedMax = 0
    Object.values(grades)
      .flat()
      .forEach((range) => {
        range.split(/[-~]/).forEach((numStr) => {
          const num = parseInt(numStr.trim(), 10)
          if (!isNaN(num) && num > calculatedMax) calculatedMax = num
        })
      })

    const payload = {
      score_categories_id: catId,
      name,
      max_score: calculatedMax,
      grades,
    }

    await onSave(catId, payload)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-full max-w-xl gap-0 overflow-y-auto rounded-3xl p-0 sm:rounded-[32px]">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="p-6 pb-2 sm:px-10 sm:pt-10">
            <DialogTitle className="font-montserrat text-xl font-bold text-neutral-800 sm:text-2xl">
              {subCategory ? "Edit Sub-Kategori" : "Tambah Sub-Kategori"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col px-6 pb-6 sm:px-10 sm:pb-10">
            <Tabs defaultValue="name" className="mt-4 w-full">
              <TabsList className="h-12 w-full rounded-xl bg-slate-100 p-1">
                <TabsTrigger
                  value="name"
                  className="w-1/2 rounded-lg font-poppins text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Informasi
                </TabsTrigger>
                <TabsTrigger
                  value="grade"
                  className="w-1/2 rounded-lg font-poppins text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Rentang Nilai (Grade)
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="name"
                className="mt-6 flex flex-col gap-6 outline-none"
              >
                <div className="flex flex-col gap-2">
                  <Label className="font-poppins text-sm text-neutral-600">
                    Nama Sub-Kategori
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Gerakan di Tempat"
                    required
                    className="h-12 bg-white focus-visible:ring-sky-200"
                  />
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <span className="font-poppins text-sm text-blue-600">
                    <span className="font-semibold">Info:</span> Skor maksimal
                    akan dihitung otomatis berdasarkan rentang nilai tertinggi
                    yang Anda masukkan di tab Grade.
                  </span>
                </div>
              </TabsContent>

              <TabsContent
                value="grade"
                className="mt-6 flex flex-col gap-8 outline-none"
              >
                <div className="font-poppins text-sm text-neutral-500">
                  Masukkan rentang nilai untuk setiap grade (Contoh: 0-10)
                </div>
                {GRADE_CONFIG.map(({ key, label, bgColor }) => (
                  <div key={key} className="flex flex-col gap-3">
                    <Badge
                      variant="secondary"
                      className={cn(
                        bgColor,
                        "w-max rounded-full px-4 py-1.5 font-poppins text-sm font-medium text-white hover:opacity-90"
                      )}
                    >
                      {label}
                    </Badge>
                    <div className="flex flex-wrap items-center gap-3">
                      {grades[key].map((code, index) => (
                        <div key={index} className="relative">
                          <Input
                            type="text"
                            maxLength={5}
                            value={code}
                            onChange={(e) =>
                              handleInputChange(key, index, e.target.value)
                            }
                            placeholder="0-10"
                            className="h-11 w-20 rounded-xl border-neutral-300 bg-neutral-50 text-center font-poppins text-sm font-semibold text-neutral-900 focus-visible:ring-sky-200"
                            required
                          />
                          {grades[key].length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveInput(key, index)}
                              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 transition-colors hover:bg-red-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      {grades[key].length < 6 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddInput(key)}
                          className="h-11 w-11 shrink-0 rounded-xl border-dashed border-neutral-300 text-neutral-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 flex-1 rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
