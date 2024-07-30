"use client";

import { Provider as JotaiProvider } from "jotai";
import { Suspense, use } from "react";
import "regenerator-runtime/runtime";
import { SWRConfig } from "swr";

let mockingPromise: Promise<boolean> | undefined;

// if we're running in the browser, start the worker
if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_MSW === "enabled"
) {
  const { worker } = require("../mocks/browser");
  mockingPromise = worker.start();
}

function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // if MSW is enabled, we need to wait for the worker to start, so we wrap the
  // children in a Suspense boundary until the worker is ready
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
}

function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (mockingPromise) {
    use(mockingPromise);
  }
  return children;
}

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MSWProvider>
      <JotaiProvider>
        <SWRConfig>{children}</SWRConfig>
      </JotaiProvider>
    </MSWProvider>
  );
}
