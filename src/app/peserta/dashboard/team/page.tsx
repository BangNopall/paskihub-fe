"use client"

import { Pencil, Plus, Trash, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Komponen Reusable untuk Kartu Anggota agar Clean Code
function MemberCard({
  name,
  description,
  avatarUrl = "https://placehold.co/100",
}: {
  name: string
  description: string
  avatarUrl?: string
}) {
  return (
    <div className="flex w-full items-center gap-4 rounded-xl bg-neutral-50 px-4 py-3">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-neutral-200 bg-neutral-200">
        <Image
          src={avatarUrl}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex flex-col justify-center gap-0.5">
        <span className="text-sm font-medium text-neutral-900">{name}</span>
        <span className="text-sm font-normal text-neutral-500">
          {description}
        </span>
      </div>
    </div>
  )
}

const products = [
  {
    id: "21",
    name: "Paskibra Cale",
    pelatih: "Pak Budi Santoso",
    status: "Approved",
  },
]

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
      {/* Card Data Tim */}
      <Card className="border-none bg-glassmorphism-50 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-bold text-dark-blue">
            Team Saya
          </CardTitle>
          <CardAction>
            <Link href={"team/new"}>
              <Button variant="default" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Buat Tim Baru
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative w-full overflow-hidden rounded-lg">
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <Table className="min-w-200 text-left text-sm text-neutral-500">
                <TableHeader className="bg-neutral-50 text-xs text-neutral-700 uppercase">
                  <TableRow className="border-b border-neutral-200 hover:bg-neutral-50">
                    <TableHead className="w-12 p-4 text-center">No</TableHead>
                    <TableHead className="px-6 py-3 font-semibold">
                      Tim
                    </TableHead>
                    <TableHead className="px-6 py-3 font-semibold">
                      Nama Pelatih
                    </TableHead>
                    <TableHead className="px-6 py-3 font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="px-6 py-3 font-semibold">
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
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                            <Image
                              fill
                              className="object-cover"
                              src={"https://placehold.co/400"}
                              alt="Tim Avatar"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-base font-semibold text-neutral-900">
                              {product.name}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-neutral-700">
                        {product.pelatih}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className="border-success-200 bg-success-50 text-success-600 hover:bg-success-50">
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="default" size="sm">
                                Detail
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] gap-0 overflow-x-hidden overflow-y-auto rounded-2xl p-0 sm:max-w-3xl sm:rounded-[32px]">
                              {/* Header Modal Sesuai Figma */}
                              <DialogHeader className="flex flex-row items-start justify-between space-y-0 border-b border-neutral-200/50 p-6 sm:px-8">
                                <DialogTitle className="sr-only">
                                  Detail Tim {product.name}
                                </DialogTitle>
                                <div className="flex items-center gap-4 sm:gap-6">
                                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-100 outline outline-4 outline-neutral-200 sm:h-16 sm:w-16">
                                    <Image
                                      src="https://placehold.co/400"
                                      fill
                                      className="object-cover"
                                      alt="Tim Avatar"
                                      unoptimized
                                    />
                                  </div>
                                  <div className="flex flex-col items-start gap-1 sm:gap-2">
                                    <h2 className="text-lg leading-tight font-semibold text-neutral-900 sm:text-xl">
                                      {product.name}
                                    </h2>
                                    <Badge className="w-fit rounded-full border-success-200 bg-success-50 px-3 py-0.5 text-xs font-medium text-success-600 hover:bg-success-50">
                                      Approved
                                    </Badge>
                                  </div>
                                </div>
                              </DialogHeader>

                              {/* Body Modal */}
                              <div className="flex flex-col px-6 py-6 sm:px-8">
                                <Tabs defaultValue="info" className="w-full">
                                  <TabsList className="mb-6 flex h-12 w-full rounded-[48px] bg-neutral-100 p-1.5">
                                    <TabsTrigger
                                      value="info"
                                      className="flex-1 rounded-[40px] text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                    >
                                      Info Umum
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="anggota"
                                      className="flex-1 rounded-[40px] text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                    >
                                      Anggota
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="berkas"
                                      className="flex-1 rounded-[40px] text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                    >
                                      Berkas
                                    </TabsTrigger>
                                  </TabsList>

                                  {/* CONTENT 1: INFO UMUM */}
                                  <TabsContent
                                    value="info"
                                    className="mt-0 flex flex-col gap-5 focus-visible:outline-none"
                                  >
                                    <div className="flex flex-col gap-3 rounded-xl bg-neutral-50 px-5 py-4">
                                      <h3 className="text-base font-semibold text-neutral-800">
                                        Informasi Tim
                                      </h3>
                                      <div className="flex items-center gap-1.5 text-sm">
                                        <span className="text-neutral-500">
                                          Nama Tim:
                                        </span>
                                        <span className="font-medium text-neutral-800">
                                          {product.name}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex w-full items-center gap-4 rounded-xl border border-blue-200 bg-blue-50/50 px-5 py-4 sm:w-fit">
                                      <FileText className="h-6 w-6 text-blue-500" />
                                      <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-blue-600">
                                          Surat Rekomendasi
                                        </span>
                                        <span className="text-sm text-blue-500">
                                          surat-rekomendasi-cale.pdf
                                        </span>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  {/* CONTENT 2: ANGGOTA */}
                                  <TabsContent
                                    value="anggota"
                                    className="mt-0 focus-visible:outline-none"
                                  >
                                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                                      {/* Kolom Kiri */}
                                      <div className="flex flex-col gap-5">
                                        <div className="flex flex-col gap-3">
                                          <h3 className="text-base font-medium text-neutral-900">
                                            Pelatih (1)
                                          </h3>
                                          <MemberCard
                                            name="Pak Budi Santoso"
                                            description="Pelatih #1"
                                          />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                          <h3 className="text-base font-medium text-neutral-900">
                                            Danpas (1)
                                          </h3>
                                          <MemberCard
                                            name="Siti Nurhaliza Putri"
                                            description="Kartu Pelajar: kartu-siti.jpg"
                                          />
                                        </div>
                                      </div>
                                      {/* Kolom Kanan */}
                                      <div className="flex flex-col gap-5">
                                        <div className="flex flex-col gap-3">
                                          <h3 className="text-base font-medium text-neutral-900">
                                            Official (1)
                                          </h3>
                                          <MemberCard
                                            name="Rudi Hartono"
                                            description="Kartu Pelajar: kartu-rudi.jpg"
                                          />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                          <h3 className="text-base font-medium text-neutral-900">
                                            Pasukan (2)
                                          </h3>
                                          <MemberCard
                                            name="Rudi Hartono"
                                            description="Kartu Pelajar: kartu-rudi.jpg"
                                          />
                                          <MemberCard
                                            name="Ahmad Fauzi Rahmat"
                                            description="Kartu Pelajar: kartu-ahmad.jpg"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  {/* CONTENT 3: BERKAS */}
                                  <TabsContent
                                    value="berkas"
                                    className="mt-0 flex flex-col gap-6 focus-visible:outline-none"
                                  >
                                    <div className="flex flex-col gap-3">
                                      <h3 className="text-base font-semibold text-neutral-800">
                                        Dokumen Tim
                                      </h3>
                                      <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-3">
                                          <FileText className="h-5 w-5 text-blue-500" />
                                          <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-neutral-800">
                                              Surat Rekomendasi
                                            </span>
                                            <span className="text-xs text-neutral-500">
                                              surat-rekomendasi-elang-jaya.pdf
                                            </span>
                                          </div>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8"
                                        >
                                          Download
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                      <h3 className="text-base font-semibold text-neutral-800">
                                        Logo Tim
                                      </h3>
                                      <div className="relative h-32 w-32 overflow-hidden rounded-xl bg-neutral-200">
                                        <Image
                                          src="https://placehold.co/400"
                                          fill
                                          className="object-cover"
                                          alt="Logo Tim"
                                          unoptimized
                                        />
                                      </div>
                                    </div>
                                  </TabsContent>
                                </Tabs>

                                {/* Tombol Action Bawah (Batal & Hapus Tim) */}
                                <div className="mt-8 flex w-full flex-col-reverse items-center justify-center gap-3 sm:flex-row">
                                  <DialogClose asChild>
                                    <Button
                                      variant="outline"
                                      className="h-12 w-full rounded-full text-base font-semibold sm:w-1/2"
                                    >
                                      Batal
                                    </Button>
                                  </DialogClose>
                                  <Link href={"/peserta/dashboard/team/edit/12312"} className="w-full">
                                    <Button
                                      type="button"
                                      variant="default"
                                      className="h-12 w-full rounded-full"
                                    >
                                      Edit Tim
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                              <DialogHeader className="p-6 pb-2">
                                <DialogTitle className="text-xl font-bold text-dark-blue">
                                  Konfirmasi Hapus Tim
                                </DialogTitle>
                                <Separator className="mt-4" />
                              </DialogHeader>
                              <div className="relative w-full px-6 pb-6">
                                <div className="mb-10 self-stretch text-center text-sm leading-5 font-normal text-neutral-500">
                                  Apakah kamu yakin ingin menghapus tim?
                                  Tindakan ini tidak dapat dibatalkan dan akan
                                  menghapus semua data anggota tim.{" "}
                                  <span className="font-semibold text-danger-500">
                                    {product.name}
                                  </span>
                                </div>
                                <div className="flex w-full flex-row items-center justify-center gap-3">
                                  <DialogClose asChild>
                                    <Button
                                      variant="outline"
                                      className="flex-1"
                                    >
                                      Batal
                                    </Button>
                                  </DialogClose>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    Hapus
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
