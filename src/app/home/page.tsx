import { Montserrat } from "@/libs/fonts";
import Image from "next/image";

export default function HomePage() {
    return (
        <div>
            <section className="w-full h-full justify-center items-center flex flex-col my-20">
                <div className="text-center gap-5 flex flex-col">
                    <div className={`text-dark-blue text-8xl ${Montserrat.className} font-bold`}>PaskiHub</div>
                    <div className="text-neutral-500">Kelola dan ikuti lomba Paskibra dalam satu platform untuk membuat seluruh proses lebih mudah</div>
                </div>
                <div className="w-full h-full">
                    <Image src="/home/dashboard.jpg" alt="Home" width={1000} height={1000} className="w-full h-full object-cover" />
                </div>
            </section>
        </div>
    );
}
