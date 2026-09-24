import Image from "next/image";
import { getTeacherInitials, type Teacher } from "@/data/teachers";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-9 w-9 text-xs rounded-xl",
  md: "h-12 w-12 text-sm rounded-2xl",
  lg: "h-14 w-14 text-base rounded-2xl",
  xl: "h-20 w-20 text-xl rounded-3xl",
} as const;

interface TeacherAvatarProps {
  teacher: Pick<Teacher, "name" | "image">;
  size?: keyof typeof SIZES;
  className?: string;
}

export function TeacherAvatar({ teacher, size = "md", className }: TeacherAvatarProps) {
  if (teacher.image) {
    return (
      <Image
        src={teacher.image}
        alt={teacher.name}
        width={80}
        height={80}
        className={cn("shrink-0 object-cover", SIZES[size], className)}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br from-theme_secondary to-slate-700 font-semibold tracking-wide text-white shadow-inner",
        SIZES[size],
        className,
      )}
    >
      {getTeacherInitials(teacher)}
    </div>
  );
}
