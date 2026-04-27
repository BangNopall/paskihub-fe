"use client"

import React, { useState } from "react"
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Montserrat, Poppins } from "@/lib/fonts"

const MOCK_TRANSACTIONS = [
  { id: "TX-9901", eo: "SMA 1 Jakarta", amount: 500000, coins: 500, status: "Pending", date: "27 Apr 2026", time: "14:20", proof: "/proof1.jpg" },
  { id: "TX-9902", eo: "Paskibra Kota Bandung", amount: 1000000, coins: 1000, status: "Approved", date: "26 Apr 2026", time: "10:15", proof: "/proof2.jpg" },
  { id: "TX-9903", eo: "Event Pro Nusantara", amount: 250000, coins: 250, status: "Rejected", date: "25 Apr 2026", time: "16:45", proof: "/proof3.jpg" },
  { id: "TX-9904", eo: "SMK Pelita Bangsa", amount: 750000, coins: 750, status: "Pending", date: "27 Apr 2026", time: "09:00", proof: "/proof4.jpg" },
]

export default function CoinTransactionsPage() {
  const [selectedTx, setSelectedTx] = useState<any>(null)

  function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={`flex flex-1 flex-col p-4 md:p-6 lg:p-8 ${Poppins.className}`}>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className={`text-2xl font-bold text-slate-900 ${Montserrat.className}`}>Transaksi Koin</h1>
            <p className="text-sm text-neutral-500">Kelola dan verifikasi permintaan top-up saldo koin dari Event Organizer.</p>
          </div>
        </div>

        {/* Stats Mini Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="bg-amber-50/50 border-amber-100 shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Menunggu Approval</p>
                  <p className="text-2xl font-bold text-amber-700">2 Transaksi</p>
                </div>
                <Clock className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50 border-emerald-100 shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Berhasil (Bulan Ini)</p>
                  <p className="text-2xl font-bold text-emerald-700">128 Transaksi</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50/50 border-blue-100 shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Total Koin Terdistribusi</p>
                  <p className="text-2xl font-bold text-blue-700">45.500 Koin</p>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-neutral-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-neutral-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input 
                  placeholder="Cari ID atau nama EO..." 
                  className="pl-10 rounded-xl border-neutral-200"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter Status
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-neutral-50/50">
                <TableRow>
                  <TableHead className="pl-6">ID Transaksi</TableHead>
                  <TableHead>Event Organizer</TableHead>
                  <TableHead>Jumlah (IDR)</TableHead>
                  <TableHead>Koin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead className="text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-neutral-50/50 transition-colors">
                    <TableCell className="pl-6 font-mono text-xs font-medium text-neutral-500">
                      {tx.id}
                    </TableCell>
                    <TableCell className="font-semibold text-neutral-800">
                      {tx.eo}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatRupiah(tx.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100">
                        {tx.coins} Koin
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                    <TableCell className="text-xs text-neutral-500">
                      {tx.date}<br/>{tx.time}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg border-neutral-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                            onClick={() => setSelectedTx(tx)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Detail
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-2xl">
                          <DialogHeader>
                            <DialogTitle className={Montserrat.className}>Verifikasi Pembayaran</DialogTitle>
                            <DialogDescription>
                              ID: {selectedTx?.id} • {selectedTx?.eo}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-6 py-4">
                            <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                              <div className="flex flex-col">
                                <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Total Nominal</span>
                                <span className="text-xl font-bold text-slate-900">{formatRupiah(selectedTx?.amount || 0)}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Koin Didapat</span>
                                <span className="text-xl font-bold text-blue-600">{selectedTx?.coins} Koin</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-neutral-700">Bukti Transfer</label>
                              <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-100 flex items-center justify-center group">
                                <span className="text-neutral-400 group-hover:text-neutral-500 transition-colors flex flex-col items-center">
                                  <Download className="mb-2 h-8 w-8" />
                                  Klik untuk Lihat Full Image
                                </span>
                                {/* In real app: <Image src={selectedTx.proof} fill /> */}
                              </div>
                            </div>
                          </div>

                          <DialogFooter className="gap-2 sm:gap-0">
                            {selectedTx?.status === "Pending" ? (
                              <>
                                <Button variant="outline" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                                  <X className="mr-2 h-4 w-4" /> Tolak
                                </Button>
                                <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                                  <Check className="mr-2 h-4 w-4" /> Approve & Tambah Koin
                                </Button>
                              </>
                            ) : (
                              <Button variant="secondary" className="w-full rounded-xl" disabled>
                                Transaksi Ini Sudah {selectedTx?.status}
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Approved':
      return <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-none px-3">Berhasil</Badge>
    case 'Pending':
      return <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100 border-none px-3">Pending</Badge>
    case 'Rejected':
      return <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none px-3">Ditolak</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
