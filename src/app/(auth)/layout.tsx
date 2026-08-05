export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
