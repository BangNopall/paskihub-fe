"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfilePage() {
  // State untuk melacak apakah ada perubahan di form
  const [isInfoDasarChanged, setIsInfoDasarChanged] = useState(false)
  const [isSecurityChanged, setIsSecurityChanged] = useState(false)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8">
          <Card className="@container/card border-none bg-glassmorphism-50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-xl font-bold text-dark-blue">
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <InfoSection title="Info Dasar Instansi">
                <div className="flex flex-col gap-6">
                  {/* Field: Nama Instansi (Read Only) */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-neutral-600">
                      Nama Instansi/Sekolah
                    </Label>
                    <Input
                      id="instansi-name"
                      defaultValue="SMA Negeri 1 Jakarta"
                      className="h-12"
                      onChange={() => setIsInfoDasarChanged(true)}
                    />
                  </div>

                  {/* Field: Alamat (Read Only) */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-neutral-600">
                      Alamat Instansi/Sekolah
                    </Label>
                    <Input
                      id="instansi-address"
                      defaultValue="Jl. Sudirman No. 123, Jakarta"
                      className="h-12"
                      onChange={() => setIsInfoDasarChanged(true)}
                    />
                  </div>

                  {/* Field: Tingkat (Read Only) */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-neutral-600">
                      Tingkat
                    </Label>
                    <Select
                      defaultValue="sma"
                      onValueChange={() => setIsInfoDasarChanged(true)}
                    >
                      <SelectTrigger className="h-12 w-full px-3 text-sm">
                        <SelectValue placeholder="Pilih Tingkat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tingkat</SelectLabel>
                          <SelectItem value="sd">SD/MI</SelectItem>
                          <SelectItem value="smp">SMP/MTS</SelectItem>
                          <SelectItem value="sma">SMA/SMK/MA</SelectItem>
                          <SelectItem value="purna">PURNA</SelectItem>
                          <SelectItem value="umum">UMUM</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="my-2 h-px w-full bg-neutral-200" />

                  {/* Field: Nama Penanggung Jawab (Editable) */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="pic-name"
                      className="text-sm font-medium text-neutral-700"
                    >
                      Nama Penanggung Jawab
                    </Label>
                    <Input
                      id="pic-name"
                      defaultValue="Budi Santoso"
                      className="h-12"
                      onChange={() => setIsInfoDasarChanged(true)}
                    />
                  </div>

                  {/* Field: No Whatsapp (Editable) */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="pic-phone"
                      className="text-sm font-medium text-neutral-700"
                    >
                      No. Whatsapp Penanggung Jawab
                    </Label>
                    <Input
                      id="pic-phone"
                      defaultValue="+62 812-3456-7890"
                      className="h-12"
                      onChange={() => setIsInfoDasarChanged(true)}
                    />
                    <span className="text-xs text-neutral-400">
                      Format: +628xxxxxxxxxx
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="flex w-full justify-start">
                    <Button
                      disabled={!isInfoDasarChanged}
                      variant={'default'}
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              </InfoSection>
              <InfoSection title="Info Keamanan">
                <div className="flex flex-col gap-6">
                  {/* Field: Email (Disabled) */}
                  <div className="flex flex-col gap-2 opacity-60">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-neutral-700"
                    >
                      Email Terdaftar
                    </Label>
                    <Input
                      id="email"
                      value="peserta@example.com"
                      disabled
                      className="h-12"
                    />
                  </div>

                  <div className="h-px w-full bg-neutral-200" />

                  {/* Field: Password Lama */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="old-password"
                      className="text-sm font-medium text-neutral-700"
                    >
                      Password Lama (Untuk verifikasi)
                    </Label>
                    <Input
                      id="old-password"
                      type="password"
                      placeholder="Masukkan password lama"
                      className="h-12"
                      onChange={(e) =>
                        setIsSecurityChanged(e.target.value.length > 0)
                      }
                    />
                  </div>

                  {/* Field: Password Baru */}
                  <div className="mt-2 flex flex-col gap-2">
                    <Label
                      htmlFor="new-password"
                      className="text-sm font-medium text-neutral-700"
                    >
                      Password Baru
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Masukkan password baru"
                      className="h-12"
                      onChange={(e) =>
                        setIsSecurityChanged(e.target.value.length > 0)
                      }
                    />
                    <span className="text-xs text-neutral-400">
                      Minimal 8 karakter (kosongkan jika tidak ingin mengubah)
                    </span>
                  </div>

                  {/* Field: Konfirmasi Password */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-sm font-medium text-neutral-700"
                    >
                      Konfirmasi Password Baru
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Masukkan kembali password baru"
                      className="h-12"
                      onChange={(e) =>
                        setIsSecurityChanged(e.target.value.length > 0)
                      }
                    />
                    <span className="text-xs text-neutral-400">
                      Ketik ulang password untuk konfirmasi
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="flex w-full justify-start">
                    <Button
                      disabled={!isSecurityChanged}
                      variant={'destructive'}
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              </InfoSection>
            </CardContent>
          </Card>
        </div>
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
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-glassmorphism-50 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-dark-blue">{title}</h3>
      {children}
    </div>
  )
}
