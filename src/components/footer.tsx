"use client";

import {
    Footer,
    FooterLink,
    FooterLinkGroup,
} from "flowbite-react";
import { Icon } from "@iconify/react";
import { Montserrat } from "@/libs/fonts";

export function Fouter() {
    return (
        <>
            <Footer container className="bg-primary-300 rounded-none shadow-none border-none py-14 px-8 md:px-[10%] lg:px-[15%]">
                <div className="w-full flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12.5 lg:gap-22.5 w-full max-w-7xl items-center">
                        <div className="text-dark-blue flex w-full flex-col gap-4 md:border-r-2 md:border-dark-blue items-center md:items-start text-center md:text-left md:pr-10 lg:pr-7.5">
                            <div
                                className={`text-dark-blue text-3xl md:text-[30px] ${Montserrat.className} font-bold`}
                            >
                                PaskiHub
                            </div>
                            <FooterLinkGroup
                                col
                                className="text-dark-blue space-y-2 items-center md:items-start text-center md:text-left"
                            >
                                <div>
                                    <div className="text-base font-semibold">
                                        Jam Operasional
                                    </div>
                                    <FooterLink href="#" className="text-xs">
                                        Lorem ipsum dolor
                                    </FooterLink>
                                </div>
                            </FooterLinkGroup>
                        </div>
                        
                        <div className="text-dark-blue flex w-full flex-col gap-4 md:border-r-2 md:border-dark-blue items-center md:items-start text-center md:text-left md:pr-10 lg:pr-7.5">
                            <FooterLinkGroup col className="text-dark-blue space-y-6 items-center md:items-start text-center md:text-left w-full">
                                <div>
                                    <div className="text-base font-semibold">
                                        Hubungi Kami
                                    </div>
                                    <FooterLink href="#" className="text-xs">+62</FooterLink>
                                </div>
                                <div className="w-full">
                                    <div className="text-base font-semibold">
                                        Alamat
                                    </div>
                                    <FooterLink href="#" className="text-xs whitespace-normal sm:whitespace-nowrap">
                                        Lorem ipsum dolor
                                    </FooterLink>
                                </div>
                            </FooterLinkGroup>
                        </div>
                        
                        <div className="h-full flex flex-col justify-center items-center md:items-start">
                            <FooterLinkGroup col className="text-dark-blue space-y-6 items-center md:items-start w-full">
                                <FooterLink href="#">
                                    <div className="flex gap-2 items-center">
                                        <Icon icon="mdi:instagram" width="24" height="24" className="text-dark-blue bg-primary-50 rounded-full p-1" />
                                        <div className="text-dark-blue font-semibold text-xs">loremipsum</div>
                                    </div>
                                </FooterLink>
                                <FooterLink href="#">
                                    <div className="flex gap-2 items-center">
                                        <Icon icon="ic:baseline-tiktok" width="24" height="24" className="text-dark-blue bg-primary-50 rounded-full p-1" />
                                        <div className="text-dark-blue font-semibold text-xs">loremipsum</div>
                                    </div>
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>
                    </div>
                </div>
            </Footer>
            <footer className="w-full bg-primary-200 border-t border-neutral-50 py-5.25 px-4 flex justify-center items-center mt-auto">
                <div className="flex gap-1 items-center max-w-full">
                    <Icon icon="ic:round-copyright" width="20" height="20" className="text-neutral-500 shrink-0" />
                    <p className={`text-neutral-500 text-sm leading-5 whitespace-normal sm:whitespace-nowrap text-center`}>
                        2026 PaskiHub. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
