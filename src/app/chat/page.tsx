"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

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
    if (open) {
      updateProgress();
    }
    if (!open) {
      setProgress(0);
    }
    return () => {
      isMounted = false;
    };
  }, [open]);

  return (
    <main className="flex h-dvh flex-col items-center gap-8 pt-32">
      <Image
        src={"/ListeningIcon.svg"}
        width={195}
        height={195}
        alt="Listening icon"
        className={cn(
          "ease-[cubic-bezier(.32, .72, 0, 1)] transition-transform duration-500",
          open ? "-translate-y-16" : "",
        )}
      />
      <p className="typo-headline text-center">
        아래 버튼을 누르고
        <br />
        다음과 같이 말씀해보세요.
        <br />
        “멜로디” 노래 만들어줘.
      </p>
      <Drawer open={open} onOpenChange={(o) => setOpen(o)}>
        <DrawerTrigger
          className="mb-4 mt-auto flex w-full justify-center px-6"
          asChild
        >
          <Button
            className="mx-auto h-fit w-full max-w-[328px] rounded-lg py-3 text-[20px] font-semibold leading-[30px]"
            onClick={() => setOpen(true)}
          >
            말하기
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex h-[calc(100dvh-18rem)] flex-col gap-4 px-6">
          <div className="flex w-80 items-center justify-center gap-2 rounded-full bg-[#F3F4F6] px-4 py-2">
            <Progress value={progress} className="h-2" />
            <span className="text-primary">{progress}%</span>
          </div>
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

          <DrawerFooter>
            <Button className="mx-auto h-fit w-full max-w-[328px] rounded-lg py-3 text-[20px] font-semibold leading-[30px]">
              말하기
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
