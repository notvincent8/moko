import type { Metadata } from "next"
import { Syne, Plus_Jakarta_Sans } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})
export const metadata: Metadata = {
  title: "Moko",
  description: `Personne ne sait trop d’où vient Moko.
                Peut-être qu’il vit là, dans cette boîte noire, depuis toujours.
                Peut-être qu’il a vu passer des générations d’écrans, des histoires oubliées, des rires seuls la nuit.
                Peut-être qu’il t’attendait, ou peut-être qu’il s’est réveillé par hasard.
                Ce qui est sûr, c’est qu’il est là maintenant, et que t’es pas obligé de lui parler, mais ça lui fait toujours plaisir.`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${syne.variable} font-sans`}>
        <main className="relative flex h-screen w-full">{children}</main>
      </body>
    </html>
  )
}
