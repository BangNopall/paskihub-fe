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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
    lastActivity: "28 Apr 2026, 10:15"
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
    lastActivity: "27 Apr 2026, 16:30"
  },
  { 
    id: "U3", 
    name: "Event Nusantara Corp", 
    email: "admin@eventnusantara.id", 
    role: "EO", 
    status: "Pending", 
    verified: false, 
    joined: "20 Apr 2026",
    phone: "0821-5544-3322",
    school: "-",
    address: "Bandung, Jawa Barat",
    lastActivity: "20 Apr 2026, 09:00"
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
    lastActivity: "01 Mar 2026, 12:00"
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
    lastActivity: "28 Apr 2026, 08:45"
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
    <Badge variant="outline" className={`px-3 py-1 font-poppins text-xs font-normal ${styles[status]}`}>
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
  
  // Modal States
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || user.role.toLowerCase() === activeTab
    return matchesSearch && matchesTab
  })

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
        <h2 className="font-montserrat text-xl font-bold text-slate-900">Gagal Memuat Data User</h2>
        <Button onClick={() => window.location.reload()} className="mt-6 rounded-full bg-blue-500 hover:bg-blue-600">
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
            <p className="text-sm text-neutral-500">Kelola akses dan verifikasi akun Event Organizer serta Peserta.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full border-neutral-300 bg-white hover:bg-neutral-50">
              <Mail className="mr-2 h-4 w-4" /> Blast Email
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
          <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white shadow-none">
            <CardHeader className="border-b border-neutral-100 bg-white px-5 py-6 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full md:w-auto">
                  <TabsList className="bg-neutral-100 p-1 rounded-full">
                    <TabsTrigger value="all" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Semua</TabsTrigger>
                    <TabsTrigger value="eo" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">EO</TabsTrigger>
                    <TabsTrigger value="peserta" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Peserta</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
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
                  {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-neutral-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">User</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Role</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Status</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Terdaftar</TableHead>
                        <TableHead className="px-6 text-right font-poppins font-semibold text-neutral-600">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-40 text-center font-poppins text-neutral-500">
                            Tidak ada user ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow 
                            key={user.id} 
                            className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50 cursor-pointer group"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsSheetOpen(true)
                            }}
                          >
                            <TableCell className="px-6 py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="flex items-center gap-1.5 font-poppins font-semibold text-neutral-800 group-hover:text-info-600 transition-colors">
                                  {user.name}
                                  {user.verified && <CheckCircle className="h-3.5 w-3.5 text-info-500" fill="currentColor" />}
                                </span>
                                <span className="text-xs text-neutral-500">{user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge variant="secondary" className={user.role === 'EO' ? 'bg-info-50 text-info-600' : 'bg-neutral-100 text-neutral-600'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <StatusBadge status={user.status} />
                            </TableCell>
                            <TableCell className="px-6 py-4 text-sm text-neutral-500">
                              {user.joined}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-neutral-100">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-neutral-200 shadow-lg">
                                  <DropdownMenuLabel className="font-poppins text-xs font-semibold text-neutral-500">Aksi User</DropdownMenuLabel>
                                  <DropdownMenuItem 
                                    className="cursor-pointer font-poppins text-sm rounded-xl"
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setIsSheetOpen(true)
                                    }}
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" /> Detail Profil
                                  </DropdownMenuItem>
                                  {user.status === 'Pending' && (
                                    <DropdownMenuItem 
                                      className="cursor-pointer font-poppins text-sm text-info-600 rounded-xl focus:text-info-600"
                                      onClick={() => {
                                        setActionUser(user)
                                        setIsVerifyOpen(true)
                                      }}
                                    >
                                      <UserCheck className="mr-2 h-4 w-4" /> Verifikasi EO
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator className="bg-neutral-100" />
                                  {user.status === 'Banned' ? (
                                    <DropdownMenuItem className="cursor-pointer font-poppins text-sm text-success-600 rounded-xl focus:text-success-600">
                                      <CheckCircle className="mr-2 h-4 w-4" /> Aktifkan Kembali
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem 
                                      className="cursor-pointer font-poppins text-sm text-danger-600 rounded-xl focus:text-danger-600"
                                      onClick={() => {
                                        setActionUser(user)
                                        setIsVerifyBanOpen(true)
                                      }}
                                    >
                                      <UserMinus className="mr-2 h-4 w-4" /> Nonaktifkan / Ban
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- DETAIL SHEET --- */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg rounded-l-[32px] border-none p-0 overflow-hidden shadow-2xl">
          <SheetHeader className="bg-gradient-to-br from-dark-blue to-slate-800 p-8 text-white relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
              onClick={() => setIsSheetOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex flex-col gap-4 mt-4">
              <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                <School className="h-10 w-10 text-primary-300" />
              </div>
              <div className="space-y-1">
                <SheetTitle className="text-2xl font-bold font-montserrat text-white">{selectedUser?.name}</SheetTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">{selectedUser?.role}</Badge>
                  <StatusBadge status={selectedUser?.status || "Active"} />
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-250px)] no-scrollbar">
             {/* Account Info */}
             <div className="space-y-4">
               <h3 className="font-montserrat font-bold text-slate-900 flex items-center gap-2">
                 <ShieldCheck className="h-4 w-4 text-info-600" /> Informasi Akun
               </h3>
               <div className="grid grid-cols-1 gap-4">
                 <DetailItem label="User ID" value={selectedUser?.id} />
                 <DetailItem label="Email" value={selectedUser?.email} />
                 <DetailItem label="Terdaftar Sejak" value={selectedUser?.joined} />
                 <DetailItem label="Aktivitas Terakhir" value={selectedUser?.lastActivity} />
               </div>
             </div>

             <Separator className="bg-neutral-100" />

             {/* Profile Info */}
             <div className="space-y-4">
               <h3 className="font-montserrat font-bold text-slate-900 flex items-center gap-2">
                 <UserCheck className="h-4 w-4 text-info-600" /> Profil Pengguna
               </h3>
               <div className="grid grid-cols-1 gap-4">
                 <DetailItem icon={<School className="h-4 w-4" />} label="Instansi/Sekolah" value={selectedUser?.school} />
                 <DetailItem icon={<Phone className="h-4 w-4" />} label="Nomor Telepon" value={selectedUser?.phone} />
                 <DetailItem icon={<MapPin className="h-4 w-4" />} label="Alamat" value={selectedUser?.address} />
               </div>
             </div>

             <div className="pt-4 flex flex-col gap-3">
                {selectedUser?.status === 'Pending' && (
                  <Button className="w-full h-12 rounded-full bg-info-600 hover:bg-info-700" onClick={() => {
                    setActionUser(selectedUser)
                    setIsVerifyOpen(true)
                  }}>
                    Verifikasi Akun Sekarang
                  </Button>
                )}
                <Button variant="outline" className="w-full h-12 rounded-full border-neutral-300">
                  Kirim Email Langsung
                </Button>
                {selectedUser?.status !== 'Banned' && (
                  <Button variant="ghost" className="w-full h-12 rounded-full text-danger-600 hover:bg-danger-50 hover:text-danger-700" onClick={() => {
                    setActionUser(selectedUser)
                    setIsVerifyBanOpen(true)
                  }}>
                    Nonaktifkan Akses Akun
                  </Button>
                )}
             </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* --- CONFIRMATION DIALOGS --- */}
      <AlertDialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="h-16 w-16 rounded-2xl bg-info-50 flex items-center justify-center text-info-600 mb-4">
               <ShieldCheck className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="font-montserrat text-2xl font-bold">Verifikasi EO?</AlertDialogTitle>
            <AlertDialogDescription className="font-poppins text-neutral-500">
              Apakah Anda yakin ingin memverifikasi <strong>{actionUser?.name}</strong>? Setelah diverifikasi, EO dapat mulai membuat event dan mengelola lomba.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-row gap-3">
            <AlertDialogCancel className="flex-1 h-12 rounded-full border-neutral-300 mt-0">Batalkan</AlertDialogCancel>
            <AlertDialogAction className="flex-1 h-12 rounded-full bg-info-600 hover:bg-info-700" onClick={handleVerify}>
              Ya, Verifikasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBanOpen} onOpenChange={setIsVerifyBanOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="h-16 w-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-600 mb-4">
               <UserMinus className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="font-montserrat text-2xl font-bold text-danger-600">Nonaktifkan Akun?</AlertDialogTitle>
            <AlertDialogDescription className="font-poppins text-neutral-500">
              Tindakan ini akan mencabut akses login <strong>{actionUser?.name}</strong>. User tidak akan bisa masuk ke dashboard sampai diaktifkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-row gap-3">
            <AlertDialogCancel className="flex-1 h-12 rounded-full border-neutral-300 mt-0">Batal</AlertDialogCancel>
            <AlertDialogAction className="flex-1 h-12 rounded-full bg-danger-600 hover:bg-danger-700" onClick={handleBan}>
              Ya, Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DetailItem({ label, value, icon }: { label: string, value?: string, icon?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2 text-slate-700 font-poppins font-medium">
        {icon}
        <span>{value || "-"}</span>
      </div>
    </div>
  )
}
