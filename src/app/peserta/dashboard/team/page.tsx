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
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  status: TimStatus
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

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const MOCK_TEAMS: TeamRecord[] = [
  {
    id: "tm-001",
    name: "Paskibra Cale",
    category: "SMA/SMK/MA",
    coachName: "Pak Budi Santoso",
    status: "Approved",
    logoUrl: "", // Kosong untuk trigger fallback icon
    recommendationLetterName: "surat-rekomendasi-cale.pdf",
    recommendationLetterUrl: "#",
    members: {
      pelatih: [
        {
          id: "p1",
          name: "Pak Budi Santoso",
          role: "Pelatih #1",
          avatarUrl: "",
        },
      ],
      danpas: [
        {
          id: "d1",
          name: "Siti Nurhaliza Putri",
          role: "Danpas",
          avatarUrl: "",
          documentName: "kartu-siti.jpg",
          documentUrl: "#",
        },
      ],
      official: [
        {
          id: "o1",
          name: "Rudi Hartono",
          role: "Official",
          avatarUrl: "",
          documentName: "kartu-rudi.jpg",
          documentUrl: "#",
        },
      ],
      pasukan: [
        {
          id: "ps1",
          name: "Rudi Hartono",
          role: "Pasukan",
          avatarUrl: "",
          documentName: "kartu-rudi.jpg",
          documentUrl: "#",
        },
        {
          id: "ps2",
          name: "Ahmad Fauzi Rahmat",
          role: "Pasukan",
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
    status: "Pending",
    logoUrl: "",
    recommendationLetterName: "surat-rekomendasi-garuda.pdf",
    recommendationLetterUrl: "#",
    members: { pelatih: [], danpas: [], official: [], pasukan: [] },
  },
]

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
    <div className="flex w-full items-center gap-4 rounded-xl bg-gray-50 px-4 py-3">
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
      <div className="flex flex-1 flex-col">
        <span className="font-poppins text-sm font-semibold text-neutral-800">
          {member.name}
        </span>
        {member.documentName ? (
          <a
            href={member.documentUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 flex items-center gap-1 font-poppins text-xs text-blue-500 hover:underline"
          >
            <FileText className="h-3 w-3" /> Kartu Pelajar:{" "}
            {member.documentName}
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

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function PesertaTeamPage() {
  // --- STATE ---
  const [teams, setTeams] = useState<TeamRecord[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategories, setFilterCategories] = useState<TingkatEvent[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("Semua")

  // Modals
  const [selectedTeam, setSelectedTeam] = useState<TeamRecord | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- API SIMULATION ---
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/peserta/teams
        await new Promise((resolve) => setTimeout(resolve, 1500))
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
  const handleCategoryFilterToggle = (checked: boolean, val: TingkatEvent) => {
    if (checked) setFilterCategories((prev) => [...prev, val])
    else setFilterCategories((prev) => prev.filter((c) => c !== val))
  }

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return
    setIsSubmitting(true)
    try {
      // TODO: Integrasi API DELETE /api/peserta/teams/{id}
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTeams((prev) => prev.filter((t) => t.id !== selectedTeam.id))
      setIsDeleteModalOpen(false)
    } catch (error) {
      alert("Gagal menghapus tim.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- FILTERING LOGIC ---
  const filteredTeams = teams.filter((team) => {
    const matchSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.coachName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory =
      filterCategories.length === 0 || filterCategories.includes(team.category)
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
            Team Saya
          </h1>
          <Link href="/peserta/dashboard/team/new" className="w-full sm:w-auto">
            <Button className="w-full rounded-full px-6 font-poppins font-bold text-white shadow-sm" variant={'secondary'}>
              <Plus className="mr-2 h-4 w-4" /> Buat Tim Baru
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <Skeleton className="h-[600px] w-full rounded-3xl" />
        ) : (
          <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6 lg:p-8">
            {/* TOOLBAR FILTER & SEARCH */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                {/* Search */}
                <div className="relative w-full lg:w-64">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    placeholder="Cari tim atau pelatih..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border-gray-200 bg-white pl-10 font-poppins text-sm focus-visible:ring-sky-200"
                  />
                </div>

                {/* Checkbox Kategori */}
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-poppins text-sm font-medium text-slate-900">
                    Kategori:
                  </span>
                  {(
                    [
                      "SD/MI",
                      "SMP/MTS",
                      "SMA/SMK/MA",
                      "PURNA",
                      "UMUM",
                    ] as TingkatEvent[]
                  ).map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={filterCategories.includes(cat)}
                        onCheckedChange={(checked) =>
                          handleCategoryFilterToggle(checked as boolean, cat)
                        }
                      />
                      <Label
                        htmlFor={`cat-${cat}`}
                        className="cursor-pointer font-poppins text-sm text-neutral-700"
                      >
                        {cat}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-between rounded-xl border-neutral-300 bg-white px-4 font-poppins text-sm text-neutral-700 shadow-sm lg:w-48"
                  >
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />{" "}
                      {filterStatus === "Semua" ? "Semua Status" : filterStatus}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl font-poppins text-sm"
                >
                  {["Semua", "Pending", "Approved", "Rejected"].map((opt) => (
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => setFilterStatus(opt)}
                      className="cursor-pointer py-2"
                    >
                      {opt}
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
        )}

        {/* =========================================
            MODALS SECTION (API-Ready, Rendered Once)
            ========================================= */}

        {/* 1. MODAL DETAIL TIM */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-h-[90vh] w-full sm:min-w-xl gap-0 overflow-y-auto rounded-3xl bg-white p-0 sm:rounded-[40px]">
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
                    <div className="flex flex-col items-start gap-1">
                      <DialogTitle className="font-poppins text-lg font-semibold text-neutral-900 sm:text-xl">
                        {selectedTeam.name}
                      </DialogTitle>
                      <StatusBadge status={selectedTeam.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/peserta/dashboard/team/edit/${selectedTeam.id}`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden font-poppins text-blue-500 hover:bg-blue-50 hover:text-blue-600 sm:flex"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit Tim
                      </Button>
                    </Link>
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
                      className="mt-0 flex flex-col gap-4 outline-none"
                    >
                      <div className="flex flex-col gap-3 rounded-2xl bg-gray-50 p-5">
                        <h3 className="font-poppins text-base font-semibold text-neutral-800">
                          Informasi Tim
                        </h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 font-poppins text-sm">
                            <span className="text-neutral-500">Nama Tim:</span>
                            <span className="font-semibold text-neutral-800">
                              {selectedTeam.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-indigo-50/50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <span className="font-poppins text-sm font-semibold text-blue-600">
                            Surat Rekomendasi Sekolah
                          </span>
                          <a
                            href={selectedTeam.recommendationLetterUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-poppins text-xs text-blue-500 hover:underline"
                          >
                            {selectedTeam.recommendationLetterName}
                          </a>
                        </div>
                        <a
                          href={selectedTeam.recommendationLetterUrl}
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

                      <div className="mt-2 rounded-2xl border border-red-200 bg-rose-50 p-4">
                        <p className="font-poppins text-sm text-red-600">
                          <span className="font-bold">Perhatikan!</span>{" "}
                          Menghapus tim akan menghapus semua data terkait secara
                          permanen.
                        </p>
                      </div>
                    </TabsContent>

                    {/* TAB 2: ANGGOTA */}
                    <TabsContent value="anggota" className="mt-0 outline-none">
                      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
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
                              <span className="text-sm text-neutral-400">
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
                              <span className="text-sm text-neutral-400">
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
                              <span className="text-sm text-neutral-400">
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
                              <span className="text-sm text-neutral-400">
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
                          Dokumen Tim
                        </h3>
                        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-poppins text-sm font-semibold text-neutral-800">
                                Surat Rekomendasi
                              </span>
                              <span className="font-poppins text-xs text-neutral-500">
                                {selectedTeam.recommendationLetterName}
                              </span>
                            </div>
                          </div>
                          <a
                            href={selectedTeam.recommendationLetterUrl}
                            download
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-poppins text-sm font-medium"
                            >
                              Download
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

                  {/* ACTION TOMBOL EDIT DI MOBILE & TOMBOL HAPUS */}
                  <div className="mt-8 flex w-full flex-col-reverse items-center gap-3 sm:flex-row">
                    <Link
                      href={`/peserta/dashboard/team/edit/${selectedTeam.id}`}
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
                      onClick={() => setIsDeleteModalOpen(true)}
                      variant="destructive"
                      className="ml-auto h-12 w-full rounded-full font-poppins text-base font-bold shadow-sm sm:w-1/2"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Hapus Tim
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 2. MODAL HAPUS TIM (KONFIRMASI) */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[40px]">
            {selectedTeam && (
              <form
                onSubmit={handleDeleteSubmit}
                className="flex flex-col gap-8 p-6 sm:p-10"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <Trash2 className="h-8 w-8 text-red-500" />
                  </div>
                  <h2 className="font-montserrat text-2xl font-bold text-neutral-800">
                    Hapus Tim
                  </h2>
                  <p className="font-poppins text-sm text-neutral-600">
                    Apakah kamu yakin ingin menghapus tim <br />
                    <span className="font-semibold text-red-500">
                      "{selectedTeam.name}"
                    </span>
                    ? <br />
                    Tindakan ini tidak dapat dibatalkan.
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
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
