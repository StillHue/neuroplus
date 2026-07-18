export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-[#EFEFEF]">
      <div className="app-shell w-full">{children}</div>
    </div>
  )
}
