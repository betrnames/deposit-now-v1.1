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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-200 font-mono break-all sm:text-right">{children}</span>
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
    <div className="min-h-screen bg-[#0b0d12] text-white px-4 py-16">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm font-bold">
          deposit<span className="text-blue-400">.now</span>
        </Link>

        {!receipt ? (
          <div className="mt-10 border border-white/10 rounded-2xl p-8 bg-white/[0.02]">
            <h1 className="text-xl font-bold mb-3">Receipt not found</h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              No settled deposit matches this receipt ID. If the payment just
              happened, settlement can take a few seconds — refresh shortly.
              Otherwise, check the receiptUrl returned by the API response.
            </p>
          </div>
        ) : (
          <div className="mt-10 border border-white/10 rounded-2xl p-8 bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400" />
              <h1 className="text-xl font-bold">Deposit settled</h1>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Verifiable x402 payment receipt · {networkLabel(receipt.network)}
            </p>

            <Row label="Receipt ID">{receipt.id}</Row>
            <Row label="Amount">
              {receipt.amountUsdc ? `${receipt.amountUsdc} USDC` : '—'}
            </Row>
            <Row label="Payer">{receipt.payer ?? '—'}</Row>
            <Row label="Paid to">{receipt.payTo ?? '—'}</Row>
            <Row label="Settled at">{receipt.settledAt}</Row>
            <Row label="Transaction">
              {explorerTxUrl(receipt.network, receipt.txHash) ? (
                <a
                  href={explorerTxUrl(receipt.network, receipt.txHash)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {receipt.txHash!.slice(0, 10)}…{receipt.txHash!.slice(-8)} ↗
                </a>
              ) : (
                receipt.txHash ?? '—'
              )}
            </Row>

            <p className="text-xs text-gray-600 mt-6 leading-relaxed">
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
