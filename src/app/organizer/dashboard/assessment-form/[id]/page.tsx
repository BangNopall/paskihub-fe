"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, RotateCcw, Save, Loader2, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ==========================================
// 1. TYPESCRIPT INTERFACES & SCHEMA
// ==========================================

export interface Juri {
  id: string
  name: string
}

export interface SubCatSchema {
  id: string
  name: string
  scores: {
    kurang: number[]
    cukup: number[]
    baik: number[]
    sangatBaik: number[]
  }
}

export interface CatSchema {
  id: string
  name: string
  subCategories: SubCatSchema[]
}

export interface ViolationSchema {
  id: string
  name: string
  penalty: number
}

export interface FormTemplateData {
  teamName: string
  schoolName: string
  category: string
  juriList: Juri[]
  categories: CatSchema[]
  violations: ViolationSchema[]
}

type ScoreValue = number | "Lewat" | null

// ==========================================
// 2. MOCK DATA
// ==========================================

const MOCK_TEMPLATE: FormTemplateData = {
  teamName: "Garuda Nusantara",
  schoolName: "SDN 01 Jakarta Pusat",
  category: "SD (Sekolah Dasar)",
  juriList: [
    { id: "j-1", name: "Budi Santoso, S.Pd" },
    { id: "j-2", name: "Siti Nurhaliza, M.Pd" },
  ],
  categories: [
    {
      id: "cat-1",
      name: "Gerakan Berkumpul",
      subCategories: [
        {
          id: "sc-1",
          name: "Bersaf Kumpul",
          scores: {
            kurang: [6, 7, 8],
            cukup: [9, 10, 11],
            baik: [12, 13, 14],
            sangatBaik: [15, 16, 17],
          },
        },
        {
          id: "sc-2",
          name: "Sikap Sempurna",
          scores: {
            kurang: [6, 7, 8],
            cukup: [9, 10, 11],
            baik: [12, 13, 14],
            sangatBaik: [15, 16, 17],
          },
        },
        {
          id: "sc-3",
          name: "Sikap Hormat",
          scores: {
            kurang: [6, 7, 8],
            cukup: [9, 10, 11],
            baik: [12, 13, 14],
            sangatBaik: [15, 16, 17],
          },
        },
      ],
    },
    {
      id: "cat-2",
      name: "Gerakan Berjalan",
      subCategories: [
        {
          id: "sc-4",
          name: "Langkah Tegap",
          scores: {
            kurang: [6, 7, 8],
            cukup: [9, 10, 11],
            baik: [12, 13, 14],
            sangatBaik: [15, 16, 17],
          },
        },
      ],
    },
  ],
  violations: [
    { id: "v-1", name: "Tidak Seragam", penalty: 5 },
    { id: "v-2", name: "Keluar dari Formasi", penalty: 3 },
    { id: "v-3", name: "Tidak Kompak", penalty: 2 },
    { id: "v-4", name: "Tidak Kompak", penalty: 2 },
    { id: "v-5", name: "Tidak Kompak", penalty: 2 },
    { id: "v-6", name: "Tidak Kompak", penalty: 2 },
    { id: "v-7", name: "Tidak Kompak", penalty: 2 },
  ],
}

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

type GradeType = "Lewat" | "Kurang" | "Cukup" | "Baik" | "Sangat Baik"

function getScoreColors(type: GradeType, isSelected: boolean) {
  if (!isSelected) return "bg-transparent text-neutral-600 hover:bg-neutral-100"
  switch (type) {
    case "Lewat":
      return "bg-stone-400 text-white font-bold"
    case "Kurang":
      return "bg-red-500 text-white font-bold"
    case "Cukup":
      return "bg-amber-400 text-neutral-800 font-bold"
    case "Baik":
      return "bg-green-500 text-white font-bold"
    case "Sangat Baik":
      return "bg-blue-500 text-white font-bold"
  }
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function AssessmentFormDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params?.id

  // --- STATE ---
  const [template, setTemplate] = useState<FormTemplateData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [selectedJuri, setSelectedJuri] = useState<string>("")
  const [scores, setScores] = useState<Record<string, ScoreValue>>({})
  const [selectedViolations, setSelectedViolations] = useState<
    Record<string, boolean>
  >({})

  // --- API FETCH & SET STATUS "IN PROGRESS" ---
  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: 1. API GET Template Penilaian untuk tim ini
        // TODO: 2. API POST /api/assessments/{teamId}/start (Set status tim jadi "Sedang Dinilai")
        console.log(
          "Memicu status Sedang Dinilai di Backend untuk Tim:",
          teamId
        )
        await new Promise((res) => setTimeout(res, 1500))
        setTemplate(MOCK_TEMPLATE)
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    initializeForm()
  }, [teamId])

  // --- HANDLers ---
  const handleScoreSelect = (subId: string, val: ScoreValue) => {
    setScores((prev) => ({ ...prev, [subId]: val }))
  }

  const handleReset = () => {
    if (confirm("Yakin ingin mengulang semua form penilaian ini?")) {
      setScores({})
      setSelectedViolations({})
      setSelectedJuri("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJuri) {
      alert("Pilih Juri terlebih dahulu sebelum menyimpan!")
      return
    }

    // Hitung total sebelum kirim
    let rawScore = 0
    Object.values(scores).forEach((s) => {
      if (typeof s === "number") rawScore += s
    })

    let penalty = 0
    Object.entries(selectedViolations).forEach(([vId, checked]) => {
      if (checked) {
        const v = template?.violations.find((x) => x.id === vId)
        if (v) penalty += v.penalty
      }
    })

    const payload = {
      teamId,
      juriId: selectedJuri,
      scores,
      violations: selectedViolations,
      totalScore: rawScore,
      totalPenalty: penalty,
      finalScore: rawScore - penalty,
    }

    setIsSubmitting(true)
    try {
      // TODO: API POST /api/assessments/{teamId}/submit (Set status tim jadi "Selesai Dinilai")
      console.log("=== PAYLOAD PENILAIAN ===", payload)
      await new Promise((res) => setTimeout(res, 2000))
      alert("Penilaian berhasil disimpan secara permanen!")
      router.push("/organizer/dashboard/assessment-form")
    } catch (error) {
      alert("Gagal menyimpan form.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- CALCULATION (Real-time View) ---
  const currentTotalScore = Object.values(scores).reduce<number>(
    (acc, curr) => acc + (typeof curr === "number" ? curr : 0),
    0
  )
  const currentPenalty = Object.entries(selectedViolations).reduce(
    (acc, [id, checked]) => {
      if (checked) {
        const v = template?.violations.find((x) => x.id === id)
        return acc + (v ? v.penalty : 0)
      }
      return acc
    },
    0
  )
  const currentFinalScore = currentTotalScore - currentPenalty

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Form
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
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-6">
          <Link
            href="/organizer/dashboard/assessment-form"
            className="flex w-fit items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-montserrat text-base font-semibold md:text-lg">
              Kembali
            </span>
          </Link>
        </div>

        {isLoading || !template ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-32 w-full rounded-3xl" />
            <Skeleton className="h-[600px] w-full rounded-3xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:gap-8">
            {/* IDENTITAS TIM */}
            <div className="flex flex-col gap-4 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-6 shadow-sm backdrop-blur-md md:p-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="font-poppins text-xl font-semibold text-neutral-800 md:text-2xl">
                    {template.teamName}
                  </h1>
                  <Badge
                    variant="outline"
                    className="border-yellow-400 bg-yellow-50 font-poppins font-normal text-yellow-600"
                  >
                    Sedang Dinilai
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2 md:mt-0">
                  <span className="font-poppins text-sm text-neutral-600">
                    {template.schoolName}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-stone-300 bg-white font-poppins font-normal text-stone-500"
                  >
                    {template.category}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 rounded-xl border border-sky-100 bg-white p-4 sm:p-5">
                <Label className="font-poppins text-sm font-medium text-neutral-700">
                  Pilih Juri yang Melakukan Penilaian:{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedJuri}
                  onValueChange={setSelectedJuri}
                  required
                >
                  <SelectTrigger className="h-12 w-full font-poppins text-sm text-neutral-700 focus:ring-sky-200 md:max-w-md">
                    <SelectValue placeholder="Pilih Nama Juri..." />
                  </SelectTrigger>
                  <SelectContent>
                    {template.juriList.map((juri) => (
                      <SelectItem key={juri.id} value={juri.id}>
                        {juri.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* FORM MATRIKS PENILAIAN */}
            <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-4 shadow-sm backdrop-blur-md md:p-6 lg:p-8">
              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-poppins text-lg font-semibold text-slate-900">
                  Form Penilaian
                </h2>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="h-11 w-full rounded-full border-neutral-300 px-6 font-poppins font-medium text-neutral-600 hover:bg-neutral-100 sm:w-auto"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset Form
                  </Button>
                </div>
              </div>

              {/* TABEL RESPONSIVE (Scrollable) */}
              <div className="overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  {/* Min-width dipaksa lebar agar touch target tablet nyaman dan tidak bertumpuk */}
                  <Table className="min-w-[1200px] border-collapse">
                    <TableHeader>
                      <TableRow className="bg-gray-200 hover:bg-gray-200">
                        <TableHead
                          rowSpan={2}
                          className="w-48 border border-stone-300 text-center align-middle font-poppins text-base font-semibold text-neutral-700"
                        >
                          Kategori
                        </TableHead>
                        <TableHead
                          rowSpan={2}
                          className="w-48 border border-stone-300 text-center align-middle font-poppins text-base font-semibold text-neutral-700"
                        >
                          Subkategori
                        </TableHead>
                        <TableHead
                          colSpan={13}
                          className="border border-stone-300 bg-gray-200 py-3 text-center font-poppins text-base font-semibold text-neutral-700"
                        >
                          Penilaian
                        </TableHead>
                      </TableRow>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-12 w-20 border border-stone-300 bg-stone-300 text-center font-poppins text-base font-semibold text-neutral-700">
                          Lewat
                        </TableHead>
                        <TableHead
                          colSpan={3}
                          className="h-12 border border-stone-300 bg-red-400 text-center font-poppins text-base font-semibold text-white"
                        >
                          Kurang
                        </TableHead>
                        <TableHead
                          colSpan={3}
                          className="h-12 border border-stone-300 bg-amber-300 text-center font-poppins text-base font-semibold text-neutral-700"
                        >
                          Cukup
                        </TableHead>
                        <TableHead
                          colSpan={3}
                          className="h-12 border border-stone-300 bg-green-500 text-center font-poppins text-base font-semibold text-white"
                        >
                          Baik
                        </TableHead>
                        <TableHead
                          colSpan={3}
                          className="h-12 border border-stone-300 bg-blue-500 text-center font-poppins text-base font-semibold text-white"
                        >
                          Sangat Baik
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {template.categories.map((cat) =>
                        cat.subCategories.map((sub, idx) => (
                          <TableRow
                            key={sub.id}
                            className="bg-white hover:bg-neutral-50/50"
                          >
                            {idx === 0 && (
                              <TableCell
                                rowSpan={cat.subCategories.length}
                                className="w-48 border border-stone-300 bg-gray-50 p-4 align-top font-poppins text-sm font-semibold text-neutral-700"
                              >
                                {cat.name}
                              </TableCell>
                            )}
                            <TableCell className="w-48 border border-stone-300 p-4 font-poppins text-sm font-medium text-neutral-700">
                              {sub.name}
                            </TableCell>

                            {/* Lewat Score Cell */}
                            <TableCell className="border border-stone-300 p-0">
                              <button
                                type="button"
                                onClick={() =>
                                  handleScoreSelect(sub.id, "Lewat")
                                }
                                className={cn(
                                  "min-h-[56px] w-full font-poppins text-sm transition-colors",
                                  getScoreColors(
                                    "Lewat",
                                    scores[sub.id] === "Lewat"
                                  )
                                )}
                              >
                                Lewat
                              </button>
                            </TableCell>

                            {/* Kurang Score Cells */}
                            {sub.scores.kurang.map((val) => (
                              <TableCell
                                key={val}
                                className="border border-stone-300 p-0"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleScoreSelect(sub.id, val)}
                                  className={cn(
                                    "min-h-[56px] w-full font-poppins text-sm transition-colors",
                                    getScoreColors(
                                      "Kurang",
                                      scores[sub.id] === val
                                    )
                                  )}
                                >
                                  {val}
                                </button>
                              </TableCell>
                            ))}

                            {/* Cukup Score Cells */}
                            {sub.scores.cukup.map((val) => (
                              <TableCell
                                key={val}
                                className="border border-stone-300 p-0"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleScoreSelect(sub.id, val)}
                                  className={cn(
                                    "min-h-[56px] w-full font-poppins text-sm transition-colors",
                                    getScoreColors(
                                      "Cukup",
                                      scores[sub.id] === val
                                    )
                                  )}
                                >
                                  {val}
                                </button>
                              </TableCell>
                            ))}

                            {/* Baik Score Cells */}
                            {sub.scores.baik.map((val) => (
                              <TableCell
                                key={val}
                                className="border border-stone-300 p-0"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleScoreSelect(sub.id, val)}
                                  className={cn(
                                    "min-h-[56px] w-full font-poppins text-sm transition-colors",
                                    getScoreColors(
                                      "Baik",
                                      scores[sub.id] === val
                                    )
                                  )}
                                >
                                  {val}
                                </button>
                              </TableCell>
                            ))}

                            {/* Sangat Baik Score Cells */}
                            {sub.scores.sangatBaik.map((val) => (
                              <TableCell
                                key={val}
                                className="border border-stone-300 p-0"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleScoreSelect(sub.id, val)}
                                  className={cn(
                                    "min-h-[56px] w-full font-poppins text-sm transition-colors",
                                    getScoreColors(
                                      "Sangat Baik",
                                      scores[sub.id] === val
                                    )
                                  )}
                                >
                                  {val}
                                </button>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* KETERANGAN PENILAIAN */}
              <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <span className="font-poppins text-base font-semibold text-neutral-800">
                  Keterangan Penilaian:
                </span>
                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded border border-stone-400 bg-stone-300" />
                    <div className="flex flex-col">
                      <span className="font-poppins text-sm font-medium text-neutral-700">
                        Lewat
                      </span>
                      <span className="font-poppins text-xs text-neutral-500">
                        Tidak Dinilai
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded border border-red-500 bg-red-400" />
                    <div className="flex flex-col">
                      <span className="font-poppins text-sm font-medium text-neutral-700">
                        Kurang
                      </span>
                      <span className="font-poppins text-xs text-neutral-500">
                        Nilai 6-8
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded border border-amber-400 bg-amber-300" />
                    <div className="flex flex-col">
                      <span className="font-poppins text-sm font-medium text-neutral-700">
                        Cukup
                      </span>
                      <span className="font-poppins text-xs text-neutral-500">
                        Nilai 9-11
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded border border-green-600 bg-green-500" />
                    <div className="flex flex-col">
                      <span className="font-poppins text-sm font-medium text-neutral-700">
                        Baik
                      </span>
                      <span className="font-poppins text-xs text-neutral-500">
                        Nilai 12-14
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded border border-blue-600 bg-blue-500" />
                    <div className="flex flex-col">
                      <span className="font-poppins text-sm font-medium text-neutral-700">
                        Sangat Baik
                      </span>
                      <span className="font-poppins text-xs text-neutral-500">
                        Nilai 15-17
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PELANGGARAN TIM */}
              <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-red-200 bg-rose-50 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-poppins text-base font-semibold text-neutral-800">
                    Pelanggaran Tim
                  </span>
                  <span className="font-poppins text-2xl font-bold text-red-500">
                    -{currentPenalty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {template.violations.map((v) => (
                    <div
                      key={v.id}
                      className="flex min-w-[240px] flex-1 items-center gap-3 rounded-xl border border-red-100 bg-white p-4 shadow-sm transition-colors hover:border-red-300"
                    >
                      <Checkbox
                        id={v.id}
                        checked={!!selectedViolations[v.id]}
                        onCheckedChange={(checked) =>
                          setSelectedViolations((prev) => ({
                            ...prev,
                            [v.id]: checked as boolean,
                          }))
                        }
                        className="data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                      />
                      <Label
                        htmlFor={v.id}
                        className="flex cursor-pointer flex-col leading-tight"
                      >
                        <span className="font-poppins text-sm text-neutral-700">
                          {v.name}
                        </span>
                        <span className="font-poppins text-xs font-semibold text-red-500">
                          -{v.penalty} poin
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FLOATING / STICKY SUMMARY BOTTOM */}
            <div className="sticky bottom-4 z-10 flex flex-col gap-4 rounded-[24px] border border-sky-100 bg-white/90 p-4 shadow-lg backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between md:p-6">
              <div className="grid w-full flex-1 grid-cols-3 gap-2 sm:w-auto">
                <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-3">
                  <span className="font-poppins text-xs text-neutral-500">
                    Total Nilai
                  </span>
                  <span className="font-poppins text-xl font-bold text-neutral-800">
                    {currentTotalScore}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-rose-50 py-3">
                  <span className="font-poppins text-xs text-red-400">
                    Pelanggaran
                  </span>
                  <span className="font-poppins text-xl font-bold text-red-500">
                    -{currentPenalty}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-blue-100 bg-blue-50 py-3">
                  <span className="font-poppins text-xs text-blue-500">
                    Nilai Akhir
                  </span>
                  <span className="font-poppins text-2xl font-bold text-blue-600">
                    {currentFinalScore}
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-full rounded-full bg-red-500 font-poppins text-base font-bold text-white shadow-md hover:bg-red-600 sm:w-auto sm:px-10"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-5 w-5" />
                )}{" "}
                Simpan Final
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
