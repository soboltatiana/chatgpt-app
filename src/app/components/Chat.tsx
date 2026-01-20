"use client";
import { useState, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {getCompletion, Message} from "@/server-actions/getCompletion";
import {useRouter} from "next/navigation";
import { Transcript } from "@/app/components/Transcript";

interface ChatInterface {
    messages?: Message[],
    chatId?: number,
}

export function Chat({ messages: initialMessages = [], chatId: initialChatId}: ChatInterface ) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [message, setMessage] = useState("");
    const chatId = useRef<number|null>(initialChatId);
    const router = useRouter();

    const onClick = async () => {
        const completion = await getCompletion(chatId.current || null,
            [
            ...messages,
            {
                role: 'user',
                content: message,
            }
        ]);

        if (!chatId.current) {
            router.push(`/chats/${completion.chatId}`);
            return;
        }
        setMessage('');
        setMessages(completion.messages);
        chatId.current = completion.chatId;
    }

    return (
        <div className="flex flex-col">
            <Transcript messages={messages} truncate={false} />
            <div className="flex border-t-2 border-t-gray-500 pt-3 mt-3">
                <Input
                    className="flex-grow text-xl"
                    placeholder="Question"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            onClick();
                        }
                    }}
                />
                <Button onClick={onClick} className="ml-3 text-xl">
                    Send
                </Button>
            </div>
        </div>
    );
}