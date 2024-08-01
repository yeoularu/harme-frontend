"use client";

import ChatOverlay from "../../_components/ChatOverlay";
import { musicCreateStatusAtom } from "@/atoms/musicCreateStatusAtom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { useAtom } from "jotai";
import {
  ChevronLeftIcon,
  ChevronsDownIcon,
  MicIcon,
  PauseIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "sonner";
import useSWR from "swr";
import { useIsClient, useLocalStorage } from "usehooks-ts";

export default function CreateCover({ id }: { id: string }) {
  //   const fetcher = async (url: string) => (await fetch(url)).json();
  //   const { data, error, isLoading } = useSWR(`/api/song?id=${id}`, fetcher);

  const isClient = useIsClient();

  const [user] = useLocalStorage<User | undefined>("user", undefined);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [router, user]);

  const [musicCreateStatus, setMusicCreateStatus] = useAtom(
    musicCreateStatusAtom,
  );

  const [overlayOpen, setOverlayOpen] = useState(true);

  const [coverBackgroundInput, setCoverBackgroundInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const inputValueArr = [coverBackgroundInput, colorInput];

  const inputSetterArr = [setCoverBackgroundInput, setColorInput];

  const [stage, setStage] = useState(0);

  const STAGE_MAX = 2;

  useEffect(() => {
    const createSong = async () => {
      try {
        const response = await fetch("/api/image/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...musicCreateStatus,
            isDone: undefined,
            id: undefined,

            musicId: musicCreateStatus?.id,
            userId: user?.userId,

            // background: coverBackgroundInput,
            // color: colorInput,
          }),
        });

        const createdMusicId = musicCreateStatus?.id;
        setMusicCreateStatus(null);
        router.push("/?m=" + createdMusicId);
      } catch (error) {
        console.error("Error during signup:", error);
        toast.error("음악 생성 중 오류가 발생하였습니다.");
      }
    };

    if (stage === STAGE_MAX) {
      createSong();
    }
  }, [
    colorInput,
    coverBackgroundInput,
    id,
    musicCreateStatus,
    musicCreateStatus?.id,
    musicCreateStatus?.keyword,
    musicCreateStatus?.lyrics,
    router,
    setMusicCreateStatus,
    stage,
    user?.userId,
  ]);

  const stageTexts = [
    "어떤 배경의\n아트를 원하시나요?",
    "어떤 색상을\n사용할까요?",
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const handleStartListen = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "ko-KR",
    });
  };

  const handleStopListen = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    if (!listening || transcript === "") return;

    const timer = setTimeout(() => {
      handleStopListen();
      inputSetterArr[stage](transcript);
      setStage((v) => v + 1);
      resetTranscript();
    }, 3000);

    return () => clearTimeout(timer);
  }, [resetTranscript, transcript, listening, inputSetterArr, stage]);

  const [isBtnDisable, setIsBtnDisable] = useState(false);

  const selectCardTexts: { [key: string]: string } = {
    동양적인: "동양적인 산과 강이 어우러진 풍경.",
    바닷가: "흰색의 집과 파란 지붕, 아름다운 해변",
    도시적인: "고층 건물과 어두운 밤을 빛추는 네온사인",
    자연적인: "드넓은 푸른 초원과 넓은 하늘",
  };

  const selectCard = (cardTextKey: string, idx: number) => {
    const isSelected = cardTextKey === inputValueArr[stage]?.split(":")[0];

    return (
      <Button
        variant="ghost"
        className={cn(
          "relative h-fit w-[9.75rem] flex-col items-start bg-white px-2 py-6 text-start shadow",
          isSelected && "bg-primary hover:bg-primary",
        )}
        onClick={async () => {
          if (isBtnDisable) return;
          setIsBtnDisable(true);
          inputSetterArr[stage](
            `${cardTextKey}:${selectCardTexts[cardTextKey]}`,
          );

          await new Promise((resolve) => setTimeout(resolve, 1000));
          setStage((v) => {
            if (v === STAGE_MAX) return v;
            return v + 1;
          });
          setIsBtnDisable(false);
        }}
      >
        <div className="typo-title-md flex w-full items-start justify-between">
          <p className={cn(isSelected && "text-white")}>{cardTextKey}</p>
          <Image
            src={`/create-cover-icons/${idx}.png`}
            width={24}
            height={24}
            alt={"chat icon" + cardTextKey}
            className="ml-auto inline"
          />
        </div>

        <span
          className={cn(
            "whitespace-pre-line font-normal text-[#919191]",
            isSelected && "text-white",
          )}
        >
          {selectCardTexts[cardTextKey]}
        </span>
      </Button>
    );
  };

  const stage1Texts = ["밝은", "어두운", "다채로운", "선명한"];

  const stage1Icons = [
    <div
      key={0}
      className="h-6 w-6"
      style={{
        borderRadius: "100px",
        border: "2px solid rgba(0, 0, 0, 0.10)",
        background: "#FFF",
      }}
    />,
    <div
      key={1}
      className="h-6 w-6"
      style={{
        borderRadius: "100px",
        border: "2px solid rgba(0, 0, 0, 0.10)",
        background: "var(--Grey-grey-800, #404040)",
      }}
    />,
    <div
      key={2}
      className="h-6 w-6"
      style={{
        borderRadius: "100px",
        border: "2px solid rgba(0, 0, 0, 0.10)",
        background:
          "linear-gradient(135deg, rgba(255, 66, 66, 0.30) 0.34%, rgba(147, 255, 196, 0.30) 40.56%, rgba(63, 107, 251, 0.30) 67.88%, rgba(179, 32, 216, 0.30) 90.23%)",
      }}
    />,
    <div
      key={3}
      className="h-6 w-6"
      style={{
        borderRadius: "100px",
        border: "2px solid rgba(0, 0, 0, 0.10)",
        background: "#FF6A00",
      }}
    />,
  ];

  const stage1Btn = (t: string, idx: number) => (
    <Button
      variant="ghost"
      className={cn(
        "typo-title-md relative h-fit w-[320px] items-center justify-center gap-2 bg-white p-2 shadow",
        inputValueArr[1] === t && "bg-primary hover:bg-primary",
      )}
      onClick={async () => {
        if (isBtnDisable) return;
        setIsBtnDisable(true);
        inputSetterArr[1](t);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStage((v) => {
          if (v === STAGE_MAX) return v;
          return v + 1;
        });
        setIsBtnDisable(false);
      }}
    >
      {stage1Icons[idx]}
      <p
        className={cn(
          "w-fit font-normal",
          inputValueArr[1] === t && "text-white",
        )}
      >
        {t}
      </p>
    </Button>
  );

  if (isClient && browserSupportsSpeechRecognition === false) {
    return (
      <>
        <p className="text-center">지원하지 않는 브라우저입니다</p>
        <Link href="/">홈으로</Link>
      </>
    );
  }

  if (isClient && !isMicrophoneAvailable) {
    return (
      <>
        <p className="text-center">마이크를 찾을 수 없습니다</p>
        <Link href="/">홈으로</Link>
      </>
    );
  }

  return (
    <>
      <ChatOverlay open={overlayOpen}>
        <>
          <div className="flex flex-col gap-2">
            <p className="typo-title-lg">1단계</p>
            <Button
              className="h-[62px] px-4 py-6 text-[20px] font-semibold leading-[30px]"
              disabled
            >
              Step.1 나만의 노래 작사하기
            </Button>
          </div>
          <ChevronsDownIcon className="mx-auto" />
          <div className="flex flex-col gap-2">
            <p className="typo-title-lg">2단계</p>
            <Button
              className="h-[78px] px-4 py-6 text-[20px] font-semibold leading-[30px]"
              onClick={() => setOverlayOpen(false)}
            >
              Step.2 나만의 앨범아트 만들기
            </Button>
          </div>
        </>
      </ChatOverlay>

      <section
        className={cn(
          "ease-[cubic-bezier(.32,.72,0,1)] flex min-h-dvh flex-col items-center gap-8 duration-500",
        )}
      >
        <div>
          <div className="w-[360px]">
            <Button
              variant="ghost"
              className="pl-1"
              onClick={() =>
                setStage((v) => {
                  if (v === 0) {
                    router.push("/");
                    return v;
                  }
                  return v - 1;
                })
              }
            >
              <>
                <ChevronLeftIcon />
                뒤로가기
              </>
            </Button>
          </div>

          <p className="typo-title-md m-2">2단계 나만의 앨범아트 만들기</p>

          <div className="relative mx-auto block h-fit w-fit">
            <Image
              src={"/ListeningIcon.svg"}
              width={85}
              height={85}
              alt="Listening icon"
              priority={true}
              className={listening ? "animate-pulse" : ""}
            />
          </div>
        </div>
        <p className={cn("typo-headline whitespace-pre-wrap text-center")}>
          {stageTexts[stage]}
        </p>

        <div className="flex flex-col gap-4">
          {!listening && new Set([0, 1, 3]).has(stage) && (
            <div className="typo-title-lg flex w-full max-w-[320px] items-center justify-start gap-2">
              <p className="text-primary">할매의 추천 </p>
              <Image
                src="/chat-icons/magic.png"
                width={24}
                height={24}
                alt="magic icon"
              />
            </div>
          )}
          <div
            className={cn(
              "transition-opacity",
              listening && "invisible opacity-0",
            )}
          >
            <div className="grid grid-cols-2 gap-x-2 gap-y-3">
              {stage === 0 &&
                !listening &&
                ["동양적인", "바닷가", "도시적인", "자연적인"].map((k, i) => (
                  <Fragment key={i}>{selectCard(k, i)}</Fragment>
                ))}
            </div>

            {stage === 1 && (
              <div className="flex flex-col gap-4">
                {stage1Texts.map((t, i) => (
                  <Fragment key={i}>{stage1Btn(t, i)}</Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "fixed bottom-36 mt-auto flex w-[20.5rem] items-center gap-2 overflow-hidden rounded-2xl bg-white p-4 transition-all",
            listening ? "max-h-[9999px]" : "max-h-0 opacity-0",
          )}
        >
          <Image
            src="/ListeningIndicator.svg"
            width={24}
            height={24}
            alt="Listening Indicator"
            className="animate-pulse"
          />
          {transcript}
        </div>

        <div
          className={cn(
            "fixed bottom-0 mb-4 flex h-20 w-full flex-col items-center justify-center whitespace-pre-wrap px-6 transition-all",
            stage === 2 && "hidden",
          )}
        >
          <Button
            size="icon"
            className={cn(
              "rounded-full shadow-lg",
              listening ? "h-[4.5rem] w-[4.5rem]" : "h-16 w-16",
            )}
            onClick={() => {
              if (listening) {
                handleStopListen();
                resetTranscript();
                return;
              }
              handleStartListen();
            }}
          >
            {listening ? <PauseIcon /> : <MicIcon />}
          </Button>
        </div>
      </section>
      {
        <section
          className={cn(
            "absolute inset-0 top-0 h-dvh bg-white transition-opacity",
            stage !== 4 && "hidden opacity-0",
          )}
        >
          제작중
        </section>
      }
    </>
  );
}
