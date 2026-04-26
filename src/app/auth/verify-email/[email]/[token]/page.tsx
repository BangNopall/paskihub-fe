"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Check, XCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

// ==========================================
// 1. TYPESCRIPT INTERFACES (API-Ready)
// ==========================================

export type VerificationStatus = "loading" | "success" | "error"

export interface VerificationResponse {
  success: boolean
  message: string
}

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================

export default function VerifyEmailPage() {
  const params = useParams()
  const router = useRouter()

  // Mengambil URL parameter yang di-*pass* oleh Next.js App Router
  const email = params?.email as string
  const token = params?.token as string

  const [status, setStatus] = useState<VerificationStatus>("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  // --- API SIMULATION (VERIFICATION) ---
  useEffect(() => {
    if (!email || !token) {
      setStatus("error")
      setErrorMessage("Link verifikasi tidak valid atau tidak lengkap.")
      return
    }

    const verifyAccount = async () => {
      try {
        // TODO: Integrasi API POST /api/auth/verify-email
        // Contoh Payload: { email: decodeURIComponent(email), token }
        console.log(
          `Mencoba verifikasi untuk email: ${decodeURIComponent(email)} dengan token: ${token}`
        )

        // Simulasi network delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulasi kondisi berhasil (ubah ke `false` untuk test error)
        const isApiSuccess = true

        if (isApiSuccess) {
          setStatus("success")
        } else {
          setStatus("error")
          setErrorMessage(
            "Token verifikasi telah kedaluwarsa atau tidak valid."
          )
        }
      } catch (error) {
        console.error("Gagal melakukan verifikasi:", error)
        setStatus("error")
        setErrorMessage(
          "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi."
        )
      }
    }

    verifyAccount()
  }, [email, token])

  // --- RENDER HELPERS ---
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center gap-6">
      <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-center font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
          Memverifikasi Akun
        </h2>
        <p className="text-center font-poppins text-sm text-neutral-500 md:text-base">
          Mohon tunggu sebentar, kami sedang memeriksa data Anda...
        </p>
      </div>
    </div>
  )

  const renderSuccessState = () => (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Success Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-emerald-50 md:h-24 md:w-24">
        <Check
          className="h-10 w-10 text-green-600 md:h-12 md:w-12"
          strokeWidth={3}
        />
      </div>

      {/* Texts */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center font-montserrat text-3xl font-bold text-slate-900 md:text-4xl">
          Verifikasi Berhasil
        </h1>
        <p className="max-w-md text-center font-poppins text-sm text-neutral-500 md:text-base">
          Selamat! Akun kamu sudah siap digunakan. Silakan masuk untuk
          melanjutkan.
        </p>
      </div>

      {/* Action */}
      <div className="mt-4 w-full max-w-sm">
        <Button
          onClick={() => router.push("/auth/login")}
          variant={'secondary'}
          className="h-12 w-full rounded-full font-poppins text-base font-bold transition-colors"
        >
          Masuk
        </Button>
      </div>
    </div>
  )

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Error Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-200 bg-rose-50 md:h-24 md:w-24">
        <XCircle
          className="h-10 w-10 text-red-500 md:h-12 md:w-12"
          strokeWidth={2.5}
        />
      </div>

      {/* Texts */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center font-montserrat text-3xl font-bold text-slate-900 md:text-4xl">
          Verifikasi Gagal
        </h1>
        <p className="max-w-md text-center font-poppins text-sm text-neutral-500 md:text-base">
          {errorMessage}
        </p>
      </div>

      {/* Action */}
      <div className="mt-4 flex w-full max-w-sm flex-col gap-3">
        <Button
          onClick={() => window.location.reload()}
          className="h-12 w-full rounded-full bg-blue-500 font-poppins text-base font-bold text-white transition-colors hover:bg-blue-600"
        >
          Coba Lagi
        </Button>
        <Link href="/auth/login" className="w-full">
          <Button
            variant="outline"
            className="h-12 w-full rounded-full font-poppins text-base font-semibold text-neutral-600"
          >
            Kembali ke Halaman Masuk
          </Button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="relative flex min-h-screen w-full flex-col font-poppins">
      {/* Main Content Area */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-[40px] border border-white/50 bg-gradient-to-b from-white/70 to-white/60 p-8 shadow-xl backdrop-blur-md sm:p-12 lg:p-16">
          {status === "loading" && renderLoadingState()}
          {status === "success" && renderSuccessState()}
          {status === "error" && renderErrorState()}
        </div>
      </main>
    </div>
  )
}
