import type { Ref } from "react";

export default function GradientPreview({
  gradient,
  ref,
}: {
  gradient: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className="gradient-preview aspect-video w-full rounded-lg"
      style={{
        backgroundImage: gradient,
        transform: "translate3d(0,0,0)",
      }}
    />
  );
}
