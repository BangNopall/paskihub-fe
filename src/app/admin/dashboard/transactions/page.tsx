"use client"

import React, { useState, useEffect } from "react"
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
  FileText,
  Loader2,
  TrendingUp,
  Ban,
  ArrowUpRight,
  Maximize2
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
import { Textarea } from "@/components/ui/textarea"
import { Montserrat, Poppins } from "@/lib/fonts"
import { toast } from "sonner"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export type TransactionStatus = "Pending" | "Approved" | "Rejected"

export interface TransactionData {
  id: string
  eo: string
  amount: number
  coins: number
  status: TransactionStatus
  date: string
  time: string
  proof: string
  rejectionReason?: string
}

// ==========================================
// 2. MOCK DATA
// ==========================================

const MOCK_TRANSACTIONS: TransactionData[] = [
  { id: "TX-9901", eo: "SMA 1 Jakarta", amount: 500000, coins: 500, status: "Pending", date: "27 Apr 2026", time: "14:20", proof: "/proof1.jpg" },
  { id: "TX-9902", eo: "Paskibra Kota Bandung", amount: 1000000, coins: 1000, status: "Approved", date: "26 Apr 2026", time: "10:15", proof: "/proof2.jpg" },
  { id: "TX-9903", eo: "Event Pro Nusantara", amount: 250000, coins: 250, status: "Rejected", date: "25 Apr 2026", time: "16:45", proof: "/proof3.jpg", rejectionReason: "Bukti transfer tidak terbaca (blur)." },
  { id: "TX-9904", eo: "SMK Pelita Bangsa", amount: 750000, coins: 750, status: "Pending", date: "27 Apr 2026", time: "09:00", proof: "/proof4.jpg" },
]

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    Pending: "border-yellow-400 bg-yellow-50 text-yellow-600",
    Approved: "border-green-400 bg-green-50 text-green-600",
    Rejected: "border-red-400 bg-red-50 text-red-600",
  }

  return (
    <Badge variant="outline" className={`px-3 py-1 font-poppins text-xs font-normal ${styles[status]}`}>
      {status === "Approved" ? "Berhasil" : status === "Rejected" ? "Ditolak" : status}
    </Badge>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function CoinTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [selectedTx, setSelectedTx] = useState<TransactionData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [isProcessingAction, setIsProcessingAction] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/admin/transactions di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setTransactions(MOCK_TRANSACTIONS)
      } catch (error) {
        console.error("Gagal memuat data transaksi:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleApprove = async () => {
    if (!selectedTx) return
    setIsProcessingAction(true)
    try {
      // TODO: Integrasi API Approve
      await new Promise(r => setTimeout(r, 1000))
      toast.success(`Transaksi ${selectedTx.id} berhasil disetujui. ${selectedTx.coins} koin telah ditambahkan ke saldo ${selectedTx.eo}.`)
      setSelectedTx(null)
    } finally {
      setIsProcessingAction(false)
    }
  }

  const handleRejectSubmit = async () => {
    if (!selectedTx || !rejectionReason) return
    setIsProcessingAction(true)
    try {
      // TODO: Integrasi API Reject
      await new Promise(r => setTimeout(r, 1000))
      toast.error(`Transaksi ${selectedTx.id} ditolak. Alasan: ${rejectionReason}`)
      setIsRejecting(false)
      setSelectedTx(null)
      setRejectionReason("")
    } finally {
      setIsProcessingAction(false)
    }
  }

  const filteredTransactions = transactions.filter(tx => 
    tx.eo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">Gagal Memuat Transaksi</h2>
        <Button onClick={() => window.location.reload()} className="mt-6 rounded-full bg-blue-500 hover:bg-blue-600">
          Muat Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
            Transaksi Koin
          </h1>
          <p className="text-sm text-neutral-500">Kelola dan verifikasi permintaan top-up saldo koin dari Event Organizer.</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatMiniCard 
            label="Menunggu Approval" 
            value="2 Transaksi" 
            icon={<Clock className="h-6 w-6" />} 
            color="amber" 
          />
          <StatMiniCard 
            label="Berhasil (Bulan Ini)" 
            value="128 Transaksi" 
            icon={<CheckCircle2 className="h-6 w-6" />} 
            color="emerald" 
            trend="+15% dari bulan lalu"
          />
          <StatMiniCard 
            label="Total Koin Terdistribusi" 
            value="45.500 Koin" 
            icon={<FileText className="h-6 w-6" />} 
            color="info" 
          />
        </div>

        <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
          <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white shadow-none">
            <CardHeader className="border-b border-neutral-100 bg-white px-5 py-6 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input 
                    placeholder="Cari ID atau nama EO..." 
                    className="rounded-full border-neutral-200 bg-neutral-50 pl-10 focus-visible:ring-info-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="rounded-full border-neutral-300">
                  <Filter className="mr-2 h-4 w-4" /> Filter Status
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-neutral-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">ID Transaksi</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Event Organizer</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Jumlah (IDR)</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Koin</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Status</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Waktu</TableHead>
                        <TableHead className="px-6 text-right font-poppins font-semibold text-neutral-600">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-40 text-center font-poppins text-neutral-500">
                            Tidak ada transaksi ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((tx) => (
                          <TableRow key={tx.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50">
                            <TableCell className="px-6 py-4 font-mono text-xs font-medium text-neutral-500">
                              {tx.id}
                            </TableCell>
                            <TableCell className="px-6 py-4 font-poppins font-semibold text-neutral-800">
                              {tx.eo}
                            </TableCell>
                            <TableCell className="px-6 py-4 font-poppins font-medium text-neutral-700">
                              {formatRupiah(tx.amount)}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge variant="secondary" className="bg-info-50 text-info-600 hover:bg-info-100">
                                {tx.coins} Koin
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <StatusBadge status={tx.status} />
                            </TableCell>
                            <TableCell className="px-6 py-4 text-xs text-neutral-500">
                              <div className="flex flex-col">
                                <span>{tx.date}</span>
                                <span>{tx.time}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <Dialog onOpenChange={(open) => {
                                if (!open) {
                                  setSelectedTx(null)
                                  setIsRejecting(false)
                                  setRejectionReason("")
                                }
                              }}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="rounded-full text-info-600 hover:bg-info-50 hover:text-info-700"
                                    onClick={() => setSelectedTx(tx)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" /> Detail
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[550px] rounded-[32px] border-none p-0 overflow-hidden shadow-2xl">
                                  <DialogHeader className="bg-gradient-to-r from-info-600 to-info-500 p-8 text-white relative">
                                    <DialogTitle className="font-montserrat text-2xl font-bold">Verifikasi Pembayaran</DialogTitle>
                                    <DialogDescription className="text-info-50 opacity-90">
                                      ID: {selectedTx?.id} • {selectedTx?.eo}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="grid gap-6 p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                                    <div className="flex items-center justify-between rounded-2xl bg-neutral-50 p-6 border border-neutral-100">
                                      <div className="flex flex-col">
                                        <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Total Nominal</span>
                                        <span className="text-2xl font-bold text-slate-900">{formatRupiah(selectedTx?.amount || 0)}</span>
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Koin Didapat</span>
                                        <span className="text-2xl font-bold text-info-600">{selectedTx?.coins} Koin</span>
                                      </div>
                                    </div>

                                    {selectedTx?.status === 'Rejected' && (
                                      <div className="p-4 rounded-xl bg-danger-50 border border-danger-100 flex items-start gap-3">
                                        <Ban className="h-5 w-5 text-danger-600 mt-0.5" />
                                        <div className="space-y-1">
                                          <p className="text-sm font-bold text-danger-700">Alasan Penolakan:</p>
                                          <p className="text-sm text-danger-600">{selectedTx.rejectionReason}</p>
                                        </div>
                                      </div>
                                    )}

                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-neutral-800">Bukti Transfer</label>
                                        <Button variant="ghost" size="sm" className="h-8 text-info-600 rounded-full font-bold">
                                          <Download className="mr-2 h-3.5 w-3.5" /> Download
                                        </Button>
                                      </div>
                                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-100 flex items-center justify-center group cursor-zoom-in">
                                        <div className="flex flex-col items-center gap-2 text-neutral-400 group-hover:text-info-500 transition-all group-hover:scale-110">
                                          <Maximize2 className="h-10 w-10" />
                                          <span className="text-sm font-medium">Klik untuk Perbesar Gambar</span>
                                        </div>
                                        {/* Real image would go here */}
                                      </div>
                                    </div>

                                    {isRejecting && (
                                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-sm font-semibold text-danger-600 flex items-center gap-2">
                                          <AlertCircle className="h-4 w-4" /> Alasan Penolakan
                                        </label>
                                        <Textarea 
                                          placeholder="Tulis alasan kenapa transaksi ini ditolak..." 
                                          className="rounded-xl border-danger-200 focus-visible:ring-danger-500 bg-danger-50/10 min-h-[100px]"
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <DialogFooter className="flex flex-col sm:flex-row gap-3 p-8 pt-0">
                                    {selectedTx?.status === "Pending" ? (
                                      <>
                                        {!isRejecting ? (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              className="flex-1 h-12 rounded-full text-danger-600 border-danger-200 hover:bg-danger-50 hover:text-danger-700 font-bold"
                                              onClick={() => setIsRejecting(true)}
                                            >
                                              <X className="mr-2 h-4 w-4" /> Tolak Transaksi
                                            </Button>
                                            <Button 
                                              className="flex-1 h-12 rounded-full bg-success-600 hover:bg-success-700 font-bold shadow-lg"
                                              onClick={handleApprove}
                                              disabled={isProcessingAction}
                                            >
                                              {isProcessingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                              Setujui & Tambah Koin
                                            </Button>
                                          </>
                                        ) : (
                                          <>
                                            <Button 
                                              variant="ghost" 
                                              className="flex-1 h-12 rounded-full font-bold"
                                              onClick={() => setIsRejecting(false)}
                                            >
                                              Batalkan
                                            </Button>
                                            <Button 
                                              className="flex-1 h-12 rounded-full bg-danger-600 hover:bg-danger-700 font-bold shadow-lg"
                                              onClick={handleRejectSubmit}
                                              disabled={!rejectionReason || isProcessingAction}
                                            >
                                              {isProcessingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
                                              Kirim Penolakan
                                            </Button>
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      <Button variant="secondary" className="w-full h-12 rounded-full" disabled>
                                        Sudah Diproses pada {selectedTx?.date}
                                      </Button>
                                    )}
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatMiniCard({ label, value, icon, color, trend }: { label: string, value: string, icon: React.ReactNode, color: 'amber' | 'emerald' | 'info', trend?: string }) {
  const styles = {
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    info: "bg-info-50 text-info-600"
  }
  
  return (
    <Card className="rounded-2xl border-gray-200 bg-white shadow-none transition-all hover:shadow-md">
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`rounded-xl p-3 ${styles[color]}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</span>
          <span className="text-2xl font-bold text-neutral-800">{value}</span>
          {trend && (
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold mt-0.5">
              <TrendingUp className="h-3 w-3" /> {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
