export default function JornadaLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Desktop: centres the full-screen chat in the same 430px column */
    <div className="flex min-h-dvh items-start justify-center bg-[var(--color-bg)]">
      {children}
    </div>
  )
}
