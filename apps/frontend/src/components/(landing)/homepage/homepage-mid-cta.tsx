import PrimaryCta from "@/components/(landing)/primary-cta";
import { brandCopy } from "@/lib/brand";
import Link from "next/link";

export default function HomepageMidCta() {
  return (
    <section className="w-full pb-8 pt-4 md:pb-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 text-center md:px-6">
        <p className="text-base font-medium text-foreground md:text-lg">Ready to declare yours?</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <PrimaryCta loggedOutLabel={brandCopy.cta.claimFirst} loggedOutHref="/signup" size="lg" />
          <Link href="/experience" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Or try the interactive demo
          </Link>
        </div>
      </div>
    </section>
  );
}
