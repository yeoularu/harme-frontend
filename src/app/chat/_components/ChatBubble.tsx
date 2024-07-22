import { cn } from "@/lib/utils";

export default function ChatBubble({
  isSender,
  message,
}: Readonly<{
  isSender: boolean;
  message: string;
}>) {
  return (
    <div
      className={cn(
        "relative mx-2 w-fit max-w-xs rounded-2xl p-3",
        isSender
          ? "self-end bg-primary text-white"
          : "self-start bg-[#F3F4F6] text-[#2B2B2B]",
        isSender
          ? "before:absolute before:bottom-0 before:right-[-7px] before:h-[25px] before:w-[20px] before:rounded-bl-[16px_14px] before:bg-primary before:content-[''] after:absolute after:bottom-0 after:right-[-26px] after:h-[25px] after:w-[26px] after:rounded-bl-[6px] after:bg-white after:content-['']"
          : "before:absolute before:bottom-0 before:left-[-7px] before:h-[25px] before:w-[20px] before:rounded-br-[16px_14px] before:bg-[#F3F4F6] before:content-[''] after:absolute after:bottom-0 after:left-[-26px] after:h-[25px] after:w-[26px] after:rounded-br-[6px] after:bg-white after:content-['']",
      )}
    >
      <p className="type-title-md whitespace-pre-wrap">
        {message || <span className="animate-pulse">•••</span>}
      </p>
    </div>
  );
}
