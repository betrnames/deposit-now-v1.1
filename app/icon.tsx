import { ImageResponse } from 'next/og';
import { SiteIconMark } from '@/lib/site-icon-mark';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<SiteIconMark size={32} />, { ...size });
}