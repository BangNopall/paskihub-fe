/* eslint-disable no-unused-vars */
"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Controller } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  eoUpdatePasswordSchema,
  EOUpdatePasswordData,
} from "@/schemas/profile.schema"
import { updateEOPasswordAction } from "@/actions/profile.actions"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

interface OrganizerProfileContentProps {
  primaryEmail: string
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
      {error && <p className="font-poppins text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ==========================================
// 3. MAIN CONTENT COMPONENT
// ==========================================

export default function OrganizerProfileContent({
  primaryEmail,
}: OrganizerProfileContentProps) {
  // --- STATE ---
  const [isSubmittingSecurity, setIsSubmittingSecurity] = useState(false)

  // --- FORMS ---
  const securityForm = useForm<EOUpdatePasswordData>({
    resolver: zodResolver(eoUpdatePasswordSchema),
    defaultValues: { old_password: "", new_password: "", confirm_password: "" },
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

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Profil Organizer
          </h1>
          <p className="font-montserrat text-sm text-neutral-600">
            Kelola keamanan akun utama Anda.
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
                  <Label
                    htmlFor="old_password"
                    className="font-poppins text-sm font-normal text-neutral-500"
                  >
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
                        error={
                          securityForm.formState.errors.old_password?.message
                        }
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2 lg:col-span-1">
                  <Label
                    htmlFor="new_password"
                    className="font-poppins text-sm font-normal text-neutral-500"
                  >
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
                        error={
                          securityForm.formState.errors.new_password?.message
                        }
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2 lg:col-span-2">
                  <Label
                    htmlFor="confirm_password"
                    className="font-poppins text-sm font-normal text-neutral-500"
                  >
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
                        error={
                          securityForm.formState.errors.confirm_password
                            ?.message
                        }
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
                  {isSubmittingSecurity && (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  )}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </SectionWrapper>
        </div>
      </div>
    </div>
  )
}
