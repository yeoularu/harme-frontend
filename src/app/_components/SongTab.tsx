"use client";

import SongCard from "./SongCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import useSWR from "swr";

export default function SongTab() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, isLoading } = useSWR<
    {
      musicId: string;
      musicTitle: string;
      musicImage?: string;
      userNickName: string;
    }[]
  >("/api/music/list", fetcher);

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
      <div className="shadow1 mt-[calc(1.5rem+42px)] grid min-h-[450px] grid-cols-2 justify-items-center gap-4 rounded-2xl bg-white p-4 max-[360px]:grid-cols-1">
        {tab === "기쁜" ? (
          <>
            {data?.map(({ musicId, musicTitle, musicImage, userNickName }) => (
              <SongCard
                key={musicId}
                title={musicTitle}
                ownerName={userNickName}
                imageUrl={musicImage ?? "/sample.png"}
                id={musicId}
              />
            ))}
          </>
        ) : (
          <>
            <SongCard
              key={1}
              title={"샘"}
              ownerName={"샘"}
              id={"1"}
              imageUrl={"/sample.png"}
            />
            <SongCard
              key={2}
              title={"플"}
              ownerName={"플"}
              id={"2"}
              imageUrl={"/sample2.png"}
            />
            <SongCard
              key={3}
              title={"음"}
              ownerName={"음"}
              id={"3"}
              imageUrl={"/sample3.png"}
            />
            <SongCard
              key={4}
              title={"악"}
              ownerName={"악"}
              id={"4"}
              imageUrl={"/sample4.png"}
            />
          </>
        )}
      </div>
    </div>
  );
}
