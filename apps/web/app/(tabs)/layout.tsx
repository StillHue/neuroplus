"use client"

import { BottomNav } from "@/components/BottomNav"
import { NavProvider } from "@/components/NavContext"

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavProvider>
      <div className="app-shell">
        <main
          className="min-h-dvh overflow-y-auto overscroll-contain"
          id="main-content"
        >
          {children}
        </main>
        <BottomNav />
      </div>
    </NavProvider>
  )
}
