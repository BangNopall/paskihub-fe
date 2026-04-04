import { Montserrat } from "@/lib/fonts";
import Link from "next/link";

export default function Register() {
    return (
        <div className="container mx-auto h-screen w-full overflow-x-hidden px-6 sm:px-10 lg:px-12">
            <div className="flex h-full w-full flex-col items-center justify-center">
                {/* <div className="overflow-x-auto">
            
                </div>
                <Card className="bg-glassmorphism-50 w-full max-w-[90vw] rounded-2xl border-0 shadow-lg backdrop-blur-xl transition-all duration-300 ease-in-out sm:max-w-md sm:rounded-3xl md:max-w-lg lg:max-w-xl [&>div]:p-6 sm:[&>div]:p-8 md:[&>div]:p-12">
                    <div
                        className={`text-dark-blue text-2xl font-bold sm:text-3xl ${Montserrat.className} mb-2 text-center sm:mb-4`}
                    >
                        Masuk Ke PaskiHub
                    </div>
                    <form className="flex w-full flex-col gap-4 sm:gap-5">
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="email1"
                                    className="text-sm sm:text-base"
                                >
                                    Email
                                </Label>
                            </div>
                            <TextInput
                                id="email1"
                                type="email"
                                placeholder="name@gmail.com"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="password1"
                                    className="text-sm sm:text-base"
                                >
                                    Password
                                </Label>
                            </div>
                            <TextInput
                                id="password1"
                                type="password"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="mt-1 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
                            <div className="flex items-center gap-2">
                                <Checkbox id="remember" />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm sm:text-base"
                                >
                                    Ingat Saya
                                </Label>
                            </div>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-neutral-400 transition-colors duration-300 ease-in-out hover:text-neutral-500 sm:text-base"
                            >
                                Lupa Password?
                            </Link>
                        </div>
                        <Button
                            type="submit"
                            color="primary"
                            className="mt-2 w-full text-sm sm:text-base"
                        >
                            Masuk
                        </Button>
                    </form>
                    <div className="mt-4 w-full text-center text-sm sm:mt-6 sm:text-base">
                        Belum punya akun?{" "}
                        <Link
                            href="/auth/register"
                            className="text-secondary-400 hover:text-secondary-500 font-medium transition-colors duration-300 ease-in-out"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </Card> */}
            </div>
        </div>
    );
}
