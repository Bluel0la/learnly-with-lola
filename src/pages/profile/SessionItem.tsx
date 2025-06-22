
import React from "react";
import { useToast } from "@/hooks/use-toast";

const SessionItem = ({
  title,
  date,
  type,
}: {
  title: string;
  date: string;
  type: string;
}) => {
  const { toast } = useToast();

  const getTypeColor = () => {
    switch (type) {
      case "Math":
        return "text-green-500";
      case "Summary":
        return "text-blue-500";
      case "Flashcard":
        return "text-purple-500";
      case "Quiz":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };
  return (
    <div
      className="flex justify-between items-center p-3 border rounded-lg bg-white/70 hover:bg-blue-50 transition cursor-pointer animate-fade-in"
      tabIndex={0}
      onClick={() => toast({ title: `Viewing ${title}` })}
      onKeyDown={e => {
        if (e.key === "Enter") toast({ title: `Viewing ${title}` });
      }}
      role="button"
      aria-label={`View session: ${title}`}
    >
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-400">{date}</div>
      </div>
      <div className={`font-semibold ${getTypeColor()}`}>{type}</div>
    </div>
  );
};

export default SessionItem;
