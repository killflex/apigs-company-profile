import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { SmoothScroll } from "@/components/utils/smooth-scroll";

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "APIGS Indonesia - Company Profile",
  description:
    "Discover APIGS Indonesia, a leading company dedicated to innovation and excellence. Learn more about our services, vision, and mission.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${fontPoppins.className} antialiased`}>
        <SmoothScroll>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModeToggle />
            {children}
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
