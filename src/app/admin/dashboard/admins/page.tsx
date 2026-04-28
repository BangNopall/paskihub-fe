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
  X
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
import { Montserrat, Poppins } from "@/lib/fonts"
import { toast } from "sonner"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export type AdminRole = "Super Admin" | "Finance Admin" | "Moderator"

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

const MOCK_ADMINS: AdminUser[] = [
  { id: "ADM-1", name: "Muhammad Naufal", email: "naufal@paskihub.com", role: "Super Admin", lastLogin: "28 Apr 2026, 09:00", status: "Active" },
  { id: "ADM-2", name: "Finance Team", email: "finance@paskihub.com", role: "Finance Admin", lastLogin: "27 Apr 2026, 14:20", status: "Active" },
  { id: "ADM-3", name: "Staff Moderator", email: "moderator@paskihub.com", role: "Moderator", lastLogin: "25 Apr 2026, 10:15", status: "Inactive" },
]

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

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

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case "Super Admin": return "bg-dark-blue text-white"
      case "Finance Admin": return "bg-emerald-50 text-emerald-600 border-emerald-100"
      default: return "bg-info-50 text-info-600 border-info-100"
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
              <Button className="h-12 rounded-full bg-info-600 px-6 font-semibold shadow-lg hover:bg-info-700 transition-all active:scale-95">
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
                          <SelectItem value="super">Super Admin</SelectItem>
                          <SelectItem value="finance">Finance Admin</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
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
                      {filteredAdmins.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-40 text-center font-poppins text-neutral-500">
                            Tidak ada akun admin ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAdmins.map((admin) => (
                          <TableRow key={admin.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50">
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold font-montserrat">
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
                                  <DropdownMenuItem className="cursor-pointer font-poppins text-sm rounded-xl">
                                    <Lock className="mr-2 h-4 w-4" /> Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer font-poppins text-sm rounded-xl">
                                    <ShieldCheck className="mr-2 h-4 w-4" /> Ubah Role
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-neutral-100" />
                                  <DropdownMenuItem className="cursor-pointer font-poppins text-sm text-danger-600 rounded-xl focus:text-danger-600">
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
          </Card>
        </div>
      </div>
    </div>
  )
}
