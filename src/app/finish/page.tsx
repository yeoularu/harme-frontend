import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { JSX, SVGProps } from "react";

export default function FinishPage() {
  return (
    <main className="flex flex-col items-center gap-8 py-32">
      <div className="relative mb-6 h-[195px] w-[360px]">
        <Image
          src={"/FinishIcon.svg"}
          width={296}
          height={195}
          alt="Listening icon"
          className="absolute inset-0 mx-auto"
        />
        <div className="absolute inset-x-0 top-[52px] mx-auto h-[104px] w-[104px] rounded-lg bg-muted" />
      </div>
      <p className="typo-headline text-center">
        앨범 제작이
        <br />
        완료되었습니다.
      </p>

      <div className="w-[328px]">
        <p className="typo-title-md">노래 제목</p>
        <p className="text-[20px] leading-[35px] text-[#C0C0C0]">이름</p>
      </div>
      <p className="w-[328px] whitespace-pre-wrap text-[20px] leading-[35px] text-[#2B2B2B]">
        {`햇살 가득한 아침, 웃음이 번지는 날
너와 함께라면, 모든 게 특별해져
걱정은 저 멀리, 행복만 가득히
기억 속 멜로디, 우리를 춤추게 해

햇살 가득한 아침, 웃음이 번지는 날
너와 함께라면, 모든 게 특별해져
걱정은 저 멀리, 행복만 가득히
기억 속 멜로디, 우리를 춤추게 해`}
      </p>

      <nav className="fixed bottom-0 flex w-full gap-4 bg-gradient-to-t from-background from-90% px-6 py-4">
        <Button
          className="h-fit w-full rounded-lg border border-primary bg-white py-3 text-[20px] font-semibold leading-[30px] text-primary hover:bg-gray-50"
          asChild
        >
          <Link href="/listen">들으러 가기</Link>
        </Button>
        <Button
          className="h-fit w-full rounded-lg py-3 text-[20px] font-semibold leading-[30px]"
          asChild
        >
          <Link href="/">확인</Link>
        </Button>
      </nav>
    </main>
  );
}

const MusicNoteIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)">
      <path
        fillRule="evenodd"
        d="M46.677 8.02a5 5 0 0 1 5.823 4.93V42.5a10 10 0 1 1-5-8.663V22.95l-25 4.168V45c0 .15-.013.295-.038.435a8.75 8.75 0 1 1-4.962-7.093V17.119a5 5 0 0 1 4.177-4.933l25-4.165ZM22.5 22.05l25-4.168V12.95l-25 4.168v4.932Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path d="M0 0h60v60H0z" />
      </clipPath>
    </defs>
  </svg>
);
