"use client"

import React, { useState, useEffect } from "react"
import { 
  Settings, 
  Coins, 
  ShieldCheck, 
  Save,
  AlertCircle,
  Power,
  Database,
  CheckCircle2
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Montserrat, Poppins } from "@/lib/fonts"

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
      // trigger toast success here
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
            <p className="text-sm text-neutral-500">Atur parameter global dan kebijakan platform PaskiHub.</p>
          </div>
          <Button 
            className="h-12 px-8 rounded-full bg-info-600 hover:bg-info-700 shadow-lg transition-all active:scale-95"
            onClick={handleSave}
            disabled={isSaving || isLoading}
          >
            {isSaving ? <span className="animate-spin mr-2">◌</span> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>

        <div className="flex flex-col gap-8 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-10 md:p-8">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full rounded-[24px]" />)}
            </div>
          ) : (
            <>
              {/* SECTION: MONETIZATION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-info-600 mb-2">
                    <div className="p-2 bg-info-50 rounded-xl">
                      <Coins className="h-5 w-5" />
                    </div>
                    <h3 className="font-montserrat font-bold text-lg">Monetisasi</h3>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Atur rasio konversi koin, biaya admin, dan kebijakan perpajakan sistem.
                  </p>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <Card className="rounded-[24px] border-gray-200 bg-white shadow-none p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700">Harga Per 1 Koin (IDR)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">Rp</span>
                          <Input defaultValue="1.000" className="h-12 pl-12 rounded-xl border-neutral-200 bg-neutral-50 focus-visible:ring-info-500" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700">Biaya Admin Top-up (IDR)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">Rp</span>
                          <Input defaultValue="2.500" className="h-12 pl-12 rounded-xl border-neutral-200 bg-neutral-50 focus-visible:ring-info-500" />
                        </div>
                      </div>
                    </div>
                    <Separator className="my-8 bg-neutral-100" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-poppins font-semibold text-neutral-800">Terapkan PPN 11%</p>
                        <p className="text-sm text-neutral-500">Otomatis tambahkan PPN pada setiap pengajuan koin.</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-info-600" />
                    </div>
                  </Card>
                </div>
              </div>

              {/* SECTION: SYSTEM STATUS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-warning-600 mb-2">
                    <div className="p-2 bg-warning-50 rounded-xl">
                      <Power className="h-5 w-5" />
                    </div>
                    <h3 className="font-montserrat font-bold text-lg">Status Sistem</h3>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Kontrol akses publik dan mode pemeliharaan platform secara keseluruhan.
                  </p>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <Card className="rounded-[24px] border-gray-200 bg-white shadow-none p-6 md:p-8">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-poppins font-semibold text-neutral-800">Maintenance Mode</p>
                          <p className="text-sm text-neutral-500">Hanya Super Admin yang bisa mengakses dashboard jika aktif.</p>
                        </div>
                        <Switch className="data-[state=checked]:bg-warning-500" />
                      </div>
                      <Separator className="bg-neutral-100" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-poppins font-semibold text-neutral-800">Registrasi EO Baru</p>
                          <p className="text-sm text-neutral-500">Buka atau tutup pendaftaran untuk Event Organizer baru.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-info-600" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* SECTION: SECURITY & DATA */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-danger-600 mb-2">
                    <div className="p-2 bg-danger-50 rounded-xl">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="font-montserrat font-bold text-lg">Keamanan</h3>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Tindakan darurat, pembersihan cache, dan manajemen cadangan data.
                  </p>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <Card className="rounded-[24px] border-gray-200 bg-white shadow-none p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" className="flex-1 h-12 rounded-xl border-neutral-200 bg-neutral-50 font-semibold text-neutral-700 hover:bg-neutral-100 transition-all">
                        <Database className="mr-2 h-4 w-4" /> Backup Database
                      </Button>
                      <Button variant="outline" className="flex-1 h-12 rounded-xl border-danger-100 bg-danger-50/30 font-semibold text-danger-600 hover:bg-danger-50 transition-all">
                        <AlertCircle className="mr-2 h-4 w-4" /> Reset Cache Sistem
                      </Button>
                    </div>
                    <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-info-50/50 border border-info-100 text-info-700">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed">
                        Sistem melakukan backup otomatis setiap hari pada pukul 00:00 WIB. Anda dapat melakukan backup manual sebelum melakukan perubahan besar.
                      </p>
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
