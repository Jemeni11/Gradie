export default function Code(props: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
      {...props}
    >
      {props.children}
    </code>
  );
}
