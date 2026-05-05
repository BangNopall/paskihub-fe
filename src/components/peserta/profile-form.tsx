"use client"

import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  pesertaDataFormSchema,
  PesertaDataFormData,
  pesertaUpdatePasswordSchema,
  PesertaUpdatePasswordData,
} from "@/schemas/profile.schema"
import {
  updatePesertaProfileAction,
  updatePesertaPasswordAction,
} from "@/actions/profile.actions"

interface ProfileFormProps {
  initialData: {
    email: string
    institution: {
      name: string
      address: string
      institution_type: string
      name_pj: string
      no_wa_pj: string
    }
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

  // Password Visibility Toggles
  const [showOldPwd, setShowOldPwd] = useState(false)
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    control: controlProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<PesertaDataFormData>({
    resolver: zodResolver(pesertaDataFormSchema),
    defaultValues: {
      name: initialData.institution.name,
      address: initialData.institution.address,
      institution_type: initialData.institution.institution_type,
      name_pj: initialData.institution.name_pj,
      no_wa_pj: initialData.institution.no_wa_pj,
    },
  })

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isDirty: isPasswordDirty },
  } = useForm<PesertaUpdatePasswordData>({
    resolver: zodResolver(pesertaUpdatePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  const onProfileSubmit = async (data: PesertaDataFormData) => {
    setIsSubmittingProfile(true)
    const result = await updatePesertaProfileAction(data)
    setIsSubmittingProfile(false)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const onPasswordSubmit = async (data: PesertaUpdatePasswordData) => {
    setIsSubmittingPassword(true)
    const result = await updatePesertaPasswordAction(data)
    setIsSubmittingPassword(false)

    if (result.success) {
      toast.success(result.message)
      resetPassword()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* FORM 1: INFO DASAR */}
      <div className="flex w-full flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm backdrop-blur-md md:p-8">
        <h2 className="font-poppins text-lg font-medium text-slate-900">
          Checklist Form Info Dasar
        </h2>

        <form
          onSubmit={handleSubmitProfile(onProfileSubmit)}
          className="flex flex-col gap-6 rounded-2xl border border-sky-50 bg-white/50 p-4 md:p-6"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-poppins text-sm font-normal text-neutral-500">
                Nama Instansi/Sekolah
              </Label>
              <Input
                className={`h-12 bg-neutral-50 font-poppins text-sm text-neutral-700 ${profileErrors.name ? "border-red-500" : ""}`}
                {...registerProfile("name")}
              />
              {profileErrors.name && (
                <p className="text-xs text-red-500">
                  {profileErrors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-poppins text-sm font-normal text-neutral-500">
                Tingkat
              </Label>
              <Controller
                control={controlProfile}
                name="institution_type"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={`h-12 bg-neutral-50 font-poppins text-sm text-neutral-700 ${profileErrors.institution_type ? "border-red-500" : ""}`}
                    >
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
                )}
              />
              {profileErrors.institution_type && (
                <p className="text-xs text-red-500">
                  {profileErrors.institution_type.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-poppins text-sm font-normal text-neutral-500">
              Alamat Instansi/Sekolah
            </Label>
            <Input
              className={`h-12 bg-neutral-50 font-poppins text-sm text-neutral-700 ${profileErrors.address ? "border-red-500" : ""}`}
              {...registerProfile("address")}
            />
            {profileErrors.address && (
              <p className="text-xs text-red-500">
                {profileErrors.address.message}
              </p>
            )}
          </div>

          <div className="my-2 h-px w-full bg-sky-100" />

          <div className="space-y-2">
            <Label className="font-poppins text-sm font-normal text-neutral-500">
              Nama Penanggung Jawab
            </Label>
            <Input
              className={`h-12 bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200 ${profileErrors.name_pj ? "border-red-500" : ""}`}
              {...registerProfile("name_pj")}
            />
            {profileErrors.name_pj && (
              <p className="text-xs text-red-500">
                {profileErrors.name_pj.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-poppins text-sm font-normal text-neutral-500">
              No. Whatsapp Penanggung Jawab
            </Label>
            <Input
              className={`h-12 bg-white font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200 ${profileErrors.no_wa_pj ? "border-red-500" : ""}`}
              {...registerProfile("no_wa_pj")}
            />
            <span className="font-poppins text-xs text-neutral-400">
              Format: +628xxxxxxxxxx
            </span>
            {profileErrors.no_wa_pj && (
              <p className="text-xs text-red-500">
                {profileErrors.no_wa_pj.message}
              </p>
            )}
          </div>

          <div className="mt-2 flex w-full justify-start">
            <Button
              type="submit"
              disabled={!isProfileDirty || isSubmittingProfile}
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

      {/* FORM 2: KEAMANAN (PASSWORD) */}
      <div className="flex w-full flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/70 to-white/60 p-5 shadow-sm backdrop-blur-md md:p-8">
        <h2 className="font-poppins text-lg font-medium text-slate-900">
          Checklist Form Keamanan
        </h2>

        <form
          onSubmit={handleSubmitPassword(onPasswordSubmit)}
          className="flex flex-col gap-6 rounded-2xl border border-sky-50 bg-white/50 p-4 md:p-6"
        >
          <div className="flex flex-col gap-2">
            <Label className="font-poppins text-sm font-normal text-neutral-500">
              Email
            </Label>
            <div className="relative flex items-center">
              <Input
                disabled
                value={initialData.email}
                className="h-12 bg-stone-200/60 pr-10 font-poppins text-sm text-neutral-500"
              />
              <Lock className="absolute right-3 h-4 w-4 text-neutral-500" />
            </div>
          </div>

          <div className="my-2 h-px w-full bg-sky-100" />

          <div className="space-y-2">
            <Label className="font-poppins text-sm font-normal text-neutral-500">
              Password Lama (Untuk verifikasi)
            </Label>
            <div className="relative flex items-center">
              <Input
                type={showOldPwd ? "text" : "password"}
                placeholder="Masukkan password lama"
                className={`h-12 bg-white pr-10 font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200 ${passwordErrors.old_password ? "border-red-500" : ""}`}
                {...registerPassword("old_password")}
              />
              <button
                type="button"
                onClick={() => setShowOldPwd(!showOldPwd)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"
              >
                {showOldPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordErrors.old_password && (
              <p className="text-xs text-red-500">
                {passwordErrors.old_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-poppins text-sm font-normal text-neutral-500">
              Password Baru
            </Label>
            <div className="relative flex items-center">
              <Input
                type={showNewPwd ? "text" : "password"}
                placeholder="Masukkan password baru"
                className={`h-12 bg-white pr-10 font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200 ${passwordErrors.new_password ? "border-red-500" : ""}`}
                {...registerPassword("new_password")}
              />
              <button
                type="button"
                onClick={() => setShowNewPwd(!showNewPwd)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"
              >
                {showNewPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <span className="mt-1 block font-poppins text-xs text-neutral-400">
              Minimal 8 karakter (kosongkan jika tidak ingin mengubah)
            </span>
            {passwordErrors.new_password && (
              <p className="text-xs text-red-500">
                {passwordErrors.new_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-poppins text-sm font-normal text-neutral-500">
              Konfirmasi Password Baru
            </Label>
            <div className="relative flex items-center">
              <Input
                type={showConfirmPwd ? "text" : "password"}
                placeholder="Masukkan ulang password baru"
                className={`h-12 bg-white pr-10 font-poppins text-sm text-neutral-700 focus-visible:ring-sky-200 ${passwordErrors.confirm_password ? "border-red-500" : ""}`}
                {...registerPassword("confirm_password")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <span className="mt-1 block font-poppins text-xs text-neutral-400">
              Ketik ulang password untuk konfirmasi
            </span>
            {passwordErrors.confirm_password && (
              <p className="text-xs text-red-500">
                {passwordErrors.confirm_password.message}
              </p>
            )}
          </div>

          <div className="mt-2 flex w-full justify-start">
            <Button
              type="submit"
              disabled={!isPasswordDirty || isSubmittingPassword}
              className="h-12 w-full rounded-full bg-red-400 font-poppins text-base font-bold text-white hover:bg-red-500 disabled:opacity-50 sm:w-auto sm:px-8"
            >
              {isSubmittingPassword ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
