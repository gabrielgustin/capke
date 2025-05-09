import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter, Open_Sans } from "next/font/google"
import { AppSplashScreen } from "@/components/app-splash-screen"

const inter = Inter({ subsets: ["latin"] })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })

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
    <html lang="es" className={`${openSans.variable}`}>
      <body className="font-sans bg-lacapke-background min-h-screen">
        <AppSplashScreen>{children}</AppSplashScreen>
      </body>
    </html>
  )
}
