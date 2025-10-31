import Image from "next/image";

export default function AmbitiousYouLogo() {
  return (
    <div className="flex items-center gap-2 group max-sm:z-50">
      <Image
        src="/svg_logos/favicon_32px.svg"
        alt="AmbitiousYou Logo"
        width={35}
        height={35}
        quality={100}
        className="aspect-square object-contain"
      />
      <span className="text-2xl sm:text-3xl">
        <span className="font-regular">Ambitious</span>
        <span className="font-bold">You</span>
      </span>
    </div>
  );
}
