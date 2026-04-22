import Image from "next/image"
import { Search, Filter, ChevronDown, Image as ImageIcon, Award, Trophy, Medal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DetailRowProps {
  label: string
  value?: string
  valueNode?: React.ReactNode
  className?: string
}

const products = [
  {
    id: "21",
    name: "Tim1",
    color: "Silver",
    category: "Laptop",
    price: "$2999",
  },
  {
    id: "22",
    name: "Microsoft Surface Pro",
    color: "White",
    category: "Laptop PC",
    price: "$1999",
  },
  {
    id: "23",
    name: "Magic Mouse 2",
    color: "Black",
    category: "Accessories",
    price: "$99",
  },
  {
    id: "24",
    name: "Apple Watch",
    color: "Silver",
    category: "Accessories",
    price: "$179",
  },
  {
    id: "25",
    name: "iPad",
    color: "Gold",
    category: "Tablet",
    price: "$699",
  },
  {
    id: "26",
    name: 'Apple iMac 27"',
    color: "Silver",
    category: "PC Desktop",
    price: "$3999",
  },
]

const daftarJuara = [
  {
    id: "umum",
    kategoriJudul: "Juara Umum",
    kategoriDeskripsi: "Kategori: PBB + Danton + Variasi",
    pemenang: [
      {
        urutan: 1,
        gelar: "Juara 1",
        tim: "Kilat Merah",
        sekolah: "SDN 05 Jakarta Selatan",
        skor: 285,
        warna: "amber",
        icon: Trophy,
      },
      {
        urutan: 2,
        gelar: "Juara 2",
        tim: "Garuda Emas",
        sekolah: "SDN 01 Jakarta Pusat",
        skor: 278,
        warna: "stone",
        icon: Medal,
      },
      {
        urutan: 3,
        gelar: "Juara 3",
        tim: "Bima Sakti",
        sekolah: "SDN 12 Jakarta Barat",
        skor: 272,
        warna: "amber-600",
        icon: Award,
      },
      {
        urutan: 4,
        gelar: "Harapan 1",
        tim: "Satria Putih",
        sekolah: "SDN 03 Jakarta Utara",
        skor: 245,
        warna: "blue",
        icon: Award,
      },
      {
        urutan: 5,
        gelar: "Harapan 2",
        tim: "Rajawali",
        sekolah: "SDN 08 Jakarta Timur",
        skor: 192,
        warna: "emerald",
        icon: Award,
      },
      {
        urutan: 6,
        gelar: "Harapan 3",
        tim: "Merpati Putih",
        sekolah: "SDN 02 Jakarta Selatan",
        skor: 100,
        warna: "rose",
        icon: Award,
      },
    ],
  },
  {
    id: "pbb_terbaik",
    kategoriJudul: "Juara PBB Terbaik",
    kategoriDeskripsi:
      "Penilaian spesifik pada kategori Peraturan Baris Berbaris",
    pemenang: [
      {
        urutan: 1,
        gelar: "Juara 1",
        tim: "Kilat Merah",
        sekolah: "SDN 05 Jakarta Selatan",
        skor: 98,
        warna: "amber",
        icon: Trophy,
      },
    ],
  },
  {
    id: "danton_terbaik",
    kategoriJudul: "Juara Danton Terbaik",
    kategoriDeskripsi: "Penilaian spesifik pada performa Komandan Peleton",
    pemenang: [
      {
        urutan: 1,
        gelar: "Juara 1",
        tim: "Kilat Merah",
        sekolah: "SDN 05 Jakarta Selatan",
        skor: 49,
        warna: "amber",
        icon: Trophy,
      },
    ],
  },
]

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Daftar Tim */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Rekap Nilai
            </CardTitle>
            <CardAction>
              <Button variant="default" size="sm">
                Publish Hasil
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Table */}
            <InfoSection>
              <div className="relative w-full overflow-hidden rounded-lg">
                {/* Table Toolbar (Search & Filter) */}
                <div className="flex flex-col gap-4 p-1 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:max-w-96">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <Input
                      type="text"
                      placeholder="Cari nama tim atau nama sekolah"
                      className="rounded-lg border-neutral-300 bg-neutral-50 py-2 ps-10 pe-3 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-500"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full shrink-0 justify-between rounded-lg border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-900 shadow-sm hover:bg-neutral-100 hover:text-neutral-900 sm:w-auto sm:justify-center"
                      >
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4 text-neutral-500" />
                          Filter by
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4 text-neutral-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-45 rounded-lg border-neutral-200 bg-white shadow-lg sm:w-32"
                    >
                      <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                        SD/MI
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                        SMP/MTS
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                        SMA/SMK/MA
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                        PURNA
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                        UMUM
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto rounded-lg border border-neutral-300">
                  <Table className="min-w-200 text-left text-sm text-neutral-500">
                    <TableHeader className="bg-neutral-50 text-xs text-neutral-700 uppercase">
                      <TableRow className="border-b border-neutral-200 hover:bg-neutral-50">
                        <TableHead className="w-12 p-4 text-center">
                          No
                        </TableHead>
                        <TableHead className="px-6 py-3 font-semibold">
                          Tim
                        </TableHead>
                        <TableHead className="px-6 py-3 font-semibold">
                          Kategori
                        </TableHead>
                        <TableHead className="px-6 py-3 font-semibold">
                          Total Nilai
                        </TableHead>
                        <TableHead className="px-6 py-3 font-semibold">
                          Status
                        </TableHead>
                        <TableHead className="px-6 py-3 text-right font-semibold">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow
                          key={product.id}
                          className="border-b border-neutral-200 bg-white transition-colors hover:bg-neutral-50"
                        >
                          <TableCell className="p-4 text-center font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="max-w-50 px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Image
                                width={40}
                                height={40}
                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                                src={"https://placehold.co/400"}
                                alt="Tim Avatar"
                                unoptimized
                              />
                              <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-base font-semibold text-neutral-900">
                                  Garuda Nusantara
                                </span>
                                <span className="truncate text-sm font-normal text-neutral-500">
                                  SMPN 1 Jakarta
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-neutral-700">
                            SD
                          </TableCell>
                          <TableCell className="px-6 py-4 text-neutral-700">
                            200
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge className="border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-50">
                              Belum Dinilai
                            </Badge>
                            {/* <Badge className="border-warning-200 bg-warning-50 text-warning-600 hover:bg-warning-50">
                              Sedang Dinilai
                            </Badge>
                            <Badge className="border-success-200 bg-success-50 text-success-600 hover:bg-success-50">
                              Selesai Dinilai
                            </Badge> */}
                          </TableCell>
                          <TableCell className="flex items-center justify-end px-6 py-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="default" size="sm">
                                  Detail
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="flex max-h-[90vh] w-[95vw] flex-col overflow-hidden rounded-2xl border-none p-0 font-['Poppins'] sm:max-w-4xl">
                                {/* Header Fixed (Gradient Background) */}
                                <div className="border-b border-neutral-100 bg-gradient-to-b from-white/90 to-white/70 p-6 backdrop-blur-sm">
                                  <DialogHeader>
                                    <DialogTitle className="text-center font-['Montserrat'] text-2xl font-bold text-neutral-800">
                                      Detail Nilai Tim
                                    </DialogTitle>
                                  </DialogHeader>
                                </div>

                                {/* Body Scrollable */}
                                <div className="flex-1 space-y-8 overflow-y-auto bg-neutral-50/50 p-4 sm:p-8">
                                  {/* --- BAGIAN 1: INFO TIM & REKAP SKOR --- */}
                                  <div className="flex flex-col gap-6">
                                    {/* Info Tim (Nama, Kategori) */}
                                    <div className="flex items-center gap-4 rounded-xl border border-sky-100 bg-sky-100/50 p-4">
                                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                                        <Image
                                          src="https://placehold.co/100"
                                          width={48}
                                          height={48}
                                          alt="Logo Tim"
                                          unoptimized
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-base font-semibold text-neutral-800">
                                          Garuda Nusantara
                                        </span>
                                        <span className="text-xs font-medium text-neutral-500">
                                          Kategori: SD
                                        </span>
                                      </div>
                                    </div>

                                    {/* Cards: Total, Pelanggaran, Nilai Akhir */}
                                    <div className="flex flex-wrap items-stretch gap-3">
                                      <StatCard
                                        title="Total Nilai"
                                        value={290}
                                      />
                                      <StatCard
                                        title="Pelanggaran"
                                        value="-5"
                                        isNegative
                                      />
                                      <StatCard
                                        title="Nilai Akhir"
                                        value={285}
                                      />
                                    </div>
                                  </div>

                                  <Separator className="bg-neutral-200" />

                                  {/* --- BAGIAN 2: BREAKDOWN NILAI PER JURI --- */}
                                  <div className="flex flex-col gap-5">
                                    <h3 className="text-center font-['Montserrat'] text-lg font-bold text-neutral-800">
                                      Breakdown Nilai per Juri
                                    </h3>

                                    {/* Container Juri (Warna Biru) */}
                                    <div className="flex flex-col gap-4 rounded-2xl border border-sky-200 bg-sky-50 p-5">
                                      <div className="flex flex-col gap-4">
                                        {/* Juri 1 */}
                                        <div className="flex flex-col gap-3 border-b border-sky-200/50 pb-4 last:border-0 last:pb-0">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-neutral-800">
                                              Juri Budi Santoso, S.Pd
                                            </span>
                                            <span className="text-base font-bold text-neutral-800">
                                              98 poin
                                            </span>
                                          </div>
                                          <div className="flex flex-wrap gap-3">
                                            <ScoreRow
                                              title="Gerakan di Tempat"
                                              score={38}
                                            />
                                            <ScoreRow
                                              title="Langkah Tegap"
                                              score={40}
                                            />
                                            <ScoreRow
                                              title="Kerapian"
                                              score={20}
                                            />
                                          </div>
                                        </div>

                                        {/* Juri 2 */}
                                        <div className="flex flex-col gap-3 border-b border-sky-200/50 pb-4 last:border-0 last:pb-0">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-neutral-800">
                                              Juri Danton
                                            </span>
                                            <span className="text-base font-bold text-neutral-800">
                                              47 poin
                                            </span>
                                          </div>
                                          <div className="flex flex-wrap gap-3">
                                            <ScoreRow
                                              title="Ketegasan Suara"
                                              score={38}
                                            />
                                            <ScoreRow
                                              title="Penampilan Danton"
                                              score={40}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator className="bg-neutral-200" />

                                  {/* --- BAGIAN 3: PELANGGARAN TIM --- */}
                                  <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-rose-50/50 p-5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-neutral-800">
                                          Pelanggaran Tim
                                        </span>
                                        <span className="text-xl font-bold text-neutral-800">
                                          0
                                        </span>
                                      </div>

                                      {/* Daftar Pelanggaran (Dinamis Wrap) */}
                                      <div className="flex flex-wrap gap-3">
                                        {/* Item 1 */}
                                        <div className="flex w-full min-w-50 flex-1 items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                                          <div className="flex flex-col">
                                            <span className="text-xs font-medium text-neutral-600">
                                              Tidak Seragam
                                            </span>
                                            <span className="text-xs font-semibold text-red-500">
                                              -5 poin
                                            </span>
                                          </div>
                                        </div>
                                        {/* Item 2 */}
                                        <div className="flex w-full min-w-50 flex-1 items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                                          <div className="flex flex-col">
                                            <span className="text-xs font-medium text-neutral-600">
                                              Keluar Formasi
                                            </span>
                                            <span className="text-xs font-semibold text-red-500">
                                              -3 poin
                                            </span>
                                          </div>
                                        </div>
                                        {/* Item 3 */}
                                        <div className="flex w-full min-w-50 flex-1 items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                                          <div className="flex flex-col">
                                            <span className="text-xs font-medium text-neutral-600">
                                              Tidak Kompak
                                            </span>
                                            <span className="text-xs font-semibold text-red-500">
                                              -2 poin
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </InfoSection>
            <InfoSection title="Daftar Juara">
              {daftarJuara.map((kategoriUtama) => (
                <div key={kategoriUtama.id} className="flex flex-col gap-2">
                  {/* Header Kategori Juara */}
                  <div className="flex flex-col items-start justify-start gap-1">
                    <h3 className="text-base leading-6 font-semibold text-slate-900">
                      {kategoriUtama.kategoriJudul}
                    </h3>
                    {kategoriUtama.kategoriDeskripsi && (
                      <p className="text-sm leading-5 font-normal text-slate-600">
                        {kategoriUtama.kategoriDeskripsi}
                      </p>
                    )}
                  </div>

                  {/* List Pemenang dalam Kategori Ini */}
                  <div className="flex w-full flex-col gap-3 sm:gap-4">
                    {kategoriUtama.pemenang.map((pemenang) => {
                      const IconComponent = pemenang.icon

                      // Menentukan warna icon badge berdasarkan data
                      let iconBgColor = "bg-neutral-200 text-neutral-600" // default
                      if (pemenang.warna === "amber")
                        iconBgColor = "bg-amber-100 text-amber-600"
                      else if (pemenang.warna === "stone")
                        iconBgColor = "bg-stone-200 text-stone-600"
                      else if (pemenang.warna === "amber-600")
                        iconBgColor = "bg-amber-100 text-amber-700"
                      else if (pemenang.warna === "blue")
                        iconBgColor = "bg-blue-100 text-blue-600"
                      else if (pemenang.warna === "emerald")
                        iconBgColor = "bg-emerald-100 text-emerald-600"
                      else if (pemenang.warna === "rose")
                        iconBgColor = "bg-rose-100 text-rose-600"

                      return (
                        <Card
                          key={`${kategoriUtama.id}-${pemenang.urutan}`}
                          className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-none transition-all hover:border-sky-200 hover:shadow-md"
                        >
                          <CardContent>
                            {/* Menggunakan flex-col di mobile, flex-row di layar besar (sm+) */}
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                              {/* --- Bagian Kiri: Info Juara & Tim --- */}
                              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                                {/* Label Gelar (Juara 1, Harapan 2, dll) */}
                                <div className="flex min-w-30 items-center gap-2">
                                  <div
                                    className={cn(
                                      "flex h-8 w-8 items-center justify-center rounded-lg",
                                      iconBgColor
                                    )}
                                  >
                                    <IconComponent className="h-4 w-4" />
                                  </div>
                                  <span className="text-base font-semibold text-neutral-800">
                                    {pemenang.gelar}
                                  </span>
                                </div>

                                {/* Garis Pemisah (Hanya tampil di Desktop) */}
                                <div className="hidden h-10 w-px bg-neutral-200 sm:block" />

                                {/* Info Tim & Sekolah */}
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm font-semibold text-neutral-800">
                                    {pemenang.tim}
                                  </span>
                                  <span className="text-xs font-medium text-neutral-500">
                                    {pemenang.sekolah}
                                  </span>
                                </div>
                              </div>

                              {/* --- Bagian Kanan: Total Skor --- */}
                              <div className="mt-2 flex w-full items-center justify-between gap-3 border-t border-neutral-100 pt-3 sm:mt-0 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
                                <span className="text-xs font-medium text-neutral-500 sm:hidden">
                                  Total Poin
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="border border-sky-100 bg-sky-50 px-3 py-1.5 hover:bg-sky-100"
                                >
                                  <span className="text-lg font-bold text-sky-700 sm:text-xl">
                                    {pemenang.skor}
                                  </span>
                                  <span className="ml-1 text-xs font-medium text-sky-600">
                                    poin
                                  </span>
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </InfoSection>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoSection({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-glassmorphism-50 p-4 shadow-sm sm:p-6">
      {title && (
        <h3 className="text-lg font-semibold text-dark-blue">{title}</h3>
      )}
      {children}
    </div>
  )
}

function StatCard({
  title,
  value,
  isNegative = false,
}: {
  title: string
  value: string | number
  isNegative?: boolean
}) {
  return (
    <div className="flex min-w-30 flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <span className="text-center font-['Poppins'] text-xs font-normal text-neutral-500">
        {title}
      </span>
      <span
        className={cn(
          "font-['Poppins'] text-lg font-semibold",
          isNegative ? "text-red-500" : "text-neutral-700"
        )}
      >
        {value}
      </span>
    </div>
  )
}

// 2. Baris Skor Subkategori
function ScoreRow({ title, score }: { title: string; score: number }) {
  return (
    <div className="flex w-full flex-col gap-1 rounded-xl border border-neutral-100 bg-white p-3 shadow-sm sm:w-45">
      <span className="truncate text-center font-['Poppins'] text-sm font-normal text-neutral-600">
        {title}
      </span>
      <span className="text-center font-['Poppins'] text-base font-semibold text-neutral-800">
        {score}
      </span>
    </div>
  )
}
