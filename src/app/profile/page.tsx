import Profile from "./_components/Profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center">
      <Profile />
      <p>준비 중</p>
      <Button asChild>
        <Link href="/">홈으로</Link>
      </Button>
    </main>
  );
}
