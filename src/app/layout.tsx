import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'SEEDS Experience — Comunidade de Mulheres Empreendedoras',
    template: '%s | SEEDS Experience',
  },
  description:
    'Comunidade exclusiva que conecta mulheres empreendedoras e marcas parceiras através de experiências imersivas curadas.',
  openGraph: {
    title: 'SEEDS Experience — Comunidade de Mulheres Empreendedoras',
    description:
      'Networking de alto valor, capacitação e conexões entre mulheres empreendedoras.',
    url: '/',
    siteName: 'SEEDS Experience',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEEDS Experience',
    description:
      'Networking de alto valor, capacitação e conexões entre mulheres empreendedoras.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
