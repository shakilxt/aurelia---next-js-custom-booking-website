import type { StayEstimate } from "@/lib/pricing";
import { formatMoney } from "@/lib/money";

const unitLabel = { night: ["night", "nights"], guest: ["guest", "guests"] } as const;

/** Itemised estimate. Presentational, so it can render on the server or the client. */
export function PriceSummary({ estimate }: { estimate: StayEstimate }) {
  const money = (amount: number) => formatMoney(amount, estimate.currency);

  return (
    <div>
      <dl className="space-y-3 text-sm">
        {estimate.lines.map((line) => (
          <div key={line.id} className="flex items-start justify-between gap-4">
            <dt>
              {line.label}
              {line.basis ? (
                <span className="block text-xs text-muted">
                  {money(line.basis.unitAmountMinor)} × {line.basis.quantity}{" "}
                  {unitLabel[line.basis.unit][line.basis.quantity === 1 ? 0 : 1]}
                </span>
              ) : null}
            </dt>
            <dd className="tabular-nums">{money(line.amountMinor)}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
          <dt className="font-medium">Estimated total</dt>
          <dd className="font-serif text-[1.75rem] leading-none text-forest-900 tabular-nums">
            {money(estimate.totalMinor)}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted">
        Demonstration estimate in USD. No taxes are modelled.
      </p>
    </div>
  );
}
