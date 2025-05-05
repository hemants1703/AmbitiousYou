"use client";

import { Button } from "@/components/ui/button";
import * as AlertDialog from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import deleteAccountAction from "./actions";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteAccountComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/login");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleAccountDeletion = async () => {
    setDeletingAccount(true);
    const accountDeletionResponse = await deleteAccountAction(user?.id);

    console.log("Account deletion response: ", accountDeletionResponse);

    if (!accountDeletionResponse.success) {
      toast.error(accountDeletionResponse.error ?? "Error deleting account.");
      setDeletingAccount(false);
      return;
    }

    toast.success("Account deleted successfully.");
    setDeletingAccount(false);
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      <div>
        <p className="font-medium">Delete account</p>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all data
        </p>
      </div>
      <AlertDialog.AlertDialog>
        <AlertDialog.AlertDialogTrigger>
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </AlertDialog.AlertDialogTrigger>
        <AlertDialog.AlertDialogContent>
          <AlertDialog.AlertDialogHeader>
            <AlertDialog.AlertDialogTitle>Are you absolutely sure?</AlertDialog.AlertDialogTitle>
            <AlertDialog.AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </AlertDialog.AlertDialogDescription>
          </AlertDialog.AlertDialogHeader>
          <AlertDialog.AlertDialogFooter>
            <AlertDialog.AlertDialogCancel>Cancel</AlertDialog.AlertDialogCancel>
            <AlertDialog.AlertDialogAction onClick={handleAccountDeletion}>
              {deletingAccount ? "Deleting..." : "Delete Account"}
            </AlertDialog.AlertDialogAction>
          </AlertDialog.AlertDialogFooter>
        </AlertDialog.AlertDialogContent>
      </AlertDialog.AlertDialog>
    </div>
  );
}
