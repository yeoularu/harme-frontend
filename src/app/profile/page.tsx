import Profile from "./_components/Profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center gap-2">
      <Profile />
    </main>
  );
}
