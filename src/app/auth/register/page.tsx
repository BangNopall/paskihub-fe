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
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
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
      toast.error("Terjadi Kesalahan", {
        description: "Gagal terhubung ke server.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 space-y-4 sm:space-y-6">
      <form
        className="space-y-4 sm:space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Email */}
        <div className="space-y-2 sm:space-y-1">
          <Label
            className="text-sm leading-5 sm:text-base"
            htmlFor={`${role}Email`}
          >
            Alamat Email*
          </Label>
          <Input
            type="email"
            id={`${role}Email`}
            placeholder="Masukkan alamat email"
            className={`h-10 sm:h-11 ${errors.email ? "border-red-500" : ""}`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="w-full space-y-2 sm:space-y-1">
          <Label
            className="text-sm leading-5 sm:text-base"
            htmlFor={`${role}Password`}
          >
            Password*
          </Label>
          <div className="relative">
            <Input
              id={`${role}Password`}
              type={isPasswordVisible ? "text" : "password"}
              placeholder="••••••••••••••••"
              className={`h-10 pr-9 sm:h-11 ${errors.password ? "border-red-500" : ""}`}
              {...register("password")}
            />
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={() => setIsPasswordVisible((prevState) => !prevState)}
              className="absolute inset-y-0 right-0 h-10 w-10 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50 sm:h-11 sm:w-11"
            >
              {isPasswordVisible ? (
                <EyeOffIcon className="size-4 sm:size-5" />
              ) : (
                <EyeIcon className="size-4 sm:size-5" />
              )}
              <span className="sr-only">
                {isPasswordVisible ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="w-full space-y-2 sm:space-y-1">
          <Label
            className="text-sm leading-5 sm:text-base"
            htmlFor={`${role}ConfirmPassword`}
          >
            Konfirmasi Password*
          </Label>
          <div className="relative">
            <Input
              id={`${role}ConfirmPassword`}
              type={isConfirmPasswordVisible ? "text" : "password"}
              placeholder="••••••••••••••••"
              className={`h-10 pr-9 sm:h-11 ${errors.confirm_password ? "border-red-500" : ""}`}
              {...register("confirm_password")}
            />
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={() =>
                setIsConfirmPasswordVisible((prevState) => !prevState)
              }
              className="absolute inset-y-0 right-0 h-10 w-10 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50 sm:h-11 sm:w-11"
            >
              {isConfirmPasswordVisible ? (
                <EyeOffIcon className="size-4 sm:size-5" />
              ) : (
                <EyeIcon className="size-4 sm:size-5" />
              )}
              <span className="sr-only">
                {isConfirmPasswordVisible ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {errors.confirm_password && (
            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <Button
          disabled={isLoading}
          className="mt-4 h-10 w-full text-sm sm:mt-6 sm:h-11 sm:text-base"
          variant={"secondary"}
          type="submit"
        >
          {isLoading ? "Memproses..." : "Daftar"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground sm:mt-6 sm:text-base">
        Sudah punya akun?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-secondary hover:underline"
        >
          Masuk
        </Link>
      </p>
    </div>
  )
}

const tabs = [
  {
    name: "Peserta",
    value: "peserta", // UI value
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
      <Card className="z-1 w-full max-w-[90%] border-none bg-glassmorphism-50 p-6 shadow-md sm:max-w-md sm:p-10 md:max-w-xl md:p-16 lg:max-w-2xl">
        <CardHeader className="gap-4 sm:gap-6">
          <div>
            <CardTitle
              className={`${Montserrat.className} mb-1.5 text-center text-2xl font-bold text-dark-blue sm:text-3xl`}
            >
              Daftar ke PaskiHub
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mx-auto w-full">
            <Tabs defaultValue="peserta" className="w-full gap-4">
              <TabsList className="h-auto w-full rounded-full p-1 py-1 sm:py-1.5">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="px-3 py-1.5 text-sm sm:px-6 sm:py-2 sm:text-base"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContents className="mx-1 -mt-2 mb-1 h-full rounded-sm">
                {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    <div className="text-sm text-foreground sm:text-base">
                      {tab.content()}
                    </div>
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
