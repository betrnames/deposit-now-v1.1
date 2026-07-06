import { head, put } from '@vercel/blob';

export interface Merchant {
  slug: string;
  name: string;
  payTo: string;
  description?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  active: boolean;
  createdAt: string;
}

export interface MerchantPublic {
  slug: string;
  name: string;
  payTo: string;
  description?: string;
  depositUrl: string;
  active: boolean;
}

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const REGISTRY_PATH = 'merchants/_registry.json';

export function isValidMerchantSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

export function isValidEvmAddress(address: string): boolean {
  return EVM_ADDRESS_RE.test(address);
}

export function merchantSlugFromPath(path: string): string | null {
  const match = path.match(/^\/api\/merchants\/([a-z0-9][a-z0-9-]*)\/deposit\/?$/i);
  if (!match) return null;
  const slug = match[1].toLowerCase();
  return isValidMerchantSlug(slug) ? slug : null;
}

function merchantBlobPath(slug: string) {
  return `merchants/${slug}.json`;
}

export function toPublicMerchant(merchant: Merchant): MerchantPublic {
  return {
    slug: merchant.slug,
    name: merchant.name,
    payTo: merchant.payTo,
    description: merchant.description,
    depositUrl: `https://deposit.now/api/merchants/${merchant.slug}/deposit`,
    active: merchant.active,
  };
}

async function readRegistry(): Promise<string[]> {
  try {
    const blob = await head(REGISTRY_PATH);
    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as { slugs?: string[] };
    return Array.isArray(data.slugs) ? data.slugs : [];
  } catch {
    return [];
  }
}

async function writeRegistry(slugs: string[]) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const unique = Array.from(new Set(slugs)).sort();
  await put(REGISTRY_PATH, JSON.stringify({ slugs: unique, updatedAt: new Date().toISOString() }), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

export async function getMerchant(slug: string): Promise<Merchant | null> {
  if (!isValidMerchantSlug(slug) || !process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const blob = await head(merchantBlobPath(slug));
    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as Merchant;
  } catch {
    return null;
  }
}

export async function listMerchants(): Promise<MerchantPublic[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  const slugs = await readRegistry();
  const merchants = await Promise.all(slugs.map((slug) => getMerchant(slug)));
  return merchants
    .filter((m): m is Merchant => !!m && m.active)
    .map(toPublicMerchant)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function upsertMerchant(input: Omit<Merchant, 'createdAt'> & { createdAt?: string }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }
  const slug = input.slug.toLowerCase();
  if (!isValidMerchantSlug(slug)) {
    throw new Error('Invalid merchant slug');
  }
  if (!isValidEvmAddress(input.payTo)) {
    throw new Error('Invalid payTo address');
  }

  const existing = await getMerchant(slug);
  const merchant: Merchant = {
    slug,
    name: input.name.trim(),
    payTo: input.payTo,
    description: input.description?.trim() || undefined,
    webhookUrl: input.webhookUrl?.trim() || undefined,
    webhookSecret: input.webhookSecret?.trim() || undefined,
    active: input.active,
    createdAt: existing?.createdAt ?? input.createdAt ?? new Date().toISOString(),
  };

  await put(merchantBlobPath(slug), JSON.stringify(merchant), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });

  const slugs = await readRegistry();
  if (!slugs.includes(slug)) {
    await writeRegistry([...slugs, slug]);
  }
}

/** Bootstrap default merchants when blob store is empty (idempotent). */
export async function ensureDefaultMerchants(platformPayTo: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const existing = await listMerchants();
  if (existing.length > 0) return;

  await upsertMerchant({
    slug: 'deposit-now',
    name: 'deposit.now Platform',
    payTo: platformPayTo,
    description: 'Default platform deposit endpoint — funds settle to deposit.now.',
    active: true,
  });
}