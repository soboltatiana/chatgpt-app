import { supabaseServer } from "@/lib/supabase";
import type { Chat, ChatWithMessages, Message, StoredMessage } from "@/types";

export async function createChat(
    userEmail: string,
    name: string,
    msgs: Message[]
): Promise<number> {
    const { data: chat, error: chatError } = await supabaseServer
        .from('chats')
        .insert({ user_email: userEmail, name })
        .select('id')
        .single();

    if (chatError) {
        throw new Error(`Failed to create chat: ${chatError.message}`);
    }

    const chatId = chat.id;

    if (msgs.length > 0) {
        const messagesToInsert = msgs.map(msg => ({
            chat_id: chatId,
            role: msg.role,
            content: msg.content
        }));

        const { error: messagesError } = await supabaseServer
            .from('messages')
            .insert(messagesToInsert);

        if (messagesError) {
            throw new Error(`Failed to create messages: ${messagesError.message}`);
        }
    }

    return chatId;
}

export async function getChat(
    chatId: number
): Promise<ChatWithMessages | null> {
    const { data: chat, error: chatError } = await supabaseServer
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .single();

    if (chatError) {
        if (chatError.code === 'PGRST116') {
            return null;
        }
        throw new Error(`Failed to get chat: ${chatError.message}`);
    }

    const { data: messages, error: messagesError } = await supabaseServer
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('id', { ascending: true });

    if (messagesError) {
        throw new Error(`Failed to get messages: ${messagesError.message}`);
    }

    return {
        ...chat,
        createdAt: new Date(chat.created_at),
        messages: messages as StoredMessage[]
    } as ChatWithMessages;
}

export async function getChats(userEmail: string): Promise<Chat[]> {
    const { data: chats, error } = await supabaseServer
        .from('chats')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Failed to get chats: ${error.message}`);
    }

    return (chats || []).map(chat => ({
        ...chat,
        createdAt: new Date(chat.created_at)
    })) as Chat[];
}

export async function getChatsWithMessages(
    userEmail: string
): Promise<ChatWithMessages[]> {
    const { data: chats, error: chatsError } = await supabaseServer
        .from('chats')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false })
        .limit(3);

    if (chatsError) {
        throw new Error(`Failed to get chats: ${chatsError.message}`);
    }

    if (!chats || chats.length === 0) {
        return [];
    }

    const chatIds = chats.map(chat => chat.id);

    const { data: messages, error: messagesError } = await supabaseServer
        .from('messages')
        .select('*')
        .in('chat_id', chatIds)
        .order('id', { ascending: true });

    if (messagesError) {
        throw new Error(`Failed to get messages: ${messagesError.message}`);
    }

    const messagesByChat = (messages || []).reduce((acc, msg) => {
        if (!acc[msg.chat_id]) {
            acc[msg.chat_id] = [];
        }
        acc[msg.chat_id].push(msg as StoredMessage);
        return acc;
    }, {} as Record<number, StoredMessage[]>);

    return chats.map(chat => ({
        ...chat,
        createdAt: new Date(chat.created_at),
        messages: messagesByChat[chat.id] || []
    })) as ChatWithMessages[];
}

export async function getMessages(chatId: number): Promise<StoredMessage[]> {
    const { data: messages, error } = await supabaseServer
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('id', { ascending: true });

    if (error) {
        throw new Error(`Failed to get messages: ${error.message}`);
    }

    return (messages || []) as StoredMessage[];
}

export async function updateChat(chatId: number, msgs: Message[]): Promise<void> {
    const { error: deleteError } = await supabaseServer
        .from('messages')
        .delete()
        .eq('chat_id', chatId);

    if (deleteError) {
        throw new Error(`Failed to delete messages: ${deleteError.message}`);
    }

    if (msgs.length > 0) {
        const messagesToInsert = msgs.map(msg => ({
            chat_id: chatId,
            role: msg.role,
            content: msg.content
        }));

        const { error: insertError } = await supabaseServer
            .from('messages')
            .insert(messagesToInsert);

        if (insertError) {
            throw new Error(`Failed to insert messages: ${insertError.message}`);
        }
    }
}
