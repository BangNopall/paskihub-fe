"use client"

import React, { useState } from "react"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  UserMinus,
  Mail,
  ExternalLink
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Montserrat, Poppins } from "@/lib/fonts"

const MOCK_USERS = [
  { id: "U1", name: "SMA Negeri 1 Jakarta", email: "paskibra@sman1jkt.sch.id", role: "EO", status: "Active", verified: true, joined: "12 Jan 2026" },
  { id: "U2", name: "Budi Santoso", email: "budi.coach@gmail.com", role: "Peserta", status: "Active", verified: true, joined: "15 Jan 2026" },
  { id: "U3", name: "Event Nusantara Corp", email: "admin@eventnusantara.id", role: "EO", status: "Pending", verified: false, joined: "20 Apr 2026" },
  { id: "U4", name: "Paski Creative Studio", email: "hello@paskicreative.id", role: "EO", status: "Banned", verified: true, joined: "05 Feb 2026" },
  { id: "U5", name: "Siti Aminah", email: "siti.paski@yahoo.com", role: "Peserta", status: "Active", verified: true, joined: "01 Mar 2026" },
]

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`flex flex-1 flex-col p-4 md:p-6 lg:p-8 ${Poppins.className}`}>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className={`text-2xl font-bold text-slate-900 ${Montserrat.className}`}>Manajemen User</h1>
            <p className="text-sm text-neutral-500">Kelola akses dan verifikasi akun Event Organizer serta Peserta.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-lg">
              <Mail className="mr-2 h-4 w-4" /> Blast Email
            </Button>
          </div>
        </div>

        <Card className="border-neutral-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input 
                  placeholder="Cari nama atau email..." 
                  className="pl-10 rounded-xl border-neutral-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-neutral-500">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4 bg-neutral-100 p-1">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="eo">Event Organizer</TabsTrigger>
                <TabsTrigger value="peserta">Peserta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="rounded-xl border border-neutral-100 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-neutral-50/50">
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Terdaftar</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-800 flex items-center gap-2">
                                {user.name}
                                {user.verified && <CheckCircle className="h-3 w-3 text-blue-500" fill="currentColor" />}
                              </span>
                              <span className="text-xs text-neutral-500">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={user.role === 'EO' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-neutral-200 text-neutral-600'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={user.status} />
                          </TableCell>
                          <TableCell className="text-sm text-neutral-500">
                            {user.joined}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                <DropdownMenuLabel>Aksi User</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer">
                                  <ExternalLink className="mr-2 h-4 w-4" /> Detail Profil
                                </DropdownMenuItem>
                                {user.status === 'Pending' && (
                                  <DropdownMenuItem className="cursor-pointer text-blue-600 focus:text-blue-600">
                                    <UserCheck className="mr-2 h-4 w-4" /> Verifikasi EO
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {user.status === 'Banned' ? (
                                  <DropdownMenuItem className="cursor-pointer text-emerald-600 focus:text-emerald-600">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Aktifkan Kembali
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                    <UserMinus className="mr-2 h-4 w-4" /> Nonaktifkan / Ban
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Active':
      return <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-none px-3">Aktif</Badge>
    case 'Pending':
      return <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100 border-none px-3">Pending</Badge>
    case 'Banned':
      return <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none px-3">Banned</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
