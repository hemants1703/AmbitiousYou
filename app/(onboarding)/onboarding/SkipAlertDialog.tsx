import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { redirect } from "next/navigation";


export default function SkipAlertDialog({ openSkipAlertDialog, setOpenSkipAlertDialog }: { openSkipAlertDialog: boolean, setOpenSkipAlertDialog: (open: boolean) => void }) {
    return (
        <AlertDialog open={openSkipAlertDialog} onOpenChange={setOpenSkipAlertDialog}>
            {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you really wish to skip the onboarding process?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are missing out on a really great introduction to AmbitiousYou!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {
                        setOpenSkipAlertDialog(false);
                    }}>Don't Skip</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        setOpenSkipAlertDialog(false);
                        redirect("/dashboard");
                    }}>Yes, Skip</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}