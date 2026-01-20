import {getServerSession} from "next-auth";
import {getChatsWithMessages} from "@/db";
import {redirect} from "next/navigation";
import {Transcript} from "@/app/components/Transcript";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";

export async function PreviousChats() {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
        redirect('/');
    }
    const chats = await getChatsWithMessages(session.user.email);

    if(chats.length === 0) {
        return (
            <div>
                <div className="flex justify-center">
                    <div className="text-gray-500 italic text-2xl">
                        No previous chats
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <Separator className="m-5" />
                <div className="text-2xl font-bold">Previous Chat Sessions</div>
                <div className="grid grid-cols-1 md:grid-cols-3">

                    {chats.map(chat => (
                        <div key={chat.id} className="m-1 border-2 rounded-xl">
                            <Link
                                href={`/chats/${chat.id}`}
                                className="text-lg line-clamp-1 px-5 py-2 text-white bg-blue-900 rounded-t-lg"
                            >
                                {chat.name}
                            </Link>
                            <div className="p-3">
                                <Transcript key={chat.id} messages={chat.messages} truncate={true}/>
                            </div>
                        </div>
                    ))}
                </div>
                <Separator className="my-5" />
            </div>
        )
    }
}