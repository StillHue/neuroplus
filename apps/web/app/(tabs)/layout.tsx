"use client"

import { BottomNav } from "@/components/BottomNav"
import { AccessibilityProvider } from "@/components/AccessibilityProvider"

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      <div className="app-shell">
        <main
          className="min-h-dvh overflow-y-auto overscroll-contain"
          id="main-content"
        >
          {children}
        </main>
        <BottomNav />
      </div>
    </AccessibilityProvider>
  )
}
