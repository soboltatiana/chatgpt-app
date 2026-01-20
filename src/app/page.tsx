import { Chat } from '@/app/components/Chat';

export default async function Home() {
  return (
      <main className="p-5">
        <h1 className="text-4xl font-bold">Welcome To GPT Chat</h1>
          <Chat />
      </main>
  );
}