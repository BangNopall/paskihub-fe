"use client"

import React, { useState, useEffect } from "react"
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
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
import { Skeleton } from "@/components/ui/skeleton"
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

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready)
// ==========================================

export interface SecurityPayload {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export type AccountStatus = "Verified" | "Unverified"

export interface AdditionalAccount {
  id: string
  email: string
  status: AccountStatus
  createdAt: string
}

export interface NewAccountPayload {
  email: string
  password: string
  confirmPassword: string
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const PRIMARY_EMAIL = "organizer.pusat@paskihub.com"

const MOCK_ACCOUNTS: AdditionalAccount[] = [
  {
    id: "acc-1",
    email: "admin.registrasi@paskihub.com",
    status: "Verified",
    createdAt: "10 Jan 2026",
  },
  {
    id: "acc-2",
    email: "juri.penilai@paskihub.com",
    status: "Verified",
    createdAt: "15 Jan 2026",
  },
  {
    id: "acc-3",
    email: "staff.lapangan@paskihub.com",
    status: "Unverified",
    createdAt: "18 Feb 2026",
  },
]

// ==========================================
// 3. UI HELPER COMPONENTS
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
}: {
  id: string
  value: string
  onChange: (val: string) => void
  placeholder: string
  disabled?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative flex items-center">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-12 bg-white pr-10 font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
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
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function OrganizerProfilePage() {
  // --- STATE ---
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // State Keamanan Utama
  const [formSecurity, setFormSecurity] = useState<SecurityPayload>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSubmittingSecurity, setIsSubmittingSecurity] =
    useState<boolean>(false)

  // State Additional Accounts
  const [accounts, setAccounts] = useState<AdditionalAccount[]>([])
  const [selectedAccount, setSelectedAccount] =
    useState<AdditionalAccount | null>(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSubmittingAccount, setIsSubmittingAccount] = useState(false)

  // Form State untuk Tambah Akun / Edit Akun
  const [accFormEmail, setAccFormEmail] = useState("")
  const [accFormPwd, setAccFormPwd] = useState("")
  const [accFormConfPwd, setAccFormConfPwd] = useState("")

  // --- API FETCH SIMULATION ---
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: API GET /api/organizer/profile & /api/organizer/accounts
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setAccounts(MOCK_ACCOUNTS)
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfileData()
  }, [])

  // --- HANDLERS: MAIN SECURITY ---
  const handleSecurityChange = (
    field: keyof SecurityPayload,
    value: string
  ) => {
    setFormSecurity((prev) => ({ ...prev, [field]: value }))
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formSecurity.newPassword !== formSecurity.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!")
      return
    }
    if (formSecurity.newPassword.length < 8) {
      alert("Password baru minimal 8 karakter.")
      return
    }

    setIsSubmittingSecurity(true)
    try {
      // TODO: API POST/PUT /api/organizer/change-password
      console.log("Mengubah password utama:", formSecurity)
      await new Promise((res) => setTimeout(res, 1500))
      alert("Password berhasil diperbarui!")
      setFormSecurity({ oldPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      alert("Gagal memperbarui password.")
    } finally {
      setIsSubmittingSecurity(false)
    }
  }

  // --- HANDLERS: ADDITIONAL ACCOUNTS ---
  const handleOpenAddModal = () => {
    setAccFormEmail("")
    setAccFormPwd("")
    setAccFormConfPwd("")
    setIsAddModalOpen(true)
  }

  const handleAddAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !accFormEmail ||
      accFormPwd.length < 8 ||
      accFormPwd !== accFormConfPwd
    ) {
      alert("Pastikan email terisi dan password cocok (min. 8 karakter).")
      return
    }

    setIsSubmittingAccount(true)
    try {
      // TODO: API POST /api/organizer/accounts
      console.log("Menambah akun baru:", {
        email: accFormEmail,
        pwd: accFormPwd,
      })
      await new Promise((res) => setTimeout(res, 1500))

      const newAcc: AdditionalAccount = {
        id: `acc-${Date.now()}`,
        email: accFormEmail,
        status: "Unverified", // Email baru harus verifikasi
        createdAt: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      }
      setAccounts((prev) => [...prev, newAcc])
      setIsAddModalOpen(false)
      alert(
        "Akun berhasil ditambahkan. Silakan cek email tersebut untuk verifikasi."
      )
    } catch (error) {
      alert("Gagal menambah akun.")
    } finally {
      setIsSubmittingAccount(false)
    }
  }

  const handleEditAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !selectedAccount ||
      accFormPwd.length < 8 ||
      accFormPwd !== accFormConfPwd
    ) {
      alert("Pastikan password baru cocok (min. 8 karakter).")
      return
    }

    setIsSubmittingAccount(true)
    try {
      // TODO: API PUT /api/organizer/accounts/{id}/password
      console.log("Mengubah password akun tambahan:", selectedAccount.email)
      await new Promise((res) => setTimeout(res, 1500))

      alert(`Password untuk ${selectedAccount.email} berhasil diubah!`)
      setIsEditModalOpen(false)
      setSelectedAccount(null)
    } catch (error) {
      alert("Gagal mengubah password akun.")
    } finally {
      setIsSubmittingAccount(false)
    }
  }

  const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccount) return
    setIsSubmittingAccount(true)
    try {
      // TODO: API DELETE /api/organizer/accounts/{id}
      await new Promise((res) => setTimeout(res, 1500))
      setAccounts((prev) => prev.filter((acc) => acc.id !== selectedAccount.id))
      setIsDeleteModalOpen(false)
      setSelectedAccount(null)
    } catch (error) {
      alert("Gagal menghapus akun.")
    } finally {
      setIsSubmittingAccount(false)
    }
  }

  // --- ERROR UI ---
  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">
          Gagal Memuat Profil
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
        <div className="flex flex-col gap-1">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Profil Organizer
          </h1>
          <p className="font-montserrat text-sm text-neutral-600">
            Kelola keamanan akun utama dan manajemen akses untuk staf panitia
            event.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-8">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* =========================================
                FORM 1: KEAMANAN AKUN UTAMA
                ========================================= */}
            <SectionWrapper title="Checklist Form Keamanan Akun Utama">
              <form
                onSubmit={handleSecuritySubmit}
                className="flex flex-col gap-6 rounded-2xl border border-sky-50 bg-white/50 p-4 md:p-6"
              >
                {/* Email Read Only */}
                <div className="flex flex-col gap-2">
                  <Label className="font-poppins text-sm font-normal text-neutral-500">
                    Email Utama (Read-only)
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      disabled
                      value={PRIMARY_EMAIL}
                      className="h-12 bg-stone-200/60 pr-10 font-poppins text-sm font-medium text-neutral-600"
                    />
                    <Lock className="absolute right-3 h-4 w-4 text-neutral-500" />
                  </div>
                </div>

                <div className="my-2 h-px w-full bg-sky-100" />

                {/* Password Fields */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-2 lg:col-span-3">
                    <Label
                      htmlFor="oldPwd"
                      className="font-poppins text-sm font-normal text-neutral-500"
                    >
                      Password Lama (Untuk verifikasi)
                    </Label>
                    <PasswordInput
                      id="oldPwd"
                      value={formSecurity.oldPassword}
                      onChange={(val) =>
                        handleSecurityChange("oldPassword", val)
                      }
                      placeholder="Masukkan password lama"
                    />
                  </div>

                  <div className="flex flex-col gap-2 lg:col-span-1">
                    <Label
                      htmlFor="newPwd"
                      className="font-poppins text-sm font-normal text-neutral-500"
                    >
                      Password Baru
                    </Label>
                    <PasswordInput
                      id="newPwd"
                      value={formSecurity.newPassword}
                      onChange={(val) =>
                        handleSecurityChange("newPassword", val)
                      }
                      placeholder="Masukkan password baru"
                    />
                    <span className="font-poppins text-xs text-neutral-400">
                      Minimal 8 karakter
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 lg:col-span-2">
                    <Label
                      htmlFor="confPwd"
                      className="font-poppins text-sm font-normal text-neutral-500"
                    >
                      Konfirmasi Password Baru
                    </Label>
                    <PasswordInput
                      id="confPwd"
                      value={formSecurity.confirmPassword}
                      onChange={(val) =>
                        handleSecurityChange("confirmPassword", val)
                      }
                      placeholder="Ketik ulang password baru"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-2 flex w-full justify-start">
                  <Button
                    type="submit"
                    disabled={
                      formSecurity.oldPassword === "" ||
                      formSecurity.newPassword === "" ||
                      isSubmittingSecurity
                    }
                    className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 sm:w-auto sm:px-8"
                  >
                    {isSubmittingSecurity ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : null}
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </SectionWrapper>

            {/* =========================================
                FORM 2: ADDITIONAL ACCOUNTS
                ========================================= */}
            <SectionWrapper
              title="Akses Staf Panitia (Additional Accounts)"
              description="Tambahkan akun staf agar dapat mengakses dashboard event secara bersamaan tanpa membagikan password akun utama Anda."
            >
              <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-poppins text-sm font-medium text-neutral-600">
                    Daftar Akun Terdaftar ({accounts.length})
                  </span>
                  <Button
                    onClick={handleOpenAddModal}
                    variant="outline"
                    className="w-full rounded-full border-blue-400 bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100 sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Tambah Akun Staf
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white/70 shadow-sm">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[700px]">
                      <TableHeader className="bg-blue-100/80">
                        <TableRow className="border-sky-100 hover:bg-transparent">
                          <TableHead className="w-16 py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                            No
                          </TableHead>
                          <TableHead className="py-4 font-poppins text-sm font-semibold text-neutral-700">
                            Email Akun
                          </TableHead>
                          <TableHead className="py-4 text-center font-poppins text-sm font-semibold text-neutral-700">
                            Dibuat Pada
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
                        {accounts.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="py-8 text-center font-poppins text-sm text-neutral-500"
                            >
                              Belum ada akun tambahan.
                            </TableCell>
                          </TableRow>
                        ) : (
                          accounts.map((acc, index) => (
                            <TableRow
                              key={acc.id}
                              className="border-sky-100 bg-transparent hover:bg-white/50"
                            >
                              <TableCell className="py-4 text-center font-poppins text-sm font-medium text-neutral-700">
                                {index + 1}
                              </TableCell>
                              <TableCell className="py-4 font-poppins text-sm font-medium text-neutral-800">
                                {acc.email}
                              </TableCell>
                              <TableCell className="py-4 text-center font-poppins text-sm text-neutral-600">
                                {acc.createdAt}
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex justify-center">
                                  {acc.status === "Verified" ? (
                                    <Badge
                                      variant="outline"
                                      className="border-green-400 bg-emerald-50 py-1 font-poppins font-normal text-green-600"
                                    >
                                      Verified
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="gap-1 border-yellow-400 bg-yellow-50 py-1 font-poppins font-normal text-yellow-600"
                                    >
                                      <MailWarning className="h-3 w-3" />{" "}
                                      Unverified
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
                                      setAccFormPwd("")
                                      setAccFormConfPwd("")
                                      setIsEditModalOpen(true)
                                    }}
                                    className="h-8 border-blue-200 font-poppins text-xs font-semibold text-blue-600 hover:bg-blue-50"
                                  >
                                    <Pencil className="mr-1.5 h-3 w-3" /> Edit
                                    Sandi
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
        )}

        {/* =========================================
            MODALS SECTION (API-Ready)
            ========================================= */}

        {/* 1. MODAL TAMBAH AKUN */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
            <form onSubmit={handleAddAccountSubmit} className="flex flex-col">
              <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
                <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                  Tambah Akun Staf
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-6 p-6 sm:p-10">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="accEmail"
                    className="font-poppins text-sm text-neutral-600"
                  >
                    Email Akun Baru
                  </Label>
                  <Input
                    id="accEmail"
                    type="email"
                    required
                    value={accFormEmail}
                    onChange={(e) => setAccFormEmail(e.target.value)}
                    placeholder="staf@example.com"
                    className="h-12 bg-white font-poppins text-sm focus-visible:ring-sky-200"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="accPwd"
                    className="font-poppins text-sm text-neutral-600"
                  >
                    Password Sementara
                  </Label>
                  <PasswordInput
                    id="accPwd"
                    value={accFormPwd}
                    onChange={setAccFormPwd}
                    placeholder="Minimal 8 karakter"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="accConfPwd"
                    className="font-poppins text-sm text-neutral-600"
                  >
                    Konfirmasi Password
                  </Label>
                  <PasswordInput
                    id="accConfPwd"
                    value={accFormConfPwd}
                    onChange={setAccFormConfPwd}
                    placeholder="Ketik ulang password"
                  />
                </div>

                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
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
                    disabled={isSubmittingAccount}
                    className="h-12 flex-1 rounded-full bg-blue-500 font-poppins text-base font-bold text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSubmittingAccount ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Tambah"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. MODAL EDIT SANDI AKUN */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[32px]">
            <form onSubmit={handleEditAccountSubmit} className="flex flex-col">
              <DialogHeader className="p-6 pb-0 sm:px-10 sm:pt-10">
                <DialogTitle className="text-center font-montserrat text-2xl font-bold text-neutral-800">
                  Ubah Password Akun
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-6 p-6 sm:p-10">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="truncate text-center font-poppins text-sm text-blue-600">
                    Mengubah password untuk:
                    <br />
                    <span className="font-bold">{selectedAccount?.email}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="editPwd"
                    className="font-poppins text-sm text-neutral-600"
                  >
                    Password Baru
                  </Label>
                  <PasswordInput
                    id="editPwd"
                    value={accFormPwd}
                    onChange={setAccFormPwd}
                    placeholder="Minimal 8 karakter"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="editConfPwd"
                    className="font-poppins text-sm text-neutral-600"
                  >
                    Konfirmasi Password Baru
                  </Label>
                  <PasswordInput
                    id="editConfPwd"
                    value={accFormConfPwd}
                    onChange={setAccFormConfPwd}
                    placeholder="Ketik ulang password"
                  />
                </div>

                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
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
                    disabled={isSubmittingAccount}
                    className="h-12 flex-1 rounded-full bg-blue-500 font-poppins text-base font-bold text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSubmittingAccount ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Simpan Sandi"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* 3. MODAL HAPUS AKUN */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="w-full max-w-md gap-0 rounded-3xl p-0 sm:rounded-[40px]">
            <form
              onSubmit={handleDeleteAccountSubmit}
              className="flex flex-col gap-8 p-6 sm:p-10"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="font-montserrat text-2xl font-bold text-neutral-800">
                  Hapus Akun Staf
                </h2>
                <p className="font-poppins text-sm text-neutral-600">
                  Apakah Anda yakin ingin menghapus akun <br />
                  <span className="font-semibold text-red-500">
                    {selectedAccount?.email}
                  </span>
                  ? <br />
                  Akses mereka ke dashboard event akan terputus.
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
                  disabled={isSubmittingAccount}
                  className="h-12 flex-1 rounded-full bg-red-500 font-poppins text-base font-bold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isSubmittingAccount ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Ya, Hapus Akun"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
