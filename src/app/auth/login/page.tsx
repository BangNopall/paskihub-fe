"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Montserrat } from "@/lib/fonts"
import Link from "next/link"

const Login = () => {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <Card className="z-1 w-full border-none shadow-md max-w-[90%] sm:max-w-md md:max-w-xl lg:max-w-2xl p-6 sm:p-10 md:p-16 bg-glassmorphism-50">
        <CardHeader className="gap-4 sm:gap-6">
          <div>
            <CardTitle className={`${Montserrat.className} mb-1.5 text-2xl sm:text-3xl text-center font-bold text-dark-blue`}>
              Masuk ke PaskiHub
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Login Form */}
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Email */}
              <div className="space-y-2 sm:space-y-1">
                <Label htmlFor="userEmail" className="leading-5 text-sm sm:text-base">
                  Alamat Email*
                </Label>
                <Input
                  type="email"
                  id="userEmail"
                  placeholder="Masukan email Anda"
                  className="h-10 sm:h-11"
                />
              </div>

              {/* Password */}
              <div className="w-full space-y-2 sm:space-y-1">
                <Label htmlFor="password" className="leading-5 text-sm sm:text-base">
                  Password*
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    className="pr-9 h-10 sm:h-11"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible((prevState) => !prevState)}
                    className="absolute inset-y-0 right-0 h-10 sm:h-11 w-10 sm:w-11 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50"
                  >
                    {isVisible ? <EyeOffIcon className="size-4 sm:size-5" /> : <EyeIcon className="size-4 sm:size-5" />}
                    <span className="sr-only">
                      {isVisible ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-y-2 pt-2 sm:pt-0">
                <div className="flex items-center gap-3">
                  <Checkbox id="rememberMe" className="size-5 sm:size-6" />
                  <Label htmlFor="rememberMe" className="text-sm sm:text-base text-muted-foreground">
                    {" "}
                    Ingat saya
                  </Label>
                </div>

                <Link href="/auth/forgot-password" className="text-sm sm:text-base hover:underline">
                  Lupa Password?
                </Link>
              </div>

              <Button variant={'secondary'} className="w-full h-10 sm:h-11 mt-4 sm:mt-6 text-sm sm:text-base" type="submit">
                Masuk
              </Button>
            </form>

            <p className="text-center text-sm sm:text-base text-muted-foreground mt-4 sm:mt-6">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-secondary hover:underline font-medium">
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
