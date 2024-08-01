"use client";

import ChatOverlay from "./ChatOverlay";
import { musicCreateStatusAtom } from "@/atoms/musicCreateStatusAtom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { useAtom, useSetAtom } from "jotai";
import { ChevronLeftIcon, Loader2, MicIcon, PauseIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "sonner";
import { useIsClient, useLocalStorage } from "usehooks-ts";

export default function Chat() {
  const isClient = useIsClient();

  const [overlayOpen, setOverlayOpen] = useState(true);

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

  const [feelInput, setFeelInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [singerInput, setSingerInput] = useState("");

  const inputValueArr = [feelInput, genreInput, singerInput];

  const inputSetterArr = [setFeelInput, setGenreInput, setSingerInput];

  const [stage, setStage] = useState(0);

  const STAGE_MAX = 3;

  useEffect(() => {
    const createSong = async () => {
      try {
        const response = await fetch("/api/music/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.userId,
            feel: feelInput,
            genre: genreInput,
            singerGender: singerInput,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error during signup:", errorData);
          toast.error("음악 생성 중 오류가 발생하였습니다.");
          return;
        }
        const { musicId, lyrics, keyword } = await response.json();

        setMusicCreateStatus({ id: musicId, lyrics, keyword, isDone: false });
      } catch (error) {
        console.error("Error during signup:", error);
        toast.error("음악 생성 중 오류가 발생하였습니다.");
      }
    };

    if (stage === STAGE_MAX) {
      createSong();
    }
  }, [feelInput, genreInput, router, setMusicCreateStatus, singerInput, stage]);

  const stageTexts = [
    "어떤 느낌의\n노래를 원하시나요?",
    "어떤 장르의\n노래를 원하시나요?",
    "어떤 목소리로\n노래를 듣고싶으신가요?",
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
    행복한: "듣는 순간 기분이 좋아지며 마치 과거를 회상",
    평화로운: "주말 오후 한적한 하루가 된 것 같은 느낌",
    "시 같은": "가사가 아름답고 감성을 자극하는 느낌",
    용기있는: "힘들고 어려운 순간 듣는이에게 희망을",
    "팝(Pop)": "경쾌하고 쉽게 따라 부를 수 있는 멜로디",
    "R&B": "부드러운 보컬, 감성적인 멜로디",
    "재즈(Jazz)": "즉흥 연주, 복잡한 화음, 신나는 리듬",
    클래식: "정교한 작곡, 다양한 악기 구성",
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
            src={`/chat-icons/${stage === 1 ? "stage1/" + idx : idx}.png`}
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
              className="h-[78px] px-4 py-6 text-[20px] font-semibold leading-[30px]"
              onClick={() => setOverlayOpen(false)}
            >
              Step.1 나만의 노래 작사하기
            </Button>
          </div>
          <div className="h-4"></div>
          <div className="flex flex-col gap-2">
            <p className="typo-title-lg">2단계</p>
            <Button
              className="h-[62px] px-4 py-6 text-[20px] font-semibold leading-[30px]"
              disabled
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

          <p className="typo-title-md m-2">1단계 나만의 노래 작사하기</p>

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
        <div
          className={cn(
            "flex flex-col gap-4 transition-opacity",
            listening && "invisible opacity-0",
          )}
        >
          {new Set([0, 1]).has(stage) && (
            <div className="typo-title-lg flex w-full max-w-[320px] items-center justify-start gap-2">
              <p className="text-primary">할매의 추천</p>
              <Image
                src="/chat-icons/magic.png"
                width={24}
                height={24}
                alt="magic icon"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            {stage === 0 &&
              !listening &&
              ["행복한", "평화로운", "시 같은", "용기있는"].map((k, i) => (
                <Fragment key={i}>{selectCard(k, i)}</Fragment>
              ))}
            {stage === 1 &&
              !listening &&
              ["팝(Pop)", "R&B", "재즈(Jazz)", "클래식"].map((k, i) => (
                <Fragment key={i}>{selectCard(k, i)}</Fragment>
              ))}
            {stage === 2 && (
              <>
                <Button
                  variant="ghost"
                  className={cn(
                    "relative h-[10.375rem] w-[9.75rem] flex-col items-start bg-white px-2 py-6 text-start shadow",
                    inputValueArr[2] === "여자" &&
                      "bg-primary hover:bg-primary",
                  )}
                  onClick={async () => {
                    if (isBtnDisable) return;
                    setIsBtnDisable(true);
                    inputSetterArr[2](`여자`);

                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setStage((v) => {
                      if (v === STAGE_MAX) return v;
                      return v + 1;
                    });
                    setIsBtnDisable(false);
                  }}
                >
                  <div className="flex w-full flex-col items-center justify-center">
                    <Image
                      src={`/chat-icons/woman.png`}
                      width={48}
                      height={48}
                      alt={"chat woman icon"}
                    />
                    <p
                      className={cn(
                        "typo-title-md",
                        inputValueArr[2] === "여자" && "text-white",
                      )}
                    >
                      여자
                    </p>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className={cn(
                    "relative h-[10.375rem] w-[9.75rem] flex-col items-start bg-white px-2 py-6 text-start shadow",
                    inputValueArr[2] === "남자" &&
                      "bg-primary hover:bg-primary",
                  )}
                  onClick={async () => {
                    if (isBtnDisable) return;
                    setIsBtnDisable(true);
                    inputSetterArr[2](`남자`);

                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setStage((v) => {
                      if (v === STAGE_MAX) return v;
                      return v + 1;
                    });
                    setIsBtnDisable(false);
                  }}
                >
                  <div className="flex w-full flex-col items-center justify-center">
                    <Image
                      src={`/chat-icons/man.png`}
                      width={48}
                      height={48}
                      alt={"chat man icon"}
                    />
                    <p
                      className={cn(
                        "typo-title-md",
                        inputValueArr[2] === "남자" && "text-white",
                      )}
                    >
                      남자
                    </p>
                  </div>
                </Button>
              </>
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

      <section
        className={cn(
          "absolute inset-0 top-0 flex h-dvh items-center justify-center bg-white",
          stage !== STAGE_MAX && "hidden",
        )}
      >
        {musicCreateStatus ? (
          <section
            className={cn(
              "fixed inset-0 top-0 z-50 flex h-dvh justify-center bg-white opacity-0 transition-opacity",
              musicCreateStatus && "opacity-100",
            )}
          >
            <div
              className={cn(
                "ease-[cubic-bezier(.32,.72,0,1)] flex min-h-dvh flex-col items-center gap-8 duration-500",
              )}
            >
              <div className="flex flex-col gap-8">
                <div className="h-10 w-[360px]" />

                <p className="typo-title-md m-2">1단계 나만의 노래 작사하기</p>

                <div className="relative mx-auto block h-fit w-fit">
                  <Image
                    src={"/CheckRoundIcon.svg"}
                    width={85}
                    height={85}
                    alt="Listening icon"
                    priority={true}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "typo-headline whitespace-pre-wrap text-start",
                    )}
                  >
                    노래가 만들어졌어요.
                  </p>
                </div>
              </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[360px] gap-4">
              <Button
                className="mb-2 w-full border border-primary bg-white text-primary hover:bg-gray-100"
                asChild
              >
                <Link href="/">홈 화면</Link>
              </Button>
              <Button
                className="mb-2 w-full"
                onClick={() => router.replace(`/chat/${musicCreateStatus.id}`)}
              >
                다음 단계로
              </Button>
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className={cn("typo-headline whitespace-pre-wrap text-start")}>
              수집된 취향을 바탕으로
              <br />
              노래를 만들게요.
            </p>
            <p className="mt-8 text-[20px] leading-[35px] text-[#919191]">
              노래 제작에는
              <br />
              30~60초 정도 소요됩니다.
            </p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </section>
    </>
  );
}
