import { getServerSession } from "next-auth";

import ChatMenu from "@/app/components/ChatMenu";

export default async function ChatMenuColumn() {
    const session = await getServerSession();
    const authenticated = !!session?.user?.email;

    return authenticated ? (
        <div className="md:w-1/4 md:min-w-1/3 w-full text-nowrap">
            <ChatMenu />
        </div>
    ) : null;
}