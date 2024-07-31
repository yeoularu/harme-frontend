import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative mx-auto flex h-dvh max-w-[360px] flex-col justify-center gap-6 px-4 pb-48 pt-8">
      <div className="flex justify-end">
        <Button className="" variant="ghost" size="icon" asChild>
          <Link href="/">
            <HomeIcon />
          </Link>
        </Button>
      </div>
      {children}
    </main>
  );
}
