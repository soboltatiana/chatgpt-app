import { Chat } from '@/app/components/Chat';
import {PreviousChats} from "@/app/components/PreviousChats";
import {Separator} from "@/components/ui/separator"
import {Suspense} from "react";

export default async function Home() {
  return (
      <main className="p-5">
          <h1 className="text-4xl font-bold">Welcome To GPT Chat</h1>
          <Suspense fallback="loading">
            <PreviousChats />
          </Suspense>
          <h4 className="mt-5 text-2xl font-bold">New Chat Session</h4>
          <Separator className="my-5"/>
          <Chat/>
      </main>
  );
}