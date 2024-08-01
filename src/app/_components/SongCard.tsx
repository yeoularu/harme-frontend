"use client";

import { musicAtom } from "@/atoms/musicAtom";
import { cn } from "@/lib/utils";
import { useAtom, useSetAtom } from "jotai";
import Image from "next/image";
import { useQueryState } from "nuqs";

export default function SongCard({
  id,
  title,
  ownerName,
  imageUrl,
}: Readonly<{
  id: string;
  title: string;
  ownerName: string;
  imageUrl: string;
}>) {
  const [music, setMusic] = useAtom(musicAtom);

  const [_, setMusicIdQuery] = useQueryState("m", {
    history: "push",
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="relative h-[8.5rem] w-[8.5rem] rounded-lg bg-muted">
        <button
          className="absolute inset-0"
          onClick={() => setMusicIdQuery(String(id))}
        >
          <Image
            src={imageUrl}
            fill
            className="rounded-lg object-contain"
            alt="album"
          />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setMusic(String(id));
          }}
          className={cn(
            "absolute bottom-[0.45rem] left-[0.45rem]",
            music && String(id) === music && "hidden",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
          >
            <rect
              x="0.128235"
              y="0.871796"
              width="34"
              height="34"
              rx="17"
              fill="white"
            />
            <path
              d="M13.5701 25.8556C13.1092 26.1527 12.6423 26.1696 12.1694 25.9063C11.6975 25.6439 11.4615 25.2384 11.4615 24.6898V10.4944C11.4615 9.94579 11.6975 9.53982 12.1694 9.27648C12.6423 9.01406 13.1092 9.03144 13.5701 9.3286L24.8393 16.4263C25.2541 16.7006 25.4615 17.0892 25.4615 17.5921C25.4615 18.095 25.2541 18.4836 24.8393 18.7579L13.5701 25.8556Z"
              fill="#FF8F0F"
            />
          </svg>
        </button>
      </div>
      <div>
        <p className="typo-title-lg">{title}</p>
        <p className="leading-7 text-[#919191]">{ownerName}</p>
      </div>
    </div>
  );
}
