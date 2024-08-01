import SongTab from "./_components/SongTab";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto mb-40 flex max-w-[360px] flex-col gap-6 px-4 py-8">
      <section className="flex flex-col gap-8">
        <p className="typo-headline">홈</p>
        <section className="flex justify-center gap-4 max-[360px]:flex-col">
          <Button
            className="shadow1 h-[156px] w-[156px] rounded-3xl bg-[#FC9587] hover:bg-[#FC9587]/90"
            asChild
          >
            <Link href="/listen">
              <span className="typo-headline flex h-[124px] w-[124px] items-end rounded-[10px] bg-[#F88374] p-2">
                음악
                <br />
                듣기
              </span>
            </Link>
          </Button>
          <Button
            className="shadow1 h-[156px] w-[156px] rounded-3xl bg-[#FFB45E] hover:bg-[#FFB45E]/90"
            asChild
          >
            <Link href="/chat">
              <span className="typo-headline flex h-[124px] w-[124px] items-end rounded-[10px] bg-[#FCAA4D] p-2">
                음악
                <br />
                만들기
              </span>
            </Link>
          </Button>
        </section>
      </section>

      <section className="flex flex-col gap-2">
        <p className="typo-headline">다른 노래들도 들어보세요</p>
        <SongTab />
      </section>
    </main>
  );
}
