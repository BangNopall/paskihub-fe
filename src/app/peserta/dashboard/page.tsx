import { 
  Plus, 
  Search, 
  CalendarDays, 
  Users, 
  Eye, 
  Bell, 
  CheckCircle2, 
  Clock 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Montserrat, Poppins } from "@/lib/fonts";
import Image from "next/image";
import dashboardPeserta from "@/../public/dashboard/peserta/peserta-beranda.jpg"

export default function PesertaDashboardPage() {
  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-6xl">
        
        {/* --- 1. HERO BANNER SECTION --- */}
        <div className="relative flex w-full flex-col items-start justify-center gap-4 overflow-hidden rounded-2xl bg-info-600 p-8 sm:p-12 lg:p-16">
          {/* Latar Belakang Dekoratif (Bisa diganti dengan Image Next.js) */}
          <Image src={dashboardPeserta} alt="Dashboard Peserta" fill className="object-cover opacity-30" />

          {/* Konten Banner */}
          <div className="relative z-10 flex w-full max-w-3xl flex-col items-start justify-start gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
                Selamat Datang di Portal Lomba Paskibra
              </h1>
              <p className="text-sm font-medium text-primary-100 sm:text-base">
                Platform pendaftaran dan manajemen tim untuk kompetisi Pasukan Pengibar Bendera seluruh Indonesia
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button className="h-11 rounded-lg bg-white px-6 text-info-600 hover:bg-neutral-100">
                <Plus className="mr-2 h-4 w-4" />
                <span className="font-semibold">Buat Tim Baru</span>
              </Button>
              <Button variant="outline" className="h-11 rounded-lg border-white/20 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white">
                <Search className="mr-2 h-4 w-4" />
                <span>Lihat Event</span>
              </Button>
            </div>
          </div>
        </div>

        {/* --- 2. STATISTIK CARDS --- */}
        <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Total Tim" value={2} />
          <StatCard title="Event Aktif" value={1} />
          <StatCard title="Event Selesai" value={0} />
          <StatCard title="Pembayaran Pending" value={1} />
        </div>

        {/* --- 3. KONTEN BAWAH (Grid 2 Kolom di Desktop) --- */}
        <div className="w-full flex flex-col gap-6">
          
          {/* KOLOM KIRI: Aktivitas Terbaru (Lebih Lebar) */}
          <Card className="col-span-1 flex flex-col border-neutral-200 shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100">
              <CardTitle className="text-lg font-semibold text-neutral-800">
                Aktivitas Terbaru
              </CardTitle>
              <Badge variant="secondary" className="bg-info-50 text-info-600 hover:bg-info-100 px-3 py-1 font-normal border border-info-200">
                <Bell className="mr-1.5 h-3 w-3" /> 3 Notifikasi
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-4 sm:px-6">
              
              {/* List Item 1 */}
              <ActivityItem 
                title="Pembayaran Disetujui"
                description="Paskibra Elang Jaya - Lomba Paskibra Nasional 2026"
                time="2 jam yang lalu"
              />
              
              {/* List Item 2 */}
              <ActivityItem 
                title="Event Baru Tersedia"
                description="Pekan Paskibra Nusantara - Pendaftaran dibuka"
                time="1 hari yang lalu"
              />

              {/* List Item 3 */}
              <ActivityItem 
                title="Menunggu Verifikasi Pembayaran"
                description="Paskibra Garuda Muda - Festival Paskibra Regional Jawa Barat"
                time="5 jam yang lalu"
              />

            </CardContent>
          </Card>

          {/* KOLOM KANAN: Event Mendatang */}
          <Card className="col-span-1 flex flex-col border-neutral-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100">
              <CardTitle className="text-lg font-semibold text-neutral-800">
                Event Mendatang
              </CardTitle>
              <a href="#" className="text-sm font-medium text-primary-600 hover:underline">
                Lihat Semua
              </a>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 px-4 sm:px-6">
              
              <div className="flex flex-col gap-4">
                {/* Judul & Info Event */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-semibold leading-tight text-neutral-800">
                    Lomba Paskibra Nasional 2026
                  </h3>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <CalendarDays className="h-4 w-4 shrink-0 text-neutral-400" />
                      <span>15 Maret 2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Users className="h-4 w-4 shrink-0 text-neutral-400" />
                      <span>18 tim terdaftar</span>
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <Button variant="outline" className="w-full border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-medium">
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Detail
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

// 1. Kotak Statistik Kecil
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex flex-col justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md">
      <span className="text-sm font-medium text-neutral-500 leading-tight">
        {title}
      </span>
      <span className={`text-3xl font-bold text-neutral-800 ${Montserrat.className}`}>
        {value}
      </span>
    </div>
  )
}

// 2. Baris Aktivitas
function ActivityItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4 transition-colors hover:bg-neutral-100/70">
      
      <div className="flex items-start gap-3">
        {/* Teks */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-neutral-800 leading-tight">
            {title}
          </span>
          <span className="text-xs font-normal text-neutral-500 leading-snug">
            {description}
          </span>
        </div>
      </div>

      {/* Waktu (Geser ke kanan di desktop, di bawah teks di mobile) */}
      <span className="text-xs font-medium text-neutral-400 sm:shrink-0 sm:pt-1 pl-11 sm:pl-0">
        {time}
      </span>

    </div>
  )
}