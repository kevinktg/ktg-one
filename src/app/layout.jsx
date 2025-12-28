import { Syne, Ubuntu_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

// OPTIMIZATION: Use 'swap' to ensure branding fonts load even on slower connections.
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
  metadataBase: new URL('https://ktg.one'), // Update this to your production URL
  title: {
    default: ".ktg | Top 0.01% Prompt Engineer",
    template: "%s | .ktg"
  },
  description: "Portfolio of a top 0.01% prompt engineer. Cognitive Software Engineering & Cross-world reasoning across 7 careers.",
  icons: {
    icon: "/assets/ktg.svg",
    shortcut: "/assets/ktg.svg",
  },
  // Social Preview Cards
  openGraph: {
    title: ".ktg | Top 0.01% Prompt Engineer",
    description: "Context continuation solve. Frameworks. Arxiv-ready papers.",
    type: "website",
    locale: "en_AU",
    siteName: "KTG Portfolio",
    images: [
      {
        url: "/assets/og-image.jpg", // Add a 1200x630 image at this path for best results
        width: 1200,
        height: 630,
        alt: "KTG Portfolio Preview",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${syne.variable}
          ${ubuntuMono.variable}
          antialiased
          bg-black
          text-white
          overflow-x-hidden
          selection:bg-white
          selection:text-black
        `}
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
          <SpeedInsights />
        </ClientLayout>
      </body>
    </html>
  );
}