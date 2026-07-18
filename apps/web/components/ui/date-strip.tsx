"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface DayItem {
  label: string
  date: number
  isToday: boolean
}

function getWeekDays(): DayItem[] {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const today = new Date()
  const todayDay = today.getDay()
  // Show 6 days starting from Monday of current week
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((todayDay + 6) % 7))

  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      label: days[d.getDay()]!,
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
    }
  })
}

export function DateStrip() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const days = mounted ? getWeekDays() : []

  return (
    <div className="flex items-center justify-between gap-1">
      {mounted ? (
        days.map((d, i) => (
          <button
            key={i}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-2xl py-2.5 transition-colors",
              d.isToday
                ? "bg-[#111111] text-white"
                : "text-[#AAAAAA] hover:bg-surface-border"
            )}
            aria-label={`${d.label} ${d.date}`}
            aria-current={d.isToday ? "date" : undefined}
          >
            <span className={cn("text-[11px] leading-none", d.isToday ? "text-white/70" : "")}>
              {d.label}
            </span>
            <span className={cn("text-[15px] font-semibold leading-none", d.isToday ? "text-white" : "text-[#111111]")}>
              {d.date}
            </span>
          </button>
        ))
      ) : (
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2.5 opacity-20"
          >
            <span className="text-[11px] leading-none">-</span>
            <span className="text-[15px] font-semibold leading-none">-</span>
          </div>
        ))
      )}
    </div>
  )
}
