import { Montserrat } from "@/libs/fonts";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="container mx-auto px-12">
            {/* Hero Section */}
            <section className="w-full h-full justify-center items-center flex flex-col my-20 space-y-20">
                <div className="text-center gap-5 flex flex-col">
                    <div className={`text-dark-blue text-8xl ${Montserrat.className} font-bold`}>PaskiHub</div>
                    <div className="text-neutral-500">Kelola dan ikuti lomba Paskibra dalam satu platform untuk membuat seluruh proses lebih mudah</div>
                </div>
                <div className="w-[80%] h-125 p-5 rounded-4xl bg-primary-200 relative overflow-visible">
                    <Image src="/home/dashboard.jpg" alt="Home" width={1000} height={1000} className="rounded-4xl object-top w-full h-full object-cover" />
                    <div className="absolute bottom-20 -right-20 w-50">
                        <Image src="/home/comment-cursor.png" alt="Comment Cursor" width={500} height={500} className="object-top w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-30 -left-18 w-35">
                        <Image src="/home/comment-cursor2.png" alt="Comment Cursor 2" width={500} height={500} className="object-top w-full h-full object-cover" />
                    </div>
                </div>
            </section>
            
            {/* About Section */}
            <section className="w-full h-full flex flex-col my-20 space-y-20">
                <div className="text-center gap-3 flex flex-col">
                    <div className={`text-dark-blue text-3xl ${Montserrat.className} font-bold`}>Tentang Kami</div>
                    <div className="text-neutral-300">PaskiHub adalah platform digital yang membantu <span className="italic">Event Organizer</span> dan peserta mengelola serta mengikuti lomba Paskibra dengan proses yang lebih terpusat, tertib, dan transparan.</div>
                </div>
                <div className="flex gap-6 justify-center">
                    <div className="group **:transition-all **:duration-300 **:ease-in-out">
                        <div className="w-100 rounded-4xl bg-primary-100 p-4 flex flex-col gap-4 group-hover:bg-secondary-500 group-active:bg-secondary-500">
                            <div className="w-full relative">
                                <div className="bg-primary-100 w-full h-full absolute opacity-50 rounded-3xl group-hover:opacity-0"></div>
                                <Image src="/home/about1.jpg" alt="About" width={1000} height={1000} className="rounded-3xl object-top w-full h-full object-cover" />
                            </div>
                            <div className="w-full bg-white p-6 rounded-3xl space-y-2 drop-shadow-sm">
                                <div className="text-primary-400 group-hover:text-neutral-500 font-semibold text-lg">Event Organizer</div>
                                <hr className="text-primary-100 group-hover:text-neutral-100" />
                                <div className="text-primary-400 group-hover:text-neutral-500 text-sm">
                                    Sebagai pengelola lomba, Event Organizer dapat membuat dan mengatur event, mengelola pendaftaran tim, menginput dan merekap nilai, hingga mempublikasikan hasil lomba dalam satu sistem terintegrasi.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="group **:transition-all **:duration-300 **:ease-in-out">
                        <div className="w-100 rounded-4xl bg-primary-100 p-4 flex flex-col gap-4 group-hover:bg-secondary-500 group-active:bg-secondary-500">
                            <div className="w-full relative">
                                <div className="bg-primary-100 w-full h-full absolute opacity-50 rounded-3xl group-hover:opacity-0"></div>
                                <Image src="/home/about2.jpg" alt="About" width={1000} height={1000} className="rounded-3xl object-top w-full h-full object-cover" />
                            </div>
                            <div className="w-full bg-white p-6 rounded-3xl space-y-2 drop-shadow-sm">
                                <div className="text-primary-400 group-hover:text-neutral-500 font-semibold text-lg">Peserta</div>
                                <hr className="text-primary-100 group-hover:text-neutral-100" />
                                <div className="text-primary-400 group-hover:text-neutral-500 text-sm">
                                    Sebagai peserta lomba, kalian dapat mendaftarkan tim, memantau status pendaftaran, melihat rekap nilai, serta mengetahui hasil akhir lomba secara transparan melalui dashboard.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-6 w-[80%] mx-auto p-4 rounded-4xl bg-primary-200 text-neutral-500">
                    <div className="bg-white rounded-2xl py-6 flex flex-col gap-2 text-center">
                        <div className="text-neutral-500 font-semibold text-3xl">0</div>
                        <div className="text-neutral-500 text-sm font-medium">Jumlah event</div>
                    </div>
                    <div className="bg-white rounded-2xl py-6 flex flex-col gap-2 text-center">
                        <div className="text-neutral-500 font-semibold text-3xl">0</div>
                        <div className="text-neutral-500 text-sm font-medium">Event Organizer</div>
                    </div>
                    <div className="bg-white rounded-2xl py-6 flex flex-col gap-2 text-center">
                        <div className="text-neutral-500 font-semibold text-3xl">0</div>
                        <div className="text-neutral-500 text-sm font-medium">Peserta</div>
                    </div>
                    <div className="bg-white rounded-2xl py-6 flex flex-col gap-2 text-center">
                        <div className="text-neutral-500 font-semibold text-3xl">0</div>
                        <div className="text-neutral-500 text-sm font-medium">Tim</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
