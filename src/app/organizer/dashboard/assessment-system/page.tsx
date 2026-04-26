"use client"

import React, { useState, useEffect } from "react"
import { Pencil, Plus, Trash2, Loader2, AlertCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready)
// ==========================================

export interface Violation {
  id: string
  name: string
  penaltyPoints: number
}

export type GradeKey = "kurang" | "cukup" | "baik" | "sangatBaik"

export interface SubCategory {
  id: string
  title: string
  maxScore: number // Akan dikalkulasi otomatis
  grades: Record<GradeKey, string[]>
}

export interface AssessmentCategory {
  id: string
  name: string
  totalScore: number // Akan dikalkulasi otomatis dari sub-kategori
  subCategories: SubCategory[]
}

export interface AssessmentSystemData {
  violations: Violation[]
  categories: AssessmentCategory[]
}

// ==========================================
// 2. CONSTANTS & MOCK DATA
// ==========================================

const GRADE_CONFIG = [
  { key: "kurang", label: "Kurang", bgColor: "bg-red-400 hover:bg-red-500" },
  { key: "cukup", label: "Cukup", bgColor: "bg-amber-400 hover:bg-amber-500" },
  { key: "baik", label: "Baik", bgColor: "bg-green-400 hover:bg-green-500" },
  {
    key: "sangatBaik",
    label: "Sangat Baik",
    bgColor: "bg-blue-400 hover:bg-blue-500",
  },
] as const

const JENJANG_OPTIONS = [
  { label: "SD", count: 12 },
  { label: "SMP", count: 10 },
  { label: "SMA", count: 15 },
  { label: "PURNA", count: 5 },
  { label: "UMUM", count: 3 },
]

const MOCK_DATA: AssessmentSystemData = {
  violations: [
    { id: "v1", name: "Tidak Seragam", penaltyPoints: 5 },
    { id: "v2", name: "Keluar dari Formasi", penaltyPoints: 3 },
    { id: "v3", name: "Tidak Kompak", penaltyPoints: 2 },
  ],
  categories: [
    {
      id: "c1",
      name: "PBB (Peraturan Baris Berbaris)",
      totalScore: 100,
      subCategories: [
        {
          id: "sc1",
          title: "Gerakan di Tempat",
          maxScore: 40,
          grades: {
            kurang: ["0-10"],
            cukup: ["11-20"],
            baik: ["21-30"],
            sangatBaik: ["31-40"],
          },
        },
        {
          id: "sc2",
          title: "Langkah Tegap",
          maxScore: 40,
          grades: {
            kurang: ["0-10"],
            cukup: ["11-20"],
            baik: ["21-30"],
            sangatBaik: ["31-40"],
          },
        },
        {
          id: "sc3",
          title: "Kerapian",
          maxScore: 20,
          grades: {
            kurang: ["0-10"],
            cukup: ["11-20"],
            baik: ["21-30"],
            sangatBaik: ["31-40"],
          },
        },
      ],
    },
    {
      id: "c2",
      name: "Danton (Komando)",
      totalScore: 50,
      subCategories: [],
    },
    {
      id: "c3",
      name: "Variasi",
      totalScore: 100,
      subCategories: [],
    },
  ],
}

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================

export default function AssessmentSystemPage() {
  const [data, setData] = useState<AssessmentSystemData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [activeJenjang, setActiveJenjang] = useState<string>("SMA") // Default aktif

  // --- API SIMULATION (FETCH DATA) ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/organizer/assessment-system?jenjang={activeJenjang} di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setData(MOCK_DATA)
      } catch (error) {
        console.error("Gagal memuat data sistem penilaian:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [activeJenjang]) // Akan fetch ulang jika jenjang berubah

  // --- ERROR STATE UI ---
  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data
        </h2>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
          Sistem Penilaian
        </h1>

        {isLoading || !data ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* --- SECTION 1: PELANGGARAN --- */}
            <ViolationsSection
              violations={data.violations}
              onUpdate={(updatedViolations) =>
                setData({ ...data, violations: updatedViolations })
              }
            />

            {/* --- SECTION 2: KATEGORI & SUB KATEGORI PENILAIAN --- */}
            <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6">
              {/* PILIH JENJANG TINGKAT */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <span className="font-poppins text-sm font-medium text-slate-900">
                  Pilih Jenjang Tingkat:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {JENJANG_OPTIONS.map((jenjang) => (
                    <Button
                      key={jenjang.label}
                      variant={
                        activeJenjang === jenjang.label ? "default" : "outline"
                      }
                      onClick={() => setActiveJenjang(jenjang.label)}
                      className={cn(
                        "h-9 rounded-lg px-4 py-2 font-poppins text-sm",
                        activeJenjang === jenjang.label
                          ? "border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
                          : "border-gray-200 bg-white text-zinc-600 hover:bg-gray-50"
                      )}
                    >
                      {jenjang.label} ({jenjang.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* CATEGORIES SECTION */}
              <CategoriesSection
                categories={data.categories}
                onUpdate={(updatedCategories) =>
                  setData({ ...data, categories: updatedCategories })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 4. COMPONENTS: VIOLATIONS SECTION
// ==========================================

function ViolationsSection({
  violations,
  onUpdate,
}: {
  violations: Violation[]
  onUpdate: (v: Violation[]) => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null
  )

  const [formName, setFormName] = useState("")
  const [formPoints, setFormPoints] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenModal = (violation?: Violation) => {
    if (violation) {
      setSelectedViolation(violation)
      setFormName(violation.name)
      setFormPoints(violation.penaltyPoints.toString())
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
    try {
      // TODO: API POST / PUT /api/organizer/assessment-system/violations
      await new Promise((res) => setTimeout(res, 1000))

      if (selectedViolation) {
        onUpdate(
          violations.map((v) =>
            v.id === selectedViolation.id
              ? { ...v, name: formName, penaltyPoints: Number(formPoints) }
              : v
          )
        )
      } else {
        const newViolation: Violation = {
          id: `v-${Date.now()}`,
          name: formName,
          penaltyPoints: Number(formPoints),
        }
        onUpdate([...violations, newViolation])
      }
      setIsModalOpen(false)
    } catch (error) {
      alert("Terjadi kesalahan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedViolation) return
    setIsSubmitting(true)
    try {
      // TODO: API DELETE /api/organizer/assessment-system/violations/{id}
      await new Promise((res) => setTimeout(res, 1000))
      onUpdate(violations.filter((v) => v.id !== selectedViolation.id))
      setIsDeleteModalOpen(false)
    } catch (error) {
      alert("Terjadi kesalahan.")
    } finally {
      setIsSubmitting(false)
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
                    {v.penaltyPoints} poin
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
// 5. COMPONENTS: CATEGORIES & SUBCATEGORIES
// ==========================================

function CategoriesSection({
  categories,
  onUpdate,
}: {
  categories: AssessmentCategory[]
  onUpdate: (c: AssessmentCategory[]) => void
}) {
  // -- Kategori Modal State --
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [catName, setCatName] = useState("")
  const [selectedCat, setSelectedCat] = useState<AssessmentCategory | null>(
    null
  )

  const [isDeleteCatModalOpen, setIsDeleteCatModalOpen] = useState(false)
  const [catToDelete, setCatToDelete] = useState<AssessmentCategory | null>(
    null
  )

  // -- Sub Kategori Modal State --
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)
  const [targetCatId, setTargetCatId] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<SubCategory | null>(null)

  const [isDeleteSubModalOpen, setIsDeleteSubModalOpen] = useState(false)
  const [subToDelete, setSubToDelete] = useState<{
    catId: string
    sub: SubCategory
  } | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Handlers Kategori ---
  const handleAddCategory = () => {
    setSelectedCat(null)
    setCatName("")
    setIsCatModalOpen(true)
  }

  const handleEditCategory = (cat: AssessmentCategory) => {
    setSelectedCat(cat)
    setCatName(cat.name)
    setIsCatModalOpen(true)
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await new Promise((res) => setTimeout(res, 500))
      if (selectedCat) {
        onUpdate(
          categories.map((c) =>
            c.id === selectedCat.id ? { ...c, name: catName } : c
          )
        )
      } else {
        onUpdate([
          ...categories,
          {
            id: `c-${Date.now()}`,
            name: catName,
            totalScore: 0,
            subCategories: [],
          },
        ])
      }
      setIsCatModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDeleteCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catToDelete) return
    setIsSubmitting(true)
    try {
      await new Promise((res) => setTimeout(res, 500))
      onUpdate(categories.filter((c) => c.id !== catToDelete.id))
      setIsDeleteCatModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Handlers Sub-Kategori ---
  const handleOpenSubModal = (catId: string, sub?: SubCategory) => {
    setTargetCatId(catId)
    setSelectedSub(sub || null)
    setIsSubModalOpen(true)
  }

  const handleSaveSubCategory = async (
    catId: string,
    subCategory: SubCategory
  ) => {
    await new Promise((res) => setTimeout(res, 500))
    const updatedCategories = categories.map((c) => {
      if (c.id === catId) {
        const exists = c.subCategories.find((s) => s.id === subCategory.id)
        const newSubs = exists
          ? c.subCategories.map((s) =>
              s.id === subCategory.id ? subCategory : s
            )
          : [...c.subCategories, subCategory]

        // Akumulasi ulang total score
        const newTotal = newSubs.reduce((acc, curr) => acc + curr.maxScore, 0)
        return { ...c, subCategories: newSubs, totalScore: newTotal }
      }
      return c
    })
    onUpdate(updatedCategories)
    setIsSubModalOpen(false)
  }

  const confirmDeleteSubCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subToDelete) return
    setIsSubmitting(true)
    try {
      await new Promise((res) => setTimeout(res, 500))
      const updatedCategories = categories.map((c) => {
        if (c.id === subToDelete.catId) {
          const newSubs = c.subCategories.filter(
            (s) => s.id !== subToDelete.sub.id
          )
          // Akumulasi ulang total score
          const newTotal = newSubs.reduce((acc, curr) => acc + curr.maxScore, 0)
          return { ...c, subCategories: newSubs, totalScore: newTotal }
        }
        return c
      })
      onUpdate(updatedCategories)
      setIsDeleteSubModalOpen(false)
    } finally {
      setIsSubmitting(false)
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
          {categories.map((cat) => (
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
                      {cat.subCategories.length} Sub-Kategori | Total:{" "}
                      {cat.totalScore} poin
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

              {/* PERBAIKAN ACCORDION EXPANSION: Menghilangkan padding wrapper dan memindahkannya ke dalam inner div */}
              <AccordionContent className="border-x border-b h-full border-gray-100 bg-gray-50/50 pb-0">
                <div className="flex w-full flex-col gap-4 p-4 sm:p-6">
                  {cat.subCategories.length === 0 ? (
                    <div className="py-4 text-center font-poppins text-sm text-neutral-500">
                      Belum ada sub-kategori.
                    </div>
                  ) : (
                    cat.subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:border-sky-200 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="font-poppins text-sm font-semibold text-neutral-800">
                              {sub.title}
                            </span>
                            <span className="font-poppins text-xs text-neutral-500">
                              Skor maksimal:{" "}
                              <span className="font-medium text-blue-500">
                                {sub.maxScore} poin
                              </span>
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {GRADE_CONFIG.map(({ key, label, bgColor }) => {
                              const rangeText = sub.grades[key].join(", ")
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
          ))}
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
                  {subToDelete?.sub.title}
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

      {/* Modal Tambah/Edit Sub Kategori (Complex Form Isolated) */}
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
// 6. COMPLEX FORM: SUB CATEGORY MODAL
// ==========================================

function SubCategoryFormModal({
  isOpen,
  onClose,
  catId,
  subCategory,
  onSave,
}: any) {
  const [title, setTitle] = useState("")
  const [grades, setGrades] = useState<Record<GradeKey, string[]>>({
    kurang: [""],
    cukup: [""],
    baik: [""],
    sangatBaik: [""],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-populate / Reset form
  useEffect(() => {
    if (isOpen) {
      if (subCategory) {
        setTitle(subCategory.title)
        setGrades(subCategory.grades)
      } else {
        setTitle("")
        setGrades({ kurang: [""], cukup: [""], baik: [""], sangatBaik: [""] })
      }
    }
  }, [isOpen, subCategory])

  const handleInputChange = (grade: GradeKey, index: number, value: string) => {
    if (value.length > 5) return // Format maks "xx-xx"
    setGrades((prev) => {
      const newCodes = [...prev[grade]]
      newCodes[index] = value
      return { ...prev, [grade]: newCodes }
    })
  }

  const handleAddInput = (grade: GradeKey) => {
    setGrades((prev) =>
      prev[grade].length < 5 ? { ...prev, [grade]: [...prev[grade], ""] } : prev
    )
  }

  const handleRemoveInput = (grade: GradeKey, index: number) => {
    setGrades((prev) =>
      prev[grade].length > 1
        ? { ...prev, [grade]: prev[grade].filter((_, i) => i !== index) }
        : prev
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
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

    const payload: SubCategory = {
      id: subCategory ? subCategory.id : `sc-${Date.now()}`,
      title,
      maxScore: calculatedMax, // Otomatis
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Gerakan di Tempat"
                    required
                    className="h-12 bg-white focus-visible:ring-sky-200"
                  />
                </div>
                {/* Max Score Input dihilangkan, dihitung otomatis */}
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
                      {grades[key as GradeKey].map((code, index) => (
                        <div key={index} className="relative">
                          <Input
                            type="text"
                            maxLength={5}
                            value={code}
                            onChange={(e) =>
                              handleInputChange(
                                key as GradeKey,
                                index,
                                e.target.value
                              )
                            }
                            placeholder="0-10"
                            className="h-11 w-20 rounded-xl border-neutral-300 bg-neutral-50 text-center font-poppins text-sm font-semibold text-neutral-900 focus-visible:ring-sky-200"
                            required
                          />
                          {grades[key as GradeKey].length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveInput(key as GradeKey, index)
                              }
                              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 transition-colors hover:bg-red-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      {grades[key as GradeKey].length < 6 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddInput(key as GradeKey)}
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
