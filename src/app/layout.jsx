import { Syne, Ubuntu_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const ubuntuMono = Ubuntu_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: ".ktg | Top 0.01% Prompt Engineer",
  description: "Portfolio of a top 0.1% prompt engineer. Cross-world reasoning across 7 careers.",
  icons: {
    icon: "/assets/Logo-dark-favicon.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${ubuntuMono.variable} antialiased bg-black text-white overflow-x-hidden`} suppressHydrationWarning>
        <ClientLayout>
          {children}
          <SpeedInsights />
        </ClientLayout>
      </body>
    </html>
  );
}

