"use client";
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { Montserrat } from "@/libs/fonts";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <Navbar
            className={`fixed top-0 left-0 z-50 w-full py-4 transition-all duration-300 ${
                isScrolled ? "bg-white drop-shadow-lg" : "bg-transparent"
            }`}
            fluid
            rounded
        >
            <NavbarBrand href="https://paskihub.com">
                <span
                    className={`self-center text-3xl font-bold whitespace-nowrap ${Montserrat.className}`}
                >
                    PaskiHub
                </span>
            </NavbarBrand>
            <div className="flex md:order-2">
                <Button className="bg-secondary-500 hover:bg-secondary-600 rounded-full px-12 font-bold">
                    Masuk
                </Button>
                <NavbarToggle />
            </div>
            <NavbarCollapse>
                <NavbarLink className="hover:text-primary-800" href="#">
                    Home
                </NavbarLink>
                <NavbarLink className="hover:text-primary-800" href="#">
                    About
                </NavbarLink>
                <NavbarLink className="hover:text-primary-800" href="#">
                    Services
                </NavbarLink>
                <NavbarLink className="hover:text-primary-800" href="#">
                    Contact
                </NavbarLink>
            </NavbarCollapse>
        </Navbar>
    );
}
