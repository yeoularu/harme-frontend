import MusicPlayer from "./_components/MusicPlayer";
import NavBar from "./_components/NavBar";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";

if (
  process.env.NEXT_RUNTIME === "nodejs" &&
  process.env.NODE_ENV !== "production"
) {
  console.log("SERVER LISTEN");

  const { server } = require("../mocks/node");
  server.listen();

  Reflect.set(fetch, "__FOO", "YES");
}

const pretendard = localFont({
  src: "./PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "할매",
  description: "새싹 해커톤",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendard.className}>
        <Providers>
          {children}
          <NavBar />
          <MusicPlayer />

          <Toaster
            position="top-center"
            richColors
            toastOptions={{ classNames: { title: "text-lg" } }}
          />
        </Providers>
      </body>
    </html>
  );
}
