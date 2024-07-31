import { musicAtom } from "@/atoms/musicAtom";
import { useAtomValue } from "jotai";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useMusic() {
  const id = useAtomValue(musicAtom);
  const { data, error, isLoading } = useSWR(
    id ? `/api/music/${id}` : null,
    fetcher,
  );

  // test
  if (data?.error) {
    const musics = [
      "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
      "https://www2.cs.uic.edu/~i101/SoundFiles/Fanfare60.wav",
      "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav",
      "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
    ];
    const idx = Number(id) - 1;

    return { src: musics[idx] };
  }

  return {
    src: data,
    error,
    isLoading,
  };
}
