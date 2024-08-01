import CreateCover from "./_components/CreateCover";

export default function ChatMusicIdPage({
  params,
}: {
  params: { musicId: string };
}) {
  const { musicId } = params;

  return (
    <main className="bg-gradient-to-b from-white to-[#FFEED6]">
      <CreateCover id={musicId} />
    </main>
  );
}
