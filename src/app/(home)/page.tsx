import { Montserrat } from "@/lib/fonts"
import Image from "next/image"
import about1Img from "../../../public/home/about1.jpg"
import about2Img from "../../../public/home/about2.jpg"
import home1img from "../../../public/home/home1.jpg"
import home2img from "../../../public/home/home2.jpg"
import home3img from "../../../public/home/home3.jpg"
import dashboardImg from "../../../public/home/dashboard.jpg"
import commentCursorImg from "../../../public/home/comment-cursor.png"
import commentCursor2Img from "../../../public/home/comment-cursor2.png"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icon } from "@iconify/react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto overflow-x-hidden px-6 sm:px-10 lg:px-12">
      {/* Hero Section */}
      <section className="my-20 mt-32 flex h-full w-full flex-col items-center justify-center space-y-12 md:my-20 md:space-y-20">
        <div className="flex max-w-4xl flex-col gap-4 text-center md:gap-5">
          <div
            className={`text-5xl text-dark-blue sm:text-7xl lg:text-8xl ${Montserrat.className} leading-tight font-bold`}
          >
            PaskiHub
          </div>
          <div className="px-4 text-sm text-neutral-500 sm:text-base md:px-0">
            Kelola dan ikuti lomba Paskibra dalam satu platform untuk membuat
            seluruh proses lebih mudah
          </div>
        </div>
        <div className="relative h-70 w-full overflow-visible rounded-3xl bg-primary-200 p-3 sm:h-100 md:w-[90%] md:rounded-4xl md:p-5 lg:h-125 lg:w-[80%]">
          <Image
            src={dashboardImg}
            alt="Home"
            width={1000}
            height={1000}
            className="h-full w-full rounded-2xl object-cover object-top-left shadow-lg md:rounded-4xl"
          />
          <div className="absolute -right-10 bottom-10 hidden w-32 transition-transform hover:scale-105 sm:block md:-right-20 md:bottom-20 md:w-50">
            <Image
              src={commentCursorImg}
              alt="Comment Cursor"
              width={500}
              height={500}
              className="h-auto w-full object-contain"
            />
          </div>
          <div className="absolute top-10 -left-8 hidden w-24 transition-transform hover:scale-105 sm:block md:top-30 md:-left-18 md:w-35">
            <Image
              src={commentCursor2Img}
              alt="Comment Cursor 2"
              width={500}
              height={500}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="my-16 flex h-full w-full flex-col space-y-12 md:my-32 md:space-y-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-center">
          <div
            className={`text-2xl text-dark-blue sm:text-3xl ${Montserrat.className} font-bold`}
          >
            Tentang Kami
          </div>
          <div className="px-2 text-sm leading-relaxed text-neutral-400 sm:text-base">
            PaskiHub adalah platform digital yang membantu{" "}
            <span className="italic">Event Organizer</span> dan peserta
            mengelola serta mengikuti lomba Paskibra dengan proses yang lebih
            terpusat, tertib, dan transparan.
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch lg:gap-10">
          <div className="group w-full max-w-md **:transition-all **:duration-300 **:ease-in-out md:w-1/2">
            <div className="flex h-full flex-col gap-4 rounded-4xl bg-primary-100 p-4 shadow-sm group-hover:bg-secondary-500 group-active:bg-secondary-500">
              <div className="relative aspect-video w-full md:aspect-auto">
                <div className="absolute z-10 h-full w-full rounded-3xl bg-primary-100 opacity-40 group-hover:opacity-0"></div>
                <Image
                  src={about1Img}
                  alt="About"
                  width={1000}
                  height={1000}
                  className="h-full w-full rounded-3xl object-cover object-top"
                />
              </div>
              <div className="w-full grow space-y-2 rounded-3xl bg-white p-6 drop-shadow-sm md:p-8">
                <div className="text-lg font-semibold text-primary-400 group-hover:text-neutral-600 md:text-xl">
                  Event Organizer
                </div>
                <hr className="text-primary-100 group-hover:border-neutral-100" />
                <div className="text-xs leading-relaxed text-primary-400 group-hover:text-neutral-500 md:text-sm">
                  Sebagai pengelola lomba, Event Organizer dapat membuat dan
                  mengatur event, mengelola pendaftaran tim, menginput dan
                  merekap nilai, hingga mempublikasikan hasil lomba dalam satu
                  sistem terintegrasi.
                </div>
              </div>
            </div>
          </div>
          <div className="group w-full max-w-md **:transition-all **:duration-300 **:ease-in-out md:w-1/2">
            <div className="flex h-full flex-col gap-4 rounded-4xl bg-primary-100 p-4 shadow-sm group-hover:bg-secondary-500 group-active:bg-secondary-500">
              <div className="relative aspect-video w-full md:aspect-auto">
                <div className="absolute z-10 h-full w-full rounded-3xl bg-primary-100 opacity-40 group-hover:opacity-0"></div>
                <Image
                  src={about2Img}
                  alt="About"
                  width={1000}
                  height={1000}
                  className="h-full w-full rounded-3xl object-cover object-top"
                />
              </div>
              <div className="w-full grow space-y-2 rounded-3xl bg-white p-6 drop-shadow-sm md:p-8">
                <div className="text-lg font-semibold text-primary-400 group-hover:text-neutral-600 md:text-xl">
                  Peserta
                </div>
                <hr className="text-primary-100 group-hover:border-neutral-100" />
                <div className="text-xs leading-relaxed text-primary-400 group-hover:text-neutral-500 md:text-sm">
                  Sebagai peserta lomba, kalian dapat mendaftarkan tim, memantau
                  status pendaftaran, melihat rekap nilai, serta mengetahui
                  hasil akhir lomba secara transparan melalui dashboard.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto grid w-full grid-cols-2 gap-4 rounded-3xl bg-primary-200 p-4 text-neutral-500 md:w-[90%] md:gap-6 md:rounded-4xl md:p-6 lg:w-[80%] lg:grid-cols-4">
          <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 text-center shadow-sm transition-shadow hover:shadow-md md:py-8">
            <div className="text-2xl font-bold text-neutral-600 md:text-3xl lg:text-4xl">
              0
            </div>
            <div className="text-xs font-medium tracking-wide text-neutral-400 uppercase md:text-sm">
              Jumlah event
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 text-center shadow-sm transition-shadow hover:shadow-md md:py-8">
            <div className="text-2xl font-bold text-neutral-600 md:text-3xl lg:text-4xl">
              0
            </div>
            <div className="text-xs font-medium tracking-wide text-neutral-400 uppercase md:text-sm">
              Event Organizer
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 text-center shadow-sm transition-shadow hover:shadow-md md:py-8">
            <div className="text-2xl font-bold text-neutral-600 md:text-3xl lg:text-4xl">
              0
            </div>
            <div className="text-xs font-medium tracking-wide text-neutral-400 uppercase md:text-sm">
              Peserta
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 text-center shadow-sm transition-shadow hover:shadow-md md:py-8">
            <div className="text-2xl font-bold text-neutral-600 md:text-3xl lg:text-4xl">
              0
            </div>
            <div className="text-xs font-medium tracking-wide text-neutral-400 uppercase md:text-sm">
              Tim
            </div>
          </div>
        </div>
      </section>

      {/* Mengapa PaskiHub Section */}
      <section className="my-20 flex h-full w-full flex-col space-y-16 md:my-32 md:space-y-24">
        <div className="text-center">
          <div
            className={`text-2xl text-dark-blue sm:text-3xl md:text-4xl ${Montserrat.className} font-bold`}
          >
            Mengapa harus PaskiHub?
          </div>
        </div>

        <div className="relative mx-auto flex w-full flex-col gap-20 md:w-[90%] md:gap-32 lg:w-[80%]">
          {/* Item 1 */}
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:gap-20">
            <div className="flex w-full flex-col gap-4 md:w-[50%] md:gap-6">
              <h3 className="text-2xl leading-snug font-bold text-neutral-600 sm:text-3xl md:text-4xl">
                Kelola seluruh proses lomba dalam satu{" "}
                <span className="inline-block rounded-lg bg-secondary-500 px-3 py-1 whitespace-nowrap text-white md:mt-1">
                  platform
                </span>{" "}
                <span className="inline-block rounded-lg bg-secondary-500 px-3 py-1 whitespace-nowrap text-white md:mt-1">
                  terpusat
                </span>
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400 md:text-base">
                Semua proses lomba Paskibra dari pendaftaran tim hingga
                pengumuman hasil dikelola rapi dalam satu platform.
              </p>
            </div>
            <div className="flex w-full justify-center md:w-[45%] md:justify-end">
              <div className="relative flex h-72 w-72 transform items-end justify-center overflow-hidden rounded-[40px] bg-primary-200 shadow-sm transition-transform hover:scale-[1.02] sm:h-80 sm:w-80 md:h-92.75 md:w-92.75">
                {/* iPhone Mockup */}
                <div className="absolute -bottom-4 flex h-[85%] w-[65%] justify-center overflow-hidden rounded-t-[40px] border-8 border-gray-900 bg-gray-900 shadow-xl md:border-10">
                  <div className="relative h-full w-full overflow-hidden rounded-t-[25px] bg-primary-50 md:rounded-t-[30px]">
                    <Image
                      src={home1img}
                      alt="why-paskihub"
                      width={1000}
                      height={1000}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row-reverse md:gap-20">
            <div className="flex w-full flex-col gap-4 md:w-[50%] md:items-end md:gap-6 md:text-right">
              <h3 className="space-y-2 text-2xl leading-snug font-bold text-neutral-600 sm:text-3xl md:text-4xl">
                <span>Pendaftaran tim digital yang</span>{" "}
                <span className="inline-block rounded-lg bg-secondary-500 px-3 py-1 text-white md:mt-1">
                  lebih rapi dan praktis
                </span>
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400 md:text-right md:text-base">
                Peserta mendaftarkan tim secara online tanpa formulir manual,
                memudahkan panitia dan mempercepat administrasi.
              </p>
            </div>
            <div className="flex w-full justify-center md:w-[45%] md:justify-start">
              <div className="relative flex h-72 w-72 transform items-center justify-center overflow-hidden rounded-[40px] bg-primary-200 shadow-sm transition-transform hover:scale-[1.02] sm:h-80 sm:w-80 md:h-92.75 md:w-92.75">
                {/* Macbook Mockup */}
                <div className="absolute top-[45%] z-20 flex h-[50%] w-[80%] -translate-y-[45%] justify-center rounded-t-xl border-[6px] border-gray-900 bg-gray-900 shadow-xl md:border-8">
                  <div className="relative h-full w-full overflow-hidden rounded-t-md bg-primary-50 md:rounded-t-lg">
                    <Image
                      src={home2img}
                      alt="why-paskihub"
                      width={1000}
                      height={1000}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
                {/* Macbook base */}
                <div className="absolute top-[70%] z-10 flex h-3 w-[90%] justify-center rounded-b-xl bg-gray-300 shadow-md md:top-[72%] md:h-4">
                  <div className="h-1 w-1/4 rounded-b-md bg-gray-400 md:h-2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:gap-20">
            <div className="flex w-full flex-col gap-4 md:w-[50%] md:gap-6">
              <h3 className="text-2xl leading-snug font-bold text-neutral-600 sm:text-3xl md:text-4xl">
                Perhitungan nilai otomatis untuk hasil yang{" "}
                <span className="inline-block rounded-lg bg-secondary-500 px-3 py-1 whitespace-nowrap text-white md:mt-1">
                  akurat
                </span>
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400 md:text-base">
                Panitia memasukkan nilai, sistem menghitung hasil lomba secara
                otomatis untuk meminimalkan kesalahan.
              </p>
            </div>
            <div className="flex w-full justify-center md:w-[45%] md:justify-end">
              <div className="relative flex h-72 w-72 transform items-end justify-center overflow-hidden rounded-[40px] bg-primary-200 shadow-sm transition-transform hover:scale-[1.02] sm:h-80 sm:w-80 md:h-92.75 md:w-92.75">
                {/* iPhone Mockup */}
                <div className="absolute -bottom-4 flex h-[85%] w-[65%] justify-center overflow-hidden rounded-t-[40px] border-8 border-gray-900 bg-gray-900 shadow-xl md:border-10">
                  <div className="relative h-full w-full overflow-hidden rounded-t-[25px] bg-primary-50 md:rounded-t-[30px]">
                    <Image
                      src={home3img}
                      alt="why-paskihub"
                      width={1000}
                      height={1000}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* contact us */}
      <section className="my-20 flex h-full w-full flex-col items-center space-y-10 md:my-32 md:space-y-16">
        <Card className="w-full max-w-4xl bg-primary-100 p-6 sm:p-8 md:p-12">
          <CardHeader className="px-0 pb-6 text-center md:pb-8">
            <CardTitle className="text-xl font-bold sm:text-2xl md:text-3xl">
              Butuh Bantuan? Hubungi Kami
            </CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-xl text-sm sm:text-base md:mt-3">
              Kami siap membantu Event Organizer dan peserta dalam menggunakan
              PaskiHub dengan lebih optimal.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="flex w-full flex-col items-center justify-between gap-4 rounded-3xl bg-white p-4 text-center sm:flex-row sm:rounded-[50px] sm:py-2 sm:pr-2 sm:pl-6 sm:text-left">
              <div className="text-sm leading-relaxed font-normal text-neutral-700 md:text-base">
                Klik di sini untuk mendapatkan bantuan terkait PaskiHub
              </div>
              <Link href="#" className="w-full sm:w-auto">
                <Button
                  variant={"secondary"}
                  className="flex w-full items-center justify-center gap-2 font-semibold sm:w-auto"
                >
                  Whatsapp{" "}
                  <span className="flex rotate-45 items-center justify-center rounded-full bg-secondary-200 p-0.75 text-foreground">
                    <Icon icon="formkit:arrowup" width="9" height="16" />
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
