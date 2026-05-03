"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import {
  Search,
  Image as ImageIcon,
  Trash2,
  FileText,
  Loader2,
  Download,
  Check,
  Eye,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { EOTeamListRes, EOTeamDetailRes } from "@/schemas/eo-team.schema"
import {
  approveTeamAction,
  rejectTeamAction,
  kickTeamAction,
} from "@/actions/eo-team.actions"
import { eoTeamService } from "@/services/eo-team.service"
import { useSession } from "next-auth/react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 20

// ==========================================
// 1. TYPES & HELPERS
// ==========================================

export interface TeamStats {
  total: number
  pending: number
  approved: number
  rejected: number
  lunas: number
  dp: number
}

const CATEGORY_FILTERS = ["Semua", "SD", "SMP", "SMA", "PURNA", "UMUM"]

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "DP_PAID":
    case "FULL_PAID":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-green-400 bg-emerald-50 py-1 font-poppins text-xs font-normal text-green-600"
        >
          Approved
        </Badge>
      )
    case "WAITING":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-yellow-400 bg-yellow-50 py-1 font-poppins text-xs font-normal text-yellow-600"
        >
          Pending
        </Badge>
      )
    case "REJECTED":
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

function MemberCard({ member }: { member: any }) {
  return (
    <div className="flex w-full items-start gap-4 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm transition-colors hover:border-sky-200">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-stone-200 shadow-sm">
        {member.photo_path ? (
          <img
            src={member.photo_path}
            alt={member.full_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-5 w-5 text-neutral-400" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-poppins text-sm font-semibold text-neutral-800">
          {member.full_name}
        </span>
        <span className="font-poppins text-xs font-medium text-neutral-500">
          {member.role}
        </span>

        {member.id_card_path && (
          <a
            href={member.id_card_path}
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
// 2. MAIN CLIENT COMPONENT
// ==========================================

export default function TeamListClient({
  initialTeams,
  stats,
  eventId,
  approvalFee,
  token,
}: {
  initialTeams: EOTeamListRes[]
  stats: TeamStats
  eventId: string
  approvalFee: number
  token: string
}) {
  const [isPending, startTransition] = useTransition()

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [currentPage, setCurrentPage] = useState(1)

  // Modals
  const [selectedTeam, setSelectedTeam] = useState<EOTeamListRes | null>(null)
  const [teamDetail, setTeamDetail] = useState<EOTeamDetailRes | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isKickModalOpen, setIsKickModalOpen] = useState(false)

  // --- HANDLERS ---

  const handleFetchDetail = async (team: EOTeamListRes) => {
    setSelectedTeam(team)
    setIsDetailModalOpen(true)
    setIsLoadingDetail(true)
    try {
      if (!token) return
      const detail = await eoTeamService.getTeamDetail(
        token,
        eventId,
        team.registration_id
      )
      setTeamDetail(detail)
    } catch (error) {
      toast.error("Gagal memuat detail tim")
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleApproveSubmit = async (
    paymentStatus: "DP_PAID" | "FULL_PAID"
  ) => {
    if (!selectedTeam) return
    startTransition(async () => {
      try {
        await approveTeamAction(
          eventId,
          selectedTeam.registration_id,
          paymentStatus
        )
        toast.success("Tim berhasil disetujui")
        setIsApproveModalOpen(false)
      } catch (error: any) {
        toast.error(error.message || "Gagal melakukan approve.")
      }
    })
  }

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam || !rejectReason.trim()) return
    startTransition(async () => {
      try {
        await rejectTeamAction(
          eventId,
          selectedTeam.registration_id,
          rejectReason
        )
        toast.success("Tim berhasil ditolak")
        setIsRejectModalOpen(false)
        setRejectReason("")
      } catch (error: any) {
        toast.error(error.message || "Gagal melakukan reject.")
      }
    })
  }

  const handleKickSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return
    startTransition(async () => {
      try {
        await kickTeamAction(eventId, selectedTeam.registration_id)
        toast.success("Tim berhasil dikeluarkan")
        setIsKickModalOpen(false)
      } catch (error: any) {
        toast.error(error.message || "Gagal mengeluarkan tim.")
      }
    })
  }

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredTeams = React.useMemo(() => {
    return initialTeams.filter((team) => {
      const matchSearch =
        team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.institution.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory =
        activeCategory === "Semua" || team.institution_type === activeCategory

      return matchSearch && matchCategory
    })
  }, [initialTeams, searchQuery, activeCategory])

  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE)

  const paginatedTeams = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredTeams.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredTeams, currentPage])

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeCategory])

  return (
    <div className="flex flex-col gap-8">
      {/* STATS CARDS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm md:p-6">
          <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
            {stats.lunas}
          </span>
          <span className="text-center font-poppins text-xs text-neutral-500 md:text-sm">
            Lunas
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm md:p-6">
          <span className="font-poppins text-2xl font-bold text-zinc-600 md:text-3xl">
            {stats.dp}
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
              placeholder="Cari nama tim atau institusi..."
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
                    Institusi
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
                {paginatedTeams.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center font-poppins text-sm text-neutral-500"
                    >
                      Tidak ada tim yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTeams.map((team, index) => (
                    <TableRow
                      key={team.registration_id}
                      className="border-sky-100 bg-transparent hover:bg-white/50"
                    >
                      <TableCell className="py-4 text-center font-poppins text-sm font-medium text-neutral-700">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-200">
                            {team.logo_path ? (
                              <img
                                src={team.logo_path}
                                alt="Logo"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-poppins text-sm font-semibold text-neutral-800">
                              {team.team_name}
                            </span>
                            <div className="mt-1 flex items-center gap-1.5">
                              <Badge className="w-fit border-gray-300 bg-sky-50 px-2 py-0 font-poppins text-[10px] font-medium text-slate-500 hover:bg-sky-50">
                                {team.institution_type}
                              </Badge>
                              <Badge
                                className={cn(
                                  "w-fit px-2 py-0 font-poppins text-[10px] font-medium",
                                  team.assessment_status === "COMPLETED"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                    : "border-orange-200 bg-orange-50 text-orange-600"
                                )}
                              >
                                {team.assessment_status === "COMPLETED"
                                  ? "Selesai Dinilai"
                                  : "Belum Dinilai"}
                              </Badge>
                            </div>
                          </div>{" "}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-poppins text-sm text-neutral-600">
                        {team.institution}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex justify-center">
                          <StatusBadge status={team.payment_status} />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex justify-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              "w-24 justify-center py-1 font-poppins text-xs font-normal",
                              team.payment_status === "FULL_PAID"
                                ? "border-emerald-400 bg-emerald-50 text-green-600"
                                : team.payment_status === "DP_PAID"
                                  ? "border-amber-400 bg-amber-50 text-amber-600"
                                  : "border-gray-300 bg-gray-50 text-gray-500"
                            )}
                          >
                            {team.payment_status === "FULL_PAID"
                              ? "Lunas"
                              : team.payment_status === "DP_PAID"
                                ? "DP"
                                : "N/A"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleFetchDetail(team)}
                            className="h-8 bg-blue-400 font-poppins text-xs font-semibold text-white hover:bg-blue-500"
                          >
                            Detail
                          </Button>

                          {team.payment_status === "WAITING" && (
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

                          {(team.payment_status === "DP_PAID" ||
                            team.payment_status === "FULL_PAID") && (
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-sky-100 pt-6 sm:flex-row">
            <p className="font-poppins text-xs text-neutral-500">
              Menampilkan{" "}
              <span className="font-semibold text-neutral-700">
                {paginatedTeams.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-neutral-700">
                {filteredTeams.length}
              </span>{" "}
              data tim
            </p>
            <Pagination className="mx-0 w-fit">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }}
                    className={cn(
                      "cursor-pointer hover:bg-sky-50 hover:text-sky-600",
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {/* Simplified Numbered pages - showing nearby pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                  })
                  .map((page, index, array) => {
                    const showEllipsis =
                      index > 0 && page - array[index - 1] > 1
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(page)
                            }}
                            className={cn(
                              "cursor-pointer",
                              currentPage === page
                                ? "border-sky-500 bg-sky-500 text-white hover:bg-sky-600"
                                : "hover:bg-sky-50 hover:text-sky-600"
                            )}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    )
                  })}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }}
                    className={cn(
                      "cursor-pointer hover:bg-sky-50 hover:text-sky-600",
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* =========================================
          MODALS SECTION
          ========================================= */}

      {/* 1. DETAIL MODAL */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-h-[90vh] w-full gap-0 overflow-y-auto rounded-3xl bg-white p-0 sm:min-w-xl sm:rounded-[40px]">
          {isLoadingDetail ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            teamDetail && (
              <div className="flex flex-col">
                <DialogHeader className="flex flex-row items-start justify-between space-y-0 border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-8">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-stone-200 bg-neutral-100 sm:h-16 sm:w-16">
                      {teamDetail.logo_path ? (
                        <img
                          src={teamDetail.logo_path}
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <DialogTitle className="font-poppins text-lg font-semibold text-neutral-900 sm:text-xl">
                        {teamDetail.team_name}
                      </DialogTitle>
                      <StatusBadge status={teamDetail.payment_status} />
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex flex-col p-6 sm:px-10 sm:pt-6 sm:pb-10">
                  <Tabs defaultValue="umum" className="w-full">
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
                              {teamDetail.team_name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b border-sky-100 pb-2 font-poppins text-sm">
                            <span className="text-neutral-500">
                              Asal Institusi:
                            </span>
                            <span className="font-semibold text-neutral-800">
                              {teamDetail.institution}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b border-sky-100 pb-2 font-poppins text-sm">
                            <span className="text-neutral-500">
                              Kategori Tingkat:
                            </span>
                            <span className="font-semibold text-neutral-800">
                              {teamDetail.event_level}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-poppins text-sm">
                            <span className="text-neutral-500">Alamat:</span>
                            <span className="font-semibold text-neutral-800">
                              {teamDetail.institution_address || "-"}
                            </span>
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
                              Pelatih/PJ:
                            </span>
                            <span className="font-semibold text-neutral-800">
                              {teamDetail.pelatih}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-poppins text-sm">
                            <span className="text-neutral-500">
                              Email Kontak:
                            </span>
                            <span className="truncate font-semibold text-neutral-800">
                              {teamDetail.contact_email || "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {teamDetail.payment_proof_path && (
                        <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 p-5">
                          <h3 className="font-poppins text-base font-semibold text-neutral-800">
                            Bukti Pembayaran
                          </h3>
                          <div className="mt-1 flex flex-col gap-3">
                            <Link
                              href={teamDetail.payment_proof_path}
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
                      )}
                    </TabsContent>

                    <TabsContent value="anggota" className="mt-0 outline-none">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                        <div className="flex flex-col gap-6">
                          <h3 className="border-b border-gray-100 pb-2 font-poppins text-base font-semibold text-neutral-800">
                            Anggota Tim ({teamDetail.members.length})
                          </h3>
                          {teamDetail.members.map((m) => (
                            <MemberCard key={m.id} member={m} />
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="berkas"
                      className="mt-0 flex flex-col gap-6 outline-none"
                    >
                      <div className="flex flex-col gap-3">
                        <h3 className="font-poppins text-base font-semibold text-neutral-800">
                          Dokumen Pendaftaran Tim
                        </h3>
                        {teamDetail.rec_letter_path && (
                          <div className="flex flex-col justify-between gap-4 rounded-xl border border-blue-200 bg-indigo-50/50 p-4 shadow-sm sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="flex flex-col overflow-hidden">
                                <span className="font-poppins text-sm font-semibold text-neutral-800">
                                  Surat Rekomendasi
                                </span>
                              </div>
                            </div>
                            <a
                              href={teamDetail.rec_letter_path}
                              target="_blank"
                              rel="noreferrer"
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
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>

      {/* 2. APPROVE MODAL */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="w-full max-w-lg gap-0 rounded-3xl p-0 sm:rounded-[40px]">
          {selectedTeam && (
            <div className="flex flex-col gap-8 p-6 sm:p-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="font-montserrat text-2xl font-bold text-neutral-800">
                  Approve Tim
                </h2>
                <p className="font-poppins text-sm text-neutral-600">
                  Pilih status pembayaran untuk menyetujui tim <br />{" "}
                  <span className="font-semibold text-green-600">
                    {selectedTeam.team_name}
                  </span>
                  .
                  <br />
                  <span className="mt-2 block text-xs text-rose-500">
                    *Tindakan ini akan memotong saldo koin Anda sesuai kebijakan
                    sistem.
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  disabled={isPending}
                  onClick={() => handleApproveSubmit("DP_PAID")}
                  className="h-12 flex-1 rounded-full border border-amber-400 bg-amber-50 font-poppins text-base font-bold text-amber-600 hover:bg-amber-100"
                >
                  Setujui (DP)
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => handleApproveSubmit("FULL_PAID")}
                  className="h-12 flex-1 rounded-full bg-green-500 font-poppins text-base font-bold text-white hover:bg-green-600"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Setujui (Lunas)"
                  )}
                </Button>
              </div>
            </div>
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
                    {selectedTeam.team_name}
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
                    disabled={isPending || !rejectReason.trim()}
                    className="h-12 flex-1 rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500"
                  >
                    {isPending ? (
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
                    {selectedTeam.team_name}
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
                  disabled={isPending}
                  className="h-12 flex-1 rounded-full bg-red-500 font-poppins text-base font-bold text-white hover:bg-red-600"
                >
                  {isPending ? (
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
  )
}
