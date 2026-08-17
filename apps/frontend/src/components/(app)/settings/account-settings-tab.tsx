import type { User } from "@/types";
import { CalendarIcon, CircleCheckBigIcon, MailIcon, UserRoundIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ProfileIconPicker } from "@/components/(app)/settings/profile-icon-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { formatDate } from "./settings-shared";
import { ResendVerificationButton } from "./resend-verification-button";

interface AccountSettingsTabProps {
  userDetails: User;
}

export function AccountSettingsTab(props: AccountSettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRoundIcon className="size-4 text-accent-brand" />
            Profile
          </CardTitle>
          <CardDescription>Your identity on AmbitiousYou.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
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

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <ProfileIconPicker name={props.userDetails.name} image={props.userDetails.image} />
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-accent-brand" />
            Week schedule
          </CardTitle>
          <CardDescription>
            Configure your week start and end days. The weekly review prompt appears on your week-end day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="week-start-day">Week starts on</Label>
              <Select
                value={props.userDetails.weekStartDay?.toString() ?? "0"}
                onValueChange={() => {
                  // TODO: Add update settings action call
                }}
              >
                <SelectTrigger id="week-start-day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="week-end-day">Week ends on</Label>
              <Select
                value={props.userDetails.weekEndDay?.toString() ?? "6"}
                onValueChange={() => {
                  // TODO: Add update settings action call
                }}
              >
                <SelectTrigger id="week-end-day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
