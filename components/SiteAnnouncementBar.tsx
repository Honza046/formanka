import type { SiteAnnouncementSettings } from '@/lib/pizza-orders/types';

const variantStyles = {
  info: 'bg-navy text-ivory',
  warning: 'bg-gold text-navy',
  important: 'bg-navy text-gold-light ring-1 ring-gold/30',
} as const;

export default function SiteAnnouncementBar({
  announcement,
}: {
  announcement?: SiteAnnouncementSettings | null;
}) {
  if (!announcement?.enabled || !announcement.message.trim()) {
    return null;
  }

  const styles = variantStyles[announcement.variant ?? 'info'];
  const href = announcement.href.trim();
  const linkLabel = announcement.linkLabel.trim();

  return (
    <div className={`${styles} px-4 py-2.5 text-center text-sm sm:px-6`} role="status">
      <p className="mx-auto max-w-4xl leading-relaxed">
        {announcement.message}
        {href && linkLabel && (
          <>
            {' '}
            <a
              href={href}
              className="font-semibold underline underline-offset-2 transition hover:opacity-80"
            >
              {linkLabel}
            </a>
          </>
        )}
      </p>
    </div>
  );
}
