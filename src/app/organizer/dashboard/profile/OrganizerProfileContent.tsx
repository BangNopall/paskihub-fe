"use client"

import React, { useState } from "react"
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Plus,
  Trash2,
  Pencil,
  MailWarning,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  eoUpdatePasswordSchema, EOUpdatePasswordData,
  eoStaffCreateSchema, EOStaffCreateData,
  eoStaffResetPasswordSchema, EOStaffResetPasswordData
} from "@/schemas/profile.schema"
import { 
  updateEOPasswordAction, 
  createEOStaffAction, 
  resetEOStaffPasswordAction, 
  deleteEOStaffAction 
} from "@/actions/profile.actions"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export interface AdditionalAccount {
  id: string
  email: string
  status: string
  created_at: string
}

interface OrganizerProfileContentProps {
  primaryEmail: string
  initialStaff: AdditionalAccount[]
}

// ==========================================
// 2. UI HELPER COMPONENTS
// ==========================================

function SectionWrapper({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm backdrop-blur-md md:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-poppins text-lg font-medium text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="font-poppins text-sm text-neutral-500">{description}</p>
        )}
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
}: {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  disabled?: boolean
  error?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex items-center">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "h-12 bg-white pr-10 font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200",
            error && "border-red-500 focus-visible:ring-red-200"
          )}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          className="absolute right-3 text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 font-poppins">{error}</p>}
    </div>
  )
}

// ==========================================
// 3. MAIN CONTENT COMPONENT
// ==========================================

export default function OrganizerProfileContent({ primaryEmail, initialStaff }: OrganizerProfileContentProps) {
  // --- STATE ---
  const [isSubmittingSecurity, setIsSubmittingSecurity] = useState(false)
  const [isSubmittingAccount, setIsSubmittingAccount] = useState(false)
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [selectedAccount, setSelectedAccount] = useState<AdditionalAccount | null>(null)

  // --- FORMS ---
  const securityForm = useForm<EOUpdatePasswordData>({
    resolver: zodResolver(eoUpdatePasswordSchema),
    defaultValues: { old_password: "", new_password: "", confirm_password: "" }
  })

  const staffCreateForm = useForm<EOStaffCreateData>({
    resolver: zodResolver(eoStaffCreateSchema),
    defaultValues: { email: "", password: "", confirm_password: "" }
  })

  const staffResetPwdForm = useForm<EOStaffResetPasswordData>({
    resolver: zodResolver(eoStaffResetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" }
  })

  // --- HANDLERS ---
  const onSecuritySubmit = async (data: EOUpdatePasswordData) => {
    setIsSubmittingSecurity(true)
    const res = await updateEOPasswordAction(data)
    if (res.success) {
      toast.success("Berhasil", { description: res.message })
      securityForm.reset()
    } else {
      toast.error("Gagal", { description: res.message })
    }
    setIsSubmittingSecurity(false)
  }

  const onAddStaffSubmit = async (data: EOStaffCreateData) => {
    setIsSubmittingAccount(true)
    const res = await createEOStaffAction(data)
    if (res.success) {
      toast.success("Berhasil", { description: res.message })
      staffCreateForm.reset()
      setIsAddModalOpen(false)
    } else {
      toast.error("Gagal", { description: res.message })
    }
    setIsSubmittingAccount(false)
  }

  const onResetStaffPwdSubmit = async (data: EOStaffResetPasswordData) => {
    if (!selectedAccount) return
    setIsSubmittingAccount(true)
    const res = await resetEOStaffPasswordAction(selectedAccount.id, data)
    if (res.success) {
      toast.success("Berhasil", { description: res.message })
      staffResetPwdForm.reset()
      setIsEditModalOpen(false)
      setSelectedAccount(null)
    } else {
      toast.error("Gagal", { description: res.message })
    }
    setIsSubmittingAccount(false)
  }

  const onDeleteStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccount) return
    setIsSubmittingAccount(true)
    const res = await deleteEOStaffAction(selectedAccount.id)
    if (res.success) {
      toast.success("Berhasil", { description: res.message })
      setIsDeleteModalOpen(false)
      setSelectedAccount(null)
    } else {
      toast.error("Gagal", { description: res.message })
    }
    setIsSubmittingAccount(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Profil Organizer
          </h1>
          <p className="font-montserrat text-sm text-neutral-600">
            Kelola keamanan akun utama dan manajemen akses untuk staf panitia event.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* SECURITY FORM */}
          <SectionWrapper title="Keamanan Akun Utama">
            <form
              onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
              className="flex flex-col gap-6 rounded-2xl border border-sky-50 bg-white/50 p-4 md:p-6"
            >
              <div className="flex flex-col gap-2">
                <Label className="font-poppins text-sm font-normal text-neutral-500">
                  Email Utama (Read-only)
                </Label>
                <div className="relative flex items-center">
                  <Input
                    disabled
                    value={primaryEmail}
                    className="h-12 bg-stone-200/60 pr-10 font-poppins text-sm font-medium text-neutral-600"
                  />
                  <Lock className="absolute right-3 h-4 w-4 text-neutral-500" />
                </div>
              </div>

              <div className="my-2 h-px w-full bg-sky-100" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-2 lg:col-span-3">
                  <Label htmlFor="old_password" className="font-poppins text-sm font-normal text-neutral-500">
                    Password Lama
                  </Label>
                  <Controller
                    name="old_password"
                    control={securityForm.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="old_password"
                        {...field}
                        placeholder="Masukkan password lama"
                        error={securityForm.formState.errors.old_password?.message}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2 lg:col-span-1">
                  <Label htmlFor="new_password" className="font-poppins text-sm font-normal text-neutral-500">
                    Password Baru
                  </Label>
                  <Controller
                    name="new_password"
                    control={securityForm.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="new_password"
                        {...field}
                        placeholder="Masukkan password baru"
                        error={securityForm.formState.errors.new_password?.message}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2 lg:col-span-2">
                  <Label htmlFor="confirm_password" className="font-poppins text-sm font-normal text-neutral-500">
                    Konfirmasi Password Baru
                  </Label>
                  <Controller
                    name="confirm_password"
                    control={securityForm.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="confirm_password"
                        {...field}
                        placeholder="Ketik ulang password baru"
                        error={securityForm.formState.errors.confirm_password?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="mt-2 flex w-full justify-start">
                <Button
                  type="submit"
                  disabled={isSubmittingSecurity}
                  className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 sm:w-auto sm:px-8"
                >
                  {isSubmittingSecurity && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </SectionWrapper>

          {/* STAFF ACCOUNTS */}
          <SectionWrapper
            title="Akses Staf Panitia (Additional Accounts)"
            description="Tambahkan akun staf agar dapat mengakses dashboard event secara bersamaan tanpa membagikan password akun utama Anda."
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-poppins text-sm font-medium text-neutral-600">
                  Daftar Akun Terdaftar ({initialStaff.length})
                </span>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  variant="outline"
                  className="w-full rounded-full border-blue-400 bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100 sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" /> Tambah Akun Staf
                </Button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white/70 shadow-sm">
                <div className="overflow-x-auto">
                  <Table className="min-w-[700px]">
                    <TableHeader className="bg-blue-100/80">
                      <TableRow className="border-sky-100 hover:bg-transparent">
                        <TableHead className="w-16 py-4 text-center font-poppins text-sm font-semibold text-neutral-700">No</TableHead>
                        <TableHead className="py-4 font-poppins text-sm font-semibold text-neutral-700">Email Akun</TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">Dibuat Pada</TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">Status</TableHead>
                        <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {initialStaff.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-8 text-center font-poppins text-sm text-neutral-500">
                            Belum ada akun tambahan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        initialStaff.map((acc, index) => (
                          <TableRow key={acc.id} className="border-sky-100 bg-transparent hover:bg-white/50">
                            <TableCell className="py-4 text-center font-poppins text-sm font-medium text-neutral-700">{index + 1}</TableCell>
                            <TableCell className="py-4 font-poppins text-sm font-medium text-neutral-800">{acc.email}</TableCell>
                            <TableCell className="py-4 text-center font-poppins text-sm text-neutral-600">{new Date(acc.created_at).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell className="py-4">
                              <div className="flex justify-center">
                                {acc.status === "Verified" ? (
                                  <Badge variant="outline" className="border-green-400 bg-emerald-50 py-1 font-poppins font-normal text-green-600">Verified</Badge>
                                ) : (
                                  <Badge variant="outline" className="gap-1 border-yellow-400 bg-yellow-50 py-1 font-poppins font-normal text-yellow-600">
                                    <MailWarning className="h-3 w-3" /> Unverified
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedAccount(acc)
                                    setIsEditModalOpen(true)
                                  }}
                                  className="h-8 border-blue-200 font-poppins text-xs font-semibold text-blue-600 hover:bg-blue-50"
                                >
                                  <Pencil className="mr-1.5 h-3 w-3" /> Edit Sandi
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedAccount(acc)
                                    setIsDeleteModalOpen(true)
                                  }}
                                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
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
          </SectionWrapper>
        </div>

        {/* MODALS */}
        {/* ADD STAFF */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
            <form onSubmit={staffCreateForm.handleSubmit(onAddStaffSubmit)} className="flex flex-col">
              <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
                <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">Tambah Akun Staf</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-6 p-6 sm:p-10">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="font-poppins text-sm text-neutral-600">Email Akun Baru</Label>
                  <Input
                    id="email"
                    type="email"
                    {...staffCreateForm.register("email")}
                    placeholder="staf@example.com"
                    className={cn("h-12 bg-white font-poppins text-sm focus-visible:ring-sky-200", staffCreateForm.formState.errors.email && "border-red-500")}
                  />
                  {staffCreateForm.formState.errors.email && <p className="text-xs text-red-500 font-poppins">{staffCreateForm.formState.errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password_create" className="font-poppins text-sm text-neutral-600">Password Sementara</Label>
                  <Controller
                    name="password"
                    control={staffCreateForm.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="password_create"
                        {...field}
                        placeholder="Minimal 8 karakter"
                        error={staffCreateForm.formState.errors.password?.message}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm_password_create" className="font-poppins text-sm text-neutral-600">Konfirmasi Password</Label>
                  <Controller
                    name="confirm_password"
                    control={staffCreateForm.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="confirm_password_create"
                        {...field}
                        placeholder="Ketik ulang password"
                        error={staffCreateForm.formState.errors.confirm_password?.message}
                      />
                    )}
                  />
                </div>

                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500">Batal</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmittingAccount} className="h-12 flex-1 rounded-full bg-blue-500 font-poppins text-base font-bold text-white hover:bg-blue-600 disabled:opacity-50">
                    {isSubmittingAccount ? <Loader2 className="h-5 w-5 animate-spin" /> : "Tambah"}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* RESET STAFF PASSWORD */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
            <form onSubmit={staffResetPwdForm.handleSubmit(onResetStaffPwdSubmit)} className="flex flex-col">
              <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
                <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">Ubah Password Akun</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-6 p-6 sm:p-10">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="truncate text-center font-poppins text-sm text-blue-600">
                    Mengubah password untuk:<br /><span className="font-bold">{selectedAccount?.email}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password_reset" className="font-poppins text-sm text-neutral-600">Password Baru</Label>
                  <Controller
                    name="password"
                    control={staffResetPwdForm.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="password_reset"
                        {...field}
                        placeholder="Minimal 8 karakter"
                        error={staffResetPwdForm.formState.errors.password?.message}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm_password_reset" className="font-poppins text-sm text-neutral-600">Konfirmasi Password Baru</Label>
                  <Controller
                    name="confirm_password"
                    control={staffResetPwdForm.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="confirm_password_reset"
                        {...field}
                        placeholder="Ketik ulang password"
                        error={staffResetPwdForm.formState.errors.confirm_password?.message}
                      />
                    )}
                  />
                </div>
                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500">Batal</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmittingAccount} className="h-12 flex-1 rounded-full bg-blue-500 font-poppins text-base font-bold text-white hover:bg-blue-600 disabled:opacity-50">
                    {isSubmittingAccount ? <Loader2 className="h-5 w-5 animate-spin" /> : "Simpan Sandi"}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* DELETE STAFF */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[40px]">
            <form onSubmit={onDeleteStaffSubmit} className="flex flex-col gap-8 p-6 sm:p-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="font-montserrat text-2xl font-bold text-neutral-800">Hapus Akun Staf</h2>
                <p className="font-poppins text-sm text-neutral-600">
                  Apakah Anda yakin ingin menghapus akun <br />
                  <span className="font-semibold text-red-500">{selectedAccount?.email}</span>? <br />
                  Akses mereka ke dashboard event akan terputus.
                </p>
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="h-12 flex-1 rounded-full font-poppins text-base font-semibold text-neutral-500">Batal</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmittingAccount} className="h-12 flex-1 rounded-full bg-red-500 font-poppins text-base font-bold text-white hover:bg-red-600 disabled:opacity-50">
                  {isSubmittingAccount ? <Loader2 className="h-5 w-5 animate-spin" /> : "Ya, Hapus Akun"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
