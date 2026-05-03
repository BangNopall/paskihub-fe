"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  UserCheck,
  UserMinus,
  Mail,
  ExternalLink,
  Loader2,
  AlertCircle,
  School,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  X,
  Trophy,
  Users,
  Settings,
  CreditCard,
  FileText,
  Eye,
  Download,
  Image as ImageIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Montserrat, Poppins } from "@/lib/fonts"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export type UserRole = "EO" | "Peserta"
export type UserStatus = "Active" | "Pending" | "Banned"

export interface UserData {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  verified: boolean
  joined: string
  phone?: string
  school?: string
  address?: string
  lastActivity?: string
  // Role specific data (Mock)
  eoData?: {
    eventInfo: {
      name: string
      date: string
      location: string
      rules: string
      paymentInfo: string
      categories: string[]
    }
    panitia: { name: string; role: string }[]
    judges: string[]
    scoreRecap: { team: string; score: number }[]
  }
  pesertaData?: {
    team: {
      name: string
      coach: string
      members: string[]
      documents: string[]
    }
    eventHistory: { eventName: string; status: string }[]
  }
}

// ==========================================
// 2. MOCK DATA
// ==========================================

const MOCK_USERS: UserData[] = [
  {
    id: "U1",
    name: "SMA Negeri 1 Jakarta",
    email: "paskibra@sman1jkt.sch.id",
    role: "EO",
    status: "Active",
    verified: true,
    joined: "12 Jan 2026",
    phone: "0812-3456-7890",
    school: "SMAN 1 Jakarta",
    address: "Jl. Budi Utomo No.7, Jakarta Pusat",
    lastActivity: "28 Apr 2026, 10:15",
    eoData: {
      eventInfo: {
        name: "Lomba Ketangkasan Paskibra (LKP) 2026",
        date: "20 Mei 2026",
        location: "Gedung Serbaguna SMAN 1 Jakarta",
        rules: "Terbuka untuk SMA/SMK sederajat se-Jabodetabek.",
        paymentInfo: "Transfer Mandiri 123-00-0987654-3 a.n Paskibra SMAN 1",
        categories: ["SMA/SMK", "MULA", "MADYA"],
      },
      panitia: [
        { name: "Andi Wijaya", role: "Ketua Pelaksana" },
        { name: "Sari Putri", role: "Sekretaris" },
      ],
      judges: ["Letda Inf. Bambang", "Pelda TNI AL Rusdi", "Iptu Pol. Hasan"],
      scoreRecap: [
        { team: "Paski Cale", score: 850 },
        { team: "Garuda Nusantara", score: 820 },
      ],
    },
  },
  {
    id: "U2",
    name: "Budi Santoso",
    email: "budi.coach@gmail.com",
    role: "Peserta",
    status: "Active",
    verified: true,
    joined: "15 Jan 2026",
    phone: "0856-9988-7766",
    school: "SMA Taruna Nusantara",
    address: "Magelang, Jawa Tengah",
    lastActivity: "27 Apr 2026, 16:30",
    pesertaData: {
      team: {
        name: "Paski Cale",
        coach: "Budi Santoso",
        members: ["Rizky", "Anisa", "Fajar", "Dina", "Guntur", "Siti"],
        documents: ["surat-tugas.pdf", "kartu-pelajar.zip"],
      },
      eventHistory: [
        { eventName: "LKP SMAN 1 Jakarta 2026", status: "Approved" },
        { eventName: "Gala Paski Nasional 2025", status: "Completed" },
      ],
    },
  },
  {
    id: "U3",
    name: "Event Nusantara Corp",
    email: "admin@eventnusantara.id",
    role: "EO",
    status: "Active",
    verified: false,
    joined: "20 Apr 2026",
    phone: "0821-5544-3322",
    school: "-",
    address: "Bandung, Jawa Barat",
    lastActivity: "20 Apr 2026, 09:00",
    eoData: {
      eventInfo: {
        name: "Bandung Paski Competition",
        date: "15 Juni 2026",
        location: "Gedung Sate Bandung",
        rules: "Ketentuan umum mengikuti standar PPI.",
        paymentInfo: "BCA 887-223-112 a.n Event Nusantara",
        categories: ["SMP", "SMA"],
      },
      panitia: [{ name: "Doni", role: "Admin Utama" }],
      judges: ["Mayor Inf. Agus"],
      scoreRecap: [],
    },
  },
  {
    id: "U4",
    name: "Paski Creative Studio",
    email: "hello@paskicreative.id",
    role: "EO",
    status: "Banned",
    verified: true,
    joined: "05 Feb 2026",
    phone: "0811-2233-4455",
    school: "-",
    address: "Surabaya, Jawa Timur",
    lastActivity: "01 Mar 2026, 12:00",
  },
  {
    id: "U5",
    name: "Siti Aminah",
    email: "siti.paski@yahoo.com",
    role: "Peserta",
    status: "Active",
    verified: true,
    joined: "01 Mar 2026",
    phone: "0877-1122-3344",
    school: "SMK Negeri 2 Yogyakarta",
    address: "Yogyakarta",
    lastActivity: "28 Apr 2026, 08:45",
    pesertaData: {
      team: {
        name: "Wira Muda",
        coach: "Siti Aminah",
        members: ["Member A", "Member B"],
        documents: [],
      },
      eventHistory: [],
    },
  },
]

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function StatusBadge({ status }: { status: UserStatus }) {
  const styles: Record<UserStatus, string> = {
    Active: "border-green-400 bg-green-50 text-green-600",
    Pending: "border-yellow-400 bg-yellow-50 text-yellow-600",
    Banned: "border-red-400 bg-red-50 text-red-600",
  }

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 font-poppins text-xs font-normal ${styles[status]}`}
    >
      {status === "Active" ? "Aktif" : status}
    </Badge>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Modal States
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isVerifyOpen, setIsVerifyOpen] = useState(false)
  const [isBanOpen, setIsVerifyBanOpen] = useState(false)
  const [actionUser, setActionUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/admin/users di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setUsers(MOCK_USERS)
      } catch (error) {
        console.error("Gagal memuat data user:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab =
      activeTab === "all" || user.role.toLowerCase() === activeTab
    return matchesSearch && matchesTab
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleVerify = () => {
    if (!actionUser) return
    // TODO: Integrasi API Verify
    toast.success(`Akun ${actionUser.name} berhasil diverifikasi sebagai EO`)
    setIsVerifyOpen(false)
  }

  const handleBan = () => {
    if (!actionUser) return
    // TODO: Integrasi API Ban
    toast.error(`Akses akun ${actionUser.name} telah dinonaktifkan`)
    setIsVerifyBanOpen(false)
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Data User
        </h2>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          Muat Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
              Manajemen User
            </h1>
            <p className="text-sm text-neutral-500">
              Kelola akses dan verifikasi akun Event Organizer serta Peserta.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-linear-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
          <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white py-0 shadow-none">
            <CardHeader className="bg-white px-5 pt-6 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Tabs
                  defaultValue="all"
                  onValueChange={setActiveTab}
                  className="w-full md:w-auto"
                >
                  <TabsList className="rounded-full bg-neutral-100 p-1">
                    <TabsTrigger
                      value="all"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Semua
                    </TabsTrigger>
                    <TabsTrigger
                      value="eo"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      EO
                    </TabsTrigger>
                    <TabsTrigger
                      value="peserta"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Peserta
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    placeholder="Cari nama atau email..."
                    className="rounded-full border-neutral-200 bg-neutral-50 pl-10 focus-visible:ring-info-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-neutral-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                          User
                        </TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                          Role
                        </TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                          Status
                        </TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">
                          Terdaftar
                        </TableHead>
                        <TableHead className="px-6 text-right font-poppins font-semibold text-neutral-600">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-40 text-center font-poppins text-neutral-500"
                          >
                            Tidak ada user ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="group cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50/50"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDetailModalOpen(true)
                            }}
                          >
                            <TableCell className="px-6 py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="flex items-center gap-1.5 font-poppins font-semibold text-neutral-800 transition-colors group-hover:text-info-600">
                                  {user.name}
                                  {user.verified && (
                                    <CheckCircle
                                      className="h-3.5 w-3.5 text-info-500"
                                      fill="currentColor"
                                    />
                                  )}
                                </span>
                                <span className="text-xs text-neutral-500">
                                  {user.email}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge
                                variant="secondary"
                                className={
                                  user.role === "EO"
                                    ? "bg-info-50 text-info-600"
                                    : "bg-neutral-100 text-neutral-600"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <StatusBadge status={user.status} />
                            </TableCell>
                            <TableCell className="px-6 py-4 text-sm text-neutral-500">
                              {user.joined}
                            </TableCell>
                            <TableCell
                              className="px-6 py-4 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full hover:bg-neutral-100"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48 rounded-2xl border-neutral-200 shadow-lg"
                                >
                                  <DropdownMenuLabel className="font-poppins text-xs font-semibold text-neutral-500">
                                    Aksi User
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem
                                    className="cursor-pointer rounded-xl font-poppins text-sm"
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setIsDetailModalOpen(true)
                                    }}
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />{" "}
                                    Detail Profil
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-neutral-100" />
                                  {user.status === "Banned" ? (
                                    <DropdownMenuItem className="cursor-pointer rounded-xl font-poppins text-sm text-success-600 focus:text-success-600">
                                      <CheckCircle className="mr-2 h-4 w-4" />{" "}
                                      Aktifkan Kembali
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      className="cursor-pointer rounded-xl font-poppins text-sm text-danger-600 focus:text-danger-600"
                                      onClick={() => {
                                        setActionUser(user)
                                        setIsVerifyBanOpen(true)
                                      }}
                                    >
                                      <UserMinus className="mr-2 h-4 w-4" />{" "}
                                      Nonaktifkan / Ban
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination Section */}
              {!isLoading && filteredUsers.length > 0 && (
                <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-100 p-6 md:flex-row">
                  <div className="font-poppins text-sm text-neutral-500">
                    Menampilkan{" "}
                    <span className="font-semibold text-neutral-700">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-neutral-700">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredUsers.length
                      )}
                    </span>{" "}
                    dari{" "}
                    <span className="font-semibold text-neutral-700">
                      {filteredUsers.length}
                    </span>{" "}
                    user
                  </div>
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1)
                                setCurrentPage(currentPage - 1)
                            }}
                            className={cn(
                              currentPage === 1 &&
                                "pointer-events-none opacity-50"
                            )}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i + 1}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(i + 1)
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages)
                                setCurrentPage(currentPage + 1)
                            }}
                            className={cn(
                              currentPage === totalPages &&
                                "pointer-events-none opacity-50"
                            )}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- DETAIL DIALOG (MODAL) --- */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden rounded-[32px] border-none bg-white p-0 shadow-2xl sm:max-w-2xl md:max-w-3xl">
          {selectedUser && (
            <>
              <DialogHeader className="relative shrink-0 bg-linear-to-br from-dark-blue to-slate-800 p-8 text-white">
                <div className="mt-2 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md">
                      {selectedUser.role === "EO" ? (
                        <School className="h-8 w-8 text-primary-300" />
                      ) : (
                        <UserCheck className="h-8 w-8 text-primary-300" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="font-montserrat text-2xl font-bold text-white">
                        {selectedUser.name}
                      </DialogTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                        >
                          {selectedUser.role}
                        </Badge>
                        <StatusBadge status={selectedUser.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="no-scrollbar flex-1 overflow-y-auto p-6 md:p-8">
                <Tabs defaultValue="profil" className="w-full">
                  <TabsList className="mb-8 flex h-auto w-full flex-wrap rounded-full bg-neutral-100 p-1 md:w-auto">
                    <TabsTrigger
                      value="profil"
                      className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Profil & Akun
                    </TabsTrigger>

                    {selectedUser.role === "EO" ? (
                      <>
                        <TabsTrigger
                          value="event"
                          className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          Data Event
                        </TabsTrigger>
                        <TabsTrigger
                          value="juri"
                          className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          Data Juri
                        </TabsTrigger>
                        <TabsTrigger
                          value="rekap"
                          className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          Rekap Penilaian
                        </TabsTrigger>
                      </>
                    ) : (
                      <>
                        <TabsTrigger
                          value="tim"
                          className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          Data Tim
                        </TabsTrigger>
                        <TabsTrigger
                          value="riwayat"
                          className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          Riwayat Event
                        </TabsTrigger>
                      </>
                    )}
                  </TabsList>

                  {/* --- TAB: PROFIL & AKUN (SHARED) --- */}
                  <TabsContent
                    value="profil"
                    className="space-y-8 outline-hidden"
                  >
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-montserrat font-bold text-slate-900">
                          <ShieldCheck className="h-4 w-4 text-info-600" />{" "}
                          Informasi Akun
                        </h3>
                        <div className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                          <DetailItem label="User ID" value={selectedUser.id} />
                          <DetailItem
                            label="Email Utama"
                            value={selectedUser.email}
                          />
                          <DetailItem
                            label="Terdaftar Sejak"
                            value={selectedUser.joined}
                          />
                          <DetailItem
                            label="Aktivitas Terakhir"
                            value={selectedUser.lastActivity}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-montserrat font-bold text-slate-900">
                          <UserCheck className="h-4 w-4 text-info-600" /> Profil
                          Detail
                        </h3>
                        <div className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                          <DetailItem
                            icon={<School className="h-4 w-4" />}
                            label="Instansi/Sekolah"
                            value={selectedUser.school}
                          />
                          <DetailItem
                            icon={<Phone className="h-4 w-4" />}
                            label="Nomor Telepon"
                            value={selectedUser.phone}
                          />
                          <DetailItem
                            icon={<MapPin className="h-4 w-4" />}
                            label="Alamat Lengkap"
                            value={selectedUser.address}
                          />
                        </div>
                      </div>
                    </div>

                    {selectedUser.role === "EO" &&
                      selectedUser.eoData?.panitia && (
                        <div className="space-y-4">
                          <h3 className="flex items-center gap-2 font-montserrat font-bold text-slate-900">
                            <Users className="h-4 w-4 text-info-600" /> Akses
                            Akun Panitia
                          </h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {selectedUser.eoData.panitia.map((p, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white p-3 shadow-xs"
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info-50 text-info-600">
                                  <UserCheck className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-neutral-800">
                                    {p.name}
                                  </p>
                                  <p className="text-xs text-neutral-500">
                                    {p.role}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </TabsContent>

                  {/* --- EO SPECIFIC TABS --- */}
                  {selectedUser.role === "EO" && (
                    <>
                      <TabsContent
                        value="event"
                        className="space-y-6 outline-hidden"
                      >
                        <div className="grid grid-cols-1 gap-6">
                          <Card className="rounded-2xl border-sky-100 bg-sky-50/30 shadow-none">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 font-montserrat text-lg">
                                <Trophy className="h-5 w-5 text-warning-500" />{" "}
                                Informasi Event
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <DetailItem
                                label="Nama Event"
                                value={selectedUser.eoData?.eventInfo.name}
                              />
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <DetailItem
                                  icon={<Calendar className="h-4 w-4" />}
                                  label="Jadwal Pelaksanaan"
                                  value={selectedUser.eoData?.eventInfo.date}
                                />
                                <DetailItem
                                  icon={<MapPin className="h-4 w-4" />}
                                  label="Lokasi"
                                  value={
                                    selectedUser.eoData?.eventInfo.location
                                  }
                                />
                              </div>
                              <DetailItem
                                icon={<FileText className="h-4 w-4" />}
                                label="Ketentuan Peserta"
                                value={selectedUser.eoData?.eventInfo.rules}
                              />
                            </CardContent>
                          </Card>

                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Card className="rounded-2xl border-neutral-100 shadow-none">
                              <CardHeader className="pb-2">
                                <CardTitle className="font-montserrat text-sm tracking-wider text-neutral-500 uppercase">
                                  Kategori Jenjang
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {selectedUser.eoData?.eventInfo.categories.map(
                                    (c, i) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="border-neutral-200 bg-white"
                                      >
                                        {c}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="rounded-2xl border-neutral-100 shadow-none">
                              <CardHeader className="pb-2">
                                <CardTitle className="font-montserrat text-sm tracking-wider text-neutral-500 uppercase">
                                  Pembayaran & Rekening
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center gap-3">
                                  <CreditCard className="h-5 w-5 text-info-600" />
                                  <p className="text-sm font-medium text-neutral-700">
                                    {selectedUser.eoData?.eventInfo.paymentInfo}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="juri"
                        className="space-y-4 outline-hidden"
                      >
                        <h3 className="font-montserrat font-bold text-slate-900">
                          Daftar Juri Terdaftar
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {selectedUser.eoData?.judges.map((j, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 p-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white">
                                  <UserCheck className="h-5 w-5 text-neutral-400" />
                                </div>
                                <span className="font-semibold text-neutral-800">
                                  {j}
                                </span>
                              </div>
                              <Badge
                                variant="secondary"
                                className="border-none bg-info-50 text-info-600"
                              >
                                Juri
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="rekap"
                        className="space-y-4 outline-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-montserrat font-bold text-slate-900">
                            Rekap Penilaian Sementara
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full"
                          >
                            <Download className="mr-2 h-3 w-3" /> Export PDF
                          </Button>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-neutral-100">
                          <Table>
                            <TableHeader className="bg-neutral-50">
                              <TableRow>
                                <TableHead className="font-semibold">
                                  Nama Tim
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                  Total Skor
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedUser.eoData?.scoreRecap.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={2}
                                    className="py-8 text-center text-neutral-400"
                                  >
                                    Belum ada penilaian.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                selectedUser.eoData?.scoreRecap.map((s, i) => (
                                  <TableRow key={i}>
                                    <TableCell className="font-medium">
                                      {s.team}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-info-600">
                                      {s.score}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    </>
                  )}

                  {/* --- PESERTA SPECIFIC TABS --- */}
                  {selectedUser.role === "Peserta" && (
                    <>
                      <TabsContent
                        value="tim"
                        className="space-y-6 outline-hidden"
                      >
                        <Card className="overflow-hidden rounded-3xl border-sky-100 bg-sky-50/30 shadow-none">
                          <CardHeader className="border-b border-sky-100 bg-white/50">
                            <div className="flex items-center justify-between">
                              <CardTitle className="flex items-center gap-2 font-montserrat text-lg text-sky-900">
                                <Users className="h-5 w-5" /> Informasi Tim:{" "}
                                {selectedUser.pesertaData?.team.name}
                              </CardTitle>
                              <Badge className="border-none bg-sky-600 text-white">
                                {selectedUser.pesertaData?.team.coach}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                              <div className="space-y-3">
                                <h4 className="text-sm font-bold tracking-wider text-sky-800 uppercase">
                                  Anggota Pasukan
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedUser.pesertaData?.team.members.map(
                                    (m, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="border-sky-100 bg-white px-3 py-1 text-slate-700"
                                      >
                                        {m}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-sm font-bold tracking-wider text-sky-800 uppercase">
                                  Berkas Terunggah
                                </h4>
                                <div className="space-y-2">
                                  {selectedUser.pesertaData?.team.documents.map(
                                    (d, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center justify-between rounded-lg border border-sky-100 bg-white p-2"
                                      >
                                        <span className="mr-2 truncate text-xs font-medium text-slate-600">
                                          {d}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-sky-600"
                                        >
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )
                                  )}
                                  {selectedUser.pesertaData?.team.documents
                                    .length === 0 && (
                                    <p className="text-xs text-neutral-400">
                                      Tidak ada berkas.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent
                        value="riwayat"
                        className="space-y-4 outline-hidden"
                      >
                        <h3 className="font-montserrat font-bold text-slate-900">
                          Riwayat Keikutsertaan Event
                        </h3>
                        <div className="space-y-3">
                          {selectedUser.pesertaData?.eventHistory.length ===
                          0 ? (
                            <div className="rounded-3xl border-2 border-dashed border-neutral-100 p-8 text-center">
                              <p className="text-neutral-400">
                                Belum mengikuti event apapun.
                              </p>
                            </div>
                          ) : (
                            selectedUser.pesertaData?.eventHistory.map(
                              (h, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-5 transition-colors hover:border-info-200"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info-50 text-info-600">
                                      <Trophy className="h-6 w-6" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-800">
                                        {h.eventName}
                                      </p>
                                      <p className="text-xs text-neutral-500">
                                        Status Registrasi:{" "}
                                        <span className="font-semibold text-info-600">
                                          {h.status}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                  >
                                    <ExternalLink className="h-4 w-4 text-neutral-400" />
                                  </Button>
                                </div>
                              )
                            )
                          )}
                        </div>
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </div>

              <div className="shrink-0 border-t border-neutral-100 bg-neutral-50 p-6 md:p-8">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {selectedUser.status !== "Banned" ? (
                    <Button
                      variant="ghost"
                      className="h-12 flex-1 rounded-full text-danger-600 transition-colors hover:bg-danger-50 hover:text-danger-700"
                      onClick={() => {
                        setActionUser(selectedUser)
                        setIsVerifyBanOpen(true)
                      }}
                    >
                      <UserMinus className="mr-2 h-4 w-4" /> Nonaktifkan Akses
                      Akun
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="h-12 flex-1 rounded-full text-success-600 transition-colors hover:bg-success-50 hover:text-success-700"
                      onClick={() => {
                        toast.success(
                          `Akun ${selectedUser.name} telah diaktifkan kembali`
                        )
                        setIsDetailModalOpen(false)
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Aktifkan Kembali
                      Akun
                    </Button>
                  )}
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="h-12 flex-1 rounded-full border-neutral-300"
                    >
                      Tutup Detail
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* --- CONFIRMATION DIALOGS --- */}
      <AlertDialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
        <AlertDialogContent className="rounded-[32px] border-none p-8 shadow-2xl">
          <AlertDialogHeader>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-info-50 text-info-600">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="font-montserrat text-2xl font-bold">
              Verifikasi EO?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-poppins text-neutral-500">
              Apakah Anda yakin ingin memverifikasi{" "}
              <strong>{actionUser?.name}</strong>? Setelah diverifikasi, EO
              dapat mulai membuat event dan mengelola lomba.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-row gap-3">
            <AlertDialogCancel className="mt-0 h-12 flex-1 rounded-full border-neutral-300">
              Batalkan
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-12 flex-1 rounded-full bg-info-600 hover:bg-info-700"
              onClick={handleVerify}
            >
              Ya, Verifikasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBanOpen} onOpenChange={setIsVerifyBanOpen}>
        <AlertDialogContent className="rounded-[32px] border-none p-8 shadow-2xl">
          <AlertDialogHeader>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50 text-danger-600">
              <UserMinus className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="font-montserrat text-2xl font-bold text-danger-600">
              Nonaktifkan Akun?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-poppins text-neutral-500">
              Tindakan ini akan mencabut akses login{" "}
              <strong>{actionUser?.name}</strong>. User tidak akan bisa masuk ke
              dashboard sampai diaktifkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-row gap-3">
            <AlertDialogCancel className="mt-0 h-12 flex-1 rounded-full border-neutral-300">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-12 flex-1 rounded-full bg-danger-600 hover:bg-danger-700"
              onClick={handleBan}
            >
              Ya, Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string
  value?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
        {label}
      </p>
      <div className="flex items-center gap-2 font-poppins font-medium text-slate-700">
        {icon}
        <span>{value || "-"}</span>
      </div>
    </div>
  )
}
