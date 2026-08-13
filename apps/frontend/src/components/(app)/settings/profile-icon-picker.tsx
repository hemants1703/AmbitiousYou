"use client";

import { PendingButton } from "@/components/(app)/mutations/pending-button";
import { UserAvatar } from "@/components/(app)/user-avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCloseOnActivityHide } from "@/lib/(app)/use-close-on-activity-hide";
import { PROFILE_GLYPH_ICON } from "@/lib/(app)/profile-icon-glyphs";
import { PROFILE_ICON_TONE_CLASS, PROFILE_TONE_SWATCH_CLASS } from "@/lib/(app)/profile-icon-tones";
import { updateProfileAvatarAction } from "@/lib/actions/(app)/settings/update-profile-icon";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PROFILE_TONE_ID,
  PROFILE_TONES,
  getProfileMark,
  listProfileMarksByKind,
  parseProfileAvatar,
  serializeProfileAvatar,
  type ProfileAvatarSelection,
  type ProfileMark,
  type ProfileMarkId,
  type ProfileToneId,
} from "@ambitiousyou/shared";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ProfileIconPickerProps {
  name: string;
  image: string | null;
}

interface ProfileMarkVisualProps {
  mark: ProfileMark;
  className?: string;
}

type PickerTab = "emoji" | "glyph" | "color";

function selectionKey(selection: ProfileAvatarSelection | null) {
  return selection ? serializeProfileAvatar(selection) : null;
}

function ProfileMarkVisual(props: ProfileMarkVisualProps) {
  if (props.mark.kind === "emoji") {
    return (
      <span className={cn("text-xl leading-none", props.className)} aria-hidden="true">
        {props.mark.emoji}
      </span>
    );
  }

  const GlyphIcon = PROFILE_GLYPH_ICON[props.mark.glyph];
  return <GlyphIcon className={cn("size-5", props.className)} aria-hidden="true" />;
}

export function ProfileIconPicker(props: ProfileIconPickerProps) {
  const [committedImage, setCommittedImage] = useState(props.image);
  const [prevPropsImage, setPrevPropsImage] = useState(props.image);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<PickerTab>("emoji");
  const [draft, setDraft] = useState<ProfileAvatarSelection | null>(() => parseProfileAvatar(props.image));
  const [isPending, startTransition] = useTransition();

  // Reconcile when the server prop changes after Soft Nav / refresh (not while a save is in flight).
  if (props.image !== prevPropsImage) {
    setPrevPropsImage(props.image);
    if (!isPending) {
      setCommittedImage(props.image);
      if (!open) setDraft(parseProfileAvatar(props.image));
    }
  }

  useCloseOnActivityHide(() => {
    if (open) discardAndClose();
  });

  const previewImage = selectionKey(draft);
  const committedKey = committedImage;
  const isDirty = previewImage !== committedKey;
  const activeTone = draft?.toneId ?? DEFAULT_PROFILE_TONE_ID;
  const displayImage = open ? previewImage : committedImage;

  function seedFromCommitted() {
    const nextSaved = parseProfileAvatar(committedImage);
    setDraft(nextSaved);
    if (!nextSaved?.markId) {
      setTab(nextSaved ? "color" : "emoji");
    } else {
      setTab(getProfileMark(nextSaved.markId).kind === "glyph" ? "glyph" : "emoji");
    }
  }

  function discardAndClose() {
    setDraft(parseProfileAvatar(committedImage));
    setOpen(false);
  }

  function openPicker(nextOpen: boolean) {
    if (nextOpen) {
      seedFromCommitted();
      setOpen(true);
      return;
    }

    if (isDirty) {
      toast.message("Changes discarded");
    }
    discardAndClose();
  }

  function selectMark(markId: ProfileMarkId) {
    setDraft({ markId, toneId: activeTone });
  }

  function selectTone(toneId: ProfileToneId) {
    setDraft({ markId: draft?.markId ?? null, toneId });
  }

  function save() {
    if (!isDirty) {
      setOpen(false);
      return;
    }

    const nextImage = previewImage;
    const previousImage = committedImage;
    const previousDraft = draft;

    // Optimistic: commit locally, close immediately, reconcile from the action.
    setCommittedImage(nextImage);
    setOpen(false);

    startTransition(async () => {
      const result = await toastMutation(
        () => updateProfileAvatarAction(previousDraft),
        {
          loading: "Updating avatar…",
          success: previousDraft ? "Profile avatar updated" : "Using your initials again",
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );
      if (result.error) {
        setCommittedImage(previousImage);
        setDraft(parseProfileAvatar(previousImage));
        return;
      }

      setCommittedImage(result.data?.image ?? nextImage);
    });
  }

  function renderMarkGrid(kind: "emoji" | "glyph") {
    const marks = listProfileMarksByKind(kind);
    return (
      <div className="grid grid-cols-4 gap-2" role="listbox" aria-label={kind === "emoji" ? "Emoji marks" : "Icon marks"}>
        {marks.map((mark) => {
          const isSelected = draft?.markId === mark.id;
          return (
            <button
              key={mark.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-label={mark.label}
              onClick={() => selectMark(mark.id)}
              className={cn(
                "flex min-h-11 min-w-11 aspect-square touch-manipulation items-center justify-center rounded-2xl border",
                "transition-[transform,box-shadow,background-color,border-color] duration-150",
                "hover:-translate-y-px hover:shadow-sm active:translate-y-px active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                PROFILE_ICON_TONE_CLASS[activeTone],
                isSelected ? "border-foreground/40 ring-2 ring-ring/40" : "border-border/50",
              )}
            >
              <ProfileMarkVisual mark={mark} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <UserAvatar name={props.name} image={displayImage} className="size-16" fallbackClassName="text-2xl" />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-foreground">Profile avatar</p>
          <p className="text-xs text-muted-foreground text-pretty">
            Mix an emoji or icon with a color, then save. Shown in your sidebar and account.
          </p>
        </div>
      </div>

      <Popover open={open} onOpenChange={openPicker}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="h-11 w-full touch-manipulation justify-between gap-3 rounded-2xl px-3 sm:w-56"
            aria-label="Customize profile avatar"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <UserAvatar
                name={props.name}
                image={displayImage}
                className="size-7"
                fallbackClassName="text-xs"
              />
              <span className="truncate text-sm">{committedImage ? "Customize" : "Choose avatar"}</span>
            </span>
            <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-72 gap-0 overflow-hidden overscroll-contain rounded-2xl p-0 shadow-lg"
        >
          <Tabs
            value={tab}
            onValueChange={(value) => {
              if (value === "emoji" || value === "glyph" || value === "color") setTab(value);
            }}
            className="gap-0"
          >
            <div className="border-b border-border/60 p-3">
              <TabsList className="flex h-9 w-full items-stretch gap-0.5 rounded-full p-1">
                <TabsTrigger
                  value="emoji"
                  className="h-full min-w-0 flex-1 touch-manipulation rounded-full px-2 text-xs after:hidden sm:text-sm"
                >
                  Emojis
                </TabsTrigger>
                <TabsTrigger
                  value="glyph"
                  className="h-full min-w-0 flex-1 touch-manipulation rounded-full px-2 text-xs after:hidden sm:text-sm"
                >
                  Icons
                </TabsTrigger>
                <TabsTrigger
                  value="color"
                  className="h-full min-w-0 flex-1 touch-manipulation rounded-full px-2 text-xs after:hidden sm:text-sm"
                >
                  Color
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="max-h-64 overflow-y-auto overscroll-contain p-3">
              <TabsContent value="emoji" className="mt-0 outline-none">
                {renderMarkGrid("emoji")}
              </TabsContent>
              <TabsContent value="glyph" className="mt-0 outline-none">
                {renderMarkGrid("glyph")}
              </TabsContent>
              <TabsContent value="color" className="mt-0 outline-none">
                <div className="grid grid-cols-4 gap-2" role="listbox" aria-label="Avatar colors">
                  {PROFILE_TONES.map((tone) => {
                    const isSelected = draft !== null && draft.toneId === tone.id;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        aria-label={`${tone.label}${isSelected ? ", selected" : ""}`}
                        onClick={() => selectTone(tone.id)}
                        className={cn(
                          "relative flex min-h-11 min-w-11 aspect-square touch-manipulation items-center justify-center rounded-2xl border",
                          "transition-[transform,box-shadow,border-color] duration-150",
                          "hover:-translate-y-px hover:shadow-sm active:translate-y-px active:scale-[0.98]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                          isSelected ? "border-foreground/40 ring-2 ring-ring/40" : "border-border/50",
                        )}
                      >
                        <span
                          className={cn("size-6 rounded-full shadow-sm", PROFILE_TONE_SWATCH_CLASS[tone.id])}
                          aria-hidden="true"
                        />
                        {isSelected ? (
                          <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/25">
                            <CheckIcon className="size-4 text-foreground drop-shadow-sm" aria-hidden="true" />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex items-center justify-between gap-2 border-t border-border/60 px-3 py-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="touch-manipulation"
              disabled={isPending || draft === null}
              onClick={() => setDraft(null)}
            >
              Use initials
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="touch-manipulation"
                disabled={isPending}
                onClick={() => openPicker(false)}
              >
                Cancel
              </Button>
              <PendingButton
                type="button"
                size="sm"
                className="touch-manipulation"
                isPending={isPending}
                disabled={!isDirty}
                onClick={save}
              >
                Save
              </PendingButton>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
