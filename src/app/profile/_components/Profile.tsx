"use client";

import { musicAtom } from "@/atoms/musicAtom";
import useMusic from "@/hooks/useMusic";
import { User } from "@/types/user";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";

export default function Profile() {
  const [user] = useLocalStorage<User | undefined>("user", undefined);
  const router = useRouter();
  const [music, setMusic] = useAtom(musicAtom);
  const { data: musicData } = useMusic();
  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [router, user]);

  // const fetcher = (url: string) => fetch(url).then((r) => r.json());
  // const { data, isLoading } = useSWR("/api/user-latest", fetcher);
  const data = [
    {
      musicId: "1",
      title: "1",
      createdAt: "2024.08.01",
      imageUrl: "/sample.png",
    },
    {
      musicId: "2",
      title: "2",
      createdAt: "2024.08.01",
      imageUrl: "/sample.png",
    },
    {
      musicId: "3",
      title: "3",
      createdAt: "2024.08.01",
      imageUrl: "/sample.png",
    },
    {
      musicId: "4",
      title: "4",
      createdAt: "2024.08.02",
      imageUrl: "/sample.png",
    },
    {
      musicId: "5",
      title: "5",
      createdAt: "2024.08.02",
      imageUrl: "/sample.png",
    },
    {
      musicId: "6",
      title: "6",
      createdAt: "2024.08.03",
      imageUrl: "/sample.png",
    },
    {
      musicId: "7",
      title: "7",
      createdAt: "2024.08.03",
      imageUrl: "/sample.png",
    },
    {
      musicId: "8",
      title: "8",
      createdAt: "2024.08.04",
      imageUrl: "/sample.png",
    },
    {
      musicId: "9",
      title: "9",
      createdAt: "2024.08.04",
      imageUrl: "/sample.png",
    },
    {
      musicId: "10",
      title: "10",
      createdAt: "2024.08.05",
      imageUrl: "/sample.png",
    },
  ];

  return (
    <>
      <section className="flex w-full justify-center border-b border-black/10 bg-white">
        <div className="flex h-[96px] w-[360px] items-center gap-[22px] px-5 py-4">
          <Image
            src="/UserBoxIcon.svg"
            width={64}
            height={64}
            alt="user icon"
          />
          <p className="typo-headline">{user?.nickName}</p>
        </div>
      </section>
      <div className="flex w-full flex-1 justify-center bg-white">
        <div className="flex w-[360px] flex-col p-4">
          <div className="flex items-center gap-2">
            <p className="typo-headline">재생목록</p>
            <div className="typo-title-lg">
              <p className="text-primary">{data?.length ?? 0}개</p>
            </div>
          </div>

          {data.map(({ musicId, title, createdAt, imageUrl }) => (
            <div
              key={musicId}
              className="flex items-center justify-between border-b border-black/10 py-4"
            >
              <div className="flex items-center gap-2">
                {/* <Image
                  src={imageUrl}
                  width={64}
                  height={64}
                  className="rounded-md"
                  alt={title}
                /> */}
                <div className="flex flex-col">
                  <p className="typo-title-md">{title}</p>
                  <p className="text-[#919191]">{createdAt} 제작</p>
                </div>
              </div>

              <button onClick={() => setMusic(musicId)}>
                <Image
                  src={
                    musicId === music
                      ? "/player-icons/PlayIcon.svg"
                      : "/PlayEmpty.svg"
                  }
                  alt="play"
                  width={48}
                  height={48}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
