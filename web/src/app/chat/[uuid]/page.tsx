export default async function ChatPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-lg font-semibold">Conversation</h1>
        <p className="text-sm text-gray-500">{uuid}</p>
      </header>
      <main className="flex-1 p-6">
        {/* TODO: Chat messages, input */}
      </main>
    </div>
  );
}
