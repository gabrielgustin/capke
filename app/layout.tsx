import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter, Open_Sans, Anton } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
})

export const metadata: Metadata = {
  title: "La Capke",
  description: "Menú digital de La Capke",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${openSans.variable} ${anton.variable}`}>
      <body className="font-sans bg-lacapke-background min-h-screen">{children}</body>
    </html>
  )
}
