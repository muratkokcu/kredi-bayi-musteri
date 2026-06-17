import { Hammer } from "lucide-react";
import { MobileShell } from "../mobile-shell";

export function CustomerPlaceholder({
  title,
  tab,
}: {
  title: string;
  tab?: string;
}) {
  return (
    <MobileShell tab={tab}>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-cust-tint text-cust">
          <Hammer size={26} strokeWidth={1.8} />
        </div>
        <h3 className="font-semibold text-[17px] text-ink">{title}</h3>
        <p className="text-[13px] text-ink-soft">Bu ekran yakında eklenecek.</p>
      </div>
    </MobileShell>
  );
}
