"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { EOTeamDetailRes } from "@/schemas/eo-team.schema"
import { UnifiedAssessment, ViolationType } from "@/schemas/assessment.schema"
import { finalizeAssessmentAction } from "@/actions/assessment.actions"

interface AssessmentFormProps {
  team: EOTeamDetailRes
  unifiedData: UnifiedAssessment
  judges: { id: string; name: string }[]
  eventId: string
}

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

export function AssessmentForm({
  team,
  unifiedData,
  judges,
}: AssessmentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [selectedJuri, setSelectedJuri] = useState<string>("")
  const [scores, setScores] = useState<Record<string, number | "Lewat" | null>>(
    {}
  )
  const [selectedViolations, setSelectedViolations] = useState<
    Record<string, boolean>
  >({})

  const handleScoreSelect = (subId: string, val: number | "Lewat") => {
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
      toast.error("Pilih Juri terlebih dahulu sebelum menyimpan!")
      return
    }

    const payload = {
      regis_id: team.registration_id,
      judges_id: selectedJuri,
      scores: Object.entries(scores)
        .filter(([_, val]) => typeof val === "number")
        .map(([subId, val]) => ({
          sub_category_id: subId,
          score_value: val as number,
        })),
      violation_type_ids: Object.entries(selectedViolations)
        .filter(([_, checked]) => checked)
        .map(([vId]) => vId),
    }

    setIsSubmitting(true)
    try {
      const res = await finalizeAssessmentAction(payload)
      if (res.success) {
        toast.success(res.message)
        router.push("/organizer/dashboard/assessment-form")
        router.refresh()
      } else {
        toast.error(res.message)
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan form.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentTotalScore = Object.values(scores).reduce<number>(
    (acc, curr) => acc + (typeof curr === "number" ? curr : 0),
    0
  )

  const currentPenalty = Object.entries(selectedViolations).reduce(
    (acc, [id, checked]) => {
      if (checked) {
        const v = unifiedData.violations.find((x) => x.id === id)
        return acc + (v ? v.point : 0)
      }
      return acc
    },
    0
  )

  const currentFinalScore = currentTotalScore - currentPenalty

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
      {/* IDENTITAS TIM */}
      <div className="flex flex-col gap-4 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-6 shadow-sm backdrop-blur-md md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-poppins text-xl font-semibold text-neutral-800 md:text-2xl">
              {team.team_name}
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
              {team.institution}
            </span>
            <Badge
              variant="outline"
              className="border-stone-300 bg-white font-poppins font-normal text-stone-500"
            >
              {team.event_level}
            </Badge>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-sky-100 bg-white p-4 sm:p-5">
          <Label className="font-poppins text-sm font-medium text-neutral-700">
            Pilih Juri yang Melakukan Penilaian:{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedJuri} onValueChange={setSelectedJuri} required>
            <SelectTrigger className="h-12 w-full font-poppins text-sm text-neutral-700 focus:ring-sky-200 md:max-w-md">
              <SelectValue placeholder="Pilih Nama Juri..." />
            </SelectTrigger>
            <SelectContent>
              {judges.map((juri) => (
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

        <div className="overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-sm">
          <div className="overflow-x-auto">
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
                {unifiedData.categories.map((cat) =>
                  cat.sub_categories.map((sub, idx) => (
                    <TableRow
                      key={sub.id}
                      className="bg-white hover:bg-neutral-50/50"
                    >
                      {idx === 0 && (
                        <TableCell
                          rowSpan={cat.sub_categories.length}
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
                          onClick={() => handleScoreSelect(sub.id, "Lewat")}
                          className={cn(
                            "min-h-[56px] w-full font-poppins text-sm transition-colors",
                            getScoreColors("Lewat", scores[sub.id] === "Lewat")
                          )}
                        >
                          Lewat
                        </button>
                      </TableCell>

                      {/* Kurang Score Cells */}
                      {(sub.grade_numbers?.["Kurang"] || []).map((val) => (
                        <TableCell
                          key={val}
                          className="border border-stone-300 p-0"
                        >
                          <button
                            type="button"
                            onClick={() => handleScoreSelect(sub.id, val)}
                            className={cn(
                              "min-h-[56px] w-full font-poppins text-sm transition-colors",
                              getScoreColors("Kurang", scores[sub.id] === val)
                            )}
                          >
                            {val}
                          </button>
                        </TableCell>
                      ))}

                      {/* Cukup Score Cells */}
                      {(sub.grade_numbers?.["Cukup"] || []).map((val) => (
                        <TableCell
                          key={val}
                          className="border border-stone-300 p-0"
                        >
                          <button
                            type="button"
                            onClick={() => handleScoreSelect(sub.id, val)}
                            className={cn(
                              "min-h-[56px] w-full font-poppins text-sm transition-colors",
                              getScoreColors("Cukup", scores[sub.id] === val)
                            )}
                          >
                            {val}
                          </button>
                        </TableCell>
                      ))}

                      {/* Baik Score Cells */}
                      {(sub.grade_numbers?.["Baik"] || []).map((val) => (
                        <TableCell
                          key={val}
                          className="border border-stone-300 p-0"
                        >
                          <button
                            type="button"
                            onClick={() => handleScoreSelect(sub.id, val)}
                            className={cn(
                              "min-h-[56px] w-full font-poppins text-sm transition-colors",
                              getScoreColors("Baik", scores[sub.id] === val)
                            )}
                          >
                            {val}
                          </button>
                        </TableCell>
                      ))}

                      {/* Sangat Baik Score Cells */}
                      {(sub.grade_numbers?.["Sangat Baik"] || []).map((val) => (
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
            {unifiedData.violations.map((v) => (
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
                    -{v.point} poin
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
    </form>
  )
}
