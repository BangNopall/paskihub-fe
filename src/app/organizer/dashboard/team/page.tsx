"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  ChevronDown,
  Image as ImageIcon,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  Loader2,
  X,
  Download,
  Pencil,
  Check,
  Eye,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready)
// ==========================================

export type TingkatEvent = "SD/MI" | "SMP/MTS" | "SMA/SMK/MA" | "PURNA" | "UMUM"
export type TimStatus =
  | "Approved"
  | "Pending"
  | "Rejected"
  | "Belum Dinilai"
  | "Selesai Dinilai"
export type TipePembayaran = "Lunas" | "DP"

export interface MemberDoc {
  id: string
  name: string
  role: string // "Pelatih #1", "Official (1)", "Pasukan (1)"
  avatarUrl: string
  documentName?: string // "kartu-siti.jpg"
  documentUrl?: string
}

export interface TeamRecord {
  id: string
  name: string
  category: TingkatEvent
  coachName: string
  schoolName: string
  status: TimStatus
  paymentType: TipePembayaran // Penanda Lunas atau Masih DP
  logoUrl: string
  recommendationLetterName: string
  recommendationLetterUrl: string
  members: {
    pelatih: MemberDoc[]
    danpas: MemberDoc[]
    official: MemberDoc[]
    pasukan: MemberDoc[]
  }
}

export interface TeamStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const MOCK_STATS: TeamStats = {
  total: 45,
  pending: 12,
  approved: 28,
  rejected: 5,
}

const MOCK_TEAMS: TeamRecord[] = [
  {
    id: "tm-001",
    name: "Paskibra Cale",
    category: "SMA/SMK/MA",
    coachName: "Pak Budi Santoso",
    schoolName: "SMA Negeri 1 Jakarta",
    status: "Approved",
    paymentType: "Lunas",
    logoUrl: "", // Kosong untuk trigger fallback icon
    recommendationLetterName: "surat-rekomendasi-cale.pdf",
    recommendationLetterUrl: "#",
    members: {
      pelatih: [
        {
          id: "p1",
          name: "Pak Budi Santoso",
          role: "Pelatih Utama",
          avatarUrl: "",
        },
      ],
      danpas: [
        {
          id: "d1",
          name: "Siti Nurhaliza Putri",
          role: "Komandan Pasukan",
          avatarUrl: "",
          documentName: "kartu-siti.jpg",
          documentUrl: "#",
        },
      ],
      official: [
        {
          id: "o1",
          name: "Rudi Hartono",
          role: "Manager Tim",
          avatarUrl: "",
          documentName: "kartu-rudi.jpg",
          documentUrl: "#",
        },
      ],
      pasukan: [
        {
          id: "ps1",
          name: "Rudi Hartono",
          role: "Anggota Pasukan",
          avatarUrl: "",
          documentName: "kartu-rudi.jpg",
          documentUrl: "#",
        },
        {
          id: "ps2",
          name: "Ahmad Fauzi Rahmat",
          role: "Anggota Pasukan",
          avatarUrl: "",
          documentName: "kartu-ahmad.jpg",
          documentUrl: "#",
        },
      ],
    },
  },
  {
    id: "tm-002",
    name: "Garuda Nusantara",
    category: "SD/MI",
    coachName: "Budi Setiawan",
    schoolName: "SD Negeri 05 Bandung",
    status: "Pending",
    paymentType: "DP",
    logoUrl: "",
    recommendationLetterName: "surat-rekomendasi-garuda.pdf",
    recommendationLetterUrl: "#",
    members: { pelatih: [], danpas: [], official: [], pasukan: [] },
  },
]

const CATEGORY_FILTERS = ["Semua", "SD", "SMP", "SMA", "PURNA", "UMUM"]

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function StatusBadge({ status }: { status: TimStatus }) {
  switch (status) {
    case "Approved":
    case "Selesai Dinilai":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-green-400 bg-emerald-50 py-1 font-poppins text-xs font-normal text-green-600"
        >
          Approved
        </Badge>
      )
    case "Pending":
    case "Belum Dinilai":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-yellow-400 bg-yellow-50 py-1 font-poppins text-xs font-normal text-yellow-600"
        >
          Pending
        </Badge>
      )
    case "Rejected":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-red-400 bg-rose-50 py-1 font-poppins text-xs font-normal text-red-500"
        >
          Rejected
        </Badge>
      )
    default:
      return null
  }
}

function MemberCard({ member }: { member: MemberDoc }) {
  return (
    <div className="flex w-full items-start gap-4 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm transition-colors hover:border-sky-200">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-stone-200 shadow-sm">
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-5 w-5 text-neutral-400" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-poppins text-sm font-semibold text-neutral-800">
          {member.name}
        </span>
        <span className="font-poppins text-xs font-medium text-neutral-500">
          {member.role}
        </span>

        {/* Tombol Akses Berkas */}
        {member.documentUrl && (
          <a
            href={member.documentUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex w-fit items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-poppins text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            <FileText className="h-3.5 w-3.5" /> Lihat Berkas
          </a>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function OrganizerTeamListPage() {
  // --- STATE ---
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [teams, setTeams] = useState<TeamRecord[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [filterStatus, setFilterStatus] = useState<string>("Semua")

  // Modals
  const [selectedTeam, setSelectedTeam] = useState<TeamRecord | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isApproveSubmitting, setIsApproveSubmitting] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isRejectSubmitting, setIsRejectSubmitting] = useState(false)
  const [isKickModalOpen, setIsKickModalOpen] = useState(false)
  const [isKickSubmitting, setIsKickSubmitting] = useState(false)

  // --- API SIMULATION ---
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/organizer/teams
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setStats(MOCK_STATS)
        setTeams(MOCK_TEAMS)
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTeams()
  }, [])

  // --- HANDLERS ---

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return
    setIsApproveSubmitting(true)
    try {
      // TODO: API POST /api/organizer/teams/{id}/approve
      await new Promise((res) => setTimeout(res, 1000))
      setTeams((prev) =>
        prev.map((t) =>
          t.id === selectedTeam.id ? { ...t, status: "Approved" } : t
        )
      )
      setIsApproveModalOpen(false)
    } catch (error) {
      alert("Gagal melakukan approve.")
    } finally {
      setIsApproveSubmitting(false)
    }
  }

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam || !rejectReason.trim()) return
    setIsRejectSubmitting(true)
    try {
      // TODO: API POST /api/organizer/teams/{id}/reject
      await new Promise((res) => setTimeout(res, 1000))
      setTeams((prev) =>
        prev.map((t) =>
          t.id === selectedTeam.id ? { ...t, status: "Rejected" } : t
        )
      )
      setIsRejectModalOpen(false)
      setRejectReason("")
    } catch (error) {
      alert("Gagal melakukan reject.")
    } finally {
      setIsRejectSubmitting(false)
    }
  }

  const handleKickSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return
    setIsKickSubmitting(true)
    try {
      // TODO: API DELETE /api/organizer/teams/{id}/kick
      await new Promise((res) => setTimeout(res, 1000))
      setTeams((prev) => prev.filter((t) => t.id !== selectedTeam.id))
      setIsKickModalOpen(false)
    } catch (error) {
      alert("Gagal mengeluarkan tim.")
    } finally {
      setIsKickSubmitting(false)
    }
  }

  // --- FILTERING LOGIC ---
  const filteredTeams = teams.filter((team) => {
    const matchSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.coachName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory =
      activeCategory === "Semua" || team.category.includes(activeCategory)
    const matchStatus = filterStatus === "Semua" || team.status === filterStatus
    return matchSearch && matchCategory && matchStatus
  })

  // --- ERROR UI ---
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
          Muat Ulang
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
            Daftar Tim Peserta
          </h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-12 w-full max-w-2xl rounded-full" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* STATS CARDS */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition-all hover:border-sky-300 md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  {stats?.total}
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Total Tim
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition-all hover:border-yellow-300 md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  {stats?.pending}
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Menunggu Approval
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition-all hover:border-green-300 md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  {stats?.approved}
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Disetujui
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition-all hover:border-red-300 md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  {stats?.rejected}
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Ditolak
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition-all hover:border-red-300 md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  5
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Lunas
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition-all hover:border-red-300 md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  10
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Down Payment
                </span>
              </div>
            </div>

            {/* MAIN CONTENT CARD */}
            <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6">
              {/* FILTERS */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-2 hidden font-poppins text-sm font-medium text-slate-900 sm:block">
                    Filter:
                  </span>
                  {CATEGORY_FILTERS.map((cat) => (
                    <Button
                      key={cat}
                      variant={activeCategory === cat ? "default" : "outline"}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "h-9 rounded-lg px-4 py-2 font-poppins text-sm transition-colors",
                        activeCategory === cat
                          ? "border-red-400 bg-rose-50 text-red-500 hover:bg-rose-100 hover:text-red-600"
                          : "border-gray-200 bg-white text-zinc-600 hover:bg-gray-50"
                      )}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    placeholder="Cari nama tim atau pelatih..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border-gray-200 bg-white pl-10 font-poppins text-sm focus-visible:ring-sky-200"
                  />
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white/70 shadow-sm">
                <div className="overflow-x-auto">
                  <Table className="min-w-[900px]">
                    <TableHeader className="bg-blue-100/80">
                      <TableRow className="border-sky-100 hover:bg-transparent">
                        <TableHead className="w-16 py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                          No
                        </TableHead>
                        <TableHead className="py-4 font-poppins text-sm font-semibold text-neutral-700">
                          Tim
                        </TableHead>
                        <TableHead className="py-4 font-poppins text-sm font-semibold text-neutral-700">
                          Nama Pelatih
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                          Status Registrasi
                        </TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                          Status Pembayaran
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
                            colSpan={5}
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
                                    {team.name}
                                  </span>
                                  <Badge className="mt-1 w-fit border-gray-300 bg-sky-50 px-2 py-0 font-poppins text-[10px] font-medium text-slate-500 hover:bg-sky-50">
                                    {team.category}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 font-poppins text-sm text-neutral-600">
                              {team.coachName}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex justify-center">
                                <StatusBadge status={team.status} />
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex justify-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "w-24 justify-center py-1 font-poppins text-xs font-normal",
                                    team.paymentType === "Lunas"
                                      ? "border-emerald-400 bg-emerald-50 text-green-600"
                                      : "border-amber-400 bg-amber-50 text-amber-600"
                                  )}
                                >
                                  {team.paymentType}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTeam(team)
                                    setIsDetailModalOpen(true)
                                  }}
                                  className="h-8 bg-blue-400 font-poppins text-xs font-semibold text-white hover:bg-blue-500"
                                >
                                  Detail
                                </Button>

                                {team.status === "Pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedTeam(team)
                                        setIsApproveModalOpen(true)
                                      }}
                                      className="h-8 bg-green-400 font-poppins text-xs font-semibold text-white hover:bg-green-500"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedTeam(team)
                                        setIsRejectModalOpen(true)
                                      }}
                                      className="h-8 bg-rose-400 font-poppins text-xs font-semibold text-white hover:bg-rose-500"
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}

                                {team.status === "Approved" && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedTeam(team)
                                      setIsKickModalOpen(true)
                                    }}
                                    className="h-8 bg-red-400 font-poppins text-xs font-semibold text-white hover:bg-red-500"
                                  >
                                    Kick
                                  </Button>
                                )}
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
          </div>
        )}

        {/* =========================================
            MODALS SECTION (API-Ready, Rendered Once)
            ========================================= */}

        {/* 1. DETAIL MODAL DENGAN TABS */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-h-[90vh] w-full gap-0 overflow-y-auto rounded-3xl bg-white p-0 sm:min-w-xl sm:rounded-[40px]">
            {selectedTeam && (
              <div className="flex flex-col">
                <DialogHeader className="flex flex-row items-start justify-between space-y-0 border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-8">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-stone-200 bg-neutral-100 sm:h-16 sm:w-16">
                      {selectedTeam.logoUrl ? (
                        <img
                          src={selectedTeam.logoUrl}
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <DialogTitle className="font-poppins text-lg font-semibold text-neutral-900 sm:text-xl">
                        {selectedTeam.name}
                      </DialogTitle>
                      <StatusBadge status={selectedTeam.status} />
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex flex-col p-6 sm:px-10 sm:pt-6 sm:pb-10">
                  <Tabs defaultValue="umum" className="w-full">
                    {/* TABS LIST PILL */}
                    <TabsList className="mb-6 flex h-12 w-full rounded-full bg-neutral-100 p-1.5">
                      <TabsTrigger
                        value="umum"
                        className="flex-1 rounded-full font-poppins text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Info Umum
                      </TabsTrigger>
                      <TabsTrigger
                        value="anggota"
                        className="flex-1 rounded-full font-poppins text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Anggota
                      </TabsTrigger>
                      <TabsTrigger
                        value="berkas"
                        className="flex-1 rounded-full font-poppins text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Berkas
                      </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: INFO UMUM */}
                    <TabsContent
                      value="umum"
                      className="mt-0 flex flex-col gap-5 outline-none"
                    >
                      <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 p-5">
                        <h3 className="font-poppins text-base font-semibold text-neutral-800">
                          Informasi Tim
                        </h3>
                        <div className="mt-1 flex flex-col gap-3">
                          <div className="flex items-center justify-between border-b border-sky-100 pb-2 font-poppins text-sm">
                            <span className="text-neutral-500">Nama Tim:</span>
                            <span className="font-semibold text-neutral-800">
                              {selectedTeam.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b border-sky-100 pb-2 font-poppins text-sm">
                            <span className="text-neutral-500">
                              Asal Sekolah:
                            </span>
                            <span className="font-semibold text-neutral-800">
                              {selectedTeam.schoolName}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b border-sky-100 pb-2 font-poppins text-sm">
                            <span className="text-neutral-500">
                              Kategori Tingkat:
                            </span>
                            <span className="font-semibold text-neutral-800">
                              {selectedTeam.category}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-poppins text-sm">
                            <span className="text-neutral-500">
                              Tipe Pembayaran:
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-full border-blue-200 bg-blue-50 px-2.5 py-0.5 font-poppins text-xs font-semibold text-blue-600"
                              )}
                            >
                              {selectedTeam.paymentType === "Lunas"
                                ? "Lunas"
                                : "Masih DP"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 p-5">
                        <h3 className="font-poppins text-base font-semibold text-neutral-800">
                          Informasi Kontak
                        </h3>
                        <div className="mt-1 flex flex-col gap-3">
                          <div className="flex items-center justify-between border-b border-sky-100 pb-2 font-poppins text-sm">
                            <span className="text-neutral-500">
                              Penanggung Jawab:
                            </span>
                            <span className="font-semibold text-neutral-800">
                              {selectedTeam.coachName}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-poppins text-sm">
                            <span className="text-neutral-500">
                              Email Sekolah/Tim:
                            </span>
                            <span className="truncate font-semibold text-neutral-800">
                              tim@example.com
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 p-5">
                        <h3 className="font-poppins text-base font-semibold text-neutral-800">
                          Bukti Pembayaran
                        </h3>
                        <div className="mt-1 flex flex-col gap-3">
                          <Link
                            href={'#'}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-stone-300 bg-sky-50 p-8 transition-colors hover:border-blue-300 hover:bg-blue-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-500 transition-transform group-hover:scale-110 group-hover:bg-blue-500">
                              <Eye className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-montserrat text-sm font-semibold text-neutral-700 group-hover:text-blue-600">
                              Klik untuk melihat bukti transfer
                            </span>
                          </Link>
                        </div>
                      </div>
                    </TabsContent>

                    {/* TAB 2: ANGGOTA */}
                    <TabsContent value="anggota" className="mt-0 outline-none">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                        {/* Kolom Kiri */}
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-3">
                            <h3 className="border-b border-gray-100 pb-2 font-poppins text-base font-semibold text-neutral-800">
                              Pelatih ({selectedTeam.members.pelatih.length})
                            </h3>
                            {selectedTeam.members.pelatih.length > 0 ? (
                              selectedTeam.members.pelatih.map((m) => (
                                <MemberCard key={m.id} member={m} />
                              ))
                            ) : (
                              <span className="font-poppins text-sm text-neutral-400">
                                Kosong
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-3">
                            <h3 className="border-b border-gray-100 pb-2 font-poppins text-base font-semibold text-neutral-800">
                              Danpas ({selectedTeam.members.danpas.length})
                            </h3>
                            {selectedTeam.members.danpas.length > 0 ? (
                              selectedTeam.members.danpas.map((m) => (
                                <MemberCard key={m.id} member={m} />
                              ))
                            ) : (
                              <span className="font-poppins text-sm text-neutral-400">
                                Kosong
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-3">
                            <h3 className="border-b border-gray-100 pb-2 font-poppins text-base font-semibold text-neutral-800">
                              Official ({selectedTeam.members.official.length})
                            </h3>
                            {selectedTeam.members.official.length > 0 ? (
                              selectedTeam.members.official.map((m) => (
                                <MemberCard key={m.id} member={m} />
                              ))
                            ) : (
                              <span className="font-poppins text-sm text-neutral-400">
                                Kosong
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-3">
                            <h3 className="border-b border-gray-100 pb-2 font-poppins text-base font-semibold text-neutral-800">
                              Pasukan ({selectedTeam.members.pasukan.length})
                            </h3>
                            {selectedTeam.members.pasukan.length > 0 ? (
                              selectedTeam.members.pasukan.map((m) => (
                                <MemberCard key={m.id} member={m} />
                              ))
                            ) : (
                              <span className="font-poppins text-sm text-neutral-400">
                                Kosong
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* TAB 3: BERKAS */}
                    <TabsContent
                      value="berkas"
                      className="mt-0 flex flex-col gap-6 outline-none"
                    >
                      <div className="flex flex-col gap-3">
                        <h3 className="font-poppins text-base font-semibold text-neutral-800">
                          Dokumen Pendaftaran Tim
                        </h3>
                        <div className="flex flex-col justify-between gap-4 rounded-xl border border-blue-200 bg-indigo-50/50 p-4 shadow-sm sm:flex-row sm:items-center">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-poppins text-sm font-semibold text-neutral-800">
                                Surat Rekomendasi Sekolah
                              </span>
                              <span className="truncate font-poppins text-xs text-neutral-500">
                                {selectedTeam.recommendationLetterName}
                              </span>
                            </div>
                          </div>
                          <a
                            href={selectedTeam.recommendationLetterUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-blue-200 font-poppins text-sm font-medium text-blue-600 hover:bg-blue-100"
                            >
                              <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h3 className="font-poppins text-base font-semibold text-neutral-800">
                          Logo Tim
                        </h3>
                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-stone-100 shadow-sm">
                          {selectedTeam.logoUrl ? (
                            <img
                              src={selectedTeam.logoUrl}
                              alt="Logo Tim"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-neutral-400" />
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 2. APPROVE MODAL */}
        <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
          <DialogContent className="w-full max-w-lg gap-0 rounded-3xl p-0 sm:rounded-[40px]">
            {selectedTeam && (
              <form
                onSubmit={handleApproveSubmit}
                className="flex flex-col gap-8 p-6 sm:p-10"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="font-montserrat text-2xl font-bold text-neutral-800">
                    Approve Tim
                  </h2>
                  <p className="font-poppins text-sm text-neutral-600">
                    Apakah Anda yakin menyetujui pendaftaran tim <br />{" "}
                    <span className="font-semibold text-green-600">
                      {selectedTeam.name}
                    </span>
                    ?
                  </p>
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
                    disabled={isApproveSubmitting}
                    className="h-12 flex-1 rounded-full bg-green-500 font-poppins text-base font-bold text-white hover:bg-green-600 disabled:opacity-50"
                  >
                    {isApproveSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* 3. REJECT MODAL */}
        <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
          <DialogContent className="w-full max-w-xl gap-0 rounded-3xl p-0 sm:rounded-[40px]">
            {selectedTeam && (
              <form onSubmit={handleRejectSubmit} className="flex flex-col">
                <div className="flex flex-col items-center gap-2 border-b border-neutral-200/50 p-6 pb-4 text-center sm:px-10 sm:pt-10">
                  <h2 className="font-montserrat text-2xl font-bold text-neutral-800">
                    Tolak Tim
                  </h2>
                  <p className="font-poppins text-sm text-neutral-400">
                    Berikan alasan penolakan tim{" "}
                    <span className="font-medium text-neutral-700">
                      {selectedTeam.name}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-6 p-6 sm:p-10">
                  <div className="flex flex-col gap-2">
                    <Label className="font-poppins text-sm text-neutral-700">
                      Alasan Penolakan <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Contoh: Surat rekomendasi tidak sah atau data anggota tidak lengkap"
                      className="h-24 resize-y bg-white font-poppins text-sm focus-visible:ring-sky-200"
                      required
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
                      disabled={isRejectSubmitting || !rejectReason.trim()}
                      className="h-12 flex-1 rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500 disabled:opacity-50"
                    >
                      {isRejectSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Tolak Tim"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* 4. KICK MODAL */}
        <Dialog open={isKickModalOpen} onOpenChange={setIsKickModalOpen}>
          <DialogContent className="w-full max-w-lg gap-0 rounded-3xl p-0 sm:rounded-[40px]">
            {selectedTeam && (
              <form
                onSubmit={handleKickSubmit}
                className="flex flex-col gap-8 p-6 sm:p-10"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <Trash2 className="h-8 w-8 text-red-500" />
                  </div>
                  <h2 className="font-montserrat text-2xl font-bold text-neutral-800">
                    Kick Tim
                  </h2>
                  <p className="font-poppins text-sm text-neutral-600">
                    Apakah Anda yakin kick (hapus secara permanen) peserta ini
                    dari event? <br />
                    <span className="font-semibold text-red-500">
                      {selectedTeam.schoolName} ({selectedTeam.name})
                    </span>
                  </p>
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
                    disabled={isKickSubmitting}
                    className="h-12 flex-1 rounded-full bg-red-500 font-poppins text-base font-bold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {isKickSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Ya, Kick Tim"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
