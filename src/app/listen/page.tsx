import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ListenPage() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center">
      <p>준비 중</p>
      <Button asChild>
        <Link href="/">홈으로</Link>
      </Button>
    </main>
  );
}
