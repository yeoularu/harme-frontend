"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function Profile() {
  const [user] = useLocalStorage("user", undefined);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [router, user]);

  return <p>client component</p>;
}
