import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/data';

type SiteLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClass = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const sizePx = {
  sm: 40,
  md: 48,
  lg: 64,
};

export default function SiteLogo({ size = 'md', className = '' }: SiteLogoProps) {
  return (
    <Image
      src="/logo.jpg"
      alt={site.fullName}
      width={sizePx[size]}
      height={sizePx[size]}
      sizes={`${sizePx[size]}px`}
      className={`${sizeClass[size]} shrink-0 rounded-full object-cover shadow-sm ring-1 ring-slate-deep/10 ${className}`}
      priority={size === 'md'}
    />
  );
}

export function SiteLogoLink({ size = 'md', className = '' }: SiteLogoProps) {
  return (
    <Link href="/" className={`inline-flex shrink-0 transition-opacity hover:opacity-90 ${className}`}>
      <SiteLogo size={size} />
    </Link>
  );
}
