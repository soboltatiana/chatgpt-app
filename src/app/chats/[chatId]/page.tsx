import {getChat} from "@/db";
import {Chat} from "@/app/components/Chat";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {red} from "next/dist/lib/picocolors";

export const dynamic='force-dynamic';

export default async function ChatDetail({
    params
}: {
    params: Promise<{ chatId: string }>;
}) {
    const { chatId } = await params;
    const chat = await getChat(+chatId);

    if (!chat) {
        return notFound();
    }
    const session = await getServerSession();

    if (!session || chat?.user_email !== session?.user?.email) {
        redirect("/");
    }

    return (
        <main>
            <Chat chatId={+chat.id} messages={chat.messages}/>
        </main>
    );
}