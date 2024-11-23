"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import  ChatInterface  from "@/components/chat/chat-interface";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs"; // Make sure to import useUser
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage({ params }: { params: { noteId: string } }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Fetch messages for the specific note
  const messages = useQuery(api.chats.getMessages, { 
    noteId: params.noteId as Id<"note">,
  });

  // Redirect if user is not authenticated or note loading fails
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoaded, router]);

  // Handle loading and error states
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  if (messages === null) {
    return <div>Error loading messages</div>;
  }

  if (messages === undefined) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ChatInterface 
        noteId={params.noteId as Id<"note">} 
        initialMessages={messages} 
      />
    </div>
  );
}