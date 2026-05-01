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
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { pesertaDataFormSchema, PesertaDataFormData } from "@/schemas/profile.schema"
import { updatePesertaProfileAction } from "@/actions/profile.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const RegisterPesertaDataForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, control, formState: { errors } } = useForm<PesertaDataFormData>({
    resolver: zodResolver(pesertaDataFormSchema),
  })

  const onSubmit = async (data: PesertaDataFormData) => {
    setIsLoading(true)
    try {
      const res = await updatePesertaProfileAction(data)
      if (res.success) {
        toast.success("Berhasil", { description: res.message })
        router.push("/peserta/dashboard")
      } else {
        toast.error("Gagal", { description: res.message })
      }
    } catch {
      toast.error("Terjadi Kesalahan", { description: "Gagal memproses formulir." })
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
              Lengkapi Profil Kamu
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6 mt-2">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="name"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Instansi/Sekolah
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Masukan nama instansi"
                  className={`h-10 sm:h-11 ${errors.name ? "border-red-500" : ""}`}
                  {...register("name")}
                />
                {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name.message}</p>}
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
                  type="text"
                  placeholder="Masukan alamat instansi/sekolah"
                  className={`h-10 sm:h-11 ${errors.address ? "border-red-500" : ""}`}
                  {...register("address")}
                />
                {errors.address && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address.message}</p>}
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="institution_type"
                  className="text-sm leading-5 sm:text-base"
                >
                  Tingkat
                </Label>
                <Controller
                  name="institution_type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={`w-full h-10 sm:h-11 text-sm sm:text-base px-3 ${errors.institution_type ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Pilih Tingkat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tingkat</SelectLabel>
                          <SelectItem value="SD">SD/MI</SelectItem>
                          <SelectItem value="SMP">SMP/MTS</SelectItem>
                          <SelectItem value="SMA">SMA/SMK/MA</SelectItem>
                          <SelectItem value="PURNA">PURNA</SelectItem>
                          <SelectItem value="UMUM">UMUM</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.institution_type && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.institution_type.message}</p>}
              </div>
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="name_pj"
                  className="text-sm leading-5 sm:text-base"
                >
                  Nama Penanggung Jawab
                </Label>
                <Input
                  id="name_pj"
                  type="text"
                  placeholder="Masukan nama penanggung jawab"
                  className={`h-10 sm:h-11 ${errors.name_pj ? "border-red-500" : ""}`}
                  {...register("name_pj")}
                />
                {errors.name_pj && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name_pj.message}</p>}
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
                {errors.no_wa_pj && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.no_wa_pj.message}</p>}
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

export default RegisterPesertaDataForm