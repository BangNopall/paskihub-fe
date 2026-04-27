"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()

  const token = params?.token as string

  // --- FORM STATES ---
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Visibility States
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Feedback & Submission States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // --- HANDLERS ---
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (validationError) setValidationError(null)
  }

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value)
    if (validationError) setValidationError(null)
  }

  const validateForm = () => {
    if (!password || !confirmPassword) {
      setValidationError("Semua kolom harus diisi.")
      return false
    }

    if (password.length < 8) {
      setValidationError(
        "Gunakan minimal 8 karakter dengan kombinasi huruf dan angka."
      )
      return false
    }

    // Opsional: Tambahkan regex untuk memastikan kombinasi huruf & angka
    // const hasLetterAndNumber = /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password);
    // if (!hasLetterAndNumber) {
    //   setValidationError("Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.");
    //   return false;
    // }

    if (password !== confirmPassword) {
      setValidationError("Konfirmasi password tidak cocok.")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setValidationError(null)

    try {
      const payload: ResetPasswordPayload = {
        token: decodeURIComponent(token),
        newPassword: password,
      }

      // TODO: Integrasi API POST /api/auth/reset-password
      console.log("=== PAYLOAD RESET PASSWORD ===", payload)

      // Simulasi delay jaringan
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Asumsi berhasil, redirect ke halaman status verifikasi / login
      alert(
        "Password berhasil diubah! Silakan login dengan password baru Anda."
      )
      router.push("/auth/login")
    } catch (error) {
      console.error("Gagal mereset password:", error)
      setValidationError(
        "Terjadi kesalahan sistem. Link mungkin sudah kedaluwarsa."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 font-poppins sm:p-6 lg:p-8">
      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/50 bg-gradient-to-b from-white/80 to-white/60 p-8 shadow-xl backdrop-blur-md sm:rounded-[40px] sm:p-12 lg:p-16">
        <div className="flex flex-col items-center justify-center gap-8 sm:gap-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-montserrat text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
              Buat password baru
            </h1>
            <p className="max-w-md font-poppins text-xs font-medium text-neutral-500 sm:text-sm">
              Silakan buat password baru untuk akun PaskiHub kamu.
            </p>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-6 sm:gap-8"
          >
            <div className="flex flex-col gap-5 sm:gap-6">
              {/* Field Password Baru */}
              <div className="relative flex flex-col gap-2">
                <Label
                  htmlFor="newPassword"
                  className={cn(
                    "font-poppins text-sm font-medium sm:text-base",
                    validationError &&
                      password.length > 0 &&
                      password.length < 8
                      ? "text-red-600"
                      : "text-neutral-700"
                  )}
                >
                  Password Baru
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Masukkan kata sandi baru"
                    className={cn(
                      "h-12 bg-white pr-12 font-poppins text-sm shadow-sm sm:h-14 sm:text-base",
                      validationError &&
                        password.length > 0 &&
                        password.length < 8
                        ? "border-red-500 focus-visible:ring-red-200"
                        : "border-gray-200 focus-visible:ring-sky-200"
                    )}
                  />
                  {validationError &&
                  password.length > 0 &&
                  password.length < 8 ? (
                    <div className="absolute right-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-neutral-400 transition-colors hover:text-neutral-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
                {validationError &&
                  password.length > 0 &&
                  password.length < 8 && (
                    <span className="font-poppins text-xs font-medium text-red-500 sm:text-sm">
                      *Gunakan minimal 8 karakter dengan kombinasi huruf dan
                      angka
                    </span>
                  )}
              </div>

              {/* Field Konfirmasi Password */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="font-poppins text-sm font-medium text-neutral-700 sm:text-base"
                >
                  Konfirmasi Password Baru
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Masukkan ulang kata sandi baru"
                    className="h-12 border-gray-200 bg-white pr-12 font-poppins text-sm shadow-sm focus-visible:ring-sky-200 sm:h-14 sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-neutral-400 transition-colors hover:text-neutral-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Global Validation Error Message */}
              {validationError && (password.length >= 8 || !password) && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                  <span className="flex items-center gap-2 font-poppins text-sm font-medium text-red-600">
                    <XCircle className="h-4 w-4 shrink-0" />
                    {validationError}
                  </span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex w-full pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !password || !confirmPassword}
                className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white shadow-md transition-all hover:bg-red-500 hover:shadow-lg disabled:opacity-70 sm:h-14"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memproses...
                  </div>
                ) : (
                  "Simpan Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
