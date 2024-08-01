"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChatOverlay({
  children,
  open,
}: {
  children: React.ReactNode;
  open: boolean;
}) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (open) return;

    const hide = async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setHidden(true);
    };
    hide();
  }, [open]);

  return (
    <section
      className={cn(
        "fixed inset-0 top-0 z-50 flex h-dvh justify-center bg-white transition-opacity",
        !open && "opacity-0",
        hidden && "hidden",
      )}
    >
      <div className="flex h-dvh max-w-[360px] flex-col gap-4 px-4">
        <Button
          variant="ghost"
          className="typo-title-md my-3 mr-auto -translate-x-2 pl-1"
          asChild
        >
          <Link href="/">
            <ChevronLeftIcon />
            뒤로가기
          </Link>
        </Button>

        <p className="typo-headline">
          음성으로
          <br />
          음악 만들기
        </p>
        <p className="mb-4 text-base font-normal">
          위 서비스는 할매 이용자라면 <br />
          누구나 무료로 이용 가능합니다!
        </p>
        {children}
      </div>
    </section>
  );
}
