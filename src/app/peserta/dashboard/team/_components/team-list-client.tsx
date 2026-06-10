/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  ChevronDown,
  Image as ImageIcon,
  Plus,
  Trash2,
  FileText,
  Loader2,
  Download,
  Pencil,
} from "lucide-react"

import { cn, getProxyFileUrl } from "@/lib/utils"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ParticipantTeamRes,
  TeamDetailRes,
  ParticipantTeamMemberRes,
} from "@/schemas/team.schema"
import { deleteTeamAction, getTeamDetailAction } from "@/actions/team.actions"
import { toast } from "sonner"

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

const AVATAR_GRADIENTS = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-cyan-400 to-sky-500",
]

function getGradient(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]
}

function AvatarPlaceholder({
  name,
  size = "md",
}: {
  name: string
  size?: "sm" | "md" | "lg"
}) {
  const initials = getInitials(name)
  const gradient = getGradient(name)
  const sizeClasses = {
    sm: "h-12 w-12 text-sm",
    md: "h-14 w-14 text-base sm:h-16 sm:w-16 sm:text-lg",
    lg: "h-32 w-32 text-3xl",
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-poppins font-bold tracking-wide text-white select-none",
        `${gradient}`,
        sizeClasses[size]
      )}
    >
      {initials || <ImageIcon className="h-5 w-5 text-white/70" />}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase()
  switch (normalizedStatus) {
    case "DP_PAID":
    case "FULL_PAID":
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-green-400 bg-emerald-50 py-1 font-poppins text-xs font-normal text-green-600"
        >
          {normalizedStatus === "DP_PAID" ? "Paid DP" : "Full Paid"}
        </Badge>
      )
    case "WAITING":
    case "PENDING":
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
      return (
        <Badge
          variant="outline"
          className="w-24 justify-center border-gray-400 bg-gray-50 py-1 font-poppins text-xs font-normal text-gray-500"
        >
          {status}
        </Badge>
      )
  }
}

function MemberCard({ member }: { member: ParticipantTeamMemberRes }) {
  const photoUrl = getProxyFileUrl(member.photo_path)
  const idCardUrl = getProxyFileUrl(member.id_card_path)

  return (
    <div className="flex w-full items-center gap-4 rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-sm">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={member.full_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br font-poppins text-xs font-bold tracking-wide text-white",
              getGradient(member.full_name)
            )}
          >
            {getInitials(member.full_name)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <span className="font-poppins text-sm font-semibold text-neutral-800">
          {member.full_name}
        </span>
        {idCardUrl ? (
          <a
            href={idCardUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 flex items-center gap-1 font-poppins text-xs text-blue-500 hover:underline"
          >
            <FileText className="h-3 w-3" /> Kartu Pelajar
          </a>
        ) : (
          <span className="mt-0.5 font-poppins text-xs text-neutral-500">
            {member.role}
          </span>
        )}
      </div>
    </div>
  )
}

interface TeamListClientProps {
  initialTeams: ParticipantTeamRes[]
  token: string
}

export default function TeamListClient({
  initialTeams,
  token,
}: TeamListClientProps) {
  const [teams, setTeams] = useState<ParticipantTeamRes[]>(initialTeams)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("Semua")

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [teamDetail, setTeamDetail] = useState<TeamDetailRes | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const statusFilter = [
    { label: "Semua", value: "Semua" },
    { label: "Pending", value: "WAITING" },
    { label: "DP Paid", value: "DP_PAID" },
    { label: "Full Paid", value: "FULL_PAID" },
    { label: "Rejected", value: "REJECTED" },
  ]

  const fetchDetail = async (id: string) => {
    setIsLoadingDetail(true)
    try {
      const res = await getTeamDetailAction(id)
      if (res.success && res.data) {
        setTeamDetail(res.data)
      } else {
        toast.error(res.error || "Gagal memuat detail tim")
      }
    } catch (error) {
      toast.error("Gagal memuat detail tim")
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleOpenDetail = (team: ParticipantTeamRes) => {
    setSelectedTeamId(team.id)
    setIsDetailModalOpen(true)
    fetchDetail(team.id)
  }

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeamId) return
    setIsSubmitting(true)
    try {
      const res = await deleteTeamAction(selectedTeamId)
      if (res.success) {
        setTeams((prev) => prev.filter((t) => t.id !== selectedTeamId))
        setIsDeleteModalOpen(false)
        setIsDetailModalOpen(false)
        toast.success("Tim berhasil dihapus")
      } else {
        toast.error(res.error || "Gagal menghapus tim")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTeams = teams.filter((team) => {
    const matchSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.pelatih.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus =
      filterStatus === "Semua" || team.payment_status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6 lg:p-8">
      {/* TOOLBAR FILTER & SEARCH */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative w-full lg:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder="Cari tim atau pelatih..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-gray-200 bg-white pl-10 font-poppins text-sm focus-visible:ring-sky-200"
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-full justify-between rounded-xl border-neutral-300 bg-white px-4 font-poppins text-sm text-neutral-700 shadow-sm lg:w-48"
            >
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />{" "}
                {filterStatus === "Semua"
                  ? "Semua Status"
                  : statusFilter.find((opt) => opt.value === filterStatus)
                      ?.label}
              </div>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl font-poppins text-sm"
          >
            {statusFilter.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className="cursor-pointer py-2"
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* TABLE DATA */}
      <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white/70 shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
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
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                          {team.logo_path ? (
                            <img
                              src={getProxyFileUrl(team.logo_path) || ""}
                              alt="Logo"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className={cn(
                                "flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br font-poppins text-xs font-bold tracking-wide text-white",
                                getGradient(team.name)
                              )}
                            >
                              {getInitials(team.name)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-poppins text-sm font-semibold text-neutral-800">
                            {team.name}
                          </span>
                          <Badge className="mt-1 w-fit border-gray-300 bg-sky-50 px-2 py-0 font-poppins text-[10px] font-medium text-slate-500 hover:bg-sky-50">
                            {team.institution_type}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-poppins text-sm text-neutral-600">
                      {team.pelatih}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <StatusBadge status={team.payment_status} />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleOpenDetail(team)}
                          className="h-8 bg-blue-400 font-poppins text-xs font-semibold text-white hover:bg-blue-500"
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

      {/* DETAIL MODAL */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-h-[90vh] w-full gap-0 overflow-y-auto rounded-3xl bg-white p-0 sm:min-w-xl sm:rounded-[40px]">
          <DialogHeader className="flex flex-row items-start justify-between space-y-0 border-b border-neutral-200 p-6 pb-4 sm:px-10 sm:pt-8">
            <div className="flex items-center gap-4 sm:gap-6">
              {isLoadingDetail ? (
                <div className="flex h-14 w-14 shrink-0 animate-pulse items-center justify-center rounded-full bg-neutral-200 sm:h-16 sm:w-16" />
              ) : teamDetail?.logo_path ? (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-stone-200 bg-neutral-100 sm:h-16 sm:w-16">
                  <img
                    src={getProxyFileUrl(teamDetail.logo_path) || ""}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <AvatarPlaceholder name={teamDetail?.name || "Tim"} size="md" />
              )}
              <div className="flex flex-col items-start gap-1">
                <DialogTitle className="font-poppins text-lg font-semibold text-neutral-900 sm:text-xl">
                  {isLoadingDetail
                    ? "Memuat Detail Tim..."
                    : teamDetail?.name || "Detail Tim"}
                </DialogTitle>
                {!isLoadingDetail && teamDetail && (
                  <Badge variant="secondary" className="bg-sky-50 text-sky-600">
                    {teamDetail.institution_type}
                  </Badge>
                )}
              </div>
            </div>
            {!isLoadingDetail && teamDetail && (
              <div className="flex items-center gap-4">
                <Link href={`/peserta/dashboard/team/edit/${teamDetail.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden font-poppins text-blue-500 hover:bg-blue-50 hover:text-blue-600 sm:flex"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit Tim
                  </Button>
                </Link>
              </div>
            )}
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : teamDetail ? (
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
                  className="mt-0 flex flex-col gap-4 outline-none"
                >
                  <div className="flex flex-col gap-3 rounded-2xl bg-gray-50 p-5">
                    <h3 className="font-poppins text-base font-semibold text-neutral-800">
                      Informasi Tim
                    </h3>
                    <div className="flex flex-col gap-2 font-poppins text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Nama Tim:</span>
                        <span className="font-semibold text-neutral-800">
                          {teamDetail.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Pelatih:</span>
                        <span className="font-semibold text-neutral-800">
                          {teamDetail.pelatih}
                        </span>
                      </div>
                    </div>
                  </div>

                  {teamDetail.rec_letter_path && (
                    <div className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-indigo-50/50 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="font-poppins text-sm font-semibold text-blue-600">
                          Surat Rekomendasi
                        </span>
                        <a
                          href={
                            getProxyFileUrl(teamDetail.rec_letter_path) || "#"
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="font-poppins text-xs text-blue-500 hover:underline"
                        >
                          Lihat Dokumen
                        </a>
                      </div>
                      <a
                        href={
                          getProxyFileUrl(teamDetail.rec_letter_path) || "#"
                        }
                        download
                        className="shrink-0"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-100"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="anggota" className="mt-0 outline-none">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                    {Object.entries(teamDetail.members_grouped).map(
                      ([role, item]) => (
                        <div key={role} className="flex flex-col gap-3">
                          <h3 className="border-b border-gray-100 pb-2 font-poppins text-base text-xs font-semibold tracking-wider text-neutral-800 uppercase">
                            {role} ({item.length})
                          </h3>
                          {item.map((m) => (
                            <MemberCard key={m.id} member={m} />
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </TabsContent>

                <TabsContent
                  value="berkas"
                  className="mt-0 flex flex-col gap-6 outline-none"
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="font-poppins text-base font-semibold text-neutral-800">
                      Logo Tim
                    </h3>
                    {teamDetail.logo_path ? (
                      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-stone-100 shadow-sm">
                        <img
                          src={getProxyFileUrl(teamDetail.logo_path) || ""}
                          alt="Logo Tim"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-8">
                        <div
                          className={cn(
                            "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br font-poppins text-xl font-bold tracking-wide text-white",
                            getGradient(teamDetail.name)
                          )}
                        >
                          {getInitials(teamDetail.name)}
                        </div>
                        <p className="font-poppins text-sm text-neutral-500">
                          Tim ini belum memiliki logo
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 flex w-full flex-col-reverse items-center gap-3 sm:flex-row">
                <Link
                  href={`/peserta/dashboard/team/edit/${teamDetail.id}`}
                  className="w-full sm:hidden"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full rounded-full border-blue-200 bg-blue-50 font-poppins text-base font-semibold text-blue-600"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit Tim
                  </Button>
                </Link>
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedTeamId(teamDetail.id)
                    setIsDeleteModalOpen(true)
                  }}
                  variant="destructive"
                  className="ml-auto h-12 w-full rounded-full font-poppins text-base font-bold shadow-sm sm:w-1/2"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Hapus Tim
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[40px]">
          <form
            onSubmit={handleDeleteSubmit}
            className="flex flex-col gap-8 p-6 sm:p-10"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <DialogTitle className="font-montserrat text-2xl font-bold text-neutral-800">
                Hapus Tim
              </DialogTitle>
              <DialogDescription className="font-poppins text-sm text-neutral-600">
                Apakah kamu yakin ingin menghapus tim ini?
                <br />
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
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
                disabled={isSubmitting}
                className="h-12 flex-1 rounded-full bg-red-500 font-poppins text-base font-bold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Ya, Hapus Tim"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
