import type { Metadata } from "next";
import "./style.css";
import InstallPrompt from "./InstallPrompt";

export const metadata: Metadata = {
    title: "uniStream22",
    description: "كل أخبار وجداول الدفعة في مكان واحد.",
    icons: {
        icon: "/icons/UniStream22-dark-logo.png",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InstallPrompt />
            {children}
        </>
    );
}
