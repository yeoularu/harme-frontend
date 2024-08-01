import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative mx-auto flex h-dvh max-w-[360px] flex-col justify-center gap-6 px-4">
      <Button
        className="absolute inset-x-0 top-12 mx-auto h-24 w-36"
        variant="ghost"
        size="icon"
        asChild
      >
        <Link href="/">
          <Image src="/Harme.svg" fill alt="harme" className="" />
        </Link>
      </Button>

      {children}
    </main>
  );
}
