"use client";

import { musicAtom } from "@/atoms/musicAtom";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMusic from "@/hooks/useMusic";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import {
  ChevronDown,
  ClipboardCheck,
  LetterTextIcon,
  ShareIcon,
} from "lucide-react";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { toast } from "sonner";
import { useIsClient } from "usehooks-ts";

export default function MusicPlayer() {
  const isClient = useIsClient();

  const [music, setMusic] = useAtom(musicAtom);

  const [isShuffle, setIsShuffle] = useState(false);
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

  const { data, error, isLoading } = useMusic();
  console.log(data);
  const [isHidden, setIsHidden] = useState(true);

  const segment = useSelectedLayoutSegment();
  useEffect(() => {
    const hiddenSegments = ["chat", "auth"];
    const isHiddenSegment =
      segment !== null && hiddenSegments.includes(segment);

    !isHiddenSegment && data?.musicUrl ? setIsHidden(false) : setIsHidden(true);
  }, [segment, data]);

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
              "fixed left-4 top-4 z-50 transition-opacity duration-300",
              isFullPlayer ? "delay-150" : "invisible opacity-0",
            )}
          >
            {copyState ? <ClipboardCheck /> : <ShareIcon />}
          </Button>
        </CopyToClipboard>
      )}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed right-4 top-4 z-50 transition-opacity duration-300",
          isFullPlayer ? "delay-150" : "invisible opacity-0",
        )}
        onClick={() => setMusicIdQuery(null)}
      >
        <ChevronDown />
      </Button>

      <Button
        className={cn(
          `fixed inset-x-0 z-50 mx-auto bg-white py-2 pl-4 transition-all duration-300 hover:bg-white`, // [&_svg_*]:fill-[#2B2B2B]`,
          isFullPlayer
            ? `bottom-1/2 top-4 my-auto h-[35dvh] max-h-[35dvh] w-[35dvh] max-w-full animate-custom-fade-in cursor-default flex-col gap-8`
            : `bottom-[80px] h-24 max-h-24 w-full max-w-64 -translate-x-8 animate-custom-fade-out-in justify-start rounded-lg bg-transparent hover:bg-transparent`,
          isHidden && "hidden",
        )}
        onClick={musicIdQuery ? undefined : () => setMusicIdQuery(music)}
      >
        <Image
          className={cn(
            "animate-custom-fade-in rounded-2xl object-contain",
            !isFullPlayer && "mr-4",
          )}
          src={data?.musicImage ?? "/sample3.png"}
          alt="album"
          width={isFullPlayer ? undefined : 80}
          height={isFullPlayer ? undefined : 80}
          fill={isFullPlayer}
        />
        <div
          className={cn(
            "flex flex-col items-start justify-center",
            isFullPlayer && "translate-y-[25dvh]",
          )}
        >
          {/* <p className="typo-title-md">{data?.title ?? '노래'}</p>
          <p className="text-[20px] leading-[35px] text-[#666]">
            {data?.nickName ?? '할매'}
          </p> */}
          <p className="typo-title-md text-start">{data?.musicTitle}</p>
          <p className="text-[20px] leading-[35px] text-[#666]">
            {data?.userNickName}
          </p>
        </div>
      </Button>

      <AudioPlayer
        ref={playerRef}
        src={data?.musicUrl}
        layout={isFullPlayer ? "stacked" : "horizontal"}
        showJumpControls={isFullPlayer}
        showFilledVolume={isFullPlayer}
        customAdditionalControls={
          isFullPlayer
            ? [
                RHAP_UI.LOOP,
                <Drawer key={2}>
                  <DrawerTrigger className="absolute bottom-28 right-2">
                    <LetterTextIcon className="text-[#868686]" />
                  </DrawerTrigger>
                  <DrawerContent className="h-[55dvh]">
                    <ScrollArea className="h-full w-full overscroll-auto whitespace-pre-wrap px-4 text-lg">
                      {data?.musicLyrics}
                    </ScrollArea>
                  </DrawerContent>
                </Drawer>,
              ]
            : [<></>]
        }
        customVolumeControls={
          isFullPlayer
            ? [
                RHAP_UI.VOLUME,
                <button
                  key={2}
                  onClick={() => setIsShuffle((v) => !v)}
                  className="ml-2"
                >
                  {isShuffle ? (
                    <Image
                      width={26}
                      height={26}
                      src="/player-icons/ShuffleOnIcon.svg"
                      alt="shuffle"
                    />
                  ) : (
                    <Image
                      width={26}
                      height={26}
                      src="/player-icons/ShuffleOffIcon.svg"
                      alt="shuffle off"
                    />
                  )}
                </button>,
              ]
            : [<></>]
        }
        customIcons={{
          play: (
            <Image
              width={40}
              height={40}
              src="/player-icons/PlayIcon.svg"
              className={isFullPlayer ? "scale-[2]" : "scale-150"}
              alt="play"
            />
          ),
          pause: (
            <Image
              width={40}
              height={40}
              src="/player-icons/PauseIcon.svg"
              alt="pause"
              className={isFullPlayer ? "scale-150" : ""}
            />
          ),
          rewind: (
            <Image
              width={40}
              height={40}
              src="/player-icons/PlaybackIcon.svg"
              alt="rewind"
              className="rotate-180"
            />
          ),
          forward: (
            <Image
              width={40}
              height={40}
              src="/player-icons/PlaybackIcon.svg"
              alt="forward"
              className=""
            />
          ),
          // previous: <></>,
          // next: <></>,
          loop: (
            <Image
              width={40}
              height={40}
              src="/player-icons/LoopOnIcon.svg"
              alt="loop"
            />
          ),
          loopOff: (
            <Image
              width={40}
              height={40}
              src="/player-icons/LoopOffIcon.svg"
              alt="loop off"
            />
          ),

          // volume: (
          //   <Image
          //     width={40}
          //     height={40}
          //     src="/player-icons/VolumeIcon.svg"
          //     alt="loop"
          //   />
          // ),
          // volumeMute: <></>,
        }}
        className={cn(
          `fixed inset-x-0 z-30 mx-auto border border-black/10 shadow-none transition-all duration-300`,
          isFullPlayer
            ? `bottom-0 h-dvh max-h-dvh w-dvw max-w-full`
            : `bottom-[80px] h-24 max-h-24 w-[calc(360px-2rem)] max-w-[calc(360px-2rem)] rounded-lg`,
          isFullPlayer
            ? String.raw`[&_.rhap\_additional-controls]:justify-end [&_.rhap\_controls-section>div]:h-[40px] [&_.rhap\_controls-section]:translate-y-20 [&_.rhap\_controls-section]:flex-row-reverse [&_.rhap\_controls-section]:items-start [&_.rhap\_main-controls]:gap-8 [&_.rhap\_progress-container]:translate-y-0.5 [&_.rhap\_progress-container]:self-end [&_.rhap\_progress-filled]:bg-primary [&_.rhap\_progress-indicator]:bg-primary [&_.rhap\_progress-indicator]:shadow-none [&_.rhap\_progress-section]:grow-[2] [&_.rhap\_progress-section]:items-end [&_.rhap\_volume-container]:absolute [&_.rhap\_volume-container]:bottom-28 [&_.rhap\_volume-container]:left-2 [&_.rhap\_volume-container]:w-24 [&_.rhap\_volume-controls]:justify-start [&_.rhap\_volume-indicator]:invisible`
            : String.raw`[&_.rhap\_additional-controls_.rhap\_volume-controls]:hidden [&_.rhap\_controls-section]:grow-0 [&_.rhap\_progress-section]:invisible`,
          isHidden && "hidden",
        )}
      />
    </>
  );
}
