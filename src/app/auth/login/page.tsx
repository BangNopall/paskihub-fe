import { Card, Label, Button, Checkbox, TextInput } from "flowbite-react";
import { Montserrat } from "@/libs/fonts";
import Link from "next/link";

export default function Login() {
    return (
        <div className="container mx-auto min-h-screen w-full overflow-x-hidden px-4 sm:px-6 lg:px-12 py-10 flex flex-col justify-center">
            <div className="flex w-full flex-col items-center justify-center">
                <Card className="bg-glassmorphism-50 w-full max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl sm:rounded-3xl border-0 shadow-lg backdrop-blur-xl transition-all duration-300 ease-in-out [&>div]:p-6 sm:[&>div]:p-8 md:[&>div]:p-12">
                    <div
                        className={`text-dark-blue text-2xl sm:text-3xl font-bold ${Montserrat.className} text-center mb-2 sm:mb-4`}
                    >
                        Masuk Ke PaskiHub
                    </div>
                    <form className="flex w-full flex-col gap-4 sm:gap-5">
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="email1" className="text-sm sm:text-base">Email</Label>
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
                                <Label htmlFor="password1" className="text-sm sm:text-base">Password</Label>
                            </div>
                            <TextInput
                                id="password1"
                                type="password"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mt-1">
                            <div className="flex items-center gap-2">
                                <Checkbox id="remember" />
                                <Label htmlFor="remember" className="text-sm sm:text-base">Ingat Saya</Label>
                            </div>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm sm:text-base text-neutral-400 transition-colors duration-300 ease-in-out hover:text-neutral-500"
                            >
                                Lupa Password?
                            </Link>
                        </div>
                        <Button type="submit" color="primary" className="mt-2 text-sm sm:text-base w-full">Masuk</Button>
                    </form>
                    <div className="mt-4 sm:mt-6 text-sm sm:text-base text-center w-full">
                        Belum punya akun?{" "}
                        <Link
                            href="/auth/register"
                            className="font-medium text-secondary-400 transition-colors duration-300 ease-in-out hover:text-secondary-500"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
