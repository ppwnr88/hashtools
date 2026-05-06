type AdSlotProps = {
  placement: "top" | "rail" | "bottom";
};

export function AdSlot({ placement }: AdSlotProps) {
  const enabled = import.meta.env.VITE_ENABLE_ADS === "true";
  if (!enabled) {
    return import.meta.env.DEV ? <div className={`ad-slot ad-${placement}`}>Ad placeholder: {placement}</div> : null;
  }

  return (
    <ins
      className={`adsbygoogle ad-slot ad-${placement}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-9540032299322636"
      data-ad-slot="auto"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
