import { Hammer } from "lucide-react";
import { Card } from "../../../ui/card";
import { BankShell } from "../bank-shell";

export function BankPlaceholder({ title }: { title: string }) {
  return (
    <BankShell
      subtitle="Bu ekran yakında pixel-perfect olarak eklenecek."
      title={title}
    >
      <Card className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-bank-tint text-bank-600">
          <Hammer size={26} strokeWidth={1.8} />
        </div>
        <h3 className="font-semibold text-[17px] text-ink">{title}</h3>
        <p className="max-w-sm text-[13.5px] text-ink-soft">
          Yapım aşamasında — tasarım taslağındaki ekran sıradaki adımda
          uygulanacak.
        </p>
      </Card>
    </BankShell>
  );
}
