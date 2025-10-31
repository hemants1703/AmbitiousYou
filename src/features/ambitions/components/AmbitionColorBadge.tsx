import { MotionWrapper } from "@/components/MotionWrapper";

export function AmbitionColorBadge({
  ambitionColor,
  index = 1,
  width = 100,
}: {
  ambitionColor: string;
  index: number;
  width: number;
}) {
  return (
    <MotionWrapper
      className={`h-1 w-12 rounded-full`}
      style={{ backgroundColor: ambitionColor }}
      initial={{ width: 0 }}
      animate={{ width: width }}
      transition={{
        duration: 0.3,
        delay: 0.2 + 0.1 * (index ? index : 1),
      }}
    >
      {width}
    </MotionWrapper>
  );
}
