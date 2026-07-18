export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-[#1c1e26]">
      <div className="app-shell w-full">{children}</div>
    </div>
  )
}
