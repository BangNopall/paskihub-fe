"use client"
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

const ForgotPassword = () => {
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <Card className="z-1 w-full border-none shadow-md max-w-[90%] sm:max-w-md md:max-w-xl lg:max-w-2xl p-6 sm:p-10 md:p-16 bg-glassmorphism-50">
        <CardHeader className="gap-4 sm:gap-6">
          <div>
            <CardTitle className={`${Montserrat.className} mb-1.5 text-2xl sm:text-3xl text-center font-bold text-dark-blue`}>
              Lupa Password
            </CardTitle>
          </div>
          <div>
            <CardDescription className="mb-1.5 text-center text-sm sm:text-base font-normal text-muted-foreground">
              Masukkan alamat email yang kamu gunakan untuk membuat akun, dan kami akan mengirimkan email berisi petunjuk untuk mengatur ulang kata sandi kamu.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* Login Form */}
          <div className="space-y-4">
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
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

              <Button variant={'secondary'} className="w-full h-10 sm:h-11 mt-4 sm:mt-6 text-sm sm:text-base" type="submit">
                Kirim Link Reset
              </Button>
            </form>

            <p className="text-center text-sm sm:text-base text-muted-foreground mt-4 sm:mt-6">
              Ingat Password?{" "}
              <Link href="/auth/login" className="text-secondary hover:underline font-medium">
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
