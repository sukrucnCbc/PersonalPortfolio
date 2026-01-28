import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-context";
import { PrimeReactProvider } from "primereact/api";

// PrimeReact Styles
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Şükrücan Cebeci - Portfolio & Blog",
  description: "Modern portfolio built with Next.js and 21st.dev",
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PrimeReactProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </PrimeReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
