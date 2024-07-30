"use client";

import { musicAtom } from "@/atoms/musicAtom";
import { Button } from "@/components/ui/button";
import useMusic from "@/hooks/useMusic";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { ChevronDown, ClipboardCheck, ShareIcon } from "lucide-react";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { toast } from "sonner";
import { useIsClient } from "usehooks-ts";

export default function MusicPlayer() {
  const isClient = useIsClient();

  const [music, setMusic] = useAtom(musicAtom);

  const [musicIdQuery, setMusicIdQuery] = useQueryState("m", {
    history: "push",
  });
  const isFullPlayer = !!musicIdQuery;
  useEffect(() => {
    if (musicIdQuery) {
      setMusic(musicIdQuery);
    }
  }, [musicIdQuery, setMusic]);

  const playerRef = useRef<AudioPlayer>(null);

  const { src, error, isLoading } = useMusic();

  const [isHidden, setIsHidden] = useState(true);

  const segment = useSelectedLayoutSegment();
  useEffect(() => {
    const hiddenSegments = ["chat"];
    const isHiddenSegment =
      segment !== null && hiddenSegments.includes(segment);

    !isHiddenSegment && src ? setIsHidden(false) : setIsHidden(true);
  }, [segment, src]);

  useEffect(() => {
    if (isHidden) {
      playerRef.current?.audio.current?.pause();
    }
  }, [isHidden]);

  const [copyState, setCopyState] = useState(false);
  useEffect(() => {
    if (copyState) {
      const timeout = setTimeout(() => {
        setCopyState(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copyState]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed left-4 top-4 z-50 transition-opacity duration-300",
          isFullPlayer ? "delay-150" : "invisible opacity-0",
        )}
        onClick={() => setMusicIdQuery(null)}
      >
        <ChevronDown />
      </Button>
      {isClient && (
        <CopyToClipboard
          text={window.location.href}
          onCopy={() => {
            setCopyState(true);
            toast.success("주소가 클립보드로 복사되었습니다.");
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "fixed right-4 top-4 z-50 transition-opacity duration-300",
              isFullPlayer ? "delay-150" : "invisible opacity-0",
            )}
          >
            {copyState ? <ClipboardCheck /> : <ShareIcon />}
          </Button>
        </CopyToClipboard>
      )}

      <Button
        className={cn(
          `fixed inset-x-0 z-50 mx-auto bg-white py-2 pl-4 transition-all duration-300 hover:bg-white`, // [&_svg_*]:fill-[#2B2B2B]`,
          isFullPlayer
            ? `bottom-1/3 top-0 my-auto h-[40dvh] max-h-[40dvh] w-dvw max-w-full cursor-default flex-col gap-8`
            : `bottom-2 h-24 max-h-24 w-full max-w-80 -translate-x-8 justify-start rounded-lg`,
          isHidden && "hidden",
        )}
        onClick={musicIdQuery ? undefined : () => setMusicIdQuery(music)}
      >
        <Image
          className={cn(
            "animate-custom-fade-in aspect-square rounded-lg object-contain",
            !isFullPlayer && "mr-4",
            isFullPlayer
              ? "animate-custom-fade-in"
              : "animate-custom-fade-out-in",
          )}
          src="/sample.png"
          alt="album"
          width={isFullPlayer ? undefined : 80}
          height={isFullPlayer ? undefined : 80}
          fill={isFullPlayer}
        />
        <div
          className={cn(
            "flex flex-col justify-center",
            isFullPlayer && "translate-y-[25dvh]",
          )}
        >
          <p className="typo-title-md">노래 제목</p>
          <p className="text-[20px] leading-[35px] text-[#666]">노래 설명</p>
        </div>
      </Button>

      <AudioPlayer
        ref={playerRef}
        src={src}
        layout={isFullPlayer ? "stacked" : "horizontal"}
        showJumpControls={isFullPlayer}
        showFilledVolume={isFullPlayer}
        customVolumeControls={isFullPlayer ? undefined : [<></>]}
        customAdditionalControls={isFullPlayer ? undefined : [<></>]}
        className={cn(
          `fixed inset-x-0 z-30 mx-auto transition-all duration-300`, // [&_svg_*]:fill-[#2B2B2B]`,
          isFullPlayer
            ? `bottom-0 h-dvh max-h-dvh w-dvw max-w-full`
            : `bottom-2 h-24 max-h-24 w-full max-w-sm rounded-lg`,
          isFullPlayer
            ? String.raw`[&_.rhap\_main-controls>button]:scale-150 [&_.rhap\_main-controls]:gap-4 [&_.rhap\_progress-container]:translate-y-0.5 [&_.rhap\_progress-container]:self-end [&_.rhap\_progress-section]:items-end`
            : String.raw`[&_.rhap\_additional-controls_.rhap\_volume-controls]:hidden [&_.rhap\_controls-section]:grow-0 [&_.rhap\_progress-section]:invisible`,
          isHidden && "hidden",
        )}
      />
    </>
  );
}
