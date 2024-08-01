"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HomeIcon, ListMusicIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export default function NavBar() {
  const segment = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        "fixed bottom-0 flex w-full justify-center bg-white",
        segment === "chat" && "hidden",
      )}
    >
      <nav className="flex w-[360px] justify-between px-4 py-2">
        <Button
          variant="ghost"
          className="flex h-[56px] w-[80px] flex-col items-center"
          asChild
        >
          <Link href="/memory">
            <ListMusicIcon
              className={
                segment === "memory" ? "text-primary" : "text-[#2B2B2B]"
              }
            />
            <p>저장소</p>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="flex h-[56px] w-[80px] flex-col items-center"
          asChild
        >
          <Link href="/">
            <HomeIcon
              className={segment === null ? "text-primary" : "text-[#2B2B2B]"}
            />
            <p>홈</p>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="flex h-[56px] w-[80px] flex-col items-center"
          asChild
        >
          <Link href="/profile">
            <UserIcon
              className={
                segment === "profile" ? "text-primary" : "text-[#2B2B2B]"
              }
            />
            <p>내 정보</p>
          </Link>
        </Button>
      </nav>
    </div>
  );
}
