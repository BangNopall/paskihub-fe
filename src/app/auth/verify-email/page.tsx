import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Montserrat } from "@/lib/fonts"
import { Icon } from "@iconify/react"
import Link from "next/link"

export default function VerifyEmail() {
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <Card className="z-1 w-full max-w-[90%] border-none bg-glassmorphism-50 p-6 shadow-md sm:max-w-md sm:p-10 md:max-w-xl md:p-16 lg:max-w-2xl">
        <CardHeader className="gap-4 sm:gap-6">
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6 rounded-full border border-primary-500 bg-primary-100 p-3 sm:p-4">
              <Icon
                icon="material-symbols:mail-outline"
                className="w-6 h-6 sm:w-8 sm:h-8 text-primary-700"
              />
            </div>
            <CardTitle
              className={`${Montserrat.className} mb-1.5 text-center text-2xl font-bold text-dark-blue sm:text-3xl lg:text-4xl`}
            >
              Hampir selesai!
            </CardTitle>
            <CardTitle
              className={`${Montserrat.className} mb-1.5 text-center text-xl sm:text-2xl lg:text-3xl font-bold text-dark-blue`}
            >
              Verifikasi email untuk memulai.
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="justify-center text-center px-1 sm:px-4 md:px-8">
            <span className="text-sm sm:text-base leading-5 sm:leading-6 font-normal text-muted-foreground">
              Kami telah mengirimkan email kepada kamu di{" "}
            </span>
            <span className="text-sm sm:text-base leading-5 sm:leading-6 font-bold text-muted-foreground">
              loremipsum@email.com
            </span>
            <span className="text-sm sm:text-base leading-5 sm:leading-6 font-normal text-muted-foreground">
              . Periksa dan ikuti instruksi untuk menyelesaikan proses
              pendaftaran.
            </span>
          </div>
          <Button
            variant={"secondary"}
            className="mt-6 sm:mt-8 h-10 w-full text-sm sm:h-11 sm:text-base"
            type="submit"
          >
            Kirim Ulang Email
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
