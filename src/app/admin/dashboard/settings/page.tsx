"use client"

import React, { useState, useEffect, useTransition } from "react"
import { Coins, Save, CreditCard, Loader2 } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Poppins } from "@/lib/fonts"
import { systemSettingService } from "@/services/system-setting.service"
import { updateSystemSettingsAction } from "@/actions/system-setting.actions"
import { useSession } from "next-auth/react"
import { UpdateSystemSettingReqSchema } from "@/schemas/system-setting.schema"

export default function AdminSettingsPage() {
  const { data: session } = useSession() as any
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState({
    coin_rate: 0,
    approval_fee: 0,
    bank_name: "",
    account_number: "",
    account_name: "",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      if (!session?.accessToken) return
      try {
        const data = await systemSettingService.getSettings(session.accessToken)
        setFormData({
          coin_rate: data.coin_rate,
          approval_fee: data.approval_fee || 1, // Default 1 if not set
          bank_name: data.bank_info.bank_name,
          account_number: data.bank_info.account_number,
          account_name: data.bank_info.account_name,
        })
      } catch (error) {
        toast.error("Gagal memuat pengaturan")
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [session])

  const handleSave = () => {
    const result = UpdateSystemSettingReqSchema.safeParse(formData)
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    startTransition(async () => {
      try {
        await updateSystemSettingsAction(result.data)
        toast.success("Konfigurasi sistem berhasil diperbarui")
      } catch (error: any) {
        toast.error(error.message || "Gagal memperbarui konfigurasi")
      }
    })
  }

  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
              Konfigurasi Sistem
            </h1>
            <p className="text-sm text-neutral-500">
              Atur parameter global dan kebijakan platform PaskiHub.
            </p>
          </div>
          <Button
            variant={"default"}
            className="h-12 rounded-full px-8 shadow-lg transition-all active:scale-95"
            onClick={handleSave}
            disabled={isPending || isLoading}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>

        <div className="flex flex-col gap-8 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-10 md:p-8">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-[24px]" />
              ))}
            </div>
          ) : (
            <>
              {/* SECTION: MONETIZATION */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <div className="mb-2 flex items-center gap-3 text-info-600">
                    <div className="rounded-xl bg-info-50 p-2">
                      <Coins className="h-5 w-5" />
                    </div>
                    <h3 className="font-montserrat text-lg font-bold">
                      Monetisasi
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    Atur rasio konversi koin dan biaya layanan.
                  </p>
                </div>
                <div className="space-y-6 lg:col-span-2">
                  <Card className="rounded-[24px] border-gray-200 bg-white p-6 shadow-none md:p-8">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="coin-price"
                          className="text-sm font-semibold text-neutral-700"
                        >
                          Harga Per 1 Koin (IDR)
                        </Label>
                        <div className="relative">
                          <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-neutral-400">
                            Rp
                          </span>
                          <Input
                            id="coin-price"
                            type="number"
                            value={formData.coin_rate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                coin_rate: Number(e.target.value),
                              })
                            }
                            className="h-12 rounded-xl border-neutral-200 bg-neutral-50 pl-12 focus-visible:ring-info-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="approval-fee"
                          className="text-sm font-semibold text-neutral-700"
                        >
                          Biaya Approve Tim (Koin)
                        </Label>
                        <div className="relative">
                          <Input
                            id="approval-fee"
                            type="number"
                            value={formData.approval_fee}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                approval_fee: Number(e.target.value),
                              })
                            }
                            className="h-12 rounded-xl border-neutral-200 bg-neutral-50 pr-12 focus-visible:ring-info-500"
                          />
                          <span className="absolute top-1/2 right-4 -translate-y-1/2 font-bold text-neutral-400">
                            Koin
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400">
                          *Koin yang akan dipotong dari saldo Organizer setiap
                          kali menyetujui pendaftaran tim.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* SECTION: TRANSFER INSTRUCTIONS */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <div className="mb-2 flex items-center gap-3 text-info-600">
                    <div className="rounded-xl bg-info-50 p-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <h3 className="font-montserrat text-lg font-bold">
                      Instruksi Transfer Koin
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    Atur informasi rekening bank tujuan transfer untuk pembelian
                    koin oleh pengguna.
                  </p>
                </div>
                <div className="space-y-6 lg:col-span-2">
                  <Card className="rounded-[24px] border-gray-200 bg-white p-6 shadow-none md:p-8">
                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                        <Label
                          htmlFor="bank-name"
                          className="text-sm font-semibold text-neutral-700"
                        >
                          Nama Bank
                        </Label>
                        <Input
                          id="bank-name"
                          value={formData.bank_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bank_name: e.target.value,
                            })
                          }
                          placeholder="Contoh: Bank Central Asia (BCA)"
                          className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 focus-visible:ring-info-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label
                            htmlFor="account-number"
                            className="text-sm font-semibold text-neutral-700"
                          >
                            Nomor Rekening
                          </Label>
                          <Input
                            id="account-number"
                            value={formData.account_number}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                account_number: e.target.value,
                              })
                            }
                            placeholder="Contoh: 1234567890"
                            className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 focus-visible:ring-info-500"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="account-name"
                            className="text-sm font-semibold text-neutral-700"
                          >
                            Atas Nama
                          </Label>
                          <Input
                            id="account-name"
                            value={formData.account_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                account_name: e.target.value,
                              })
                            }
                            placeholder="Contoh: PT PaskiHub Indonesia"
                            className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 focus-visible:ring-info-500"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
