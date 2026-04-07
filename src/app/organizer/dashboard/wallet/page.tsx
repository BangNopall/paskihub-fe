import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Icon } from "@iconify/react"
import { Label } from "@/components/ui/label"
import { Montserrat } from "@/lib/fonts"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    datePayment: "25 January 2025",
    timePayment: "10:00 AM",
    paymentStatus: "Paid",
    totalAmount: "250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    datePayment: "25 January 2025",
    timePayment: "10:00 AM",
    paymentStatus: "Paid",
    totalAmount: "250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV003",
    datePayment: "25 January 2025",
    timePayment: "10:00 AM",
    paymentStatus: "Paid",
    totalAmount: "250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV004",
    datePayment: "25 January 2025",
    timePayment: "10:00 AM",
    paymentStatus: "Paid",
    totalAmount: "250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    datePayment: "25 January 2025",
    timePayment: "10:00 AM",
    paymentStatus: "Paid",
    totalAmount: "250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV006",
    datePayment: "25 January 2025",
    timePayment: "10:00 AM",
    paymentStatus: "Paid",
    totalAmount: "250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV007",
    datePayment: "25 January 2025",
    timePayment: "10:00 AM",
    paymentStatus: "Paid",
    totalAmount: "250.00",
    paymentMethod: "Credit Card",
  },
]

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
        {/* Top Section: Balance & Stats */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <Card className="flex flex-col justify-center border-none bg-glassmorphism-50 p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium text-neutral-500">
                  Saldo Koin
                </span>
                <div className="flex items-center gap-2 text-primary-600">
                  <Icon icon="akar-icons:coin" width="32" height="32" />
                  <span className="text-4xl font-bold tracking-tight text-neutral-800">
                    150
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-400">
                  ≈ Rp 150.000
                </span>
              </div>
              <div className="flex w-full items-center justify-center rounded-xl border border-info-200 bg-info-50 p-3">
                <span className="text-sm font-medium text-info-700">
                  Nilai 1 Koin = Rp 1.000
                </span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col border-none bg-glassmorphism-50 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl font-bold text-dark-blue">
                Statistik
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-full flex-row gap-3 sm:gap-4">
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm transition-all hover:border-primary-200 hover:shadow-md sm:p-6">
                <span className="text-3xl font-bold text-success-500">2</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-xs">
                  Top Up Berhasil
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm transition-all hover:border-primary-200 hover:shadow-md sm:p-6">
                <span className="text-3xl font-bold text-warning-500">1</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-xs">
                  Menunggu Approval
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Top Up Form */}
        <Card className="border-none bg-glassmorphism-50 shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl font-bold text-dark-blue">
              Top Up Koin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pilih Jumlah Koin */}
            <InfoSection title="Pilih Jumlah Koin">
              <div className="flex w-full flex-col gap-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                  {[50, 100, 150, 200].map((amount) => (
                    <div
                      key={amount}
                      className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-transparent bg-white p-4 shadow-sm transition-all hover:border-primary-500 hover:ring-1 hover:ring-primary-500 sm:gap-2"
                    >
                      <div className="flex items-center gap-1 text-neutral-400 sm:gap-2">
                        <Icon
                          icon="akar-icons:coin"
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        />
                        <span className="text-base font-semibold sm:text-lg">
                          {amount}
                        </span>
                      </div>
                      <span className="text-xs font-normal text-neutral-500">
                        Rp{amount}.000
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <Input
                    type="number"
                    id="coin"
                    placeholder="Masukan jumlah koin sendiri"
                    className="rounded-lg bg-white text-center sm:text-left"
                  />
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="coupon"
                      className="text-sm font-medium text-neutral-700"
                    >
                      Kode Kupon (Opsional)
                    </Label>
                    <Input
                      type="text"
                      id="coupon"
                      placeholder="Masukan kode kupon jika ada"
                      className="rounded-lg bg-white"
                    />
                    <p className="text-xs font-normal text-neutral-500">
                      Dapatkan bonus koin dengan kode kupon spesial
                    </p>
                  </div>
                </div>
              </div>
            </InfoSection>

            {/* Instruksi Transfer */}
            <InfoSection title="Instruksi Transfer">
              <div className="flex w-full flex-col gap-4">
                <div className="rounded-2xl border border-primary-100 bg-white p-5 sm:p-6 md:p-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-neutral-500">
                        Nama Bank
                      </div>
                      <div className="text-base font-semibold text-neutral-800">
                        BCA
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-neutral-500">
                        Nomor Rekening
                      </div>
                      <div className="text-base font-semibold text-neutral-800">
                        1234567890
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-neutral-500">
                        Atas Nama
                      </div>
                      <div className="text-base font-semibold text-neutral-800">
                        Panitia Lomba GJ 2025
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-semibold text-neutral-700">
                    Ketentuan:
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-sm text-neutral-600 sm:grid-cols-2 sm:gap-4">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>
                        Transfer sesuai jumlah yang dipilih ke rekening di atas
                      </li>
                      <li>
                        Simpan bukti transfer dari bank atau e-wallet kamu
                      </li>
                      <li>Upload bukti transfer di form bawah ini</li>
                    </ul>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Tunggu approval dari admin (maks 1x24 jam)</li>
                      <li>Koin akan otomatis masuk setelah disetujui</li>
                    </ul>
                  </div>
                </div>
              </div>
            </InfoSection>

            {/* Upload Bukti Transfer */}
            <InfoSection title="Upload Bukti Transfer">
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-gray-200 bg-white p-8 transition-colors hover:bg-gray-50 md:p-12">
                  <div className="flex items-center justify-center rounded-full bg-neutral-100 p-3 text-neutral-500">
                    <Icon icon="ep:upload-filled" width="24" height="24" />
                  </div>
                  <div
                    className={cn(
                      "text-center text-sm font-medium text-neutral-700",
                      Montserrat.className
                    )}
                  >
                    Klik untuk unggah bukti transfer
                  </div>
                  <div className="text-xs text-neutral-400">
                    Format: JPG, PNG (Max 5MB)
                  </div>
                </div>
                <Button variant="destructive" className="w-full font-bold">
                  Ajukan Top Up
                </Button>
              </div>
            </InfoSection>

            {/* History Transaksi */}
            <InfoSection title="History Transaksi">
              <div className="relative w-full overflow-auto rounded-lg border border-neutral-100 bg-white">
                <Table className="min-w-150">
                  <TableHeader>
                    <TableRow className="bg-neutral-50/50">
                      <TableHead>Invoice</TableHead>
                      <TableHead>Jenis Transaksi</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Jam</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Jumlah Koin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice, index) => (
                      <TableRow key={`${invoice.invoice}-${index}`}>
                        <TableCell className="font-medium text-neutral-700">
                          {invoice.invoice}
                        </TableCell>
                        <TableCell className="text-neutral-600">
                          {invoice.paymentMethod}
                        </TableCell>
                        <TableCell className="text-neutral-600">
                          {invoice.datePayment}
                        </TableCell>
                        <TableCell className="text-neutral-600">
                          {invoice.timePayment}
                        </TableCell>
                        <TableCell>
                          <Badge className="border-success-200 bg-success-50 text-success-600 hover:bg-success-50">
                            {invoice.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-success-600">
                          +{invoice.totalAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-glassmorphism-50 p-4 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold text-dark-blue">{title}</h3>
      {children}
    </div>
  )
}
