"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Montserrat } from "@/lib/fonts"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/schemas/auth.schema"
import { forgotPasswordAction } from "@/actions/auth.actions"
import { toast } from "sonner"

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const res = await forgotPasswordAction(data)
      if (res.success) {
        toast.success("Berhasil", { description: res.message })
      } else {
        toast.error("Gagal", { description: res.message })
      }
    } catch {
      toast.error("Terjadi Kesalahan", {
        description: "Gagal terhubung ke server.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <Card className="z-10 w-full max-w-[90%] border-none bg-glassmorphism-50 p-6 shadow-md sm:max-w-md sm:p-10 md:max-w-xl md:p-16 lg:max-w-2xl">
        <CardHeader className="gap-4 sm:gap-6">
          <div>
            <CardTitle
              className={`${Montserrat.className} mb-1.5 text-center text-2xl font-bold text-dark-blue sm:text-3xl`}
            >
              Lupa Password
            </CardTitle>
          </div>
          <div>
            <CardDescription className="mb-1.5 text-center text-sm font-normal text-muted-foreground sm:text-base">
              Masukkan alamat email yang kamu gunakan untuk membuat akun, dan
              kami akan mengirimkan email berisi petunjuk untuk mengatur ulang
              kata sandi kamu.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="space-y-2 sm:space-y-1">
                <Label
                  htmlFor="userEmail"
                  className="text-sm leading-5 sm:text-base"
                >
                  Alamat Email*
                </Label>
                <Input
                  type="email"
                  id="userEmail"
                  placeholder="Masukan email Anda"
                  className={`h-10 sm:h-11 ${errors.email ? "border-red-500" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isLoading}
                variant={"secondary"}
                className="mt-4 h-10 w-full text-sm sm:mt-6 sm:h-11 sm:text-base"
                type="submit"
              >
                {isLoading ? "Memproses..." : "Kirim Link Reset"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground sm:mt-6 sm:text-base">
              Ingat Password?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-secondary hover:underline"
              >
                Masuk
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword
