"use client";

import { Button } from "@/components/ui/button";
import { saveDraft } from "@/lib/(app)/create-ambition-draft";
import { hydrateTemplateDraft, type AmbitionTemplate } from "@/lib/seo/template-content";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TemplateApplyButtonProps {
  template: AmbitionTemplate;
}

export function TemplateApplyButton(props: TemplateApplyButtonProps) {
  const isLoggedIn = useAuthStatus();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <Button asChild size="lg">
        <Link href="/signup">Join to use this template</Link>
      </Button>
    );
  }

  const handleApply = () => {
    saveDraft(hydrateTemplateDraft(props.template));
    router.push("/ambitions/create");
  };

  return (
    <Button type="button" size="lg" onClick={handleApply}>
      Use this template
      <ArrowRightIcon className="size-4" aria-hidden="true" />
    </Button>
  );
}
