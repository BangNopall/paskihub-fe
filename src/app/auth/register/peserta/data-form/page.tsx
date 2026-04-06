"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Montserrat } from "@/lib/fonts"

const RegisterPesertaDataForm = () => {
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <Card className="z-1 w-full max-w-[90%] border-none bg-glassmorphism-50 p-6 shadow-md sm:max-w-md sm:p-10 md:max-w-xl md:p-16 lg:max-w-2xl">
        <CardHeader className="gap-4 sm:gap-6">
          <div>
            <CardTitle
              className={`${Montserrat.className} mb-1.5 text-center text-2xl font-bold text-dark-blue sm:text-3xl`}
            >
              Lengkapi Profil Kamu
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6 mt-2">
            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="instansiName"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Instansi/Sekolah
                </Label>
                <Input
                  type="text"
                  id="instansiName"
                  placeholder="Masukan nama instansi"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="address"
                  className="text-sm leading-5 sm:text-base"
                >
                  Alamat Instansi/Sekolah
                </Label>
                <Input
                  id="address"
                  type={"text"}
                  placeholder="Masukan alamat instansi/sekolah"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="address"
                  className="text-sm leading-5 sm:text-base"
                >
                  Tingkat
                </Label>
                <Select>
                  <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base px-3">
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
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="picName"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Penanggung Jawab
                </Label>
                <Input
                  id="picName"
                  type={"text"}
                  placeholder="Masukan nama penanggung jawab"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="picWhatsapp"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nomor Whatsapp Penanggung Jawab
                </Label>
                <Input
                  id="picWhatsapp"
                  type={"text"}
                  placeholder="Masukan nomor whatsapp penanggung jawab"
                  className="h-10 sm:h-11"
                />
              </div>
              <Button
                variant={"secondary"}
                className="mt-6 h-10 w-full text-sm sm:mt-8 sm:h-11 sm:text-base"
                type="submit"
              >
                Simpan
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPesertaDataForm
