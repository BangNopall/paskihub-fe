"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Check,
  X,
  Eye,
  Trash2,
} from "lucide-react"

// --- SHADCN UI COMPONENTS ---
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready Architecture)
// ==========================================

export type CategoryType = "SD" | "SMP" | "SMA" | "PURNA" | "UMUM"
export type PaymentStatus = "Pending" | "Approved" | "Ditolak"

export interface TeamStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export interface TeamDetail {
  id: string
  logoUrl: string
  teamName: string
  schoolName: string
  category: CategoryType
  memberCount: number
  schoolAddress: string
  coachName: string
  phoneNumber: string
  email: string
  paymentStatus: PaymentStatus
  paymentProofUrl: string
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

const MOCK_TEAMS: TeamDetail[] = [
  {
    id: "tm-1",
    logoUrl: "",
    teamName: "Garuda Nusantara",
    schoolName: "SDN 01 Jakarta Pusat",
    category: "SD",
    memberCount: 15,
    schoolAddress: "Jl. Merdeka No. 123, Jakarta Pusat",
    coachName: "Budi Santoso, S.Pd",
    phoneNumber: "+62 812-3456-7890",
    email: "garuda.nusantara@email.com",
    paymentStatus: "Pending",
    paymentProofUrl: "#",
  },
  {
    id: "tm-2",
    logoUrl: "",
    teamName: "Elang Merah",
    schoolName: "SMPN 5 Bandung",
    category: "SMP",
    memberCount: 18,
    schoolAddress: "Jl. Diponegoro No. 45, Bandung",
    coachName: "Andi Saputra",
    phoneNumber: "+62 813-4567-8901",
    email: "elang.merah@email.com",
    paymentStatus: "Approved",
    paymentProofUrl: "#",
  },
  {
    id: "tm-3",
    logoUrl: "",
    teamName: "Sakti Perkasa",
    schoolName: "SMAN 3 Surabaya",
    category: "SMA",
    memberCount: 20,
    schoolAddress: "Jl. Pahlawan No. 10, Surabaya",
    coachName: "Siti Aminah",
    phoneNumber: "+62 814-5678-9012",
    email: "sakti.perkasa@email.com",
    paymentStatus: "Ditolak",
    paymentProofUrl: "#",
  },
]

const CATEGORY_FILTERS = ["Semua", "SD", "SMP", "SMA", "PURNA", "UMUM"]

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function PaymentBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "Pending":
      return (
        <Badge
          variant="outline"
          className="border-yellow-400 bg-yellow-50 font-poppins font-normal text-yellow-600"
        >
          Pending
        </Badge>
      )
    case "Approved":
      return (
        <Badge
          variant="outline"
          className="border-green-400 bg-emerald-50 font-poppins font-normal text-green-600"
        >
          Approved
        </Badge>
      )
    case "Ditolak":
      return (
        <Badge
          variant="outline"
          className="border-red-400 bg-rose-50 font-poppins font-normal text-red-600"
        >
          Ditolak
        </Badge>
      )
    default:
      return null
  }
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function OrganizerTeamListPage() {
  // --- DATA STATE ---
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [teams, setTeams] = useState<TeamDetail[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // --- FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("Semua")

  // --- MODAL STATES ---
  // Kita pisahkan state modal agar tidak di-render berulang kali di dalam map
  const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null)

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isApproveSubmitting, setIsApproveSubmitting] = useState(false)

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isRejectSubmitting, setIsRejectSubmitting] = useState(false)

  const [isKickModalOpen, setIsKickModalOpen] = useState(false)
  const [isKickSubmitting, setIsKickSubmitting] = useState(false)

  // --- FETCH DATA SIMULATION ---
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/organizer/teams di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setStats(MOCK_STATS)
        setTeams(MOCK_TEAMS)
      } catch (error) {
        console.error("Gagal memuat data tim:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTeams()
  }, [])

  // --- DERIVED DATA (FILTERING) ---
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      activeCategory === "Semua" || team.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // --- ACTION HANDLERS ---
  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return
    setIsApproveSubmitting(true)
    try {
      // TODO: API POST /api/organizer/teams/{id}/approve
      console.log("Approve Team ID:", selectedTeam.id)
      await new Promise((res) => setTimeout(res, 1500))

      // Update local state (Optimistic UI)
      setTeams((prev) =>
        prev.map((t) =>
          t.id === selectedTeam.id ? { ...t, paymentStatus: "Approved" } : t
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
    if (!selectedTeam || !rejectReason.trim()) {
      alert("Alasan penolakan wajib diisi.")
      return
    }
    setIsRejectSubmitting(true)
    try {
      // TODO: API POST /api/organizer/teams/{id}/reject
      console.log("Reject Team ID:", selectedTeam.id, "Reason:", rejectReason)
      await new Promise((res) => setTimeout(res, 1500))

      setTeams((prev) =>
        prev.map((t) =>
          t.id === selectedTeam.id ? { ...t, paymentStatus: "Ditolak" } : t
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
      console.log("Kick Team ID:", selectedTeam.id)
      await new Promise((res) => setTimeout(res, 1500))

      setTeams((prev) => prev.filter((t) => t.id !== selectedTeam.id))
      setIsKickModalOpen(false)
    } catch (error) {
      alert("Gagal mengeluarkan tim.")
    } finally {
      setIsKickSubmitting(false)
    }
  }

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
          className="mt-4 rounded-full bg-blue-500"
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
          Daftar Tim Peserta
        </h1>

        {isLoading || !stats ? (
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
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  {stats.total}
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Total Tim
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  {stats.pending}
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Menunggu Approval
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  {stats.approved}
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Disetujui
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm md:p-6">
                <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
                  {stats.rejected}
                </span>
                <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
                  Ditolak
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
                        "h-9 rounded-lg px-4 py-2 font-poppins text-sm",
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
                    placeholder="Cari nama tim atau sekolah..."
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
                        <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                          Kategori
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
                                    {team.teamName}
                                  </span>
                                  <span className="font-poppins text-xs text-neutral-500">
                                    {team.schoolName}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-center font-poppins text-sm font-medium text-neutral-700">
                              {team.category}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex justify-center">
                                <PaymentBadge status={team.paymentStatus} />
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

                                {team.paymentStatus === "Pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedTeam(team)
                                        setIsApproveModalOpen(true)
                                      }}
                                      className="h-8 bg-green-400 font-poppins text-xs font-semibold text-white hover:bg-green-500"
                                    >
                                      Approved
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

                                {team.paymentStatus === "Approved" && (
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
            MODALS (Rendered Once, Controlled by State)
            ========================================= */}

        {/* 1. DETAIL MODAL */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-h-[90vh] w-full max-w-2xl gap-0 overflow-y-auto rounded-3xl p-0 sm:rounded-[40px]">
            {selectedTeam && (
              <div className="flex flex-col">
                <DialogHeader className="border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-8">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="font-montserrat text-xl font-bold text-neutral-800">
                      Detail Tim Peserta
                    </DialogTitle>
                  </div>
                </DialogHeader>

                <div className="flex flex-col gap-6 p-6 sm:px-10 sm:pt-6 sm:pb-10">
                  {/* Informasi Tim */}
                  <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-5">
                    <h3 className="font-poppins text-lg font-semibold text-slate-900">
                      Informasi Tim
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-poppins text-sm text-neutral-500">
                          Nama Tim
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedTeam.teamName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-poppins text-sm text-neutral-500">
                          Kategori
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedTeam.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-poppins text-sm text-neutral-500">
                          Jumlah Anggota
                        </span>
                        <span className="font-poppins text-sm font-medium text-neutral-800">
                          {selectedTeam.memberCount} orang
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-poppins text-sm text-neutral-500">
                          Status Pembayaran
                        </span>
                        <PaymentBadge status={selectedTeam.paymentStatus} />
                      </div>
                    </div>
                  </div>

                  {/* Informasi Sekolah */}
                  <div className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-5">
                    <h3 className="font-poppins text-lg font-semibold text-slate-900">
                      Informasi Sekolah
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-poppins text-sm text-neutral-500">
                          Nama Sekolah
                        </span>
                        <span className="text-right font-poppins text-sm font-medium text-neutral-800">
                          {selectedTeam.schoolName}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-poppins text-sm text-neutral-500">
                          Alamat
                        </span>
                        <span className="text-right font-poppins text-sm font-medium text-neutral-800">
                          {selectedTeam.schoolAddress}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-poppins text-sm text-neutral-500">
                          Nama Pelatih
                        </span>
                        <span className="text-right font-poppins text-sm font-medium text-neutral-800">
                          {selectedTeam.coachName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-poppins text-sm text-neutral-500">
                          No. Telepon
                        </span>
                        <span className="text-right font-poppins text-sm font-medium text-neutral-800">
                          {selectedTeam.phoneNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-poppins text-sm text-neutral-500">
                          Email
                        </span>
                        <span className="truncate text-right font-poppins text-sm font-medium text-neutral-800">
                          {selectedTeam.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bukti Transfer */}
                  <a
                    href={selectedTeam.paymentProofUrl}
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
                  </a>
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
                  <h2 className="font-montserrat text-2xl font-bold text-neutral-800">
                    Konfirmasi
                  </h2>
                  <p className="font-poppins text-sm text-neutral-600">
                    Approve peserta ini? Saldo kamu akan{" "}
                    <span className="font-semibold text-red-500">
                      terpotong 1 koin
                    </span>
                    .
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
                    Reject Tim
                  </h2>
                  <p className="font-poppins text-sm text-neutral-400">
                    Berikan alasan penolakan tim
                  </p>
                </div>
                <div className="flex flex-col gap-6 p-6 sm:p-10">
                  <div className="flex flex-col gap-2">
                    <Label className="font-poppins text-sm text-neutral-700">
                      Alasan Penolakan
                    </Label>
                    <Textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Contoh: Bukti transfer tidak jelas atau tidak sesuai jumlah pembayaran"
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
                      disabled={isRejectSubmitting || !rejectReason}
                      className="h-12 flex-1 rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500 disabled:opacity-50"
                    >
                      {isRejectSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Reject"
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
                    Apakah Anda yakin kick peserta ini? <br />
                    <span className="font-semibold text-red-500">
                      {selectedTeam.schoolName} ({selectedTeam.teamName})
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
                      "Kick Tim"
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
