"use client"

import React, { useState, useEffect } from "react"
import { 
  ShieldCheck, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Lock, 
  Mail,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Montserrat, Poppins } from "@/lib/fonts"
import { toast } from "sonner"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export type AdminRole = "Admin" | "Super Admin"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  lastLogin: string
  status: "Active" | "Inactive"
}

// ==========================================
// 2. MOCK DATA
// ==========================================

const MOCK_ADMINS: AdminUser[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `ADM-${i + 1}`,
  name: i === 0 ? "Muhammad Naufal" : `Staff Admin ${i + 1}`,
  email: i === 0 ? "naufal@paskihub.com" : `staff${i + 1}@paskihub.com`,
  role: i % 5 === 0 ? "Super Admin" : "Admin",
  lastLogin: "28 Apr 2026, 09:00",
  status: "Active"
}))

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isRoleOpen, setIsRoleOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [actionAdmin, setActionAdmin] = useState<AdminUser | null>(null)
  const [newRole, setNewRole] = useState<AdminRole>("Admin")

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/admin/accounts di sini
        await new Promise((resolve) => setTimeout(resolve, 1200))
        setAdmins(MOCK_ADMINS)
      } catch (error) {
        console.error("Gagal memuat data admin:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdmins()
  }, [])

  // Action Handlers
  const handleResetPassword = async () => {
    if (!actionAdmin) return
    toast.promise(new Promise(res => setTimeout(res, 1000)), {
      loading: 'Sedang mengirim email reset...',
      success: `Link reset password telah dikirim ke ${actionAdmin.email}`,
      error: 'Gagal mereset password'
    })
    setIsResetOpen(false)
  }

  const handleChangeRole = async () => {
    if (!actionAdmin) return
    setAdmins(prev => prev.map(a => a.id === actionAdmin.id ? { ...a, role: newRole } : a))
    toast.success(`Role ${actionAdmin.name} berhasil diubah menjadi ${newRole}`)
    setIsRoleOpen(false)
  }

  const handleDeleteAdmin = async () => {
    if (!actionAdmin) return
    setAdmins(prev => prev.filter(a => a.id !== actionAdmin.id))
    toast.error(`Akses admin ${actionAdmin.name} telah dihapus permanen`)
    setIsDeleteOpen(false)
  }

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination Logic
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage)
  const paginatedAdmins = filteredAdmins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case "Super Admin": return "bg-dark-blue text-white"
      case "Admin": return "bg-info-50 text-info-600 border-info-100"
      default: return "bg-neutral-100 text-neutral-600"
    }
  }

  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
              Kelola Akses Admin
            </h1>
            <p className="text-sm text-neutral-500">Tambahkan dan kelola akun staff yang dapat mengakses dashboard admin.</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 rounded-full px-6 font-semibold shadow-lg transition-all active:scale-95" variant={'default'}>
                <UserPlus className="mr-2 h-5 w-5" />
                Tambah Admin Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none p-0 overflow-hidden shadow-2xl">
              <DialogHeader className="bg-gradient-to-r from-dark-blue to-slate-800 p-8 text-white">
                <DialogTitle className="font-montserrat text-2xl font-bold">Buat Akun Admin</DialogTitle>
                <DialogDescription className="text-slate-300">
                  Pastikan email staff aktif untuk verifikasi login.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 p-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Nama Lengkap</label>
                    <Input placeholder="Masukkan nama staff..." className="h-12 rounded-xl border-neutral-200 bg-neutral-50 focus-visible:ring-info-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700">Alamat Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input type="email" placeholder="email@paskihub.com" className="h-12 pl-12 rounded-xl border-neutral-200 bg-neutral-50 focus-visible:ring-info-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-700">Role Akses</label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl border-neutral-200 bg-neutral-50">
                          <SelectValue placeholder="Pilih Role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-700">Password Sementara</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input type="password" placeholder="••••••••" className="h-12 pl-12 rounded-xl border-neutral-200 bg-neutral-50 focus-visible:ring-info-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex flex-row gap-3 p-8 pt-0">
                <Button variant="outline" className="flex-1 h-12 rounded-full border-neutral-300" onClick={() => setIsCreateOpen(false)}>Batal</Button>
                <Button className="flex-1 h-12 rounded-full bg-info-600 hover:bg-info-700 font-bold" onClick={() => {
                  toast.success("Akun admin berhasil dibuat")
                  setIsCreateOpen(false)
                }}>Simpan Akun</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
          <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white shadow-none">
            <CardHeader className="border-b border-neutral-100 bg-white px-5 py-6 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input 
                    placeholder="Cari nama atau email admin..." 
                    className="rounded-full border-neutral-200 bg-neutral-50 pl-10 focus-visible:ring-info-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className="rounded-full px-3 py-1 font-normal text-neutral-500 border-neutral-200 bg-neutral-50">
                    Total: {admins.length} Staff
                   </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-neutral-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Admin</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Role</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Login Terakhir</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Status</TableHead>
                        <TableHead className="px-6 text-right font-poppins font-semibold text-neutral-600">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAdmins.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-40 text-center font-poppins text-neutral-500">
                            Tidak ada akun admin ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedAdmins.map((admin) => (
                          <TableRow key={admin.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50">
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold font-montserrat uppercase">
                                  {admin.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-poppins font-semibold text-neutral-800">{admin.name}</span>
                                  <span className="text-xs text-neutral-500">{admin.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge variant="outline" className={`px-3 py-1 font-normal text-xs rounded-full border-none ${getRoleBadge(admin.role)}`}>
                                {admin.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-sm text-neutral-500">
                              {admin.lastLogin}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge variant="outline" className={`px-3 py-1 font-poppins text-xs font-normal ${admin.status === "Active" ? "border-green-400 bg-green-50 text-green-600" : "border-neutral-300 bg-neutral-50 text-neutral-600"}`}>
                                {admin.status === "Active" ? "Aktif" : "Nonaktif"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-neutral-100">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-neutral-200 shadow-lg">
                                  <DropdownMenuLabel className="font-poppins text-xs font-semibold text-neutral-500">Opsi Akun</DropdownMenuLabel>
                                  <DropdownMenuItem 
                                    className="cursor-pointer font-poppins text-sm rounded-xl"
                                    onClick={() => {
                                      setActionAdmin(admin)
                                      setIsResetOpen(true)
                                    }}
                                  >
                                    <Lock className="mr-2 h-4 w-4" /> Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="cursor-pointer font-poppins text-sm rounded-xl"
                                    onClick={() => {
                                      setActionAdmin(admin)
                                      setNewRole(admin.role)
                                      setIsRoleOpen(true)
                                    }}
                                  >
                                    <ShieldCheck className="mr-2 h-4 w-4" /> Ubah Role
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-neutral-100" />
                                  <DropdownMenuItem 
                                    className="cursor-pointer font-poppins text-sm text-danger-600 rounded-xl focus:text-danger-600"
                                    onClick={() => {
                                      setActionAdmin(admin)
                                      setIsDeleteOpen(true)
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus Akses
                                  </DropdownMenuItem>
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
            </CardContent>

            {/* Pagination */}
            {!isLoading && filteredAdmins.length > itemsPerPage && (
              <div className="border-t border-neutral-100 p-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* --- RESET PASSWORD DIALOG --- */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="sm:max-w-md rounded-[32px] border-none p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="bg-info-600 p-8 text-white">
            <DialogTitle className="font-montserrat text-2xl font-bold">Reset Password?</DialogTitle>
            <DialogDescription className="text-info-100">
              Konfirmasi pengaturan ulang kata sandi admin.
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 text-center space-y-4">
             <div className="mx-auto h-16 w-16 rounded-2xl bg-info-50 flex items-center justify-center text-info-600">
                <Lock className="h-8 w-8" />
             </div>
             <p className="font-poppins text-neutral-600">
               Paskihub akan mengirimkan link pengaturan ulang kata sandi ke email: <br/>
               <strong className="text-slate-900">{actionAdmin?.email}</strong>
             </p>
          </div>
          <DialogFooter className="flex flex-row gap-3 p-8 pt-0">
            <Button variant="outline" className="flex-1 h-12 rounded-full border-neutral-300" onClick={() => setIsResetOpen(false)}>Batalkan</Button>
            <Button variant={'default'} className="flex-1 h-12 rounded-full font-bold" onClick={handleResetPassword}>Kirim Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- CHANGE ROLE DIALOG --- */}
      <Dialog open={isRoleOpen} onOpenChange={setIsRoleOpen}>
        <DialogContent className="sm:max-w-md rounded-[32px] border-none p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="bg-slate-800 p-8 text-white">
            <DialogTitle className="font-montserrat text-2xl font-bold">Ubah Role Akses</DialogTitle>
            <DialogDescription className="text-slate-400">
              Update tingkat akses untuk {actionAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Pilih Role Baru</label>
                <Select value={newRole} onValueChange={(val) => setNewRole(val as AdminRole)}>
                  <SelectTrigger className="h-14 rounded-xl border-neutral-200 bg-neutral-50 focus:ring-info-500">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-neutral-200 shadow-xl">
                    <SelectItem value="Admin" className="rounded-xl py-3">Admin (Staff Biasa)</SelectItem>
                    <SelectItem value="Super Admin" className="rounded-xl py-3">Super Admin (Akses Penuh)</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <p className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-xl border border-neutral-100 italic">
               * Super Admin dapat mengelola akun admin lain dan mengakses pengaturan sistem utama.
             </p>
          </div>
          <DialogFooter className="flex flex-row gap-3 p-8 pt-0">
            <Button variant="outline" className="flex-1 h-12 rounded-full border-neutral-300" onClick={() => setIsRoleOpen(false)}>Batal</Button>
            <Button className="flex-1 h-12 rounded-full bg-slate-900 hover:bg-black font-bold text-white" onClick={handleChangeRole}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DELETE ACCESS ALERT --- */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="h-16 w-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-600 mb-4">
               <Trash2 className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="font-montserrat text-2xl font-bold text-danger-600">Hapus Akses Admin?</AlertDialogTitle>
            <AlertDialogDescription className="font-poppins text-neutral-500">
              Apakah Anda yakin ingin menghapus akses <strong>{actionAdmin?.name}</strong> secara permanen? Akun ini tidak akan bisa lagi login ke dashboard admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-row gap-3">
            <AlertDialogCancel className="flex-1 h-12 rounded-full border-neutral-300 mt-0">Batalkan</AlertDialogCancel>
            <AlertDialogAction className="flex-1 h-12 rounded-full bg-danger-600 hover:bg-danger-700 text-white font-bold" onClick={handleDeleteAdmin}>
              Ya, Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
