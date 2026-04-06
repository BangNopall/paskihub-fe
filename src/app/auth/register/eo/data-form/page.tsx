"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Montserrat } from "@/lib/fonts"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const RegisterEODataForm = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <Card className="z-1 w-full max-w-[90%] border-none bg-glassmorphism-50 p-6 shadow-md sm:max-w-md sm:p-10 md:max-w-xl md:p-16 lg:max-w-2xl">
        <CardHeader className="gap-4 sm:gap-6">
          <div>
            <CardTitle
              className={`${Montserrat.className} mb-1.5 text-center text-2xl font-bold text-dark-blue sm:text-3xl`}
            >
              Buat Event Kamu
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6 mt-2">
            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="eventName"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Event
                </Label>
                <Input
                  type="text"
                  id="eventName"
                  placeholder="Masukan nama event"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Field className="w-full">
                  <FieldLabel htmlFor="date-picker-range" className="text-sm leading-5 sm:text-base">
                    Tanggal Pendaftaran Dibuka hingga Ditutup
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker-range"
                        className="w-full h-10 sm:h-11 justify-start px-3 font-normal text-sm sm:text-base"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
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
                  htmlFor="schoolName"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Sekolah/Instansi/Penyelenggara
                </Label>
                <Input
                  id="schoolName"
                  type={"text"}
                  placeholder="Masukan nama sekolah/instansi/penyelenggara"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="location"
                  className="text-sm leading-5 sm:text-base"
                >
                  Lokasi
                </Label>
                <Input
                  id="location"
                  type={"text"}
                  placeholder="Masukan lokasi"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="picName"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Lengkap Penanggung Jawab
                </Label>
                <Input
                  id="picName"
                  type={"text"}
                  placeholder="Masukan nama lengkap penanggung jawab"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="whatsapp"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nomor Whatsapp Penanggung Jawab
                </Label>
                <Input
                  id="whatsapp"
                  type={"text"}
                  placeholder="Masukan nomor whatsapp penanggung jawab"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="bankName"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Bank
                </Label>
                <Input
                  id="bankName"
                  type={"text"}
                  placeholder="Masukan nama bank"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="bankNumber"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nomor Rekening Bank
                </Label>
                <Input
                  id="bankNumber"
                  type={"text"}
                  placeholder="Masukan nomor rekening bank"
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

export default RegisterEODataForm
