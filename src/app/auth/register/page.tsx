"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/ui/motion-tabs"
import Link from "next/link"
import { Montserrat } from "@/lib/fonts"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerFormSchema, RegisterFormData } from "@/schemas/auth.schema"
import { registerAction } from "@/actions/auth.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const RegisterForm = ({ role }: { role: "PESERTA" | "ORGANIZER" }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const res = await registerAction(role, data)
      if (res.success) {
        toast.success("Registrasi Berhasil", { description: res.message })
        router.push("/auth/verify-email")
      } else {
        toast.error("Registrasi Gagal", { description: res.message })
      }
    } catch {
      toast.error("Terjadi Kesalahan", { description: "Gagal terhubung ke server." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 mt-4">
      <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="space-y-2 sm:space-y-1">
          <Label className="leading-5 text-sm sm:text-base" htmlFor={`${role}Email`}>
            Alamat Email*
          </Label>
          <Input
            type="email"
            id={`${role}Email`}
            placeholder="Masukkan alamat email"
            className={`h-10 sm:h-11 ${errors.email ? "border-red-500" : ""}`}
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="w-full space-y-2 sm:space-y-1">
          <Label className="leading-5 text-sm sm:text-base" htmlFor={`${role}Password`}>
            Password*
          </Label>
          <div className="relative">
            <Input
              id={`${role}Password`}
              type={isPasswordVisible ? "text" : "password"}
              placeholder="••••••••••••••••"
              className={`pr-9 h-10 sm:h-11 ${errors.password ? "border-red-500" : ""}`}
              {...register("password")}
            />
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={() => setIsPasswordVisible((prevState) => !prevState)}
              className="absolute inset-y-0 right-0 h-10 sm:h-11 w-10 sm:w-11 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50"
            >
              {isPasswordVisible ? <EyeOffIcon className="size-4 sm:size-5" /> : <EyeIcon className="size-4 sm:size-5" />}
              <span className="sr-only">
                {isPasswordVisible ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="w-full space-y-2 sm:space-y-1">
          <Label className="leading-5 text-sm sm:text-base" htmlFor={`${role}ConfirmPassword`}>
            Konfirmasi Password*
          </Label>
          <div className="relative">
            <Input
              id={`${role}ConfirmPassword`}
              type={isConfirmPasswordVisible ? "text" : "password"}
              placeholder="••••••••••••••••"
              className={`pr-9 h-10 sm:h-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
              {...register("confirmPassword")}
            />
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={() =>
                setIsConfirmPasswordVisible((prevState) => !prevState)
              }
              className="absolute inset-y-0 right-0 h-10 sm:h-11 w-10 sm:w-11 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50"
            >
              {isConfirmPasswordVisible ? <EyeOffIcon className="size-4 sm:size-5" /> : <EyeIcon className="size-4 sm:size-5" />}
              <span className="sr-only">
                {isConfirmPasswordVisible
                  ? "Hide password"
                  : "Show password"}
              </span>
            </Button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button disabled={isLoading} className="w-full h-10 sm:h-11 mt-4 sm:mt-6 text-sm sm:text-base" variant={"secondary"} type="submit">
          {isLoading ? "Memproses..." : "Daftar"}
        </Button>
      </form>

      <p className="text-center text-sm sm:text-base text-muted-foreground mt-4 sm:mt-6">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="text-secondary hover:underline font-medium">
          Masuk
        </Link>
      </p>
    </div>
  )
}

const tabs = [
  {
    name: "Peserta",
    value: "peserta",
    content: () => <RegisterForm role="PESERTA" />,
  },
  {
    name: "Event Organizer",
    value: "organizer",
    content: () => <RegisterForm role="ORGANIZER" />,
  },
]

const Register = () => {
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <Card className="z-1 w-full border-none shadow-md max-w-[90%] sm:max-w-md md:max-w-xl lg:max-w-2xl p-6 sm:p-10 md:p-16 bg-glassmorphism-50">
        <CardHeader className="gap-4 sm:gap-6">
          <div>
            <CardTitle className={`${Montserrat.className} mb-1.5 text-2xl sm:text-3xl text-center font-bold text-dark-blue`}>
              Daftar ke PaskiHub
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full mx-auto">
            <Tabs defaultValue="peserta" className="w-full gap-4">
              <TabsList className="w-full rounded-full h-auto p-1 py-1 sm:py-1.5">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-sm sm:text-base px-3 sm:px-6 py-1.5 sm:py-2">
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContents className="mx-1 -mt-2 mb-1 h-full rounded-sm">
                {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    <div className="text-sm sm:text-base text-foreground">{tab.content()}</div>
                  </TabsContent>
                ))}
              </TabsContents>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
