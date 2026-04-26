"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  ChevronDown,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready)
// ==========================================

export type Jenjang = "SD" | "SMP" | "SMA" | "PURNA" | "UMUM"
export type AssessmentStatus =
  | "Belum Dinilai"
  | "Sedang Dinilai"
  | "Selesai Dinilai"

export interface TeamAssessment {
  id: string
  teamName: string
  schoolName: string
  logoUrl: string
  category: Jenjang
  status: AssessmentStatus
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const JENJANG_LIST: Jenjang[] = ["SD", "SMP", "SMA", "PURNA", "UMUM"]

const MOCK_TEAMS: TeamAssessment[] = [
  {
    id: "tm-1",
    teamName: "Garuda Nusantara",
    schoolName: "SDN 01 Jakarta Pusat",
    logoUrl: "",
    category: "SD",
    status: "Sedang Dinilai",
  },
  {
    id: "tm-2",
    teamName: "Elang Merah",
    schoolName: "SMPN 5 Bandung",
    logoUrl: "",
    category: "SMP",
    status: "Belum Dinilai",
  },
  {
    id: "tm-3",
    teamName: "Sakti Perkasa",
    schoolName: "SMAN 3 Surabaya",
    logoUrl: "",
    category: "SMA",
    status: "Selesai Dinilai",
  },
  {
    id: "tm-4",
    teamName: "Bintang Timur",
    schoolName: "SDN 12 Jakarta",
    logoUrl: "",
    category: "SD",
    status: "Belum Dinilai",
  },
  {
    id: "tm-5",
    teamName: "Pasukan Inti",
    schoolName: "Purna Paskibraka",
    logoUrl: "",
    category: "PURNA",
    status: "Belum Dinilai",
  },
]

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function StatusBadge({ status }: { status: AssessmentStatus }) {
  switch (status) {
    case "Belum Dinilai":
      return (
        <Badge
          variant="outline"
          className="border-gray-200 bg-gray-50 font-poppins font-normal text-neutral-600"
        >
          Belum Dinilai
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
    case "Selesai Dinilai":
      return (
        <Badge
          variant="outline"
          className="border-green-400 bg-emerald-50 font-poppins font-normal text-green-600"
        >
          Selesai Dinilai
        </Badge>
      )
    default:
      return null
  }
}

function ActionButton({
  teamId,
  status,
}: {
  teamId: string
  status: AssessmentStatus
}) {
  if (status === "Belum Dinilai") {
    return (
      <Link href={`/organizer/dashboard/assessment-form/${teamId}`}>
        <Button
          size="sm"
          className="w-full bg-blue-500 font-poppins text-xs font-semibold text-white hover:bg-blue-600 sm:w-auto"
        >
          Mulai Menilai
        </Button>
      </Link>
    )
  }
  if (status === "Sedang Dinilai") {
    return (
      <Link href={`/organizer/dashboard/assessment-form/${teamId}`}>
        <Button
          size="sm"
          className="w-full bg-yellow-500 font-poppins text-xs font-semibold text-white hover:bg-yellow-600 sm:w-auto"
        >
          Lanjut Menilai
        </Button>
      </Link>
    )
  }
  return (
    <span className="w-full border-green-500 font-poppins text-xs font-semibold text-green-600 hover:bg-green-50 sm:w-auto">
      -
    </span>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function AssessmentFormListPage() {
  const [teams, setTeams] = useState<TeamAssessment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("Semua")
  const [activeStatus, setActiveStatus] = useState<string>("Semua")

  // --- API SIMULATION ---
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: API GET /api/organizer/assessments/teams
        await new Promise((res) => setTimeout(res, 1000))
        setTeams(MOCK_TEAMS)
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTeams()
  }, [])

  // --- FILTERING LOGIC ---
  const filteredTeams = teams.filter((team) => {
    const matchSearch =
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory =
      activeCategory === "Semua" || team.category === activeCategory
    const matchStatus = activeStatus === "Semua" || team.status === activeStatus
    return matchSearch && matchCategory && matchStatus
  })

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
          Form Penilaian
        </h1>

        {isLoading ? (
          <Skeleton className="h-96 w-full rounded-3xl" />
        ) : (
          <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/50 p-4 shadow-sm backdrop-blur-md md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-poppins text-lg font-medium text-slate-900">
                Daftar Tim
              </h2>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
                <div className="relative w-full lg:w-64">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    placeholder="Cari nama tim atau sekolah..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border-gray-200 bg-white pl-10 font-poppins text-sm focus-visible:ring-sky-200"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 font-poppins text-sm font-medium text-slate-900">
                    Kategori:
                  </span>
                  {["Semua", ...JENJANG_LIST].map((cat) => (
                    <Button
                      key={cat}
                      variant={activeCategory === cat ? "default" : "outline"}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "h-9 rounded-lg px-3 py-1 font-poppins text-sm",
                        activeCategory === cat
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-white text-zinc-600 hover:bg-gray-50"
                      )}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-between rounded-lg border-neutral-300 bg-white px-4 font-poppins text-sm text-neutral-700 lg:w-48"
                  >
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />{" "}
                      {activeStatus === "Semua"
                        ? "Filter Status"
                        : activeStatus}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl font-poppins text-sm"
                >
                  {[
                    "Semua",
                    "Belum Dinilai",
                    "Sedang Dinilai",
                    "Selesai Dinilai",
                  ].map((opt) => (
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => setActiveStatus(opt)}
                      className="cursor-pointer py-2"
                    >
                      {opt}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* TABLE */}
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
                      <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                        Kategori
                      </TableHead>
                      <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                        Status Penilaian
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
                              <StatusBadge status={team.status} />
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex justify-center">
                              <ActionButton
                                teamId={team.id}
                                status={team.status}
                              />
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
      </div>
    </div>
  )
}
