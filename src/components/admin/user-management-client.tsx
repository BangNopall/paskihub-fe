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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Montserrat, Poppins } from "@/lib/fonts"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { cn } from "@/lib/utils"

import { UserResponse } from "@/schemas/admin.schema"
import {
  banUserAction,
  activateUserAction,
  verifyUserAction,
  fetchUserDetailAction,
  updateEventStatusAction,
} from "@/actions/admin.actions"

export type UserRole = "EO" | "Peserta"
export type UserStatus = "Active" | "Pending" | "Banned"

interface UserManagementClientProps {
  initialUsers: UserResponse[]
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status as UserStatus;
  const styles: Record<string, string> = {
    Active: "border-green-400 bg-green-50 text-green-600",
    Pending: "border-yellow-400 bg-yellow-50 text-yellow-600",
    Banned: "border-red-400 bg-red-50 text-red-600",
  }

  const safeStyle = styles[normalizedStatus] || "border-gray-400 bg-gray-50 text-gray-600";

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 font-poppins text-xs font-normal ${safeStyle}`}
    >
      {normalizedStatus === "Active" ? "Aktif" : normalizedStatus}
    </Badge>
  )
}

export function UserManagementClient({ initialUsers }: UserManagementClientProps) {
  const [users, setUsers] = useState<UserResponse[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Modal States
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
  const [detailData, setDetailData] = useState<any | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isVerifyOpen, setIsVerifyOpen] = useState(false)
  const [isBanOpen, setIsVerifyBanOpen] = useState(false)
  const [actionUser, setActionUser] = useState<UserResponse | null>(null)
  const [isPendingAction, setIsPendingAction] = useState(false)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])

  const filteredUsers = users.filter((user) => {
    if (user.role === "ADMIN") return false
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab =
      activeTab === "all" || user.role === activeTab
    return matchesSearch && matchesTab
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleVerify = async () => {
    if (!actionUser) return
    setIsPendingAction(true)
    const res = await verifyUserAction(actionUser.id)
    if (res.success) {
      toast.success(`Akun ${actionUser.name} berhasil diverifikasi`)
      setUsers(users.map(u => u.id === actionUser.id ? { ...u, status: "Active", email_is_verified: true } : u))
      if (selectedUser?.id === actionUser.id) {
        setSelectedUser({ ...selectedUser, status: "Active", email_is_verified: true });
        if (detailData) setDetailData({ ...detailData, status: "Active" });
      }
    } else {
      toast.error(res.message)
    }
    setIsPendingAction(false)
    setIsVerifyOpen(false)
  }

  const handleBan = async () => {
    if (!actionUser) return
    setIsPendingAction(true)
    const res = await banUserAction(actionUser.id)
    if (res.success) {
      toast.error(`Akses akun ${actionUser.name} telah dinonaktifkan`)
      setUsers(users.map(u => u.id === actionUser.id ? { ...u, status: "Banned", is_banned: true } : u))
      if (selectedUser?.id === actionUser.id) {
        setSelectedUser({ ...selectedUser, status: "Banned", is_banned: true });
        if (detailData) setDetailData({ ...detailData, status: "Banned" });
      }
    } else {
      toast.error(res.message)
    }
    setIsPendingAction(false)
    setIsVerifyBanOpen(false)
  }

  const handleActivate = async (user: UserResponse) => {
    const res = await activateUserAction(user.id)
    if (res.success) {
      toast.success(`Akun ${user.name} telah diaktifkan kembali`)
      setUsers(users.map(u => u.id === user.id ? { ...u, status: "Active", is_banned: false } : u))
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, status: "Active", is_banned: false });
        if (detailData) setDetailData({ ...detailData, status: "Active" });
      }
    } else {
      toast.error(res.message)
    }
  }

  const handleOpenDetail = async (user: UserResponse) => {
    setSelectedUser(user)
    setDetailData(null)
    setIsDetailModalOpen(true)
    setIsLoadingDetail(true)

    const res = await fetchUserDetailAction(user.id)
    if (res.success) {
      setDetailData(res.data)
    } else {
      toast.error(res.message)
    }
    setIsLoadingDetail(false)
  }

  const handleUpdateEventStatus = async (eventId: string, newStatus: string) => {
    const res = await updateEventStatusAction(eventId, newStatus)
    if (res.success) {
      toast.success(res.message)
      // Update local state for the event status
      if (detailData && detailData.eo_data && detailData.eo_data.events) {
        const updatedEvents = detailData.eo_data.events.map((e: any) =>
          e.id === eventId ? { ...e, status: newStatus } : e
        )
        setDetailData({
          ...detailData,
          eo_data: {
            ...detailData.eo_data,
            events: updatedEvents,
          },
        })
      }
    } else {
      toast.error(res.message)
    }
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
                      value="ORGANIZER"
                      className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      EO
                    </TabsTrigger>
                    <TabsTrigger
                      value="PESERTA"
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
                          onClick={() => handleOpenDetail(user)}
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="flex items-center gap-1.5 font-poppins font-semibold text-neutral-800 transition-colors group-hover:text-info-600">
                                {user.name}
                                {user.email_is_verified && (
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
                                user.role === "ORGANIZER"
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
                                  onClick={() => handleOpenDetail(user)}
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />{" "}
                                  Detail Profil
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-neutral-100" />
                                {user.status === "Banned" ? (
                                  <DropdownMenuItem 
                                    className="cursor-pointer rounded-xl font-poppins text-sm text-success-600 focus:text-success-600"
                                    onClick={() => handleActivate(user)}
                                  >
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

              {/* Pagination Section */}
              {filteredUsers.length > 0 && (
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
                      {selectedUser.role === "ORGANIZER" ? (
                        <School className="h-8 w-8 text-primary-300" />
                      ) : (
                        <UserCheck className="h-8 w-8 text-primary-300" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="font-montserrat text-2xl font-bold text-white">
                        {detailData ? detailData.name : selectedUser.name}
                      </DialogTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                        >
                          {selectedUser.role}
                        </Badge>
                        <StatusBadge status={detailData ? detailData.status : selectedUser.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="no-scrollbar flex-1 overflow-y-auto p-6 md:p-8">
                {isLoadingDetail ? (
                  <div className="flex items-center justify-center py-12">
                     <Loader2 className="h-8 w-8 animate-spin text-info-600" />
                  </div>
                ) : detailData ? (
                  <Tabs defaultValue="profil" className="w-full">
                    <TabsList className="mb-8 flex h-auto w-full flex-wrap rounded-full bg-neutral-100 p-1 md:w-auto">
                      <TabsTrigger
                        value="profil"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Profil & Akun
                      </TabsTrigger>

                      {detailData.role === "ORGANIZER" ? (
                        <>
                          <TabsTrigger
                            value="event"
                            className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            Data Event
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
                            <DetailItem label="User ID" value={detailData.id} />
                            <DetailItem
                              label="Email Utama"
                              value={detailData.email}
                            />
                            <DetailItem
                              label="Terdaftar Sejak"
                              value={new Date(detailData.joined_at).toLocaleDateString("id-ID")}
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
                              value={detailData.school_name}
                            />
                            <DetailItem
                              icon={<Phone className="h-4 w-4" />}
                              label="Nomor Telepon"
                              value={detailData.phone}
                            />
                            <DetailItem
                              icon={<MapPin className="h-4 w-4" />}
                              label="Alamat Lengkap"
                              value={detailData.address}
                            />
                          </div>
                        </div>
                      </div>

                      {detailData.role === "ORGANIZER" &&
                        detailData.eo_data?.panitia?.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-montserrat font-bold text-slate-900">
                              <Users className="h-4 w-4 text-info-600" /> Akses
                              Akun Panitia
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              {detailData.eo_data.panitia.map((p: any, idx: number) => (
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
                    {detailData.role === "ORGANIZER" && (
                      <>
                        <TabsContent
                          value="event"
                          className="space-y-6 outline-hidden"
                        >
                          <div className="space-y-4">
                            <h3 className="font-montserrat font-bold text-slate-900">
                              Event yang Diselenggarakan
                            </h3>
                            {detailData.eo_data?.events?.length === 0 ? (
                              <div className="rounded-3xl border-2 border-dashed border-neutral-100 p-8 text-center">
                                <p className="text-neutral-400">
                                  Belum ada event yang dibuat.
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-6">
                                {detailData.eo_data?.events?.map((e: any, i: number) => (
                                  <Card key={i} className="overflow-hidden rounded-2xl border-sky-100 bg-white shadow-sm">
                                    <div className="flex flex-col md:flex-row">
                                      <div className="flex-1 p-6">
                                        <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                          <div>
                                            <h4 className="font-montserrat text-lg font-bold text-slate-900">
                                              {e.event_name}
                                            </h4>
                                            <div className="mt-2 flex flex-wrap gap-3">
                                              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{new Date(e.compe_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                              </div>
                                              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span>{e.location}</span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="w-full sm:w-40">
                                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                              Status Event
                                            </label>
                                            <Select
                                              defaultValue={e.status}
                                              onValueChange={(val) => handleUpdateEventStatus(e.id, val)}
                                            >
                                              <SelectTrigger className="h-9 rounded-lg border-neutral-200 bg-neutral-50 text-xs font-semibold">
                                                <SelectValue placeholder="Pilih Status" />
                                              </SelectTrigger>
                                              <SelectContent className="rounded-xl border-neutral-200">
                                                <SelectItem value="DRAFT" className="text-xs">DRAFT</SelectItem>
                                                <SelectItem value="OPEN" className="text-xs">OPEN</SelectItem>
                                                <SelectItem value="CLOSED" className="text-xs">CLOSED</SelectItem>
                                                <SelectItem value="ARCHIVED" className="text-xs">ARCHIVED</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>

                                        <Separator className="my-4 bg-neutral-100" />

                                        <div>
                                          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                            Kategori & Biaya (Level)
                                          </p>
                                          <div className="flex flex-wrap gap-2">
                                            {e.event_levels?.map((lvl: any, idx: number) => (
                                              <div
                                                key={idx}
                                                className="flex flex-col gap-1 rounded-xl border border-sky-100 bg-sky-50/50 p-3"
                                              >
                                                <span className="text-xs font-bold text-sky-800">{lvl.name}</span>
                                                <div className="flex flex-col gap-0.5">
                                                  <span className="text-[10px] text-neutral-500">Reg: Rp {lvl.regis_fee.toLocaleString()}</span>
                                                  <span className="text-[10px] text-neutral-500">DP: Rp {lvl.dp_fee.toLocaleString()}</span>
                                                </div>
                                              </div>
                                            ))}
                                            {!e.event_levels?.length && (
                                              <span className="text-xs text-neutral-400 italic">Belum ada level ditentukan</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </>
                    )}

                    {/* --- PESERTA SPECIFIC TABS --- */}
                    {detailData.role === "PESERTA" && (
                      <>
                        <TabsContent
                          value="tim"
                          className="space-y-6 outline-hidden"
                        >
                           <div className="space-y-4">
                            <h3 className="font-montserrat font-bold text-slate-900">
                              Daftar Tim & Anggota
                            </h3>
                            {detailData.peserta_data?.teams?.length === 0 ? (
                               <div className="rounded-3xl border-2 border-dashed border-neutral-100 p-8 text-center">
                               <p className="text-neutral-400">
                                 Belum ada tim yang dibuat.
                               </p>
                             </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-6">
                                {detailData.peserta_data?.teams?.map((t: any, i: number) => (
                                  <div key={i} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xs">
                                    <div className="bg-neutral-50/50 p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-montserrat text-base font-bold text-slate-800">{t.team_name}</p>
                                          <p className="text-xs text-neutral-500">Pelatih: <span className="font-semibold text-neutral-700">{t.coach}</span></p>
                                        </div>
                                        <Badge variant="secondary" className="bg-white">{t.members_count} Anggota</Badge>
                                      </div>
                                    </div>
                                    <div className="p-4">
                                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">Daftar Anggota</p>
                                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {t.members?.map((m: any, idx: number) => (
                                          <div key={idx} className="flex items-center gap-2 rounded-lg border border-neutral-50 bg-neutral-50/30 p-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-info-600 shadow-xs">
                                              {idx + 1}
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-xs font-semibold text-neutral-800">{m.name}</span>
                                              <span className="text-[10px] text-neutral-500 capitalize">{m.role}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                           </div>
                        </TabsContent>

                        <TabsContent
                          value="riwayat"
                          className="space-y-4 outline-hidden"
                        >
                          <h3 className="font-montserrat font-bold text-slate-900">
                            Riwayat Keikutsertaan Event
                          </h3>
                          <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xs">
                            <Table>
                              <TableHeader className="bg-neutral-50/50">
                                <TableRow>
                                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Event</TableHead>
                                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Kategori/Level</TableHead>
                                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Pembayaran</TableHead>
                                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Penilaian</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {detailData.peserta_data?.event_history?.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-sm text-neutral-400">
                                      Belum mengikuti event apapun.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  detailData.peserta_data?.event_history?.map(
                                    (h: any, i: number) => (
                                      <TableRow key={i} className="hover:bg-neutral-50/30">
                                        <TableCell className="py-4">
                                          <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-50 text-info-600">
                                              <Trophy className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-semibold text-neutral-800">{h.event_name}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant="outline" className="text-[10px] border-sky-100 bg-sky-50 text-sky-700">
                                            {h.level_name || "-"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <span className={cn(
                                            "text-xs font-medium",
                                            h.payment_status === "PAID" ? "text-success-600" : "text-amber-600"
                                          )}>
                                            {h.payment_status}
                                          </span>
                                        </TableCell>
                                        <TableCell>
                                          <span className="text-xs text-neutral-500">
                                            {h.assessment_status || "Belum Dinilai"}
                                          </span>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                      </>
                    )}
                  </Tabs>
                ) : (
                  <div className="flex items-center justify-center py-12 text-neutral-500">
                    Detail pengguna tidak ditemukan.
                  </div>
                )}
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
                        handleActivate(selectedUser)
                        setIsDetailModalOpen(false)
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Aktifkan Kembali
                      Akun
                    </Button>
                  )}
                  {selectedUser.status === "Pending" && (
                    <Button
                      variant="default"
                      className="h-12 flex-1 rounded-full bg-info-600 hover:bg-info-700"
                      onClick={() => {
                        setActionUser(selectedUser)
                        setIsVerifyOpen(true)
                      }}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" /> Verifikasi Manual
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
              Verifikasi User?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-poppins text-neutral-500">
              Apakah Anda yakin ingin memverifikasi{" "}
              <strong>{actionUser?.name}</strong> secara manual?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-row gap-3">
            <AlertDialogCancel className="mt-0 h-12 flex-1 rounded-full border-neutral-300">
              Batalkan
            </AlertDialogCancel>
            <Button
              className="h-12 flex-1 rounded-full bg-info-600 hover:bg-info-700 text-white"
              onClick={handleVerify}
              disabled={isPendingAction}
            >
              {isPendingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ya, Verifikasi"}
            </Button>
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
            <Button
              variant="destructive"
              className="h-12 flex-1 rounded-full"
              onClick={handleBan}
              disabled={isPendingAction}
            >
              {isPendingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ya, Nonaktifkan"}
            </Button>
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
        <span className="truncate">{value || "-"}</span>
      </div>
    </div>
  )
}
