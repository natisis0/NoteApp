export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
