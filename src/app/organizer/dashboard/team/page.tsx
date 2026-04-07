import Image from "next/image"
import { Search, Filter, ChevronDown, Image as ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Stats Tim */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardContent className="grid h-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard value="45" label="Total Tim" />
            <StatCard value="12" label="Menunggu Approval" />
            <StatCard value="20" label="Disetujui" />
            <StatCard value="5" label="Ditolak" />
          </CardContent>
        </Card>

        {/* Daftar Tim */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Daftar Tim
            </CardTitle>
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
                      placeholder="Search"
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
                        Color
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                        Category
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-neutral-700 hover:bg-neutral-100">
                        Price
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-neutral-100">
                        Sign out
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
                          Status Pembayaran
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
                                  Bonnie Green
                                </span>
                                <span className="truncate text-sm font-normal text-neutral-500">
                                  bonnie@flowbite.com
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-neutral-700">
                            SD
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge className="border-success-200 bg-success-50 text-success-600 hover:bg-success-50">
                              Approval
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* DIALOG DETAIL TIM */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="default" size="sm">
                                    Detail
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-xl">
                                  <DialogHeader className="p-6 pb-2">
                                    <DialogTitle className="text-xl font-bold text-dark-blue">
                                      Detail Tim Peserta
                                    </DialogTitle>
                                    <Separator className="mt-4" />
                                  </DialogHeader>
                                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                                    <div className="flex w-full flex-col items-start justify-start gap-6">
                                      <Card className="mt-2 w-full rounded-2xl border-primary-100 bg-primary-50 shadow-none">
                                        <CardHeader className="pb-4">
                                          <CardTitle className="text-lg leading-7 font-semibold text-dark-blue">
                                            Informasi Tim
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-3">
                                          <DetailRow
                                            label="Nama Tim"
                                            value="Garuda Nusantara"
                                          />
                                          <DetailRow
                                            label="Kategori"
                                            value="SD"
                                          />
                                          <DetailRow
                                            label="Jumlah Anggota"
                                            value="15 orang"
                                          />
                                          <DetailRow
                                            label="Status Pembayaran"
                                            valueNode={
                                              <Badge
                                                variant="outline"
                                                className="border-warning-500 bg-warning-50 px-3 py-1 font-normal text-warning-500"
                                              >
                                                Pending
                                              </Badge>
                                            }
                                          />
                                        </CardContent>
                                      </Card>

                                      {/* Card Informasi Sekolah */}
                                      <Card className="w-full rounded-2xl border-primary-100 bg-primary-50 shadow-none">
                                        <CardHeader className="pb-4">
                                          <CardTitle className="text-lg leading-7 font-semibold text-dark-blue">
                                            Informasi Sekolah
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-3">
                                          <DetailRow
                                            label="Nama Sekolah"
                                            value="SDN 01 Jakarta Pusat"
                                          />
                                          <DetailRow
                                            label="Alamat"
                                            value="Jl. Merdeka No. 123, Jakarta Pusat"
                                          />
                                          <DetailRow
                                            label="Nama Pelatih"
                                            value="Budi Santoso, S.Pd"
                                          />
                                          <DetailRow
                                            label="No. Telepon"
                                            value="+62 812-3456-7890"
                                          />
                                          <DetailRow
                                            label="Email"
                                            value="garuda.nusantara@email.com"
                                          />
                                        </CardContent>
                                      </Card>

                                      {/* Button / Card Bukti Transfer */}
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className="group flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-stone-300 bg-primary-50 px-6 py-12 transition-colors hover:border-sky-300 hover:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                                      >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 transition-transform group-hover:scale-110">
                                          <ImageIcon className="h-5 w-5 text-neutral-600" />
                                        </div>
                                        <span className="text-center font-montserrat text-sm leading-5 font-semibold text-neutral-700">
                                          Klik untuk melihat bukti transfer
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {/* DIALOG APPROVE */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-success-300 text-white hover:bg-success-400"
                                  >
                                    Approved
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                                  <DialogHeader className="p-6 pb-2">
                                    <DialogTitle className="text-xl font-bold text-dark-blue">
                                      Konfirmasi
                                    </DialogTitle>
                                    <Separator className="mt-4" />
                                  </DialogHeader>
                                  <div className="relative w-full px-6 pb-6">
                                    <div className="mb-10 self-stretch text-center text-sm leading-5 font-normal text-neutral-500">
                                      Approve peserta ini? Saldo kamu akan{" "}
                                      <span className="text-sm leading-5 font-semibold text-danger-500">
                                        terpotong 1 koin
                                      </span>
                                    </div>
                                    <div className="flex w-full flex-row items-center justify-center gap-2">
                                      <DialogClose asChild>
                                        <Button
                                          variant="outline"
                                          className="flex-1"
                                        >
                                          Batal
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        type="submit"
                                        className="flex-1 bg-success-500 text-white hover:bg-success-400"
                                      >
                                        Approve
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {/* DIALOG REJECT */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    Reject
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                                  <DialogHeader className="p-6 pb-2">
                                    <DialogTitle className="text-xl font-bold text-dark-blue">
                                      Reject Tim
                                    </DialogTitle>
                                    <Separator className="mt-4" />
                                  </DialogHeader>
                                  <div className="relative w-full px-6 pb-6">
                                    <div className="mb-10 space-y-2 sm:space-y-1">
                                      <Label
                                        htmlFor="rejectReason"
                                        className="text-sm text-neutral-500"
                                      >
                                        Alasan Penolakan
                                      </Label>
                                      <Textarea
                                        id="rejectReason"
                                        placeholder="Contoh: Bukti transfer tidak jelas atau tidak sesuai jumlah pembayaran"
                                        className="h-20 sm:h-24"
                                      />
                                    </div>
                                    <div className="flex w-full flex-row items-center justify-center gap-2">
                                      <DialogClose asChild>
                                        <Button
                                          variant="outline"
                                          className="flex-1"
                                        >
                                          Batal
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        type="submit"
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        Approve
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {/* DIALOG KICK */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    Kick
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] p-0 sm:max-w-xl">
                                  <DialogHeader className="p-6 pb-2">
                                    <DialogTitle className="text-xl font-bold text-dark-blue">
                                      Konfirmasi Kick Tim
                                    </DialogTitle>
                                    <Separator className="mt-4" />
                                  </DialogHeader>
                                  <div className="relative w-full px-6 pb-6">
                                    <div className="mb-10 self-stretch text-center text-sm leading-5 font-normal text-neutral-500">
                                      Apakah Anda yakin kick peserta ini?{" "}
                                      <span className="text-sm leading-5 font-semibold text-danger-500">
                                        SMPN 1 Malang
                                      </span>
                                    </div>
                                    <div className="flex w-full flex-row items-center justify-center gap-2">
                                      <DialogClose asChild>
                                        <Button
                                          variant="outline"
                                          className="flex-1"
                                        >
                                          Batal
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        type="submit"
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        Kick
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
            </InfoSection>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm transition-all hover:border-primary-200 hover:shadow-md sm:p-6">
      <span className="text-2xl font-bold text-neutral-700 sm:text-3xl">
        {value}
      </span>
      <span className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase sm:text-xs">
        {label}
      </span>
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

function DetailRow({ label, value, valueNode, className }: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4",
        className
      )}
    >
      <span className="text-base leading-6 font-normal text-neutral-500">
        {label}
      </span>
      {valueNode ? (
        valueNode
      ) : (
        <span className="max-w-[60%] flex-wrap text-right text-base leading-6 font-medium text-neutral-700">
          {value}
        </span>
      )}
    </div>
  )
}
