import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Lary Beauty Home",
  description: "Institut de beauté à domicile — Lary Beauty Home",
  authors: [{ name: "Lary Beauty Home" }],
  openGraph: {
    title: "Lary Beauty Home",
    description: "L'art de la beauté à domicile",
    type: "website",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Lary Beauty Home — Institut de beauté à La Rivière Saint Louis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpeg"],
  },
  icons: {
    icon: "/LB.ico",
    shortcut: "/LB.ico",
    apple: "/LB.ico",
    other: {
      rel: "icon",
      url: "/LB.ico",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} font-body antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}