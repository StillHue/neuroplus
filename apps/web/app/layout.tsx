import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import { AccessibilityProvider } from "@/components/AccessibilityProvider"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Neuroplus",
  description: "Acompanhamento do diagnóstico e cuidado neurodivergente",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Neuroplus",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1e26" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable} suppressHydrationWarning data-theme="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("neuroplus-a11y");if(!s)return;var j=JSON.parse(s);var t=j.state&&j.state.theme;if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  )
}
