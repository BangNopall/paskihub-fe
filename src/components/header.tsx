import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import { Montserrat } from "@/libs/fonts";

export function Header() {
    return (
        <Navbar className="container mx-auto sm:px-12 bg-transparent" fluid rounded>
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
