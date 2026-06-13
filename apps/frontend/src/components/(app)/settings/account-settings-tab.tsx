import type { User } from "@ambitiousyou/shared";
import { CircleCheckBigIcon, MailIcon, UserRoundIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { formatDate } from "./settings-shared";
import { ResendVerificationButton } from "./resend-verification-button";

interface AccountSettingsTabProps {
  userDetails: User;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AccountSettingsTab(props: AccountSettingsTabProps) {
  const initials = getInitials(props.userDetails.name);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRoundIcon className="size-4 text-primary dark:text-chart-1" />
            Profile
          </CardTitle>
          <CardDescription>Your identity on AmbitiousYou.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="size-16 shrink-0">
              {props.userDetails.image ? (
                <AvatarImage src={props.userDetails.image} alt={props.userDetails.name} />
              ) : null}
              <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-1.5">
              <p className="line-clamp-1 text-xl font-semibold tracking-tight text-foreground">
                {props.userDetails.name}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MailIcon className="size-3.5 shrink-0" />
                  <span className="truncate">{props.userDetails.email}</span>
                </div>
                <Badge
                  variant={props.userDetails.emailVerified ? "default" : "outline"}
                  className="shrink-0"
                >
                  {props.userDetails.emailVerified ? (
                    <CircleCheckBigIcon className="size-3" />
                  ) : null}
                  {props.userDetails.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </div>

          {!props.userDetails.emailVerified ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Verify your email to secure your account. Check your inbox for the verification link.
              </p>
              <ResendVerificationButton />
            </div>
          ) : null}

          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Member since
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {formatDate(props.userDetails.createdAt)}
            </dd>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
