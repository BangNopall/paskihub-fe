"use client"

import React from "react"
import { 
  History, 
  Search, 
  Filter, 
  User, 
  ShieldAlert, 
  CreditCard, 
  Megaphone,
  ArrowRight
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Montserrat, Poppins } from "@/lib/fonts"

const MOCK_LOGS = [
  { id: "L1", admin: "Super Admin", action: "Approve Top-up", target: "TX-9902 (Paskibra Kota Bandung)", type: "Transaction", date: "27 Apr 2026", time: "14:30:12" },
  { id: "L2", admin: "Super Admin", action: "Sent Broadcast", target: "Maintenance Sistem", type: "Broadcast", date: "27 Apr 2026", time: "14:25:05" },
  { id: "L3", admin: "System", action: "Auto-debit Koin", target: "Approval Tim: Elang Jaya", type: "System", date: "27 Apr 2026", time: "14:10:00" },
  { id: "L4", admin: "Super Admin", action: "Banned User", target: "Paski Creative Studio", type: "Security", date: "26 Apr 2026", time: "09:15:33" },
  { id: "L5", admin: "Super Admin", action: "Verified EO", target: "SMA 1 Jakarta", type: "User", date: "26 Apr 2026", time: "08:00:10" },
]

export default function AuditLogsPage() {
  return (
    <div className={`flex flex-1 flex-col p-4 md:p-6 lg:p-8 ${Poppins.className}`}>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className={`text-2xl font-bold text-slate-900 ${Montserrat.className}`}>Audit Logs</h1>
            <p className="text-sm text-neutral-500">Jejak aktivitas administratif dan perubahan sistem yang terjadi.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-neutral-200">
            Export Logs (CSV)
          </Button>
        </div>

        <Card className="border-neutral-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-neutral-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input 
                  placeholder="Cari tindakan, admin, atau target..." 
                  className="pl-10 rounded-xl border-neutral-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-neutral-500">
                  <Filter className="mr-2 h-4 w-4" /> Semua Tipe
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-neutral-50/50">
                <TableRow>
                  <TableHead className="pl-6 w-[180px]">Waktu</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Tindakan</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="text-right pr-6">Tipe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LOGS.map((log) => (
                  <TableRow key={log.id} className="hover:bg-neutral-50/50 transition-colors border-b border-neutral-50">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-800">{log.date}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{log.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-neutral-700">{log.admin}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-600">{log.action}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <ArrowRight className="h-3 w-3 text-neutral-300" />
                        <span className="truncate max-w-[200px]">{log.target}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <LogTypeBadge type={log.type} />
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

function LogTypeBadge({ type }: { type: string }) {
  switch (type) {
    case 'Transaction':
      return <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"><CreditCard className="h-3 w-3"/> Finance</div>
    case 'Security':
      return <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100"><ShieldAlert className="h-3 w-3"/> Security</div>
    case 'Broadcast':
      return <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"><Megaphone className="h-3 w-3"/> Info</div>
    default:
      return <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-100">{type}</div>
  }
}
