"use server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export async function getCompletion(
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

    return { messages };
}
