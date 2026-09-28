import "./globals.css";
import AuthProvider from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Plus_Jakarta_Sans, Cairo } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  metadataBase: new URL("https://unistream22.vercel.app"),
  title: "UniStream22",
  description:
    "UniStream22 — منصة مخصصة لدفعة رابعة في المعهد التكنولوجي العالي، كلية الحاسبات والمعلومات، لمتابعة المواد والجداول والأخبار الجامعية بسهولة وسرعة في مكان واحد.",
  keywords:
    "unistream22, UniStream22, uniStream22, Unistream22, HTI4, Hti4, hti4, hti, HTI, رابعة حاسبات العاشر, unistream, UniStream, كلية الحاسبات والمعلومات, طلاب HTI, منصة تعليمية, جدول المحاضرات, مواد دراسية",
  author: "Diaa Elsadek",
  openGraph: {
    title: "UniStream22",
    description:
      "منصة متكاملة لطلاب كلية الحاسبات بالمعهد التكنولوجي العالي لمتابعة كل ما يخص الدراسة بسهولة.",
    url: "https://unistream22.vercel.app",
    siteName: "UniStream22",
    images: [
      {
        url: "/icons/UniStream22-dark-logo.png",
        width: 800,
        height: 600,
        alt: "UniStream22 Logo",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  icons: {
    icon: [{ url: "/icons/UniStream22-dark-logo.png", type: "image/png" }],
    shortcut: [{ url: "/icons/UniStream22-dark-logo.png", type: "image/png" }],
    apple: [{ url: "/icons/UniStream22-dark-logo.png", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#091f42" />
        <link
          rel="icon"
          href="/icons/UniStream22-dark-logo.png"
          type="image/png"
        />
        <link
          rel="shortcut icon"
          href="/icons/UniStream22-dark-logo.png"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/icons/UniStream22-dark-logo.png" />

        <meta
          name="description"
          content="UniStream22 — منصة لدفعة رابعة بالمعهد التكنولوجي العالي كلية الحاسبات والمعلومات لمتابعة المواد والجداول والأخبار الجامعية بسهولة"
        />
        <meta
          name="keywords"
          content="unistream22, UniStream22, uniStream22, Unistream22, HTI4, Hti4, hti4, hti, HTI, رابعة حاسبات العاشر, unistream, UniStream, كلية الحاسبات والمعلومات, طلاب HTI, منصة تعليمية, جدول المحاضرات, مواد دراسية"
        />
        <meta name="author" content="Diaa Elsadek" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_EG" />
        <meta property="og:site_name" content="UniStream22" />
        <meta property="og:title" content="UniStream22 | منصة طلاب HTI" />
        <meta
          property="og:description"
          content="منصة متكاملة لطلاب كلية الحاسبات بالمعهد التكنولوجي العالي لمتابعة كل ما يخص الدراسة بسهولة."
        />
        <meta
          property="og:image"
          content="https://github.com/DiaaElsadek/uniStream22-test/blob/5c1e0fcf1e9db6d49393c46e9c6eb2e7f45ae2df/public/icons/UniStream22-dark-logo.png"
        />
        <meta property="og:url" content="https://unistream22.vercel.app" />
      </head>
      <body className={`${jakarta.variable} ${inter.variable} ${cairo.variable} font-sans antialiased bg-background text-foreground min-h-screen selection:bg-primary/20 selection:text-primary`}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
            <SpeedInsights />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
