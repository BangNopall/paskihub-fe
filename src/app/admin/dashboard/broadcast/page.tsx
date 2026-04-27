"use client"

import React, { useState } from "react"
import {
  Megaphone,
  Send,
  Trash2,
  Users,
  UserCircle,
  Clock,
  CheckCircle,
  Plus,
  AlertTriangle,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Montserrat, Poppins } from "@/lib/fonts"

const MOCK_BROADCASTS = [
  {
    id: "BC-001",
    title: "Maintenance Sistem",
    target: "Semua User",
    status: "Sent",
    date: "26 Apr 2026",
    time: "23:00",
  },
  {
    id: "BC-002",
    title: "Fitur Baru: Kalkulator Otomatis",
    target: "Event Organizer",
    status: "Sent",
    date: "20 Apr 2026",
    time: "10:00",
  },
  {
    id: "BC-003",
    title: "Promo Top-up Koin Lebaran",
    target: "Event Organizer",
    status: "Draft",
    date: "-",
    time: "-",
  },
]

export default function BroadcastInfoPage() {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div
      className={`flex flex-1 flex-col p-4 md:p-6 lg:p-8 ${Poppins.className}`}
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1
              className={`text-2xl font-bold text-slate-900 ${Montserrat.className}`}
            >
              Broadcast Info
            </h1>
            <p className="text-sm text-neutral-500">
              Kirim pengumuman global kepada Event Organizer atau Peserta.
            </p>
          </div>
          <Button
            variant={"default"}
            className="rounded-xl shadow-md transition-all active:scale-95"
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? (
              <Trash2 className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isCreating ? "Batalkan" : "Buat Broadcast Baru"}
          </Button>
        </div>

        {isCreating && (
          <Card className="animate-in border-blue-200 bg-blue-50 shadow-lg duration-300 fade-in slide-in-from-top-4">
            <CardHeader>
              <CardTitle className="text-lg">Tulis Pengumuman Baru</CardTitle>
              <CardDescription>
                Pesan ini akan muncul di dashboard user yang dituju.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700">
                    Judul Pengumuman
                  </label>
                  <Input
                    placeholder="Contoh: Maintenance Terjadwal"
                    className="rounded-xl border-neutral-200 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700">
                    Target Audience
                  </label>
                  <Select>
                    <SelectTrigger className="rounded-xl border-neutral-200 bg-white">
                      <SelectValue placeholder="Pilih Target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua User</SelectItem>
                      <SelectItem value="eo">Event Organizer (EO)</SelectItem>
                      <SelectItem value="peserta">
                        Peserta (Official)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">
                  Konten Pesan
                </label>
                <Textarea
                  placeholder="Tulis detail pengumuman di sini..."
                  className="min-h-[120px] rounded-xl border-neutral-200 bg-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button className="rounded-xl" variant={'default'}>
                  <Send className="mr-2 h-4 w-4" /> Kirim Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden border-neutral-200 shadow-sm">
            <CardHeader className="border-b border-neutral-100 bg-neutral-50/50">
              <CardTitle className="text-lg">Riwayat Broadcast</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-100">
                {MOCK_BROADCASTS.map((bc) => (
                  <div
                    key={bc.id}
                    className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-neutral-50/50 md:flex-row md:items-center"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-2xl p-3 ${bc.status === "Sent" ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"}`}
                      >
                        <Megaphone className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-neutral-800">
                          {bc.title}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {bc.target}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {bc.date} {bc.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 self-end md:self-center">
                      {bc.status === "Sent" ? (
                        <Badge className="border-none bg-emerald-100 px-3 text-emerald-600">
                          Terkirim
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-neutral-200 px-3 text-neutral-400"
                        >
                          Draft
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Tip */}
        <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            <strong>Tips:</strong> Broadcast yang dikirim akan muncul sebagai
            notifikasi popup di dashboard user saat mereka pertama kali login
            setelah pengumuman dibuat.
          </p>
        </div>
      </div>
    </div>
  )
}
