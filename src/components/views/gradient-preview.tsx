import type { Ref } from "react";
import { cn } from "@/lib/utils";

export default function GradientPreview({
  gradient,
  ref,
  className,
}: {
  gradient: string;
  ref?: Ref<HTMLDivElement>;
  className?: string;
}) {
  return (
    <div
      ref={ref}
      className={cn("aspect-video w-full rounded-lg", className)}
      style={{
        backgroundImage: gradient,
        transform: "translate3d(0,0,0)",
      }}
    />
  );
}
