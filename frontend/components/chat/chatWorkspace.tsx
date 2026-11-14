"use client";

import { API_BASE_URL } from "@/lib/api";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/state/store";
import { useSocket } from "@/context/socketContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Check, CheckCheck, CircleUserRound, LoaderCircle, LockKeyhole, MessageCircle, MessageSquareText, Search, Send, ShieldCheck, X } from "lucide-react";

type Participant = { _id?: string; name?: string; profilePicture?: string } | string;
type Conversation = {
    _id: string;
    recruiter: Participant;
    candidate: Participant;
    job: { _id?: string; title?: string; company?: { name?: string; logo?: string } } | string;
    status: "open" | "closed";
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount?: number;
};
type ChatMessage = {
    _id: string;
    conversation: string;
    sender: Participant;
    receiver: string;
    content: string;
    createdAt?: string;
    isRead?: boolean;
};

const idOf = (value: Participant | undefined) => typeof value === "object" ? value?._id ?? "" : value ?? "";
const personOf = (value: Participant | undefined) => typeof value === "object" ? value : undefined;
const timeOf = (date?: string) => date ? new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";
const dateOf = (date?: string) => date ? new Date(date).toLocaleDateString([], { month: "short", day: "numeric" }) : "";

export default function ChatWorkspace() {
    const user = useAuthStore((state) => state.user);
    const { socket } = useSocket();
    const searchParams = useSearchParams();
    const requestedConversation = searchParams.get("conversation");
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedId, setSelectedId] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageText, setMessageText] = useState("");
    const [search, setSearch] = useState("");
    const [loadingList, setLoadingList] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [typing, setTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [socketError, setSocketError] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typingSendTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typingStopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const selectedConversation = conversations.find((conversation) => conversation._id === selectedId);
    const isRecruiter = user?.role === "recruiter";
    const participant = selectedConversation
        ? personOf(isRecruiter ? selectedConversation.candidate : selectedConversation.recruiter)
        : undefined;
    const filteredConversations = useMemo(() => conversations.filter((conversation) => {
        const other = personOf(isRecruiter ? conversation.candidate : conversation.recruiter);
        const job = typeof conversation.job === "object" ? conversation.job : undefined;
        return `${other?.name ?? "Candidate"} ${job?.title ?? ""} ${job?.company?.name ?? ""}`.toLowerCase().includes(search.trim().toLowerCase());
    }), [conversations, isRecruiter, search]);

    const loadConversations = useCallback(async () => {
        if (!user?._id) return;
        setLoadingList(true);
        try {
            const response = await fetch(`${API_BASE_URL}/chat/conversations`, { credentials: "include" });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Could not load conversations");
            const items = Array.isArray(result.data) ? result.data as Conversation[] : [];
            setConversations(items);
            setSelectedId((current) => {
                if (requestedConversation && items.some((item) => item._id === requestedConversation)) return requestedConversation;
                return current && items.some((item) => item._id === current) ? current : items[0]?._id ?? "";
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not load conversations");
        } finally {
            setLoadingList(false);
        }
    }, [requestedConversation, user?._id]);

    useEffect(() => { void loadConversations(); }, [loadConversations]);

    useEffect(() => {
        if (!socket) { setSocketConnected(false); return; }
        const handleConnect = () => { setSocketConnected(true); setSocketError(false); };
        const handleDisconnect = () => setSocketConnected(false);
        const handleConnectError = () => { setSocketConnected(false); setSocketError(true); };
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        if (socket.connected) handleConnect();
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
        };
    }, [socket]);

    useEffect(() => {
        if (!selectedId) { setMessages([]); return; }
        const controller = new AbortController();
        const loadMessages = async () => {
            setLoadingMessages(true);
            try {
                const response = await fetch(`${API_BASE_URL}/chat/conversations/${selectedId}/messages`, { credentials: "include", signal: controller.signal });
                const result = await response.json();
                if (!response.ok || !result.success) throw new Error(result.message || "Could not load messages");
                setMessages(Array.isArray(result.data) ? result.data : []);
                setConversations((current) => current.map((item) => item._id === selectedId ? { ...item, unreadCount: 0 } : item));
            } catch (error) {
                if (!(error instanceof DOMException && error.name === "AbortError")) toast.error(error instanceof Error ? error.message : "Could not load messages");
            } finally {
                if (!controller.signal.aborted) setLoadingMessages(false);
            }
        };
        void loadMessages();
        return () => controller.abort();
    }, [selectedId]);

    useEffect(() => {
        if (!socket) return;
        const handleMessage = (message: ChatMessage) => {
            setMessages((current) => {
                if (message.conversation === selectedId && !current.some((item) => item._id === message._id)) return [...current, message];
                return current;
            });
            setConversations((current) => current.map((conversation) => conversation._id === message.conversation ? {
                ...conversation,
                lastMessage: message.content,
                lastMessageAt: message.createdAt,
                unreadCount: message.conversation === selectedId || idOf(message.sender) === String(user?._id)
                    ? conversation.unreadCount
                    : (conversation.unreadCount ?? 0) + 1,
            } : conversation).sort((a, b) => new Date(b.lastMessageAt ?? 0).getTime() - new Date(a.lastMessageAt ?? 0).getTime()));
            if (message.conversation === selectedId && idOf(message.sender) !== String(user?._id)) {
                socket.emit("chat:read", { conversationId: message.conversation });
            }
        };
        const handleConversation = (conversation: Conversation) => {
            setConversations((current) => current.some((item) => item._id === conversation._id)
                ? current.map((item) => item._id === conversation._id ? { ...item, ...conversation } : item)
                : [conversation, ...current]);
            if (!selectedId) setSelectedId(conversation._id);
        };
        const handleConversationUpdate = (event: { conversationId: string; conversation: Conversation }) => {
            setConversations((current) => current.map((item) => item._id === event.conversationId ? { ...item, ...event.conversation, unreadCount: item.unreadCount } : item));
        };
        const handleTyping = (event: { conversationId: string; userId: string; isTyping: boolean }) => {
            if (event.conversationId !== selectedId || event.userId === String(user?._id)) return;
            setTyping(event.isTyping);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            if (event.isTyping) typingTimeout.current = setTimeout(() => setTyping(false), 2500);
        };
        const handleReadReceipt = (event: { conversationId: string; readerId: string }) => {
            if (event.readerId === String(user?._id)) return;
            setMessages((current) => current.map((message) => message.conversation === event.conversationId && idOf(message.sender) === String(user?._id) ? { ...message, isRead: true } : message));
        };
        socket.on("chat:message", handleMessage);
        socket.on("chat:conversation", handleConversation);
        socket.on("chat:conversation-updated", handleConversationUpdate);
        socket.on("chat:typing", handleTyping);
        socket.on("chat:read-receipt", handleReadReceipt);
        return () => {
            socket.off("chat:message", handleMessage);
            socket.off("chat:conversation", handleConversation);
            socket.off("chat:conversation-updated", handleConversationUpdate);
            socket.off("chat:typing", handleTyping);
            socket.off("chat:read-receipt", handleReadReceipt);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            if (typingSendTimeout.current) clearTimeout(typingSendTimeout.current);
            if (typingStopTimeout.current) clearTimeout(typingStopTimeout.current);
        };
    }, [selectedId, socket, user?._id]);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selectedId]);

    const sendMessage = async (event?: FormEvent) => {
        event?.preventDefault();
        const content = messageText.trim();
        if (!content || !selectedConversation || selectedConversation.status !== "open" || !socket || !socketConnected || sending) return;
        setSending(true);
        socket.timeout(10000).emit("chat:send", { conversationId: selectedConversation._id, content }, (timeoutError: Error | null, result: { success?: boolean; message?: string; data?: ChatMessage }) => {
            setSending(false);
            if (timeoutError || !result?.success || !result.data) {
                toast.error(result?.message || "Message could not be sent. Check your connection and try again.");
                return;
            }
            setMessageText("");
            socket?.emit("chat:typing", { conversationId: selectedConversation._id, isTyping: false });
            setMessages((current) => current.some((item) => item._id === result.data?._id) ? current : [...current, result.data!]);
        });
    };

    const changeStatus = async (status: "open" | "closed") => {
        if (!selectedConversation || updatingStatus) return;
        setUpdatingStatus(true);
        try {
            const response = await fetch(`${API_BASE_URL}/chat/conversations/${selectedConversation._id}/status`, {
                method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Could not update conversation");
            setConversations((current) => current.map((item) => item._id === selectedConversation._id ? { ...item, ...result.data, unreadCount: item.unreadCount } : item));
            toast.success(status === "closed" ? "Conversation ended" : "Conversation reopened");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not update conversation");
        } finally { setUpdatingStatus(false); }
    };

    const handleTypingInput = (value: string) => {
        setMessageText(value);
        if (!selectedConversation || !socket || !socketConnected) return;
        if (typingSendTimeout.current) clearTimeout(typingSendTimeout.current);
        if (typingStopTimeout.current) clearTimeout(typingStopTimeout.current);
        if (!value.trim()) {
            socket.emit("chat:typing", { conversationId: selectedConversation._id, isTyping: false });
            return;
        }
        typingSendTimeout.current = setTimeout(() => {
            socket?.emit("chat:typing", { conversationId: selectedConversation._id, isTyping: true });
            typingStopTimeout.current = setTimeout(() => socket?.emit("chat:typing", { conversationId: selectedConversation._id, isTyping: false }), 1800);
        }, 250);
    };

    const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); }
    };

    return (
        <main className="mx-auto w-full max-w-7xl space-y-5 pb-8">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">Your inbox</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Messages</h1><p className="mt-1 text-sm text-slate-500">{isRecruiter ? "Talk with applicants and coordinate the next step." : "Keep up with recruiters who want to discuss your application."}</p></div>
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:self-auto"><ShieldCheck className="h-3.5 w-3.5" />Private conversations</div>
            </header>

            <section className="grid min-h-[620px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.04] md:h-[min(78vh,820px)] md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)]">
                <aside className="flex min-h-0 flex-col border-b border-slate-200 md:border-b-0 md:border-r">
                    <div className="border-b border-slate-100 p-4 sm:p-5"><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-900">Conversations</h2><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{conversations.length}</span></div><label className="relative mt-3 block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" /></label></div>
                    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                        {loadingList ? <div className="grid h-32 place-items-center"><LoaderCircle className="h-5 w-5 animate-spin text-violet-700" /></div> : filteredConversations.length ? filteredConversations.map((conversation) => {
                            const other = personOf(isRecruiter ? conversation.candidate : conversation.recruiter);
                            const job = typeof conversation.job === "object" ? conversation.job : undefined;
                            const active = selectedId === conversation._id;
                            return <button type="button" key={conversation._id} onClick={() => setSelectedId(conversation._id)} className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${active ? "bg-violet-50 ring-1 ring-violet-100" : "hover:bg-slate-50"}`}>
                                <Avatar className="h-11 w-11 shrink-0 rounded-xl"><AvatarImage src={other?.profilePicture} alt="" /><AvatarFallback className="rounded-xl bg-indigo-50 font-semibold text-indigo-700">{(other?.name || "U").slice(0, 1).toUpperCase()}</AvatarFallback></Avatar>
                                <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-slate-900">{other?.name || (isRecruiter ? "Candidate" : "Recruiter")}</span><span className="shrink-0 text-[10px] text-slate-400">{dateOf(conversation.lastMessageAt)}</span></span><span className="mt-0.5 block truncate text-xs font-medium text-violet-700">{job?.title || "Job application"}</span><span className="mt-1 flex items-center justify-between gap-2"><span className="truncate text-xs text-slate-500">{conversation.lastMessage || "Conversation started"}</span>{conversation.unreadCount ? <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-violet-700 px-1 text-[10px] font-bold text-white">{conversation.unreadCount}</span> : null}</span></span>
                            </button>;
                        }) : <div className="px-5 py-10 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500"><MessageSquareText className="h-5 w-5" /></span><p className="mt-3 text-sm font-semibold text-slate-800">{search ? "No matches found" : "No conversations yet"}</p><p className="mx-auto mt-1 max-w-[220px] text-xs leading-5 text-slate-500">{isRecruiter ? "Open an applicant list from My Jobs and start a conversation with a candidate." : "A recruiter can start a private conversation with you from one of your applications."}</p></div>}
                    </div>
                </aside>

                {selectedConversation ? <section className="flex min-h-[520px] min-w-0 flex-col md:min-h-0">
                    <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3"><Avatar className="h-10 w-10 rounded-xl"><AvatarImage src={participant?.profilePicture} alt="" /><AvatarFallback className="rounded-xl bg-violet-50 text-violet-700">{(participant?.name || "U").slice(0, 1).toUpperCase()}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{participant?.name || "Conversation"}</p><p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500"><BriefcaseBusiness className="h-3 w-3 shrink-0" />{typeof selectedConversation.job === "object" ? selectedConversation.job.title : "Job application"}</p></div></div>
                        <div className="flex shrink-0 items-center gap-2"><span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${selectedConversation.status === "open" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{selectedConversation.status === "open" ? "Open" : "Ended"}</span>{isRecruiter && <Button type="button" variant="outline" disabled={updatingStatus} onClick={() => void changeStatus(selectedConversation.status === "open" ? "closed" : "open")} className={`h-9 rounded-lg px-3 text-xs font-semibold ${selectedConversation.status === "open" ? "border-rose-200 text-rose-700 hover:bg-rose-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}>{updatingStatus ? <LoaderCircle className="h-4 w-4 animate-spin" /> : selectedConversation.status === "open" ? <><X className="mr-1.5 h-3.5 w-3.5" />End conversation</> : <><Check className="mr-1.5 h-3.5 w-3.5" />Reopen</>}</Button>}</div>
                    </header>

                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f8f9fc] px-4 py-5 sm:px-7">
                        <div className="mx-auto mb-5 flex max-w-lg items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-5 text-slate-500"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" /><span>This conversation is private and about <strong className="font-semibold text-slate-700">{typeof selectedConversation.job === "object" ? selectedConversation.job.title : "this job application"}</strong>.</span></div>
                        {loadingMessages ? <div className="grid flex-1 place-items-center"><LoaderCircle className="h-5 w-5 animate-spin text-violet-700" /></div> : messages.length ? <div className="mt-auto space-y-3">{messages.map((message) => {
                            const ownMessage = idOf(message.sender) === String(user?._id);
                            const sender = personOf(message.sender);
                            return <div key={message._id} className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}><div className={`max-w-[min(85%,560px)] rounded-2xl px-4 py-2.5 shadow-sm ${ownMessage ? "rounded-br-md bg-violet-700 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-800"}`}><p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p><div className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] ${ownMessage ? "text-violet-200" : "text-slate-400"}`}><time>{timeOf(message.createdAt)}</time>{ownMessage && (message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}{!ownMessage && <span className="sr-only">Message from {sender?.name || participant?.name}</span>}</div></div></div>;
                        })}</div> : <div className="grid flex-1 place-items-center"><div className="max-w-sm text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm"><MessageCircle className="h-5 w-5" /></span><p className="mt-3 text-sm font-semibold text-slate-800">Start the conversation</p><p className="mt-1 text-xs leading-5 text-slate-500">{isRecruiter ? "Introduce yourself and let the candidate know what you’d like to discuss." : "Reply here to discuss the role with the recruiter."}</p></div></div>}
                        {typing && <p className="mt-3 text-xs italic text-slate-400">{participant?.name || "They"} is typing…</p>}
                        <div ref={bottomRef} />
                    </div>

                    {selectedConversation.status === "closed" ? <div className="flex items-start gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /><div><p className="text-sm font-semibold text-slate-800">This conversation has ended</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{isRecruiter ? "The candidate can’t send messages while it’s closed. Reopen the conversation to continue." : "The recruiter ended this conversation. You can no longer send messages here."}</p></div></div> : <form onSubmit={(event) => void sendMessage(event)} className="border-t border-slate-100 bg-white p-3 sm:p-4"><div className="flex items-end gap-2"><textarea value={messageText} maxLength={4000} onChange={(event) => handleTypingInput(event.target.value)} onKeyDown={handleComposerKeyDown} placeholder="Write a message…" rows={1} className="max-h-32 min-h-11 flex-1 resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100" /><Button type="submit" disabled={!messageText.trim() || sending || !socketConnected} aria-label="Send message" className="h-11 w-11 shrink-0 rounded-xl bg-violet-700 p-0 hover:bg-violet-800 disabled:bg-slate-200"><span className="sr-only">Send message</span>{sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button></div><div className="mt-1.5 flex items-center justify-between px-1"><span className="text-[10px] text-slate-400">Enter to send · Shift + Enter for a new line</span><span className="text-[10px] text-slate-400">{messageText.length}/4000</span></div></form>}
                </section> : <section className="hidden min-h-0 place-items-center bg-[#f8f9fc] p-8 text-center md:grid"><div className="max-w-sm"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm"><MessageSquareText className="h-6 w-6" /></span><h2 className="mt-4 text-lg font-semibold text-slate-900">Choose a conversation</h2><p className="mt-1 text-sm leading-6 text-slate-500">Select a conversation from the list to view messages and continue the discussion.</p></div></section>}
            </section>
            {!socketConnected && user && <p className="flex items-center gap-2 text-xs text-amber-700"><CircleUserRound className="h-3.5 w-3.5" />{socketError ? "Live connection lost. Reconnecting…" : "Connecting to live messages…"}</p>}
        </main>
    );
}
