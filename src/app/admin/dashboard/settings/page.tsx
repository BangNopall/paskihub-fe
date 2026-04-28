"use client"

import React, { useState, useEffect } from "react"
import { Coins, Save, CreditCard } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Poppins } from "@/lib/fonts"

// ==========================================
// 1. MAIN PAGE COMPONENT
// ==========================================

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Simulasi loading data konfigurasi
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    // TODO: Integrasi endpoint API PATCH /api/admin/settings di sini
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Konfigurasi sistem berhasil diperbarui")
    }, 2000)
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
            disabled={isSaving || isLoading}
          >
            {isSaving ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
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
                    Atur rasio konversi koin.
                  </p>
                </div>
                <div className="space-y-6 lg:col-span-2">
                  <Card className="rounded-[24px] border-gray-200 bg-white p-6 shadow-none md:p-8">
                    <div className="w-full">
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
                            defaultValue="1.000"
                            className="h-12 rounded-xl border-neutral-200 bg-neutral-50 pl-12 focus-visible:ring-info-500"
                          />
                        </div>
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
