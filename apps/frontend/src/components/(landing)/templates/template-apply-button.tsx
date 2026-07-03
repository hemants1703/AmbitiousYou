"use client";

import { Button } from "@/components/ui/button";
import { saveDraft } from "@/lib/(app)/create-ambition-draft";
import { brandCopy } from "@/lib/brand";
import { hydrateTemplateDraft, type AmbitionTemplate } from "@/lib/seo/template-content";
import { useAuthSession } from "@/hooks/use-auth-status";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface TemplateApplyButtonProps {
  template: AmbitionTemplate;
}

export function TemplateApplyButton(props: TemplateApplyButtonProps) {
  const session = useAuthSession();
  const router = useRouter();

  if (!session.isLoggedIn) {
    const handleSignupWithTemplate = () => {
      saveDraft(hydrateTemplateDraft(props.template));
      router.push("/signup");
    };

    return (
      <Button type="button" size="lg" onClick={handleSignupWithTemplate}>
        {brandCopy.cta.join}
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
