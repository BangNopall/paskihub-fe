import { Montserrat } from "@/libs/fonts";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="container mx-auto px-12">
            {/* Hero Section */}
            <section className="my-20 flex h-full w-full flex-col items-center justify-center space-y-20">
                <div className="flex flex-col gap-5 text-center">
                    <div
                        className={`text-dark-blue text-8xl ${Montserrat.className} font-bold`}
                    >
                        PaskiHub
                    </div>
                    <div className="text-neutral-500">
                        Kelola dan ikuti lomba Paskibra dalam satu platform
                        untuk membuat seluruh proses lebih mudah
                    </div>
                </div>
                <div className="bg-primary-200 relative h-125 w-[80%] overflow-visible rounded-4xl p-5">
                    <Image
                        src="/home/dashboard.jpg"
                        alt="Home"
                        width={1000}
                        height={1000}
                        className="h-full w-full rounded-4xl object-cover object-top"
                    />
                    <div className="absolute -right-20 bottom-20 w-50">
                        <Image
                            src="/home/comment-cursor.png"
                            alt="Comment Cursor"
                            width={500}
                            height={500}
                            className="h-full w-full object-cover object-top"
                        />
                    </div>
                    <div className="absolute top-30 -left-18 w-35">
                        <Image
                            src="/home/comment-cursor2.png"
                            alt="Comment Cursor 2"
                            width={500}
                            height={500}
                            className="h-full w-full object-cover object-top"
                        />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="my-20 flex h-full w-full flex-col space-y-20">
                <div className="flex flex-col gap-3 text-center">
                    <div
                        className={`text-dark-blue text-3xl ${Montserrat.className} font-bold`}
                    >
                        Tentang Kami
                    </div>
                    <div className="text-neutral-300">
                        PaskiHub adalah platform digital yang membantu{" "}
                        <span className="italic">Event Organizer</span> dan
                        peserta mengelola serta mengikuti lomba Paskibra dengan
                        proses yang lebih terpusat, tertib, dan transparan.
                    </div>
                </div>
                <div className="flex justify-center gap-6">
                    <div className="group **:transition-all **:duration-300 **:ease-in-out">
                        <div className="bg-primary-100 group-hover:bg-secondary-500 group-active:bg-secondary-500 flex w-100 flex-col gap-4 rounded-4xl p-4">
                            <div className="relative w-full">
                                <div className="bg-primary-100 absolute h-full w-full rounded-3xl opacity-50 group-hover:opacity-0"></div>
                                <Image
                                    src="/home/about1.jpg"
                                    alt="About"
                                    width={1000}
                                    height={1000}
                                    className="h-full w-full rounded-3xl object-cover object-top"
                                />
                            </div>
                            <div className="w-full space-y-2 rounded-3xl bg-white p-6 drop-shadow-sm">
                                <div className="text-primary-400 text-lg font-semibold group-hover:text-neutral-500">
                                    Event Organizer
                                </div>
                                <hr className="text-primary-100 group-hover:text-neutral-100" />
                                <div className="text-primary-400 text-sm group-hover:text-neutral-500">
                                    Sebagai pengelola lomba, Event Organizer
                                    dapat membuat dan mengatur event, mengelola
                                    pendaftaran tim, menginput dan merekap
                                    nilai, hingga mempublikasikan hasil lomba
                                    dalam satu sistem terintegrasi.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="group **:transition-all **:duration-300 **:ease-in-out">
                        <div className="bg-primary-100 group-hover:bg-secondary-500 group-active:bg-secondary-500 flex w-100 flex-col gap-4 rounded-4xl p-4">
                            <div className="relative w-full">
                                <div className="bg-primary-100 absolute h-full w-full rounded-3xl opacity-50 group-hover:opacity-0"></div>
                                <Image
                                    src="/home/about2.jpg"
                                    alt="About"
                                    width={1000}
                                    height={1000}
                                    className="h-full w-full rounded-3xl object-cover object-top"
                                />
                            </div>
                            <div className="w-full space-y-2 rounded-3xl bg-white p-6 drop-shadow-sm">
                                <div className="text-primary-400 text-lg font-semibold group-hover:text-neutral-500">
                                    Peserta
                                </div>
                                <hr className="text-primary-100 group-hover:text-neutral-100" />
                                <div className="text-primary-400 text-sm group-hover:text-neutral-500">
                                    Sebagai peserta lomba, kalian dapat
                                    mendaftarkan tim, memantau status
                                    pendaftaran, melihat rekap nilai, serta
                                    mengetahui hasil akhir lomba secara
                                    transparan melalui dashboard.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-primary-200 mx-auto grid w-[80%] grid-cols-4 gap-6 rounded-4xl p-4 text-neutral-500">
                    <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 text-center">
                        <div className="text-3xl font-semibold text-neutral-500">
                            0
                        </div>
                        <div className="text-sm font-medium text-neutral-500">
                            Jumlah event
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 text-center">
                        <div className="text-3xl font-semibold text-neutral-500">
                            0
                        </div>
                        <div className="text-sm font-medium text-neutral-500">
                            Event Organizer
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 text-center">
                        <div className="text-3xl font-semibold text-neutral-500">
                            0
                        </div>
                        <div className="text-sm font-medium text-neutral-500">
                            Peserta
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 text-center">
                        <div className="text-3xl font-semibold text-neutral-500">
                            0
                        </div>
                        <div className="text-sm font-medium text-neutral-500">
                            Tim
                        </div>
                    </div>
                </div>
            </section>

            {/* Mengapa PaskiHub Section */}
            <section className="my-32 flex h-full w-full flex-col space-y-20">
                <div className="text-center">
                    <div
                        className={`text-dark-blue text-3xl ${Montserrat.className} font-bold`}
                    >
                        Mengapa harus PaskiHub?
                    </div>
                </div>

                <div className="relative mx-auto flex w-full flex-col gap-28 md:w-[90%] lg:w-[80%]">
                    {/* Item 1 */}
                    <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:gap-20">
                        <div className="flex w-full flex-col gap-6 md:w-[45%]">
                            <h3 className="text-[28px] leading-snug font-semibold text-neutral-500 md:text-3xl">
                                Kelola seluruh proses lomba dalam satu{" "}
                                <span className="bg-secondary-500 inline-block rounded-lg px-3 py-1 text-white md:mt-1">
                                    platform
                                </span>{" "}
                                <span className="bg-secondary-500 inline-block rounded-lg px-3 py-1 text-white md:mt-1">
                                    terpusat
                                </span>
                            </h3>
                            <p className="leading-relaxed text-neutral-400">
                                Semua proses lomba Paskibra dari pendaftaran tim
                                hingga pengumuman hasil dikelola rapi dalam satu
                                platform.
                            </p>
                        </div>
                        <div className="flex w-full justify-center md:w-[50%] md:justify-end">
                            <div className="bg-primary-200 relative flex h-80 w-80 items-end justify-center overflow-hidden rounded-[40px] shadow-sm sm:h-96 sm:w-96 md:h-92.75 md:w-92.75">
                                {/* iPhone Mockup */}
                                <div className="absolute -bottom-4 flex h-[85%] w-[65%] justify-center rounded-t-[40px] border-10 border-gray-900 bg-gray-900 shadow-xl md:h-78 md:w-66.75">
                                    <div className="bg-primary-50 relative h-full w-full overflow-hidden rounded-t-[30px]">
                                        <div className="absolute top-0 left-1/2 z-10 h-6 w-32 -translate-x-1/2 rounded-b-[20px] bg-gray-900"></div>
                                        <div className="from-primary-100/50 to-primary-200 absolute inset-0 bg-linear-to-br"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col items-center justify-between gap-10 md:flex-row-reverse md:gap-20">
                        <div className="flex w-full flex-col gap-6 md:w-[45%] md:items-end md:text-right">
                            <h3 className="text-[28px] leading-snug font-semibold text-neutral-500 md:text-3xl">
                                Pendaftaran tim digital yang{" "}
                                <span className="bg-secondary-500 inline-block rounded-lg px-3 py-1 text-white md:mt-1">
                                    lebih rapi dan praktis
                                </span>
                            </h3>
                            <p className="leading-relaxed text-neutral-400 md:text-right">
                                Peserta mendaftarkan tim secara online tanpa
                                formulir manual, memudahkan panitia dan
                                mempercepat administrasi.
                            </p>
                        </div>
                        <div className="flex w-full justify-center md:w-[50%] md:justify-start">
                            <div className="bg-primary-200 relative flex h-80 w-80 items-center justify-center overflow-hidden rounded-[40px] shadow-sm sm:h-96 sm:w-96 md:h-92.75 md:w-92.75">
                                {/* Macbook Mockup */}
                                <div className="absolute top-[45%] flex h-[55%] w-[85%] -translate-y-[45%] justify-center rounded-t-xl border-8 border-gray-900 bg-gray-900 shadow-xl md:h-50 md:w-80">
                                    <div className="bg-primary-50 relative h-full w-full overflow-hidden rounded-t-lg">
                                        <div className="from-primary-100/50 to-primary-200 absolute inset-0 bg-linear-to-b"></div>
                                    </div>
                                </div>
                                {/* Macbook base */}
                                <div className="absolute top-[72.5%] flex h-4 w-[95%] justify-center rounded-b-xl bg-gray-300 shadow-md md:top-[72%] md:w-80">
                                    <div className="h-2 w-1/4 rounded-b-md bg-gray-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:gap-20">
                        <div className="flex w-full flex-col gap-6 md:w-[45%]">
                            <h3 className="text-[28px] leading-snug font-semibold text-neutral-500 md:text-3xl">
                                Perhitungan nilai otomatis untuk hasil yang{" "}
                                <span className="bg-secondary-500 inline-block rounded-lg px-3 py-1 text-white md:mt-1">
                                    akurat
                                </span>
                            </h3>
                            <p className="leading-relaxed text-neutral-400">
                                Panitia memasukkan nilai, sistem menghitung
                                hasil lomba secara otomatis untuk meminimalkan
                                kesalahan.
                            </p>
                        </div>
                        <div className="flex w-full justify-center md:w-[50%] md:justify-end">
                            <div className="bg-primary-200 relative flex h-80 w-80 items-end justify-center overflow-hidden rounded-[40px] shadow-sm sm:h-96 sm:w-96 md:h-92.75 md:w-92.75">
                                {/* iPhone Mockup */}
                                <div className="absolute -bottom-4 flex h-[85%] w-[65%] justify-center rounded-t-[40px] border-10 border-gray-900 bg-gray-900 shadow-xl md:h-78 md:w-66.75">
                                    <div className="bg-primary-50 relative h-full w-full overflow-hidden rounded-t-[30px]">
                                        <div className="absolute top-0 left-1/2 z-10 h-6 w-32 -translate-x-1/2 rounded-b-[20px] bg-gray-900"></div>
                                        <div className="from-primary-100/50 to-primary-200 absolute inset-0 bg-linear-to-br"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
