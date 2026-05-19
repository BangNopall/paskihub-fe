"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  Search,
  AlertCircle,
  Loader2,
  Trophy,
  Medal,
  Award,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

// --- SHADCN UI COMPONENTS ---
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

// --- TYPES & ACTIONS ---
import { AwardRes } from "@/schemas/ranking.schema"
import { ScoreboardItem, TeamAssessmentDetailRes } from "@/schemas/rekap.schema"
import {
  publishScoreboardAction,
  getScoreboardAction,
  getTeamAssessmentDetailAction,
  getLeaderboardCustomAction,
} from "@/actions/rekap.actions"

interface ScoreRecapClientProps {
  eventId: string
  levels: { id: string; name: string }[]
  initialAwards: AwardRes[]
  initialScoreboard: ScoreboardItem[]
}

// ==========================================
// UI HELPER COMPONENTS
// ==========================================

function getIconComponent(rank: number) {
  if (rank === 1) return Trophy
  if (rank <= 3) return Medal
  return Award
}

function getIconStyles(rank: number) {
  if (rank === 1) return "text-amber-500"
  if (rank === 2) return "text-stone-400"
  if (rank === 3) return "text-amber-600"
  if (rank === 4) return "text-blue-400"
  if (rank === 5) return "text-emerald-400"
  return "text-rose-400"
}

// ==========================================
// MAIN CLIENT COMPONENT
// ==========================================

export default function ScoreRecapClient({
  levels,
  initialAwards,
  initialScoreboard,
}: ScoreRecapClientProps) {
  // --- STATE ---
  const [activeLevelId, setActiveLevelId] = useState<string>(
    levels[0]?.id || ""
  )
  const [scoreboard, setScoreboard] =
    useState<ScoreboardItem[]>(initialScoreboard)
  const [isLoadingScoreboard, setIsLoadingScoreboard] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)

  // Awards State (Calculated)
  const [awardsData, setAwardsData] = useState<
    { award: AwardRes; winners: ScoreboardItem[] }[]
  >([])
  const [isLoadingAwards, setIsLoadingAwards] = useState(false)

  // Modal Detail State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedDetail, setSelectedDetail] =
    useState<TeamAssessmentDetailRes | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  // --- FETCH SCOREBOARD WHEN LEVEL CHANGES ---
  useEffect(() => {
    if (activeLevelId === levels[0]?.id) {
      setScoreboard(initialScoreboard)
      return
    }

    const fetchScoreboard = async () => {
      setIsLoadingScoreboard(true)
      try {
        const res = await getScoreboardAction(activeLevelId)
        if (res.success && res.data) {
          setScoreboard(res.data.items)
        } else {
          toast.error(res.message || "Gagal memuat scoreboard")
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat memuat data")
      } finally {
        setIsLoadingScoreboard(false)
      }
    }

    fetchScoreboard()
  }, [activeLevelId, levels, initialScoreboard])

  // --- CALCULATE WINNERS FOR ALL AWARDS ---
  useEffect(() => {
    const calculateAllWinners = async () => {
      setIsLoadingAwards(true)
      try {
        const results = await Promise.all(
          initialAwards.map(async (award) => {
            let pooledWinners: ScoreboardItem[] = []

            // Fetch custom leaderboard for each level in the award
            const levelResults = await Promise.all(
              award.event_level_ids.map(async (levelId) => {
                const res = await getLeaderboardCustomAction(
                  levelId,
                  award.score_categories.map((c) => c.id)
                )
                return res.success ? res.data?.items || [] : []
              })
            )

            // Merge and re-rank
            pooledWinners = levelResults.flat()
            pooledWinners.sort((a, b) => b.final_score - a.final_score)

            // Take top N
            const winners = pooledWinners
              .slice(0, award.limit_rank)
              .map((w, idx) => ({
                ...w,
                rank: idx + 1,
              }))

            return { award, winners }
          })
        )
        setAwardsData(results)
      } catch (error) {
        toast.error("Gagal menghitung daftar juara")
      } finally {
        setIsLoadingAwards(false)
      }
    }

    if (initialAwards.length > 0) {
      calculateAllWinners()
    }
  }, [initialAwards])

  // --- HANDLERS ---
  const handlePublish = async () => {
    const levelName =
      levels.find((l) => l.id === activeLevelId)?.name || "jenjang ini"
    if (
      !confirm(
        `Apakah Anda yakin ingin mempublikasikan hasil nilai untuk ${levelName}?`
      )
    )
      return

    setIsPublishing(true)
    try {
      const res = await publishScoreboardAction(activeLevelId, true)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error("Gagal mempublikasikan hasil")
    } finally {
      setIsPublishing(false)
    }
  }

  const handleOpenDetail = async (regisId: string) => {
    setIsDetailModalOpen(true)
    setIsDetailLoading(true)
    setSelectedDetail(null)
    try {
      const res = await getTeamAssessmentDetailAction(regisId)
      if (res.success && res.data) {
        setSelectedDetail(res.data)
      } else {
        toast.error(res.message || "Gagal memuat detail tim")
        setIsDetailModalOpen(false)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat detail")
      setIsDetailModalOpen(false)
    } finally {
      setIsDetailLoading(false)
    }
  }

  // --- FILTERED DATA ---
  const filteredTeams = useMemo(() => {
    return scoreboard.filter(
      (item) =>
        item.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.insti_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [scoreboard, searchQuery])

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Rekap Nilai
          </h1>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || isLoadingScoreboard}
            className="rounded-full bg-red-400 px-8 font-montserrat font-bold text-white shadow-sm hover:bg-red-500"
          >
            {isPublishing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isPublishing ? "Memproses..." : "Publish Hasil"}
          </Button>
        </div>

        <div className="flex flex-col gap-8">
          {/* --- SECTION 1: FILTER & TABLE REKAP NILAI --- */}
          <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <span className="font-poppins text-sm font-medium text-slate-900">
                  Pilih Jenjang:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {levels.map((level) => (
                    <Button
                      key={level.id}
                      variant={
                        activeLevelId === level.id ? "default" : "outline"
                      }
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

              <div className="relative w-full md:max-w-md">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  placeholder="Cari nama tim atau sekolah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border-gray-200 bg-white pl-10 font-poppins text-sm focus-visible:ring-sky-200"
                />
              </div>
            </div>

            {/* TABLE DATA */}
            <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white/70 shadow-sm">
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader className="bg-blue-100/80">
                    <TableRow className="border-sky-100 hover:bg-transparent">
                      <TableHead className="w-16 py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                        No
                      </TableHead>
                      <TableHead className="py-4 font-poppins text-sm font-semibold text-neutral-700">
                        Nama Tim
                      </TableHead>
                      <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                        Asal Instansi
                      </TableHead>
                      <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                        Total Nilai
                      </TableHead>
                      <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                        Pelanggaran
                      </TableHead>
                      <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                        Nilai Akhir
                      </TableHead>
                      <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingScoreboard ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={7} className="p-4">
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredTeams.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-10 text-center font-poppins text-sm text-neutral-500"
                        >
                          Tidak ada tim yang ditemukan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeams.map((item, index) => (
                        <TableRow
                          key={item.regis_id}
                          className="border-sky-100 bg-transparent hover:bg-white/50"
                        >
                          <TableCell className="py-4 text-center font-poppins text-sm font-medium text-neutral-700">
                            {index + 1}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <span className="font-poppins text-sm font-semibold text-neutral-800">
                                {item.team_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center font-poppins text-sm text-neutral-600">
                            {item.insti_name}
                          </TableCell>
                          <TableCell className="py-4 text-center font-poppins text-sm text-neutral-600">
                            {item.total_score}
                          </TableCell>
                          <TableCell className="py-4 text-center font-poppins text-sm font-medium text-red-500">
                            -{item.total_violation_points}
                          </TableCell>
                          <TableCell className="py-4 text-center font-poppins text-sm font-bold text-neutral-800">
                            {item.final_score}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex justify-center">
                              <Button
                                size="sm"
                                onClick={() => handleOpenDetail(item.regis_id)}
                                className="h-8 rounded-lg bg-blue-400 px-4 font-poppins text-xs font-semibold text-white hover:bg-blue-500"
                              >
                                Detail
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* --- SECTION 2: DAFTAR JUARA --- */}
          <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins text-xl font-semibold text-slate-900">
                Daftar Juara
              </h2>
              {isLoadingAwards && (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              )}
            </div>

            <div className="flex flex-col gap-8">
              {awardsData.length === 0 && !isLoadingAwards ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-12 text-center">
                  <AlertCircle className="mb-2 h-10 w-10 text-gray-300" />
                  <p className="font-poppins text-sm text-gray-500">
                    Belum ada kategori juara yang dikonfigurasi.
                  </p>
                </div>
              ) : (
                awardsData.map(({ award, winners }) => (
                  <div key={award.id} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-poppins text-lg font-semibold text-slate-900">
                        {award.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {award.levels.map((l) => (
                          <Badge
                            key={l.id}
                            variant="outline"
                            className="border-sky-200 bg-sky-50 text-sky-700"
                          >
                            {l.name}
                          </Badge>
                        ))}
                        <span className="ml-1 self-center text-xs text-neutral-400">
                          Kategori:{" "}
                          {award.score_categories.map((c) => c.name).join(", ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-white/70 p-4 shadow-sm sm:p-6">
                      {winners.length === 0 ? (
                        <p className="py-4 text-center font-poppins text-sm text-neutral-400 italic">
                          Belum ada pemenang untuk kategori ini.
                        </p>
                      ) : (
                        winners.map((winner) => {
                          const Icon = getIconComponent(winner.rank)
                          const iconColor = getIconStyles(winner.rank)

                          return (
                            <div
                              key={winner.regis_id}
                              className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                            >
                              <div className="flex items-center gap-4">
                                <Icon
                                  className={cn("h-6 w-6 shrink-0", iconColor)}
                                />
                                <div className="flex flex-col gap-1">
                                  <span className="font-poppins text-base font-semibold text-neutral-800">
                                    {winner.rank === 1
                                      ? "Juara Utama"
                                      : `Juara ${winner.rank}`}
                                  </span>
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                    <span className="font-poppins text-sm text-neutral-600">
                                      {winner.team_name}
                                    </span>
                                    <span className="hidden text-neutral-300 sm:inline">
                                      •
                                    </span>
                                    <span className="font-poppins text-xs text-neutral-400">
                                      {winner.insti_name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className="font-poppins text-xl font-bold text-neutral-800 sm:text-right">
                                {winner.final_score}
                              </span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MODAL DETAIL NILAI TIM */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-h-[90vh] w-full max-w-2xl gap-0 overflow-y-auto rounded-3xl p-0 sm:rounded-[40px]">
            <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-8">
              <DialogTitle className="text-center font-montserrat text-xl font-bold text-neutral-800 sm:text-2xl">
                Detail Nilai Tim
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6 p-6 sm:px-10 sm:pt-6 sm:pb-10">
              {isDetailLoading ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-48 w-full rounded-2xl" />
                </div>
              ) : selectedDetail ? (
                <div className="flex flex-col gap-6">
                  {/* Identitas Tim */}
                  <div className="flex items-center gap-4 rounded-2xl border border-sky-100 bg-sky-100/50 p-4">
                    <div className="flex flex-col">
                      <span className="font-poppins text-base font-semibold text-neutral-800">
                        {selectedDetail.team_name}
                      </span>
                      <span className="font-poppins text-xs font-medium text-neutral-500">
                        {selectedDetail.insti_name}
                      </span>
                    </div>
                  </div>

                  {/* Summary Scores */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-4 shadow-sm">
                      <span className="font-poppins text-xs text-neutral-500">
                        Total Nilai
                      </span>
                      <span className="font-poppins text-xl font-bold text-neutral-800">
                        {selectedDetail.total_score}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-4 shadow-sm">
                      <span className="font-poppins text-xs text-neutral-500">
                        Pelanggaran
                      </span>
                      <span className="font-poppins text-xl font-bold text-red-500">
                        -{selectedDetail.total_violation}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-4 shadow-sm">
                      <span className="font-poppins text-xs text-neutral-500">
                        Nilai Akhir
                      </span>
                      <span className="font-poppins text-xl font-bold text-neutral-800">
                        {selectedDetail.final_score}
                      </span>
                    </div>
                  </div>

                  {/* Breakdown Kategori Nilai */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-poppins text-sm font-semibold text-neutral-800">
                      Breakdown Nilai per Kategori
                    </h3>

                    {selectedDetail.categories.map((cat) => (
                      <div
                        key={cat.category_id}
                        className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50/50 p-4 sm:p-5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-poppins text-sm font-bold text-sky-800">
                            {cat.category_name}
                          </span>
                        </div>

                        <div className="flex flex-col gap-3">
                          {cat.sub_categories.map((sub, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-xl border border-white bg-white p-3 shadow-sm"
                            >
                              <div className="flex flex-col gap-0.5">
                                <span className="font-poppins text-xs font-medium text-neutral-600">
                                  {sub.sub_category_name}
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                  Juri: {sub.judge_name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {sub.grade && (
                                  <Badge
                                    variant="outline"
                                    className="h-5 border-sky-200 px-1.5 text-[10px] font-bold text-sky-600"
                                  >
                                    {sub.grade}
                                  </Badge>
                                )}
                                <span className="font-poppins text-base font-bold text-neutral-800">
                                  {sub.score_value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Breakdown Pelanggaran */}
                  {selectedDetail.violations.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <h3 className="font-poppins text-sm font-semibold text-neutral-800">
                        Pelanggaran Tim
                      </h3>

                      <div className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-rose-50/50 p-4 sm:p-5">
                        <div className="flex flex-col gap-3">
                          {selectedDetail.violations.map((violation, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-xl border border-white bg-white p-3 shadow-sm"
                            >
                              <div className="flex flex-col gap-0.5">
                                <span className="font-poppins text-xs font-medium text-neutral-600">
                                  {violation.violation_name}
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                  Juri: {violation.judge_name}
                                </span>
                              </div>
                              <span className="font-poppins text-base font-bold text-red-500">
                                -{violation.point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center text-neutral-500">
                  Data tidak ditemukan.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
