import Chat from "./_components/Chat";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  return (
    <main className="bg-gradient-to-b from-white to-[#FFEED6]">
      <Chat />
    </main>
  );
}
