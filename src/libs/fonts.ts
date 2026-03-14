import localfont from "next/font/local";

const poppins = localfont({
    src: [
        {
            path: "../styles/fonts/Poppins-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../styles/fonts/Poppins-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../styles/fonts/Poppins-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../styles/fonts/Poppins-Bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-poppins",
});

const montserrat = localfont({
    src: [
        {
            path: "../styles/fonts/Montserrat-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../styles/fonts/Montserrat-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../styles/fonts/Montserrat-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../styles/fonts/Montserrat-Bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-montserrat",
});

export { poppins, montserrat };
