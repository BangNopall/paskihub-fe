"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, Filter, ChevronDown, Image as ImageIcon } from "lucide-react"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EOTeamListRes } from "@/schemas/eo-team.schema"

const JENJANG_LIST = ["SD", "SMP", "SMA", "PURNA", "UMUM"]

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="border-gray-200 bg-gray-50 font-poppins font-normal text-neutral-600"
        >
          Belum Dinilai
        </Badge>
      )
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="border-yellow-400 bg-yellow-50 font-poppins font-normal text-yellow-600"
        >
          Sedang Dinilai
        </Badge>
      )
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="border-green-400 bg-emerald-50 font-poppins font-normal text-green-600"
        >
          Selesai Dinilai
        </Badge>
      )
    default:
      return (
        <Badge
          variant="outline"
          className="border-gray-200 bg-gray-50 font-poppins font-normal text-neutral-600"
        >
          {status}
        </Badge>
      )
  }
}

function ActionButton({
  registrationId,
  status,
}: {
  registrationId: string
  status: string
}) {
  if (status === "PENDING") {
    return (
      <Link href={`/organizer/dashboard/assessment-form/${registrationId}`}>
        <Button
          size="sm"
          className="w-full bg-blue-500 font-poppins text-xs font-semibold text-white hover:bg-blue-600 sm:w-auto"
        >
          Mulai Menilai
        </Button>
      </Link>
    )
  }
  if (status === "IN_PROGRESS") {
    return (
      <Link href={`/organizer/dashboard/assessment-form/${registrationId}`}>
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
    <span className="w-full font-poppins text-xs font-semibold text-green-600 sm:w-auto">
      -
    </span>
  )
}

interface TeamAssessmentListProps {
  teams: EOTeamListRes[]
}

export function TeamAssessmentList({ teams }: TeamAssessmentListProps) {
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("Semua")
  const [activeStatus, setActiveStatus] = useState<string>("Semua")

  const statusMap: Record<string, string> = {
    "Belum Dinilai": "PENDING",
    "Sedang Dinilai": "IN_PROGRESS",
    "Selesai Dinilai": "COMPLETED",
  }

  // --- FILTERING LOGIC ---
  const filteredTeams = teams.filter((team) => {
    const matchSearch =
      team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.institution.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory =
      activeCategory === "Semua" || team.institution_type === activeCategory
    const matchStatus =
      activeStatus === "Semua" ||
      team.assessment_status === statusMap[activeStatus]
    return matchSearch && matchCategory && matchStatus
  })

  return (
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
                {activeStatus === "Semua" ? "Filter Status" : activeStatus}
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
                filteredTeams.map((team, index) => {
                  const logo_path = team.logo_path
                    ? team.logo_path.startsWith("http")
                      ? team.logo_path
                      : process.env.NEXT_PUBLIC_API_URL + team.logo_path
                    : null
                  return (
                    <TableRow
                      key={team.registration_id}
                      className="border-sky-100 bg-transparent hover:bg-white/50"
                    >
                      <TableCell className="py-4 text-center font-poppins text-sm font-medium text-neutral-700">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-200">
                            {logo_path ? (
                              <img
                                src={logo_path}
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
                            <span className="font-poppins text-xs text-neutral-500">
                              {team.institution}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center font-poppins text-sm font-medium text-neutral-700">
                        {team.institution_type}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex justify-center">
                          <StatusBadge status={team.assessment_status} />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex justify-center">
                          <ActionButton
                            registrationId={team.registration_id}
                            status={team.assessment_status}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
