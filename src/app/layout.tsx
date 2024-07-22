import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";
import localFont from "next/font/local";

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
    <Providers>
      <html lang="ko">
        <body className={pretendard.className}>{children}</body>
      </html>
    </Providers>
  );
}
