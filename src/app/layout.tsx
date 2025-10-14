import "./globals.css";
import AuthProvider from "./AuthProvider";

export const metadata = {
  title: "HTI Year 4 App",
  description: "Your Next.js app as a mobile PWA",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#55aaFF" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
