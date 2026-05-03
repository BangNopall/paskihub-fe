"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/schemas/auth.schema"
import { resetPasswordAction } from "@/actions/auth.actions"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()

  const token = params?.token as string

  // Visibility States
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true)
    try {
      const res = await resetPasswordAction(token, data)
      if (res.success) {
        toast.success("Berhasil", { description: res.message })
        router.push("/auth/login")
      } else {
        console.log(res)
        toast.error("Gagal", { description: res.message })
      }
    } catch {
      toast.error("Terjadi Kesalahan", {
        description: "Gagal mereset password.",
      })
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6 sm:gap-8"
          >
            <div className="flex flex-col gap-5 sm:gap-6">
              {/* Field Password Baru */}
              <div className="relative flex flex-col gap-2">
                <Label
                  htmlFor="newPassword"
                  className={cn(
                    "font-poppins text-sm font-medium sm:text-base",
                    errors.password ? "text-red-600" : "text-neutral-700"
                  )}
                >
                  Password Baru
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi baru"
                    className={cn(
                      "h-12 bg-white pr-12 font-poppins text-sm shadow-sm sm:h-14 sm:text-base",
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-200"
                        : "border-gray-200 focus-visible:ring-sky-200"
                    )}
                    {...register("password")}
                  />
                  {errors.password ? (
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
                {errors.password && (
                  <span className="font-poppins text-xs font-medium text-red-500 sm:text-sm">
                    *{errors.password.message}
                  </span>
                )}
              </div>

              {/* Field Konfirmasi Password */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="confirm_password"
                  className={cn(
                    "font-poppins text-sm font-medium sm:text-base",
                    errors.confirm_password
                      ? "text-red-600"
                      : "text-neutral-700"
                  )}
                >
                  Konfirmasi Password Baru
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Masukkan ulang kata sandi baru"
                    className={cn(
                      "h-12 bg-white pr-12 font-poppins text-sm shadow-sm sm:h-14 sm:text-base",
                      errors.confirm_password
                        ? "border-red-500 focus-visible:ring-red-200"
                        : "border-gray-200 focus-visible:ring-sky-200"
                    )}
                    {...register("confirm_password")}
                  />
                  {errors.confirm_password ? (
                    <div className="absolute right-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 text-neutral-400 transition-colors hover:text-neutral-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
                {errors.confirm_password && (
                  <span className="font-poppins text-xs font-medium text-red-500 sm:text-sm">
                    *{errors.confirm_password.message}
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex w-full pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
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
