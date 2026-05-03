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
import { useState, useEffect } from "react"
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
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { eoDataFormSchema, EODataFormData } from "@/schemas/profile.schema"
import { createEventAction } from "@/actions/profile.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const RegisterEODataForm = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [openTime, setOpenTime] = useState("00:00")
  const [closeTime, setCloseTime] = useState("23:59")

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EODataFormData>({
    resolver: zodResolver(eoDataFormSchema),
    defaultValues: {
      open_date: `${format(new Date(), "yyyy-MM-dd")} 00:00:00`,
      close_date: `${format(addDays(new Date(), 30), "yyyy-MM-dd")} 23:59:00`,
    },
  })

  useEffect(() => {
    if (date?.from) {
      setValue("open_date", `${format(date.from, "yyyy-MM-dd")} ${openTime}:00`)
    }
    if (date?.to) {
      setValue("close_date", `${format(date.to, "yyyy-MM-dd")} ${closeTime}:00`)
    }
  }, [date, openTime, closeTime, setValue])

  const onSubmit = async (data: EODataFormData) => {
    setIsLoading(true)
    try {
      const res = await createEventAction(data)
      if (res.success) {
        toast.success("Berhasil", { description: res.message })
        router.push("/organizer/dashboard")
      } else {
        toast.error("Gagal", { description: res.message })
      }
    } catch {
      toast.error("Terjadi Kesalahan", {
        description: "Gagal memproses formulir.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <Card className="z-10 w-full max-w-[90%] border-none bg-glassmorphism-50 p-6 shadow-md sm:max-w-md sm:p-10 md:max-w-xl md:p-16 lg:max-w-2xl">
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
          <div className="mt-2 space-y-4 sm:space-y-6">
            <form
              className="space-y-4 sm:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="name"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Event
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Masukan nama event"
                  className={`h-10 sm:h-11 ${errors.name ? "border-red-500" : ""}`}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-1">
                <Field className="w-full">
                  <FieldLabel
                    htmlFor="date-picker-range"
                    className="text-sm leading-5 sm:text-base"
                  >
                    Tanggal Pendaftaran Dibuka hingga Ditutup
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker-range"
                        className="h-10 w-full justify-start px-3 text-sm font-normal sm:h-11 sm:text-base"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} {openTime} -{" "}
                              {format(date.to, "LLL dd, y")} {closeTime}
                            </>
                          ) : (
                            `${format(date.from, "LLL dd, y")} ${openTime}`
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
                      <div className="flex items-center gap-4 border-t border-border bg-muted/30 p-3">
                        <div className="flex flex-1 flex-col">
                          <Label className="mb-1.5 text-xs text-muted-foreground">
                            Waktu Buka
                          </Label>
                          <Input
                            type="time"
                            value={openTime}
                            onChange={(e) => setOpenTime(e.target.value)}
                            className="h-8 text-xs font-medium"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <Label className="mb-1.5 text-xs text-muted-foreground">
                            Waktu Tutup
                          </Label>
                          <Input
                            type="time"
                            value={closeTime}
                            onChange={(e) => setCloseTime(e.target.value)}
                            className="h-8 text-xs font-medium"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Field>
              </div>

              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="organizer"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Sekolah/Instansi/Penyelenggara
                </Label>
                <Input
                  id="organizer"
                  type="text"
                  placeholder="Masukan nama sekolah/instansi/penyelenggara"
                  className={`h-10 sm:h-11 ${errors.organizer ? "border-red-500" : ""}`}
                  {...register("organizer")}
                />
                {errors.organizer && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.organizer.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="location"
                  className="text-sm leading-5 sm:text-base"
                >
                  Lokasi Kota
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Masukan lokasi nama kota"
                  className={`h-10 sm:h-11 ${errors.location ? "border-red-500" : ""}`}
                  {...register("location")}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Note: I'm mapping address the same as location here based on schema, but they could be split in UI if needed. Adding address. */}
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="address"
                  className="text-sm leading-5 sm:text-base"
                >
                  Alamat
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Masukan alamat"
                  className={`h-10 sm:h-11 ${errors.address ? "border-red-500" : ""}`}
                  {...register("address")}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="nama_pj"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Lengkap Penanggung Jawab
                </Label>
                <Input
                  id="nama_pj"
                  type="text"
                  placeholder="Masukan nama lengkap penanggung jawab"
                  className={`h-10 sm:h-11 ${errors.nama_pj ? "border-red-500" : ""}`}
                  {...register("nama_pj")}
                />
                {errors.nama_pj && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.nama_pj.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="no_wa_pj"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nomor Whatsapp Penanggung Jawab
                </Label>
                <Input
                  id="no_wa_pj"
                  type="text"
                  placeholder="Masukan nomor whatsapp penanggung jawab"
                  className={`h-10 sm:h-11 ${errors.no_wa_pj ? "border-red-500" : ""}`}
                  {...register("no_wa_pj")}
                />
                {errors.no_wa_pj && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.no_wa_pj.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="bank_name"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Bank
                </Label>
                <Input
                  id="bank_name"
                  type="text"
                  placeholder="Masukan nama bank"
                  className={`h-10 sm:h-11 ${errors.bank_name ? "border-red-500" : ""}`}
                  {...register("bank_name")}
                />
                {errors.bank_name && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.bank_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="bank_number"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nomor Rekening Bank
                </Label>
                <Input
                  id="bank_number"
                  type="text"
                  placeholder="Masukan nomor rekening bank"
                  className={`h-10 sm:h-11 ${errors.bank_number ? "border-red-500" : ""}`}
                  {...register("bank_number")}
                />
                {errors.bank_number && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.bank_number.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isLoading}
                variant={"secondary"}
                className="mt-6 h-10 w-full text-sm sm:mt-8 sm:h-11 sm:text-base"
                type="submit"
              >
                {isLoading ? "Memproses..." : "Simpan"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterEODataForm
