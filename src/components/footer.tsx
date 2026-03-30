"use client";

import { Footer, FooterLink, FooterLinkGroup } from "flowbite-react";
import { Icon } from "@iconify/react";
import { Montserrat } from "@/libs/fonts";

export function Fouter() {
    return (
        <>
            <Footer
                container
                className="bg-primary-300 rounded-none border-none px-8 py-14 shadow-none md:px-[10%] lg:px-[15%]"
            >
                <div className="flex w-full justify-center">
                    <div className="ml-0 grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:ml-[8%] md:grid-cols-3 md:gap-12.5 lg:gap-22.5">
                        <div className="text-dark-blue md:border-dark-blue flex h-full w-full flex-col items-center gap-4 text-center md:items-start md:border-r-2 md:pr-10 md:text-left lg:pr-7.5">
                            <div
                                className={`text-dark-blue text-3xl md:text-[30px] ${Montserrat.className} font-bold`}
                            >
                                PaskiHub
                            </div>
                            <FooterLinkGroup
                                col
                                className="text-dark-blue items-center space-y-2 text-center md:items-start md:text-left"
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
                        <div className="text-dark-blue md:border-dark-blue flex h-full w-full flex-col items-center gap-4 text-center md:items-start md:border-r-2 md:pr-10 md:text-left lg:pr-7.5">
                            <FooterLinkGroup
                                col
                                className="text-dark-blue w-full items-center space-y-6 text-center md:items-start md:text-left"
                            >
                                <div>
                                    <div className="text-base font-semibold">
                                        Hubungi Kami
                                    </div>
                                    <FooterLink href="#" className="text-xs">
                                        +62
                                    </FooterLink>
                                </div>
                                <div className="w-full">
                                    <div className="text-base font-semibold">
                                        Alamat
                                    </div>
                                    <FooterLink
                                        href="#"
                                        className="text-xs whitespace-normal sm:whitespace-nowrap"
                                    >
                                        Lorem ipsum dolor
                                    </FooterLink>
                                </div>
                            </FooterLinkGroup>
                        </div>

                        <div className="flex h-full flex-col items-center justify-center md:items-start">
                            <FooterLinkGroup
                                col
                                className="text-dark-blue w-full items-center space-y-6 md:items-start"
                            >
                                <FooterLink href="#">
                                    <div className="flex items-center gap-2">
                                        <Icon
                                            icon="mdi:instagram"
                                            width="24"
                                            height="24"
                                            className="text-dark-blue bg-primary-50 rounded-full p-1"
                                        />
                                        <div className="text-dark-blue text-xs font-semibold">
                                            loremipsum
                                        </div>
                                    </div>
                                </FooterLink>
                                <FooterLink href="#">
                                    <div className="flex items-center gap-2">
                                        <Icon
                                            icon="ic:baseline-tiktok"
                                            width="24"
                                            height="24"
                                            className="text-dark-blue bg-primary-50 rounded-full p-1"
                                        />
                                        <div className="text-dark-blue text-xs font-semibold">
                                            loremipsum
                                        </div>
                                    </div>
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>
                    </div>
                </div>
            </Footer>
            <footer className="bg-primary-200 mt-auto flex w-full items-center justify-center border-t border-neutral-50 px-4 py-5.25">
                <div className="flex max-w-full items-center gap-1">
                    <Icon
                        icon="ic:round-copyright"
                        width="20"
                        height="20"
                        className="shrink-0 text-neutral-500"
                    />
                    <p
                        className={`text-center text-sm leading-5 whitespace-normal text-neutral-500 sm:whitespace-nowrap`}
                    >
                        2026 PaskiHub. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
