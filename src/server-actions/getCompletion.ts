"use server";
import OpenAI from "openai";
import {createChat, updateChat} from "@/db";
import {getServerSession} from "next-auth";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export async function getCompletion(
    chatId: number|null,
    messageHistory: Message[]
) {
    const response = await openai.chat.completions.create({
        model: "o3",
        messages: messageHistory,
    });

    const messages = [
        ...messageHistory,
        response.choices[0].message as unknown as Message
    ];

    const session= await getServerSession();
    let newChatId;

    if(chatId) {
       await updateChat(chatId, messages);
    } else {
        newChatId = await createChat(session?.user?.email || '', messageHistory[0].content, messages)
    }

    return { chatId: chatId || newChatId, messages };
}
