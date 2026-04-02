import type { CustomFlowbiteTheme } from "flowbite-react/types";

export const customTheme: CustomFlowbiteTheme = {
    button: {
        base: "group flex items-center justify-center font-['Poppins',sans-serif] transition-all duration-200 outline-none focus:ring-4 rounded-[50px] border-none",
        size: {
            md: "h-12 px-7 text-[16px] leading-6",
        },
        color: {
            primary:
                "bg-secondary-500 text-white font-bold hover:bg-secondary-600 active:bg-secondary-700 focus:ring-secondary-100 disabled:bg-neutral-300 disabled:border disabled:border-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed",
            secondary:
                "bg-secondary-50 border border-secondary-500 text-secondary-500 font-semibold hover:bg-secondary-100 active:bg-secondary-200 focus:ring-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed",
        },
    },
    textInput: {
        base: "flex w-full",
        field: {
            base: "relative w-full",
            input: {
                base: "block w-full border font-['Poppins',sans-serif] rounded-[8px] text-[16px] outline-none transition-colors px-[16px] py-[13px] box-border",
                colors: {
                    gray: "bg-white border-[#ececf0] text-neutral-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-neutral-300",
                    failure:
                        "bg-white border-danger-500 text-neutral-500 focus:border-danger-500 focus:ring-1 focus:ring-danger-500 placeholder-neutral-300",
                },
                withShadow: {
                    on: "",
                    off: "",
                },
            },
        },
    },
    label: {
        root: {
            base: "text-[16px] font-medium font-['Poppins',sans-serif] leading-6",
            colors: {
                default: "text-neutral-500",
            },
            disabled: "opacity-50",
        },
    },
    badge: {
        root: {
            base: "flex h-fit items-center justify-center border font-['Poppins',sans-serif] text-[12px] leading-[18px]",
            color: {
                approved: "bg-[#e9f9ef] border-success-500 text-success-500",
                pending: "bg-[#fdf7e6] border-warning-500 text-warning-500",
                rejected: "bg-[#fdecec] border-danger-500 text-danger-500",
                pengurangan:
                    "bg-neutral-50 border-neutral-300 text-neutral-300",
                belum_lunas:
                    "bg-secondary-50 border-secondary-500 text-secondary-500",
                info: "bg-[#ebf2fe] border-[#3b81f4] text-[#3b81f4]",
            },
            size: {
                sm: "px-2 py-1 rounded-xl",
                md: "px-2 py-1 rounded-xl",
            },
        },
        icon: {
            on: "gap-1",
            off: "",
            size: {
                sm: "w-3 h-3",
                md: "w-3.5 h-3.5",
            },
        },
    },
    checkbox: {
        base: "flex size-[24px] items-center justify-center rounded-[4px] border border-solid border-[#929292] bg-white text-primary-500 outline-none transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus-visible:ring-2",
        color: {
            default: "focus:ring-primary-600 text-primary-500",
        },
    },
};
