import "./globals.css";
import AuthProvider from "./AuthProvider";

export const metadata = {
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
        url: "/icons/uniStream22.png",
        width: 800,
        height: 600,
        alt: "UniStream22 Logo",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  icons: {
    icon: "/icons/uniStream22.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="theme-color" content="#091f42" />
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
          content="/icons/uniStream22.png"
        />
        <meta property="og:url" content="https://unistream22.vercel.app" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
