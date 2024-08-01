import { atom } from "jotai";

export const musicCreateStatusAtom = atom<{
  id: string;
  isDone: boolean;
  lyrics?: string;
  keyword?: string;
} | null>(null);
