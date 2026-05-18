import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Search, Send } from "lucide-react";
import { toast } from "sonner";
import PageHeading from "@/components/ui/page-heading";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatService } from "@/api/chat.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { ChatPeer, IChatConversation } from "@/types/chat";
import { isSameChatUser, isStudentChatPeer, normalizeChatUserId } from "@/types/chat";

const formatTime = (value?: string) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatListTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return formatTime(value);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
};

const getInitials = (name?: string) =>
  (name || "S")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const StudentChatPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [peerSearch, setPeerSearch] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activePeer, setActivePeer] = useState<ChatPeer | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);

  const currentUserId = normalizeChatUserId(user?._id);

  const conversationsQuery = useQuery({
    queryKey: ["chat-conversations"],
    queryFn: chatService.fetchConversations,
    refetchInterval: 8000,
  });

  const peersQuery = useQuery({
    queryKey: ["chat-peers", peerSearch],
    queryFn: () => chatService.fetchPeers(peerSearch || undefined),
    enabled: showNewChat,
  });

  const messagesQuery = useQuery({
    queryKey: ["chat-messages", activeConversationId],
    queryFn: () => chatService.fetchMessages(activeConversationId!),
    enabled: Boolean(activeConversationId),
    refetchInterval: activeConversationId ? 3000 : false,
  });

  const conversations = useMemo(
    () =>
      (conversationsQuery.data || []).filter(
        (c) =>
          isStudentChatPeer(c.peer) &&
          c.peer &&
          !isSameChatUser(c.peer._id, currentUserId),
      ),
    [conversationsQuery.data, currentUserId],
  );

  const chatPeers = useMemo(
    () =>
      (peersQuery.data || []).filter(
        (peer) => isStudentChatPeer(peer) && !isSameChatUser(peer._id, currentUserId),
      ),
    [peersQuery.data, currentUserId],
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c._id === activeConversationId),
    [conversations, activeConversationId],
  );

  const startChatMutation = useMutation({
    mutationFn: chatService.getOrCreateConversation,
    onSuccess: (conversation) => {
      void queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
      const peer = conversation.peer;
      if (!peer || isSameChatUser(peer._id, currentUserId)) {
        toast.error("You cannot chat with yourself.");
        return;
      }
      setActiveConversationId(conversation._id);
      setActivePeer(peer);
      setShowNewChat(false);
      setPeerSearch("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Could not start chat.");
    },
  });

  const sendMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      chatService.sendMessage(conversationId, { content }),
    onSuccess: () => {
      setMessageDraft("");
      void queryClient.invalidateQueries({ queryKey: ["chat-messages", activeConversationId] });
      void queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send message.");
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesQuery.data]);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      const first = conversations[0];
      setActiveConversationId(first._id);
      setActivePeer(first.peer || null);
    }
  }, [conversations, activeConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;
    const match = conversations.find((c) => c._id === activeConversationId);
    if (match?.peer && !isSameChatUser(match.peer._id, currentUserId)) {
      setActivePeer(match.peer);
    }
  }, [activeConversationId, conversations, currentUserId]);

  const handleStartChat = (peer: ChatPeer) => {
    if (isSameChatUser(peer._id, currentUserId)) {
      toast.error("You cannot chat with yourself.");
      return;
    }
    startChatMutation.mutate({ peerId: peer._id });
  };

  const handleSend = () => {
    if (!activeConversationId || !messageDraft.trim()) return;
    sendMutation.mutate({ conversationId: activeConversationId, content: messageDraft.trim() });
  };

  const peer =
    activePeer && !isSameChatUser(activePeer._id, currentUserId)
      ? activePeer
      : activeConversation?.peer &&
          !isSameChatUser(activeConversation.peer._id, currentUserId)
        ? activeConversation.peer
        : undefined;
  const messages = messagesQuery.data || [];

  return (
    <section className="space-y-6">
      <PageHeading title="Peer Chat" />

      <Card className="overflow-hidden border-muted shadow-sm">
        <div className="grid min-h-[32rem] md:grid-cols-[320px_1fr]">
          {/* Conversations sidebar */}
          <div className="flex flex-col border-b md:border-b-0 md:border-r">
            <div className="border-b p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold">Messages</h2>
                <Button
                  size="sm"
                  variant={showNewChat ? "secondary" : "outline"}
                  onClick={() => setShowNewChat((prev) => !prev)}
                >
                  {showNewChat ? "Cancel" : "New Chat"}
                </Button>
              </div>
              {showNewChat && (
                <div className="mt-3 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={peerSearch}
                      onChange={(e) => setPeerSearch(e.target.value)}
                      placeholder="Search students..."
                      className="pl-9"
                    />
                  </div>
                  <div className="max-h-48 space-y-1 overflow-y-auto">
                    {chatPeers.map((student) => (
                      <button
                        key={student._id}
                        type="button"
                        onClick={() => handleStartChat(student)}
                        disabled={startChatMutation.isPending}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted/60"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.image} />
                          <AvatarFallback className="bg-indigo-600 text-xs text-white">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{student.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            @{student.username}
                          </p>
                        </div>
                      </button>
                    ))}
                    {showNewChat && !peersQuery.isLoading && chatPeers.length === 0 && (
                      <p className="py-4 text-center text-xs text-muted-foreground">
                        No students found.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {conversations.map((conversation: IChatConversation) => {
                const other = conversation.peer;
                const isActive = conversation._id === activeConversationId;
                return (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() => {
                      setActiveConversationId(conversation._id);
                      setActivePeer(other || null);
                      setShowNewChat(false);
                    }}
                    className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isActive ? "bg-indigo-50 ring-1 ring-indigo-100" : "hover:bg-muted/50"
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={other?.image} />
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {getInitials(other?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{other?.name || "Student"}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {formatListTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {conversation.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })}
              {!conversationsQuery.isLoading && conversations.length === 0 && !showNewChat && (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
                  <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Start a new chat to message other students.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message pane */}
          <div className="flex min-h-[24rem] flex-col">
            {activeConversationId && peer ? (
              <>
                <div className="flex items-center gap-3 border-b px-4 py-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={peer.image} />
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {getInitials(peer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{peer.name}</p>
                    <p className="text-xs text-muted-foreground">@{peer.username}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-4">
                  {messages.map((message) => {
                    const isMine = isSameChatUser(message.sender._id, currentUserId);
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                            isMine
                              ? "rounded-br-md bg-indigo-600 text-white"
                              : "rounded-bl-md border bg-background"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          <p
                            className={`mt-1 text-[10px] ${
                              isMine ? "text-indigo-100" : "text-muted-foreground"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={messageDraft}
                      onChange={(e) => setMessageDraft(e.target.value)}
                      placeholder="Type a message..."
                      className="min-h-11 resize-none"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      className="shrink-0"
                      onClick={handleSend}
                      disabled={sendMutation.isPending || !messageDraft.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <MessageCircle className="h-12 w-12 text-indigo-200" />
                <p className="text-muted-foreground">
                  Select a conversation or start a new chat with a classmate.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default StudentChatPage;
