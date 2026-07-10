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
    'Verifiable x402 deposit receipt: payer, amount, and on-chain settlement transaction.',
  robots: { index: false },
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
            <h1 className="text-xl font-bold mb-3">Receipt not found</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No settled deposit matches this receipt ID. If the payment just
              happened, settlement can take a few seconds — refresh shortly.
              Otherwise, check the receiptUrl returned by the API response.
            </p>
          </div>
        ) : (
          <div className="mt-10 border border-border/60 rounded-2xl p-8 bg-card/40">
            <div className="flex items-center gap-3 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400" />
              <h1 className="text-xl font-bold">Deposit settled</h1>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Verifiable x402 payment receipt · {networkLabel(receipt.network)}
            </p>

            <Row label="Receipt ID">{receipt.id}</Row>
            {receipt.merchantSlug ? (
              <Row label="Merchant">
                {receipt.merchantName ?? receipt.merchantSlug}
              </Row>
            ) : null}
            {receipt.grossAmount ? (
              <Row label="Gross amount">{receipt.grossAmount} USDC</Row>
            ) : receipt.depositAmount ? (
              <Row label="Deposit intent">{receipt.depositAmount} USDC</Row>
            ) : null}
            {receipt.fee ? (
              <Row label="Settlement fee">
                {receipt.fee} USDC ({receipt.feePercent}%)
              </Row>
            ) : null}
            {receipt.netToMerchant ? (
              <Row label="Net to merchant">{receipt.netToMerchant} USDC</Row>
            ) : null}
            {receipt.account ? <Row label="Account">{receipt.account}</Row> : null}
            {!receipt.grossAmount && receipt.amountUsdc ? (
              <Row label="Amount">{receipt.amountUsdc} USDC</Row>
            ) : null}
            <Row label="Payer">{receipt.payer ?? '—'}</Row>
            {receipt.merchantPayTo ? (
              <Row label="Merchant wallet">{receipt.merchantPayTo}</Row>
            ) : (
              <Row label="Paid to">{receipt.payTo ?? '—'}</Row>
            )}
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
              <Row label="Platform → Merchant">
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
              <Row label="Platform → Merchant">
                <span className="text-red-400">Forward pending — contact support</span>
              </Row>
            ) : null}

            <p className="text-xs text-muted-foreground/70 mt-6 leading-relaxed">
              This receipt was written by deposit.now after the x402 facilitator
              settled the payment on-chain. The transaction link is the
              authoritative proof; this page binds it to the deposit request.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
