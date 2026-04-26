"use client"

import React, { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2, AlertCircle, Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready Architecture)
// ==========================================

export interface ParticipantProfile {
  id: string
  schoolName: string
  schoolAddress: string
  educationLevel: string
  picName: string
  picPhone: string
  email: string
}

export interface SecurityPayload {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// ==========================================
// 2. MOCK DATA (Simulasi Database)
// ==========================================

const MOCK_PROFILE: ParticipantProfile = {
  id: "usr-p123",
  schoolName: "SMA Negeri 1 Jakarta",
  schoolAddress: "Jl. Sudirman No. 123, Jakarta",
  educationLevel: "SMA",
  picName: "Budi Santoso",
  picPhone: "+62 812-3456-7890",
  email: "peserta@example.com",
}

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================

export default function ParticipantProfilePage() {
  // --- STATE FETCH DATA ---
  const [profile, setProfile] = useState<ParticipantProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  // --- STATE FORM INFO DASAR ---
  const [formProfile, setFormProfile] = useState<Partial<ParticipantProfile>>(
    {}
  )
  const [isProfileChanged, setIsProfileChanged] = useState<boolean>(false)
  const [isSubmittingProfile, setIsSubmittingProfile] = useState<boolean>(false)

  // --- STATE FORM KEAMANAN (PASSWORD) ---
  const [formSecurity, setFormSecurity] = useState<SecurityPayload>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSubmittingSecurity, setIsSubmittingSecurity] =
    useState<boolean>(false)

  // Password Visibility Toggles
  const [showOldPwd, setShowOldPwd] = useState(false)
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  // --- API SIMULATION (FETCH DATA) ---
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/peserta/profile di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setProfile(MOCK_PROFILE)
        setFormProfile(MOCK_PROFILE)
      } catch (error) {
        console.error("Gagal memuat profil:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfileData()
  }, [])

  // --- HANDLERS: INFO DASAR ---
  const handleProfileChange = (
    field: keyof ParticipantProfile,
    value: string
  ) => {
    setFormProfile((prev) => ({ ...prev, [field]: value }))
    setIsProfileChanged(true)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingProfile(true)
    try {
      // TODO: Integrasi API PUT/PATCH /api/peserta/profile
      console.log("=== PAYLOAD UPDATE PROFIL ===", formProfile)
      await new Promise((res) => setTimeout(res, 1500))

      setProfile(formProfile as ParticipantProfile)
      setIsProfileChanged(false)
      alert("Informasi profil berhasil diperbarui!")
    } catch (error) {
      alert("Gagal memperbarui profil.")
    } finally {
      setIsSubmittingProfile(false)
    }
  }

  // --- HANDLERS: KEAMANAN ---
  const handleSecurityChange = (
    field: keyof SecurityPayload,
    value: string
  ) => {
    setFormSecurity((prev) => ({ ...prev, [field]: value }))
  }

  const isSecurityFormValid =
    formSecurity.oldPassword.trim() !== "" &&
    formSecurity.newPassword.trim() !== "" &&
    formSecurity.confirmPassword.trim() !== ""

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
      // TODO: Integrasi API POST/PUT /api/peserta/change-password
      console.log("=== PAYLOAD GANTI PASSWORD ===", {
        oldPassword: formSecurity.oldPassword,
        newPassword: formSecurity.newPassword,
      })
      await new Promise((res) => setTimeout(res, 1500))

      alert("Password berhasil diperbarui!")
      setFormSecurity({ oldPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      alert("Gagal memperbarui password. Pastikan password lama anda benar.")
    } finally {
      setIsSubmittingSecurity(false)
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
      <div className="mx-auto flex w-full flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Profil
          </h1>
          <p className="font-montserrat text-sm text-neutral-600">
            Kelola informasi profil dan keamanan akun kamu.
          </p>
        </div>

        {isLoading || !profile ? (
          <div className="flex flex-col gap-8">
            <Skeleton className="h-[500px] w-full rounded-3xl" />
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* =========================================
                FORM 1: INFO DASAR
                ========================================= */}
            <div className="flex w-full flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm backdrop-blur-md md:p-8">
              <h2 className="font-poppins text-lg font-medium text-slate-900">
                Checklist Form Info Dasar
              </h2>

              <form
                onSubmit={handleProfileSubmit}
                className="flex flex-col gap-6 rounded-2xl border border-sky-50 bg-white/50 p-4 md:p-6"
              >
                {/* Read Only Fields (Berdasarkan desain, asumsikan instansi/sekolah read-only) */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label className="font-poppins text-sm font-normal text-neutral-500">
                      Nama Instansi/Sekolah
                    </Label>
                    <Input
                      disabled
                      value={formProfile.schoolName}
                      className="h-12 bg-neutral-50 font-poppins text-sm text-neutral-700"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-poppins text-sm font-normal text-neutral-500">
                      Tingkat
                    </Label>
                    <Select disabled value={formProfile.educationLevel}>
                      <SelectTrigger className="h-12 bg-neutral-50 font-poppins text-sm text-neutral-700">
                        <SelectValue placeholder="Pilih Tingkat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="SD">SD/MI</SelectItem>
                          <SelectItem value="SMP">SMP/MTS</SelectItem>
                          <SelectItem value="SMA">SMA/SMK/MA</SelectItem>
                          <SelectItem value="PURNA">PURNA</SelectItem>
                          <SelectItem value="UMUM">UMUM</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="font-poppins text-sm font-normal text-neutral-500">
                    Alamat Instansi/Sekolah
                  </Label>
                  <Input
                    disabled
                    value={formProfile.schoolAddress}
                    className="h-12 bg-neutral-50 font-poppins text-sm text-neutral-700"
                  />
                </div>

                <div className="my-2 h-px w-full bg-sky-100" />

                {/* Editable Fields */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="picName"
                    className="font-poppins text-sm font-normal text-neutral-500"
                  >
                    Nama Penanggung Jawab
                  </Label>
                  <Input
                    id="picName"
                    value={formProfile.picName}
                    onChange={(e) =>
                      handleProfileChange("picName", e.target.value)
                    }
                    className="h-12 bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="picPhone"
                    className="font-poppins text-sm font-normal text-neutral-500"
                  >
                    No. Whatsapp Penanggung Jawab
                  </Label>
                  <Input
                    id="picPhone"
                    value={formProfile.picPhone}
                    onChange={(e) =>
                      handleProfileChange("picPhone", e.target.value)
                    }
                    className="h-12 bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
                  />
                  <span className="font-poppins text-xs text-neutral-400">
                    Format: +628xxxxxxxxxx
                  </span>
                </div>

                <div className="mt-2 flex w-full justify-start">
                  <Button
                    type="submit"
                    disabled={!isProfileChanged || isSubmittingProfile}
                    className="h-12 w-full rounded-full bg-secondary-500 font-poppins text-base font-semibold text-white hover:bg-secondary-300 disabled:opacity-50 sm:w-auto sm:px-8"
                  >
                    {isSubmittingProfile ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : null}
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </div>

            {/* =========================================
                FORM 2: KEAMANAN (PASSWORD)
                ========================================= */}
            <div className="flex w-full flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm backdrop-blur-md md:p-8">
              <h2 className="font-poppins text-lg font-medium text-slate-900">
                Checklist Form Keamanan
              </h2>

              <form
                onSubmit={handleSecuritySubmit}
                className="flex flex-col gap-6 rounded-2xl border border-sky-50 bg-white/50 p-4 md:p-6"
              >
                {/* Email Read Only */}
                <div className="flex flex-col gap-2">
                  <Label className="font-poppins text-sm font-normal text-neutral-500">
                    Email
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      disabled
                      value={profile.email}
                      className="h-12 bg-stone-200/60 pr-10 font-poppins text-sm text-neutral-500"
                    />
                    <Lock className="absolute right-3 h-4 w-4 text-neutral-500" />
                  </div>
                </div>

                <div className="my-2 h-px w-full bg-sky-100" />

                {/* Password Lama */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="oldPwd"
                    className="font-poppins text-sm font-normal text-neutral-500"
                  >
                    Password Lama (Untuk verifikasi)
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      id="oldPwd"
                      type={showOldPwd ? "text" : "password"}
                      placeholder="Masukkan password lama"
                      value={formSecurity.oldPassword}
                      onChange={(e) =>
                        handleSecurityChange("oldPassword", e.target.value)
                      }
                      className="h-12 bg-white pr-10 font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPwd(!showOldPwd)}
                      className="absolute right-3 text-neutral-400 hover:text-neutral-600"
                    >
                      {showOldPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Baru */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="newPwd"
                    className="font-poppins text-sm font-normal text-neutral-500"
                  >
                    Password Baru
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      id="newPwd"
                      type={showNewPwd ? "text" : "password"}
                      placeholder="Masukkan password baru"
                      value={formSecurity.newPassword}
                      onChange={(e) =>
                        handleSecurityChange("newPassword", e.target.value)
                      }
                      className="h-12 bg-white pr-10 font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd(!showNewPwd)}
                      className="absolute right-3 text-neutral-400 hover:text-neutral-600"
                    >
                      {showNewPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <span className="font-poppins text-xs text-neutral-400">
                    Minimal 8 karakter (kosongkan jika tidak ingin mengubah)
                  </span>
                </div>

                {/* Konfirmasi Password */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="confPwd"
                    className="font-poppins text-sm font-normal text-neutral-500"
                  >
                    Konfirmasi Password Baru
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      id="confPwd"
                      type={showConfirmPwd ? "text" : "password"}
                      placeholder="Masukkan ulang password baru"
                      value={formSecurity.confirmPassword}
                      onChange={(e) =>
                        handleSecurityChange("confirmPassword", e.target.value)
                      }
                      className="h-12 bg-white pr-10 font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      className="absolute right-3 text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirmPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <span className="font-poppins text-xs text-neutral-400">
                    Ketik ulang password untuk konfirmasi
                  </span>
                </div>

                <div className="mt-2 flex w-full justify-start">
                  <Button
                    type="submit"
                    disabled={!isSecurityFormValid || isSubmittingSecurity}
                    className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500 disabled:opacity-50 sm:w-auto sm:px-8"
                  >
                    {isSubmittingSecurity ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : null}
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
