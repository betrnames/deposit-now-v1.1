import { head } from '@vercel/blob';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DepositReceipt,
  explorerTxUrl,
  isValidReceiptId,
  networkLabel,
  receiptBlobPath,
} from '@/lib/receipts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Deposit Receipt',
  description:
    'Verifiable x402 deposit receipt: payer, target or managed child, fee, and on-chain forward transaction. payment_received does not mean target already holds funds.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

async function loadReceipt(id: string): Promise<DepositReceipt | null> {
  if (!isValidReceiptId(id)) return null;
  try {
    const blob = await head(receiptBlobPath(id));
    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as DepositReceipt;
  } catch {
    return null;
  }
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 border-b border-border/40 last:border-0 min-w-0 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4 sm:items-start">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-foreground/90 font-mono break-all min-w-0">{children}</span>
    </div>
  );
}

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = await loadReceipt(id);

  return (
    <div className="min-h-screen page-shell px-4 py-16">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm font-bold">
          deposit<span className="text-primary">.now</span>
        </Link>

        {!receipt ? (
          <div className="mt-10 border border-border/60 rounded-2xl p-8 bg-card/40">
            <h1 className="font-mono text-xl font-bold mb-3 text-white">
              Receipt not found
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No settled deposit matches this receipt ID. If the payment just happened, settlement
              can take a few seconds — refresh shortly. Otherwise, check the receiptUrl returned by
              the API response.
            </p>
          </div>
        ) : (
          <div className="mt-10 border border-border/60 rounded-2xl p-8 bg-card/40">
            <div className="flex items-center gap-3 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 shrink-0" />
              <h1 className="font-mono text-xl font-bold text-white">
                Deposit settled
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Verifiable x402 payment receipt · {networkLabel(receipt.network)}
            </p>

            <Row label="Receipt ID">{receipt.id}</Row>
            {receipt.target ? <Row label="Target">{receipt.target}</Row> : null}
            {receipt.provisioned ? (
              <Row label="Managed child">
                yes
                {receipt.childName ? ` · ${receipt.childName}` : ''}
                {receipt.childLabel ? ` · label ${receipt.childLabel}` : ''}
              </Row>
            ) : null}
            {receipt.memo ? <Row label="Memo">{receipt.memo}</Row> : null}
            {receipt.grossAmount ? (
              <Row label="Gross paid">{receipt.grossAmount} USDC</Row>
            ) : receipt.amountUsdc ? (
              <Row label="Amount paid">{receipt.amountUsdc} USDC</Row>
            ) : null}
            {receipt.fee ? (
              <Row label="Platform fee">
                {receipt.fee} USDC ({receipt.feePercent ?? '0.25'}%)
              </Row>
            ) : null}
            {receipt.netToTarget || receipt.depositAmount ? (
              <Row label="Net to target">
                {receipt.netToTarget ?? receipt.depositAmount} USDC
              </Row>
            ) : null}
            <Row label="Payer">{receipt.payer ?? '—'}</Row>
            <Row label="Paid to (platform)">{receipt.payTo ?? '—'}</Row>
            <Row label="Settled at">{receipt.settledAt}</Row>
            <Row label="Agent → Platform">
              {explorerTxUrl(receipt.network, receipt.txHash) ? (
                <a
                  href={explorerTxUrl(receipt.network, receipt.txHash)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {receipt.txHash!.slice(0, 10)}…{receipt.txHash!.slice(-8)} ↗
                </a>
              ) : (
                receipt.txHash ?? '—'
              )}
            </Row>
            {receipt.forwardTxHash ? (
              <Row label="Platform → Target">
                {explorerTxUrl(receipt.network, receipt.forwardTxHash) ? (
                  <a
                    href={explorerTxUrl(receipt.network, receipt.forwardTxHash)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {receipt.forwardTxHash.slice(0, 10)}…{receipt.forwardTxHash.slice(-8)} ↗
                  </a>
                ) : (
                  receipt.forwardTxHash
                )}
              </Row>
            ) : receipt.forwardStatus === 'forward_failed' ? (
              <Row label="Forward">Failed — manual review may be required</Row>
            ) : receipt.forwardStatus === 'held' ? (
              <Row label="Forward">Held — guardrail or verification; manual review may be required</Row>
            ) : receipt.forwardStatus === 'pending' ? (
              <Row label="Forward">Pending or not yet available — refresh shortly</Row>
            ) : null}
            {receipt.note ? <Row label="Note">{receipt.note}</Row> : null}
            <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
              Payment to the platform is recorded when the x402 facilitator settles. Forwarding net
              USDC to the target (or managed child) is a separate step and can lag or fail.
              Managed children are platform_managed in CDP — this receipt is not a key export.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
