import SongCard from "./SongCard";

export default function SongList({ tab }: Readonly<{ tab: string }>) {
  return (
    <div className="shadow1 mt-[calc(1.5rem+42px)] grid grid-cols-2 justify-items-center gap-4 rounded-2xl bg-white p-4 max-[360px]:grid-cols-1">
      <SongCard title={tab + " 제목"} ownerName={tab + " 이름"} />
      <SongCard title={tab + " 제목"} ownerName={tab + " 이름"} />
      <SongCard title={tab + " 제목"} ownerName={tab + " 이름"} />
      <SongCard title={tab + " 제목"} ownerName={tab + " 이름"} />
    </div>
  );
}
