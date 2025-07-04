import Image from "next/image";

export default function AmbitiousYouLogo() {
  return (
    <div className="flex items-center gap-2 group max-sm:z-50">
      <div className="relative w-10 h-10 sm:w-12 sm:h-12">
        <Image
          src="/logo.svg"
          alt="AmbitiousYou Logo"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>
      <span className="text-2xl sm:text-3xl">
        <span className="font-regular">Ambitious</span>
        <span className="font-bold">You</span>
      </span>
    </div>
  );
}
