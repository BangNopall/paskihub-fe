"use client"

import React from "react"
import { 
  Settings, 
  Coins, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Save,
  AlertCircle,
  Power,
  Database
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Montserrat, Poppins } from "@/lib/fonts"

export default function AdminSettingsPage() {
  return (
    <div className={`flex flex-1 flex-col p-4 md:p-6 lg:p-8 ${Poppins.className}`}>
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div>
          <h1 className={`text-2xl font-bold text-slate-900 ${Montserrat.className}`}>Konfigurasi Sistem</h1>
          <p className="text-sm text-neutral-500">Atur parameter global dan kebijakan platform PaskiHub.</p>
        </div>

        <div className="space-y-6">
          {/* Monetization Settings */}
          <Card className="border-neutral-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pengaturan Monetisasi</CardTitle>
                  <CardDescription>Atur harga koin dan biaya sistem.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700">Harga Per 1 Koin (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">Rp</span>
                    <Input defaultValue="1.000" className="pl-10 rounded-xl" />
                  </div>
                  <p className="text-[10px] text-neutral-400">Default: Rp 1.000 / Koin</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700">Biaya Admin Top-up (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">Rp</span>
                    <Input defaultValue="2.500" className="pl-10 rounded-xl" />
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Terapkan PPN 11%</p>
                  <p className="text-xs text-neutral-500">Otomatis tambahkan PPN pada setiap pengajuan koin.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-neutral-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <Power className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Status Operasional</CardTitle>
                  <CardDescription>Kontrol akses publik ke aplikasi.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Maintenance Mode</p>
                  <p className="text-xs text-neutral-500">Hanya Super Admin yang bisa mengakses dashboard jika aktif.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Registrasi EO Baru</p>
                  <p className="text-xs text-neutral-500">Buka atau tutup pendaftaran untuk Event Organizer baru.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security & Backup */}
          <Card className="border-neutral-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Keamanan & Data</CardTitle>
                  <CardDescription>Tindakan darurat dan pemeliharaan data.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1 rounded-xl border-neutral-200">
                  <Database className="mr-2 h-4 w-4" /> Backup Database (Manual)
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                  <AlertCircle className="mr-2 h-4 w-4" /> Reset Cache Sistem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pb-10">
          <Button variant="ghost" className="rounded-xl">Batal</Button>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8">
            <Save className="mr-2 h-4 w-4" /> Simpan Semua Perubahan
          </Button>
        </div>
      </div>
    </div>
  )
}
