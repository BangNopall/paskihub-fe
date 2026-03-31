import { Montserrat } from "@/libs/fonts";
import Image from "next/image";
import about1Img from "../../../public/home/about1.jpg";
import about2Img from "../../../public/home/about2.jpg";
import home1img from "../../../public/home/home1.jpg";
import home2img from "../../../public/home/home2.jpg";
import home3img from "../../../public/home/home3.jpg";
import dashboardImg from "../../../public/home/dashboard.jpg";
import commentCursorImg from "../../../public/home/comment-cursor.png";
import commentCursor2Img from "../../../public/home/comment-cursor2.png";

export default function HomePage() {
    return (
        <div className="container mx-auto px-6 sm:px-10 lg:px-12 overflow-x-hidden">
            {/* Hero Section */}
            <section className="my-20 mt-32 md:my-20 flex h-full w-full flex-col items-center justify-center space-y-12 md:space-y-20">
                <div className="flex flex-col gap-4 md:gap-5 text-center max-w-4xl">
                    <div
                        className={`text-dark-blue text-5xl sm:text-7xl lg:text-8xl ${Montserrat.className} font-bold leading-tight`}
                    >
                        PaskiHub
                    </div>
                    <div className="text-neutral-500 text-sm sm:text-base px-4 md:px-0">
                        Kelola dan ikuti lomba Paskibra dalam satu platform
                        untuk membuat seluruh proses lebih mudah
                    </div>
                </div>
                <div className="bg-primary-200 relative h-70 sm:h-100 lg:h-125 w-full md:w-[90%] lg:w-[80%] overflow-visible rounded-3xl md:rounded-4xl p-3 md:p-5">
                    <Image
                        src={dashboardImg}
                        alt="Home"
                        width={1000}
                        height={1000}
                        className="h-full w-full rounded-2xl md:rounded-4xl object-cover object-top-left shadow-lg"
                    />
                    <div className="hidden sm:block absolute -right-10 md:-right-20 bottom-10 md:bottom-20 w-32 md:w-50 transition-transform hover:scale-105">
                        <Image
                            src={commentCursorImg}
                            alt="Comment Cursor"
                            width={500}
                            height={500}
                            className="h-auto w-full object-contain"
                        />
                    </div>
                    <div className="hidden sm:block absolute top-10 md:top-30 -left-8 md:-left-18 w-24 md:w-35 transition-transform hover:scale-105">
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
            <section className="my-16 md:my-32 flex h-full w-full flex-col space-y-12 md:space-y-20">
                <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto">
                    <div
                        className={`text-dark-blue text-2xl sm:text-3xl ${Montserrat.className} font-bold`}
                    >
                        Tentang Kami
                    </div>
                    <div className="text-neutral-400 text-sm sm:text-base leading-relaxed px-2">
                        PaskiHub adalah platform digital yang membantu{" "}
                        <span className="italic">Event Organizer</span> dan
                        peserta mengelola serta mengikuti lomba Paskibra dengan
                        proses yang lebih terpusat, tertib, dan transparan.
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-8 lg:gap-10">
                    <div className="group w-full max-w-md md:w-1/2 **:transition-all **:duration-300 **:ease-in-out">
                        <div className="bg-primary-100 group-hover:bg-secondary-500 group-active:bg-secondary-500 flex h-full flex-col gap-4 rounded-4xl p-4 shadow-sm">
                            <div className="relative w-full aspect-video md:aspect-auto">
                                <div className="bg-primary-100 absolute h-full w-full rounded-3xl opacity-40 group-hover:opacity-0 z-10"></div>
                                <Image
                                    src={about1Img}
                                    alt="About"
                                    width={1000}
                                    height={1000}
                                    className="h-full w-full rounded-3xl object-cover object-top"
                                />
                            </div>
                            <div className="w-full space-y-2 rounded-3xl bg-white p-6 md:p-8 drop-shadow-sm grow">
                                <div className="text-primary-400 text-lg md:text-xl font-semibold group-hover:text-neutral-600">
                                    Event Organizer
                                </div>
                                <hr className="text-primary-100 group-hover:border-neutral-100" />
                                <div className="text-primary-400 text-xs md:text-sm leading-relaxed group-hover:text-neutral-500">
                                    Sebagai pengelola lomba, Event Organizer
                                    dapat membuat dan mengatur event, mengelola
                                    pendaftaran tim, menginput dan merekap
                                    nilai, hingga mempublikasikan hasil lomba
                                    dalam satu sistem terintegrasi.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="group w-full max-w-md md:w-1/2 **:transition-all **:duration-300 **:ease-in-out">
                        <div className="bg-primary-100 group-hover:bg-secondary-500 group-active:bg-secondary-500 flex h-full flex-col gap-4 rounded-4xl p-4 shadow-sm">
                            <div className="relative w-full aspect-video md:aspect-auto">
                                <div className="bg-primary-100 absolute h-full w-full rounded-3xl opacity-40 group-hover:opacity-0 z-10"></div>
                                <Image
                                    src={about2Img}
                                    alt="About"
                                    width={1000}
                                    height={1000}
                                    className="h-full w-full rounded-3xl object-cover object-top"
                                />
                            </div>
                            <div className="w-full space-y-2 rounded-3xl bg-white p-6 md:p-8 drop-shadow-sm grow">
                                <div className="text-primary-400 text-lg md:text-xl font-semibold group-hover:text-neutral-600">
                                    Peserta
                                </div>
                                <hr className="text-primary-100 group-hover:border-neutral-100" />
                                <div className="text-primary-400 text-xs md:text-sm leading-relaxed group-hover:text-neutral-500">
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
                
                {/* Stats Section */}
                <div className="bg-primary-200 mx-auto grid w-full md:w-[90%] lg:w-[80%] grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 rounded-3xl md:rounded-4xl p-4 md:p-6 text-neutral-500">
                    <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 md:py-8 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-600">
                            0
                        </div>
                        <div className="text-xs md:text-sm font-medium text-neutral-400 uppercase tracking-wide">
                            Jumlah event
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 md:py-8 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-600">
                            0
                        </div>
                        <div className="text-xs md:text-sm font-medium text-neutral-400 uppercase tracking-wide">
                            Event Organizer
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 md:py-8 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-600">
                            0
                        </div>
                        <div className="text-xs md:text-sm font-medium text-neutral-400 uppercase tracking-wide">
                            Peserta
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl bg-white py-6 md:py-8 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-600">
                            0
                        </div>
                        <div className="text-xs md:text-sm font-medium text-neutral-400 uppercase tracking-wide">
                            Tim
                        </div>
                    </div>
                </div>
            </section>

            {/* Mengapa PaskiHub Section */}
            <section className="my-20 md:my-32 flex h-full w-full flex-col space-y-16 md:space-y-24">
                <div className="text-center">
                    <div
                        className={`text-dark-blue text-2xl sm:text-3xl md:text-4xl ${Montserrat.className} font-bold`}
                    >
                        Mengapa harus PaskiHub?
                    </div>
                </div>

                <div className="relative mx-auto flex w-full flex-col gap-20 md:gap-32 md:w-[90%] lg:w-[80%]">
                    {/* Item 1 */}
                    <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:gap-20">
                        <div className="flex w-full flex-col gap-4 md:gap-6 md:w-[50%]">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl leading-snug font-bold text-neutral-600">
                                Kelola seluruh proses lomba dalam satu{" "}
                                <span className="bg-secondary-500 inline-block rounded-lg px-3 py-1 text-white md:mt-1 whitespace-nowrap">
                                    platform
                                </span>{" "}
                                <span className="bg-secondary-500 inline-block rounded-lg px-3 py-1 text-white md:mt-1 whitespace-nowrap">
                                    terpusat
                                </span>
                            </h3>
                            <p className="text-sm md:text-base leading-relaxed text-neutral-400">
                                Semua proses lomba Paskibra dari pendaftaran tim
                                hingga pengumuman hasil dikelola rapi dalam satu
                                platform.
                            </p>
                        </div>
                        <div className="flex w-full justify-center md:w-[45%] md:justify-end">
                            <div className="bg-primary-200 relative flex h-72 w-72 sm:h-80 sm:w-80 md:h-92.75 md:w-92.75 items-end justify-center overflow-hidden rounded-[40px] shadow-sm transform transition-transform hover:scale-[1.02]">
                                {/* iPhone Mockup */}
                                <div className="absolute -bottom-4 flex h-[85%] w-[65%] justify-center rounded-t-[40px] border-8 md:border-10 border-gray-900 bg-gray-900 shadow-xl overflow-hidden">
                                    <div className="bg-primary-50 relative h-full w-full overflow-hidden rounded-t-[25px] md:rounded-t-[30px]">
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
                        <div className="flex w-full flex-col gap-4 md:gap-6 md:w-[50%] md:items-end md:text-right">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl leading-snug font-bold text-neutral-600 space-y-2">
                                <span>Pendaftaran tim digital yang</span>{" "}
                                <span className="bg-secondary-500 inline-block rounded-lg px-3 py-1 text-white md:mt-1">
                                    lebih rapi dan praktis
                                </span>
                            </h3>
                            <p className="text-sm md:text-base leading-relaxed text-neutral-400 md:text-right">
                                Peserta mendaftarkan tim secara online tanpa
                                formulir manual, memudahkan panitia dan
                                mempercepat administrasi.
                            </p>
                        </div>
                        <div className="flex w-full justify-center md:w-[45%] md:justify-start">
                            <div className="bg-primary-200 relative flex h-72 w-72 sm:h-80 sm:w-80 md:h-92.75 md:w-92.75 items-center justify-center overflow-hidden rounded-[40px] shadow-sm transform transition-transform hover:scale-[1.02]">
                                {/* Macbook Mockup */}
                                <div className="absolute top-[45%] flex h-[50%] w-[80%] -translate-y-[45%] justify-center rounded-t-xl border-[6px] md:border-8 border-gray-900 bg-gray-900 shadow-xl z-20">
                                    <div className="bg-primary-50 relative h-full w-full overflow-hidden rounded-t-md md:rounded-t-lg">
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
                                <div className="absolute top-[70%] md:top-[72%] flex h-3 md:h-4 w-[90%] justify-center rounded-b-xl bg-gray-300 shadow-md z-10">
                                    <div className="h-1 md:h-2 w-1/4 rounded-b-md bg-gray-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:gap-20">
                        <div className="flex w-full flex-col gap-4 md:gap-6 md:w-[50%]">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl leading-snug font-bold text-neutral-600">
                                Perhitungan nilai otomatis untuk hasil yang{" "}
                                <span className="bg-secondary-500 inline-block rounded-lg px-3 py-1 text-white md:mt-1 whitespace-nowrap">
                                    akurat
                                </span>
                            </h3>
                            <p className="text-sm md:text-base leading-relaxed text-neutral-400">
                                Panitia memasukkan nilai, sistem menghitung
                                hasil lomba secara otomatis untuk meminimalkan
                                kesalahan.
                            </p>
                        </div>
                        <div className="flex w-full justify-center md:w-[45%] md:justify-end">
                            <div className="bg-primary-200 relative flex h-72 w-72 sm:h-80 sm:w-80 md:h-92.75 md:w-92.75 items-end justify-center overflow-hidden rounded-[40px] shadow-sm transform transition-transform hover:scale-[1.02]">
                                {/* iPhone Mockup */}
                                <div className="absolute -bottom-4 flex h-[85%] w-[65%] justify-center rounded-t-[40px] border-8 md:border-10 border-gray-900 bg-gray-900 shadow-xl overflow-hidden">
                                    <div className="bg-primary-50 relative h-full w-full overflow-hidden rounded-t-[25px] md:rounded-t-[30px]">
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
        </div>
    );
}
