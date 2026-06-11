import Image from "next/image";

export default function AmbitiousYouLogo() {
  return (
    <div translate="no" className="group flex items-center gap-2">
      <Image src="/svg_logos/favicon_32px.svg" alt="AmbitiousYou Logo" width={35} height={35} className="aspect-square object-contain" />
      <span className="font-brand text-2xl sm:text-3xl">
        <span className="font-regular">Ambitious</span>
        <span className="font-bold">You</span>
      </span>
    </div>
  );
}
