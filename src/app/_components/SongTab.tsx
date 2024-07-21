"use client";

import SongList from "./SongList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SongTab() {
  const tabs = ["기쁜", "슬픈", "시 같은", "재미난", "잔잔한"];
  const [tab, setTab] = useState("기쁜");

  return (
    <div>
      <div className="absolute left-0 w-dvw overflow-x-auto scrollbar-hide">
        <div className="ml-[calc(50dvw-180px+1rem)] flex w-fit items-start gap-2 pr-2 max-[360px]:ml-4">
          {tabs.map((t) => (
            <Button
              key={t}
              className={cn(
                "h-[42px] rounded-full border-2 border-[#D4D4D433] text-2xl font-normal",
                tab === t
                  ? "bg-[#404040] text-white hover:bg-[#404040]/90"
                  : "bg-white text-black hover:bg-gray-50",
              )}
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>
      <SongList tab={tab} />
    </div>
  );
}
