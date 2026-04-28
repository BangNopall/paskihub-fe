"use client"

import React, { useState, useEffect } from "react"
import { 
  History, 
  Search, 
  Filter, 
  User, 
  ShieldAlert, 
  CreditCard, 
  Megaphone,
  ArrowRight,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Montserrat, Poppins } from "@/lib/fonts"
import { toast } from "sonner"

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export type LogType = "Transaction" | "Security" | "Broadcast" | "User" | "System"

export interface AuditLogData {
  id: string
  admin: string
  action: string
  target: string
  targetId?: string
  type: LogType
  date: string
  time: string
}

// ==========================================
// 2. MOCK DATA
// ==========================================

const MOCK_LOGS: AuditLogData[] = [
  { id: "L1", admin: "Muhammad Naufal", action: "Approve Top-up", target: "Paskibra Kota Bandung", targetId: "TX-9902", type: "Transaction", date: "27 Apr 2026", time: "14:30:12" },
  { id: "L2", admin: "Muhammad Naufal", action: "Sent Broadcast", target: "Maintenance Sistem", targetId: "BC-001", type: "Broadcast", date: "27 Apr 2026", time: "14:25:05" },
  { id: "L3", admin: "System", action: "Auto-debit Koin", target: "Approval Tim: Elang Jaya", type: "System", date: "27 Apr 2026", time: "14:10:00" },
  { id: "L4", admin: "Super Admin", action: "Banned User", target: "Paski Creative Studio", targetId: "U4", type: "Security", date: "26 Apr 2026", time: "09:15:33" },
  { id: "L5", admin: "Super Admin", action: "Verified EO", target: "SMA 1 Jakarta", targetId: "U1", type: "User", date: "26 Apr 2026", time: "08:00:10" },
]

// ==========================================
// 3. UI HELPER COMPONENTS
// ==========================================

function LogTypeBadge({ type }: { type: LogType }) {
  const styles: Record<LogType, string> = {
    Transaction: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Security: "text-danger-600 bg-danger-50 border-danger-100",
    Broadcast: "text-info-600 bg-info-50 border-info-100",
    User: "text-blue-600 bg-blue-50 border-blue-100",
    System: "text-neutral-600 bg-neutral-50 border-neutral-100",
  }

  const icons: Record<LogType, React.ReactNode> = {
    Transaction: <CreditCard className="h-3 w-3"/>,
    Security: <ShieldAlert className="h-3 w-3"/>,
    Broadcast: <Megaphone className="h-3 w-3"/>,
    User: <User className="h-3 w-3"/>,
    System: <History className="h-3 w-3"/>,
  }

  return (
    <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[type]}`}>
      {icons[type]}
      {type === 'Transaction' ? 'Finance' : type}
    </div>
  )
}

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        // TODO: Integrasi endpoint API GET /api/admin/logs di sini
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setLogs(MOCK_LOGS)
      } catch (error) {
        console.error("Gagal memuat audit logs:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const handleExport = () => {
    toast.success("Log aktivitas berhasil diekspor ke CSV")
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.target.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || log.type.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesType
  })

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="font-montserrat text-xl font-bold text-slate-900">Gagal Memuat Logs</h2>
        <Button onClick={() => window.location.reload()} className="mt-6 rounded-full bg-blue-500 hover:bg-blue-600">
          Muat Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex flex-1 flex-col ${Poppins.className}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-montserrat text-2xl font-bold text-slate-900 md:text-3xl">
              Audit Logs
            </h1>
            <p className="text-sm text-neutral-500">Jejak aktivitas administratif dan perubahan sistem yang terjadi secara real-time.</p>
          </div>
          <Button variant="outline" className="rounded-full border-neutral-300 bg-white h-12 px-6 font-bold text-slate-700" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>

        <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100 bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-sm backdrop-blur-md md:gap-8 md:p-6">
          <Card className="overflow-hidden rounded-[24px] border-gray-200 bg-white shadow-none">
            <CardHeader className="border-b border-neutral-100 bg-white px-5 py-6 md:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input 
                    placeholder="Cari tindakan, admin, atau target..." 
                    className="rounded-full border-neutral-200 bg-neutral-50 pl-11 h-12 focus-visible:ring-info-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                   <SelectTrigger className="w-[180px] rounded-full border-neutral-200 bg-neutral-50 h-12 px-6">
                      <SelectValue placeholder="Tipe Log" />
                   </SelectTrigger>
                   <SelectContent className="rounded-2xl">
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      <SelectItem value="transaction">Finance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="broadcast">Info</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                   </SelectContent>
                </Select>
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
                        <TableHead className="px-8 font-poppins font-semibold text-neutral-600 w-[180px]">Waktu</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Admin</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Tindakan</TableHead>
                        <TableHead className="px-6 font-poppins font-semibold text-neutral-600">Target</TableHead>
                        <TableHead className="px-8 text-right font-poppins font-semibold text-neutral-600">Kategori</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-40 text-center font-poppins text-neutral-500">
                            Tidak ada log ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLogs.map((log) => (
                          <TableRow key={log.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50">
                            <TableCell className="px-8 py-5">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-poppins font-semibold text-neutral-800">{log.date}</span>
                                <span className="text-[10px] text-neutral-400 font-mono tracking-tighter">{log.time}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-info-50 flex items-center justify-center text-info-600 border border-info-100 shadow-sm">
                                  <User className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-poppins font-bold text-slate-700">{log.admin}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                              <span className="text-sm font-poppins font-medium text-neutral-600">{log.action}</span>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-sm text-slate-800 font-semibold">
                                  <ArrowRight className="h-3 w-3 text-neutral-300 shrink-0" />
                                  <span className="truncate max-w-[200px]">{log.target}</span>
                                </div>
                                {log.targetId && (
                                   <Button variant="link" className="h-auto p-0 text-[10px] text-info-600 justify-start font-mono font-bold hover:no-underline opacity-70 hover:opacity-100">
                                      <ExternalLink className="h-2.5 w-2.5 mr-1" /> {log.targetId}
                                   </Button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-8 py-5 text-right">
                              <LogTypeBadge type={log.type} />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {/* Pagination UI */}
              {!isLoading && filteredLogs.length > 0 && (
                <div className="flex items-center justify-between px-8 py-6 bg-white border-t border-neutral-100">
                   <p className="text-sm text-neutral-500 font-poppins">Menampilkan <strong>1 - {filteredLogs.length}</strong> dari <strong>128</strong> aktivitas</p>
                   <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-neutral-200" disabled>
                         <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-10 px-4 rounded-full border-neutral-200 bg-info-50 text-info-700 font-bold border-info-200">1</Button>
                      <Button variant="outline" size="sm" className="h-10 px-4 rounded-full border-neutral-200 font-bold">2</Button>
                      <Button variant="outline" size="sm" className="h-10 px-4 rounded-full border-neutral-200 font-bold">3</Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-neutral-200">
                         <ChevronRight className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
