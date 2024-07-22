"use client";

import ChatBubble from "./ChatBubble";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { MicIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

//   return (
//     <div>
//       <p>Microphone: {listening ? "on" : "off"}</p>
//       <button onClick={SpeechRecognition.startListening}>Start</button>
//       <button onClick={SpeechRecognition.stopListening}>Stop</button>
//       <button onClick={resetTranscript}>Reset</button>
//       <p>{transcript}</p>
//     </div>

type ChatBubbleProps = Readonly<{
  isSender: boolean;
  message: string;
}>;

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<ChatBubbleProps[]>([]);
  const ref = useRef<HTMLDivElement>(null);
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

  // test
  useEffect(() => {
    let isMounted = true;

    const updateProgress = async () => {
      if (!isMounted) return;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isMounted) setProgress(33);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isMounted) setProgress(66);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isMounted) setProgress(100);
    };
    if (open && messages.length > 4) {
      updateProgress();
    }
    if (!open) {
      setProgress(0);
    }
    return () => {
      isMounted = false;
    };
  }, [messages.length, open]);

  useEffect(() => {
    setIsClient(true);
    handleStartListen();
  }, []);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });

    if (!listening || transcript === "") return;

    if (transcript !== "" && !open) {
      setOpen(true);
    }

    const timer = setTimeout(() => {
      handleStopListen();

      setMessages((prev) => [
        ...prev,
        {
          isSender: true,
          message: transcript,
        },
      ]);

      resetTranscript();
    }, 5000);

    return () => clearTimeout(timer);
  }, [resetTranscript, transcript, listening, open]);

  const ActionBtn = listening ? (
    <Button
      variant="secondary"
      className="mx-auto h-fit w-full max-w-[328px] rounded-lg py-3 text-[20px] font-semibold leading-[30px]"
      onClick={() => {
        handleStopListen();
        resetTranscript();
      }}
    >
      취소
    </Button>
  ) : (
    <Button
      className="mx-auto h-fit w-full max-w-[328px] rounded-lg py-3 text-[20px] font-semibold leading-[30px]"
      onClick={() => {
        handleStartListen();
      }}
    >
      말하기
    </Button>
  );

  if (isClient && browserSupportsSpeechRecognition === false) {
    return <p className="text-center">지원하지 않는 브라우저입니다</p>;
  }

  if (isClient && !isMicrophoneAvailable) {
    return <p className="text-center">마이크를 찾을 수 없습니다</p>;
  }

  return (
    <main
      className={cn(
        "ease-[cubic-bezier(.32, .72, 0, 1)] flex h-dvh flex-col items-center gap-8 pt-32 transition-colors duration-500",
        open ? "bg-background" : "bg-white",
      )}
    >
      <div className="relative h-[195px] w-full">
        <Image
          src={"/ListeningIcon.svg"}
          fill={true}
          alt="Listening icon"
          priority={true}
          className={cn(
            "ease-[cubic-bezier(.32, .72, 0, 1)] transition-transform duration-500",
            open ? "-translate-y-16" : "",
          )}
        />
      </div>
      <p className="typo-headline whitespace-pre-wrap text-center">
        {listening && (
          <MicIcon className="mx-auto mb-1 h-8 w-8 animate-pulse text-primary" />
        )}
        {listening
          ? "다음과 같이 말씀해보세요.\n“멜로디” 노래 만들어줘."
          : "아래 버튼을 누르고\n다음과 같이 말씀해보세요.\n“멜로디” 노래 만들어줘."}
      </p>
      <div className="mb-4 mt-auto flex w-full justify-center px-6">
        {ActionBtn}
      </div>

      <Drawer open={open} onOpenChange={(o) => setOpen(o)} handleOnly>
        <DrawerContent className="mx-auto flex h-[calc(100dvh-18rem)] max-w-2xl flex-col px-6 focus-visible:outline-none">
          <VisuallyHidden.Root>
            <DrawerTitle>채팅</DrawerTitle>
            <DrawerDescription>채팅 메세지들이 기록됩니다.</DrawerDescription>
          </VisuallyHidden.Root>
          <ScrollArea className="h-full w-full flex-1">
            <div className="flex flex-col gap-4">
              {messages.map((m, i) => (
                <>
                  <ChatBubble
                    key={m.message + i}
                    message={m.message}
                    isSender={m.isSender}
                  />

                  <ChatBubble
                    key={m.message + i + "test"}
                    message={m.message}
                    isSender={false}
                  />
                </>
              ))}

              {listening && <ChatBubble message={transcript} isSender={true} />}

              {/** test */}
              {messages.length > 4 && (
                <div className="flex w-80 items-center justify-center gap-2 rounded-full bg-[#F3F4F6] px-4 py-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-primary">{progress}%</span>
                </div>
              )}
              {progress === 100 && (
                <>
                  <div className="w-fit rounded-lg bg-[#F3F4F6] px-4 py-2">
                    <span className="text-primary">
                      앨범 제작이 완료되었습니다!
                    </span>
                  </div>
                  <Button variant="link" asChild>
                    <Link href="/finish">확인하러 가기</Link>
                  </Button>
                </>
              )}

              <div ref={ref} className="h-0" />
            </div>
          </ScrollArea>
          <DrawerFooter>{ActionBtn}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
