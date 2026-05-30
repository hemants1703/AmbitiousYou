import type { User } from "@ambitiousyou/shared";
import { CircleCheckBigIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { DetailItem, formatDate } from "./settings-shared";

interface AccountSettingsTabProps {
  userDetails: User;
}

export function AccountSettingsTab(props: AccountSettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account details</CardTitle>
        <CardDescription>Live data fetched for the signed-in user.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-foreground">{props.userDetails.name}</p>
            <p className="text-sm text-muted-foreground">{props.userDetails.email}</p>
          </div>
          <Badge variant={props.userDetails.emailVerified ? "default" : "outline"} className="w-fit">
            {props.userDetails.emailVerified ? <CircleCheckBigIcon className="size-3.5" /> : null}
            {props.userDetails.emailVerified ? "Email verified" : "Email pending"}
          </Badge>
        </div>

        <Separator />

        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="User ID" value={props.userDetails.id} />
          <DetailItem label="Avatar" value={props.userDetails.image ?? "No profile image"} />
          <DetailItem label="Created" value={formatDate(props.userDetails.createdAt)} />
          <DetailItem label="Updated" value={formatDate(props.userDetails.updatedAt)} />
        </dl>
      </CardContent>
    </Card>
  );
}
