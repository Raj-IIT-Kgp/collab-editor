export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">CoScribe</h1>
          <p className="text-gray-500 mt-2 text-sm">Collaborate in real-time, effortlessly.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
