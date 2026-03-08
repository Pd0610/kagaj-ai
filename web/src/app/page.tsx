export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold">KagajAI</h1>
      <p className="mt-4 text-lg text-gray-600">
        AI-powered document generation for Nepal
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/login"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Login
        </a>
        <a
          href="/register"
          className="rounded-lg border border-blue-600 px-6 py-3 text-blue-600 hover:bg-blue-50"
        >
          Register
        </a>
      </div>
    </div>
  );
}
