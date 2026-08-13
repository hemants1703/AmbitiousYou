import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PROFILE_GLYPH_ICON } from "@/lib/(app)/profile-icon-glyphs";
import { PROFILE_ICON_TONE_CLASS } from "@/lib/(app)/profile-icon-tones";
import { cn } from "@/lib/utils";
import { getProfileMark, parseProfileAvatar } from "@ambitiousyou/shared";

interface UserAvatarProps {
  name: string;
  image: string | null;
  className?: string;
  fallbackClassName?: string;
  size?: "default" | "sm" | "lg";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar(props: UserAvatarProps) {
  const selection = parseProfileAvatar(props.image);
  const initials = getInitials(props.name) || props.name.charAt(0).toUpperCase() || "?";

  if (selection) {
    const mark = selection.markId ? getProfileMark(selection.markId) : null;
    const GlyphIcon = mark?.kind === "glyph" ? PROFILE_GLYPH_ICON[mark.glyph] : null;
    const label = mark ? `${props.name} — ${mark.label}` : `${props.name} — ${selection.toneId}`;

    return (
      <Avatar className={cn(props.className)} size={props.size}>
        <AvatarFallback
          className={cn(
            "leading-none font-semibold",
            PROFILE_ICON_TONE_CLASS[selection.toneId],
            props.fallbackClassName,
          )}
          aria-label={label}
        >
          {mark?.kind === "emoji" ? (
            <span className="text-[1.05em] font-normal" aria-hidden="true">
              {mark.emoji}
            </span>
          ) : GlyphIcon ? (
            <GlyphIcon className="size-[55%]" aria-hidden="true" />
          ) : (
            initials
          )}
        </AvatarFallback>
      </Avatar>
    );
  }

  const isRemoteImage = Boolean(props.image && !props.image.startsWith("icon:"));

  return (
    <Avatar className={cn(props.className)} size={props.size}>
      {isRemoteImage ? <AvatarImage src={props.image!} alt={props.name} /> : null}
      <AvatarFallback className={cn("font-semibold", props.fallbackClassName)}>{initials}</AvatarFallback>
    </Avatar>
  );
}
