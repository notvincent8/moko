import type { Metadata } from "next"
import { Jersey_25, Roboto } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const jersey = Jersey_25({
  subsets: ["latin"],
  variable: "--font-jersey",
  weight: "400",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
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
      <body className={`antialiased ${roboto.variable} ${jersey.className} bg-orange-1 text-orange-11`}>
        <main className="relative flex h-screen w-full">{children}</main>
      </body>
    </html>
  )
}
