"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// const headers = {
//     apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
//     Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
//     "Content-Type": "application/json",
// }

const headers = {
    apikey: process.env.NEXT_PUBLIC_API_KEY!, // خليها في .env.local
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN!}`,
    "Content-Type": "application/json",
};

async function handelLogin(userToken: string): Promise<boolean> {
    const res = await fetch(`/api/auth?userToken=${userToken}`, { headers });
    const data = await res.json();
    return data.status;
}

async function handelRole(userToken: string): Promise<boolean> {
    const res = await fetch(`/api/auth?userToken=${userToken}`, { headers });
    const data = await res.json();
    console.log("Data Role", data.user?.Role);
    return data.user?.Role === "admin";
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const userToken = localStorage.getItem("userToken");
            if (!userToken) return;

            const loggedIn = await handelLogin(userToken);
            setIsLogged(loggedIn);

            // if (!loggedIn && !pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
            //     router.replace("/login");
            // }

            if ((pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard/addnews")) &&
                !(await handelRole(userToken))) {
                router.replace("/home");
            }

            if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && loggedIn) {
                router.replace("/home");
            }
        };

        checkAuth();
    }, [pathname]);

    return <>{children}</>;
}
