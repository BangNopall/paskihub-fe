"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Montserrat } from "@/lib/fonts"
import Link from "next/link"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFormSchema, LoginFormData } from "@/schemas/auth.schema"

const Login = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })
      console.log(res)

      if (res?.error) {
        toast.error("Gagal Masuk", {
          description: "Email atau password salah.",
        })
      } else {
        toast.success("Berhasil", { description: "Anda berhasil masuk." })
        router.push("/") // Middleware will intercept and redirect appropriately
        router.refresh()
      }
    } catch (e: any) {
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
              Masuk ke PaskiHub
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

              <div className="w-full space-y-2 sm:space-y-1">
                <Label
                  htmlFor="password"
                  className="text-sm leading-5 sm:text-base"
                >
                  Password*
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    className={`h-10 pr-9 sm:h-11 ${errors.password ? "border-red-500" : ""}`}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible((prevState) => !prevState)}
                    className="absolute inset-y-0 right-0 h-10 w-10 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50 sm:h-11 sm:w-11"
                  >
                    {isVisible ? (
                      <EyeOffIcon className="size-4 sm:size-5" />
                    ) : (
                      <EyeIcon className="size-4 sm:size-5" />
                    )}
                    <span className="sr-only">
                      {isVisible ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center sm:gap-y-2 sm:pt-0">
                <div className="flex items-center gap-3">
                  <Checkbox id="rememberMe" className="size-5 sm:size-6" />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-muted-foreground sm:text-base"
                  >
                    {" "}
                    Ingat saya
                  </Label>
                </div>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm hover:underline sm:text-base"
                >
                  Lupa Password?
                </Link>
              </div>

              <Button
                disabled={isLoading}
                variant={"secondary"}
                className="mt-4 h-10 w-full text-sm sm:mt-6 sm:h-11 sm:text-base"
                type="submit"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground sm:mt-6 sm:text-base">
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-secondary hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
