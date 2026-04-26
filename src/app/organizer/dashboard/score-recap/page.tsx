"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  AlertCircle,
  Loader2,
  Trophy,
  Medal,
  Award,
  Image as ImageIcon,
  X,
} from "lucide-react"

// --- SHADCN UI COMPONENTS ---
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  DialogClose,
} from "@/components/ui/dialog"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready)
// ==========================================

export type CategoryLevel = "SD" | "SMP" | "SMA" | "PURNA" | "UMUM"
export type AssessmentStatus =
  | "Sedang Dinilai"
  | "Selesai Dinilai"
  | "Belum Dinilai"

export interface TeamScore {
  id: string
  logoUrl: string
  teamName: string
  schoolName: string
  category: CategoryLevel
  totalScore: number
  status: AssessmentStatus
}

export interface SubCategoryScore {
  name: string
  score: number
}

export interface JudgeBreakdown {
  judgeId: string
  judgeName: string
  totalPoints: number
  subScores: SubCategoryScore[]
}

export interface ViolationDetail {
  name: string
  penalty: number
}

export interface TeamScoreDetail {
  teamId: string
  teamName: string
  category: CategoryLevel
  logoUrl: string
  rawTotalScore: number
  penalty: number
  finalScore: number
  judgeBreakdowns: JudgeBreakdown[]
  violations: ViolationDetail[] // Penambahan detail pelanggaran
}

export interface WinnerEntry {
  id: string
  rankLabel: string // e.g., "Juara 1", "Harapan 1"
  teamName: string
  schoolName: string
  score: number
  iconType: "trophy" | "medal" | "award"
  iconColor: "amber" | "stone" | "amber-600" | "blue" | "emerald" | "rose"
}

export interface ChampionCategory {
  id: string
  title: string
  description?: string
  winners: WinnerEntry[]
}

export interface ScoreRecapData {
  teams: TeamScore[]
  champions: ChampionCategory[]
}

// ==========================================
// 2. CONSTANTS & MOCK DATA
// ==========================================

const FILTER_TABS = ["Semua", "SD", "SMP", "SMA", "PURNA", "UMUM"]

const MOCK_TEAMS: TeamScore[] = [
  {
    id: "tm-1",
    logoUrl: "",
    teamName: "Garuda Nusantara",
    schoolName: "SDN 05 Jakarta Selatan",
    category: "SD",
    totalScore: 285,
    status: "Selesai Dinilai",
  },
  {
    id: "tm-2",
    logoUrl: "",
    teamName: "Garuda Nusantara",
    schoolName: "SDN 09 Bandung",
    category: "SD",
    totalScore: 278,
    status: "Selesai Dinilai",
  },
  {
    id: "tm-3",
    logoUrl: "",
    teamName: "Garuda Nusantara",
    schoolName: "SD Negeri 7 Semarang",
    category: "SD",
    totalScore: 272,
    status: "Selesai Dinilai",
  },
  {
    id: "tm-4",
    logoUrl: "",
    teamName: "Garuda Nusantara",
    schoolName: "SD Negeri 15 Bekasi",
    category: "SD",
    totalScore: 245,
    status: "Sedang Dinilai",
  },
  {
    id: "tm-5",
    logoUrl: "",
    teamName: "Garuda Nusantara",
    schoolName: "SDN 01 Jakarta Pusat",
    category: "SD",
    totalScore: 192,
    status: "Sedang Dinilai",
  },
  {
    id: "tm-6",
    logoUrl: "",
    teamName: "Garuda Nusantara",
    schoolName: "SD Negeri 12 Depok",
    category: "SD",
    totalScore: 0,
    status: "Sedang Dinilai",
  },
]

const MOCK_CHAMPIONS: ChampionCategory[] = [
  {
    id: "champ-1",
    title: "Juara Umum",
    description: "Kategori: PBB + Danton + Variasi",
    winners: [
      {
        id: "w-1",
        rankLabel: "Juara 1",
        teamName: "Kilat Merah",
        schoolName: "SDN 05 Jakarta Selatan",
        score: 285,
        iconType: "trophy",
        iconColor: "amber",
      },
      {
        id: "w-2",
        rankLabel: "Juara 2",
        teamName: "Kilat Merah",
        schoolName: "SDN 05 Jakarta Selatan",
        score: 278,
        iconType: "medal",
        iconColor: "stone",
      },
      {
        id: "w-3",
        rankLabel: "Juara 3",
        teamName: "Kilat Merah",
        schoolName: "SDN 05 Jakarta Selatan",
        score: 272,
        iconType: "medal",
        iconColor: "amber-600",
      },
      {
        id: "w-4",
        rankLabel: "Harapan 1",
        teamName: "Kilat Merah",
        schoolName: "SDN 05 Jakarta Selatan",
        score: 245,
        iconType: "award",
        iconColor: "blue",
      },
      {
        id: "w-5",
        rankLabel: "Harapan 2",
        teamName: "Kilat Merah",
        schoolName: "SDN 05 Jakarta Selatan",
        score: 192,
        iconType: "award",
        iconColor: "emerald",
      },
      {
        id: "w-6",
        rankLabel: "Harapan 3",
        teamName: "Kilat Merah",
        schoolName: "SDN 05 Jakarta Selatan",
        score: 100,
        iconType: "award",
        iconColor: "rose",
      },
    ],
  },
  {
    id: "champ-2",
    title: "Juara PBB Terbaik",
    description: "",
    winners: [
      {
        id: "w-7",
        rankLabel: "Juara 1",
        teamName: "Kilat Merah",
        schoolName: "SDN 05 Jakarta Selatan",
        score: 98,
        iconType: "trophy",
        iconColor: "amber",
      },
    ],
  },
  {
    id: "champ-3",
    title: "Juara Danton Terbaik",
    description: "",
    winners: [
      {
        id: "w-8",
        rankLabel: "Juara 1",
        teamName: "Kilat Merah",
        schoolName: "SDN 05 Jakarta Selatan",
        score: 49,
        iconType: "trophy",
        iconColor: "amber",
      },
    ],
  },
]

const MOCK_TEAM_DETAIL: TeamScoreDetail = {
  teamId: "tm-1",
  teamName: "Garuda Nusantara",
  category: "SD",
  logoUrl: "",
  rawTotalScore: 290,
  penalty: 5,
  finalScore: 285,
  violations: [
    { name: "Tidak Seragam", penalty: 2 },
    { name: "Keluar dari Formasi", penalty: 3 },
  ],
  judgeBreakdowns: [
    {
      judgeId: "j-1",
      judgeName: "Juri Budi Santoso, S.Pd",
      totalPoints: 98,
      subScores: [
        { name: "Gerakan di Tempat", score: 38 },
        { name: "Langkah Tegap", score: 40 },
        { name: "Kerapian", score: 20 },
      ],
    },
    {
      judgeId: "j-2",
      judgeName: "Juri Danton",
      totalPoints: 47,
      subScores: [
        { name: "Ketegasan Suara", score: 38 },
        { name: "Penampilan Danton", score: 40 },
      ],
    },
  ],
}

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function StatusBadge({ status }: { status: AssessmentStatus }) {
  switch (status) {
    case "Selesai Dinilai":
      return (
        <Badge
          variant="outline"
          className="border-green-400 bg-emerald-50 font-poppins font-normal text-green-600"
        >
          Selesai Dinilai
        </Badge>
      )
    case "Sedang Dinilai":
      return (
        <Badge
          variant="outline"
          className="border-yellow-400 bg-yellow-50 font-poppins font-normal text-yellow-600"
        >
          Sedang Dinilai
        </Badge>
      )
    case "Belum Dinilai":
      return (
        <Badge
          variant="outline"
          className="border-stone-300 bg-gray-50 font-poppins font-normal text-neutral-500"
        >
          Belum Dinilai
        </Badge>
      )
    default:
      return null
  }
}

function getIconStyles(colorType: WinnerEntry["iconColor"]) {
  switch (colorType) {
    case "amber":
      return "text-amber-500"
    case "stone":
      return "text-stone-400"
    case "amber-600":
      return "text-amber-600"
    case "blue":
      return "text-blue-400"
    case "emerald":
      return "text-emerald-400"
    case "rose":
      return "text-rose-400"
    default:
      return "text-neutral-400"
  }
}

function getIconComponent(type: WinnerEntry["iconType"]) {
  switch (type) {
    case "trophy":
      return Trophy
    case "medal":
      return Medal
    case "award":
      return Award
    default:
      return Award
  }
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function ScoreRecapPage() {
  // --- STATE MANAGEMENT ---
  const [data, setData] = useState<ScoreRecapData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [isPublishing, setIsPublishing] = useState<boolean>(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("Semua")

  // Modal Details
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false)
  const [selectedDetail, setSelectedDetail] = useState<TeamScoreDetail | null>(
    null
  )
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false)

  // --- API SIMULATION (FETCH MAIN DATA) ---
  useEffect(() => {
    const fetchRecapData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi API GET /api/organizer/score-recap
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setData({ teams: MOCK_TEAMS, champions: MOCK_CHAMPIONS })
      } catch (error) {
        console.error("Gagal memuat rekap nilai:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRecapData()
  }, [])

  // --- DERIVED DATA (FILTERING) ---
  const filteredTeams =
    data?.teams.filter((team) => {
      const matchSearch =
        team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCategory =
        activeFilter === "Semua" || team.category === activeFilter
      return matchSearch && matchCategory
    }) || []

  // Dynamic filter counts
  const getFilterCounts = () => {
    if (!data) return {}
    const counts: Record<string, number> = {
      Semua: data.teams.length,
      SD: 0,
      SMP: 0,
      SMA: 0,
      PURNA: 0,
      UMUM: 0,
    }
    data.teams.forEach((t) => {
      if (counts[t.category] !== undefined) counts[t.category]++
    })
    return counts
  }
  const filterCounts = getFilterCounts()

  // --- HANDLERS ---
  const handlePublish = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin mempublikasikan hasil nilai dan daftar juara ke peserta?"
      )
    )
      return
    setIsPublishing(true)
    try {
      // TODO: API POST /api/organizer/score-recap/publish
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Hasil rekap nilai berhasil dipublikasikan!")
    } catch (error) {
      alert("Gagal mempublikasikan hasil.")
    } finally {
      setIsPublishing(false)
    }
  }

  const handleOpenDetail = async (teamId: string) => {
    setIsDetailModalOpen(true)
    setIsDetailLoading(true)
    setSelectedDetail(null)
    try {
      // TODO: API GET /api/organizer/score-recap/teams/{teamId}
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSelectedDetail(MOCK_TEAM_DETAIL)
    } catch (error) {
      alert("Gagal memuat detail tim.")
      setIsDetailModalOpen(false)
    } finally {
      setIsDetailLoading(false)
    }
  }

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Rekap Nilai
          </h1>
          <Button
            onClick={handlePublish}
            disabled={isLoading || isPublishing}
            className="rounded-full bg-red-400 px-8 font-montserrat font-bold text-white shadow-sm hover:bg-red-500"
          >
            {isPublishing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isPublishing ? "Memproses..." : "Publish Hasil"}
          </Button>
        </div>

        {/* LOADING SKELETON OR CONTENT */}
        {isLoading || !data ? (
          <div className="flex flex-col gap-8">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
            <Skeleton className="h-[600px] w-full rounded-3xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* --- SECTION 1: FILTER & TABLE REKAP NILAI --- */}
            <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6">
              {/* FILTERS */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <span className="font-poppins text-sm font-medium text-slate-900">
                    Filter:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {FILTER_TABS.map((tab) => (
                      <Button
                        key={tab}
                        variant={activeFilter === tab ? "default" : "outline"}
                        onClick={() => setActiveFilter(tab)}
                        className={cn(
                          "h-9 rounded-lg px-4 py-2 font-poppins text-sm",
                          activeFilter === tab
                            ? "border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
                            : "border-gray-200 bg-white text-zinc-600 hover:bg-gray-50"
                        )}
                      >
                        {tab} ({filterCounts[tab] || 0})
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
                          Nama Sekolah
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                          Total Nilai
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                          Status
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeams.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="py-10 text-center font-poppins text-sm text-neutral-500"
                          >
                            Tidak ada tim yang ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTeams.map((team, index) => (
                          <TableRow
                            key={team.id}
                            className="border-sky-100 bg-transparent hover:bg-white/50"
                          >
                            <TableCell className="py-4 text-center font-poppins text-sm font-medium text-neutral-700">
                              {index + 1}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-200">
                                  {team.logoUrl ? (
                                    <img
                                      src={team.logoUrl}
                                      alt="Logo"
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="h-5 w-5 text-neutral-400" />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-poppins text-sm font-semibold text-neutral-800">
                                    {team.teamName}
                                  </span>
                                  <Badge className="mt-1 w-fit border-gray-300 bg-sky-50 px-2 py-0 font-poppins text-[10px] font-medium text-slate-500 hover:bg-sky-50">
                                    {team.category}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-center font-poppins text-sm text-neutral-600">
                              {team.schoolName}
                            </TableCell>
                            <TableCell className="py-4 text-center font-poppins text-sm font-bold text-neutral-800">
                              {team.totalScore}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex justify-center">
                                <StatusBadge status={team.status} />
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex justify-center">
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenDetail(team.id)}
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
              <h2 className="font-poppins text-xl font-semibold text-slate-900">
                Daftar Juara
              </h2>

              <div className="flex flex-col gap-6">
                {data.champions.map((champion) => (
                  <div key={champion.id} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-poppins text-lg font-semibold text-slate-900">
                        {champion.title}
                      </h3>
                      {champion.description && (
                        <span className="font-poppins text-sm text-neutral-500">
                          {champion.description}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-white/70 p-4 shadow-sm sm:p-6">
                      {champion.winners.map((winner) => {
                        const Icon = getIconComponent(winner.iconType)
                        const iconColor = getIconStyles(winner.iconColor)

                        return (
                          <div
                            key={winner.id}
                            className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                          >
                            <div className="flex items-center gap-4">
                              <Icon
                                className={cn("h-6 w-6 shrink-0", iconColor)}
                              />
                              <div className="flex flex-col gap-1">
                                <span className="font-poppins text-base font-semibold text-neutral-800">
                                  {winner.rankLabel}
                                </span>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                  <span className="font-poppins text-sm text-neutral-600">
                                    {winner.teamName}
                                  </span>
                                  <span className="hidden text-neutral-300 sm:inline">
                                    •
                                  </span>
                                  <span className="font-poppins text-xs text-neutral-400">
                                    {winner.schoolName}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="font-poppins text-xl font-bold text-neutral-800 sm:text-right">
                              {winner.score}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            MODAL DETAIL NILAI TIM (API READY)
            ========================================= */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-h-[90vh] w-full max-w-2xl gap-0 overflow-y-auto rounded-3xl p-0 sm:rounded-[40px]">
            <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-8">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex-1 text-center font-montserrat text-xl font-bold text-neutral-800 sm:text-2xl">
                  Detail Nilai Tim
                </DialogTitle>
              </div>
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-200">
                      {selectedDetail.logoUrl ? (
                        <img
                          src={selectedDetail.logoUrl}
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-poppins text-base font-semibold text-neutral-800">
                        {selectedDetail.teamName}
                      </span>
                      <span className="font-poppins text-xs font-medium text-neutral-500">
                        {selectedDetail.category}
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
                        {selectedDetail.rawTotalScore}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-4 shadow-sm">
                      <span className="font-poppins text-xs text-neutral-500">
                        Pelanggaran
                      </span>
                      <span className="font-poppins text-xl font-bold text-neutral-800">
                        -{selectedDetail.penalty}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-4 shadow-sm">
                      <span className="font-poppins text-xs text-neutral-500">
                        Nilai Akhir
                      </span>
                      <span className="font-poppins text-xl font-bold text-neutral-800">
                        {selectedDetail.finalScore}
                      </span>
                    </div>
                  </div>

                  {/* Breakdown Juri */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-poppins text-sm font-semibold text-neutral-800">
                      Breakdown Nilai per Juri
                    </h3>

                    {selectedDetail.judgeBreakdowns.map((juri) => (
                      <div
                        key={juri.judgeId}
                        className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-100/50 p-4 sm:p-5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-poppins text-sm font-medium text-neutral-700">
                            {juri.judgeName}
                          </span>
                          <span className="font-poppins text-base font-bold text-neutral-800">
                            {juri.totalPoints} poin
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                          {juri.subScores.map((sub, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col gap-1 rounded-xl border border-white bg-white p-3 shadow-sm"
                            >
                              <span className="truncate font-poppins text-xs font-medium text-neutral-600">
                                {sub.name}
                              </span>
                              <span className="font-poppins text-lg font-bold text-neutral-800">
                                {sub.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Breakdown Pelanggaran */}
                  {selectedDetail.violations &&
                    selectedDetail.violations.length > 0 && (
                      <div className="mt-2 flex flex-col gap-4">
                        <h3 className="font-poppins text-sm font-semibold text-neutral-800">
                          Pelanggaran Tim
                        </h3>

                        <div className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-rose-50/50 p-4 sm:p-5">
                          <div className="flex items-center justify-between">
                            <span className="font-poppins text-sm font-medium text-neutral-700">
                              Total Pengurangan
                            </span>
                            <span className="font-poppins text-base font-bold text-red-500">
                              -{selectedDetail.penalty} poin
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                            {selectedDetail.violations.map((violation, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col gap-1 rounded-xl border border-white bg-white p-3 shadow-sm"
                              >
                                <span className="truncate font-poppins text-xs font-medium text-neutral-600">
                                  {violation.name}
                                </span>
                                <span className="font-poppins text-lg font-bold text-red-500">
                                  -{violation.penalty}
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
