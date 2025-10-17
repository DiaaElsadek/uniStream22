import "./globals.css";
import AuthProvider from "./AuthProvider";

export const metadata = {
  title: "UniStream22",
  description:
    "UniStream22 — منصة لدفعة رابعة بالمعهد التكنولوجي العالي كلية الحاسبات والمعلومات لمتابعة المواد والجداول والأخبار الجامعية بسهولة",
  icons: {
    icon: "../../public/icons/uniStream22.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#55aaff" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const colors = ['#55aaff', '#8b5cf6', '#22d3ee', '#3b82f6'];
              let i = 0;
              setInterval(() => {
                // تغيّر كل 1 ثانية لتقريب حركة الـ gradient
                document.querySelector('meta[name="theme-color"]').setAttribute('content', colors[i % colors.length]);
                i++;
              }, 1000);
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
