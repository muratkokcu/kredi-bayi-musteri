import { Hammer } from "lucide-react";
import { Card } from "@/ui/card";
import { DealerShell } from "../dealer-shell";

export function DealerPlaceholder({ title }: { title: string }) {
  return (
    <DealerShell subtitle="Bu ekran yakında eklenecek." title={title}>
      <Card className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-dealer-tint text-dealer-700">
          <Hammer size={26} strokeWidth={1.8} />
        </div>
        <h3 className="font-semibold text-[17px] text-ink">{title}</h3>
        <p className="max-w-sm text-[13.5px] text-ink-soft">
          Yapım aşamasında — tasarım taslağındaki ekran sıradaki adımda
          uygulanacak.
        </p>
      </Card>
    </DealerShell>
  );
}
