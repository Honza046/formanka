import { siteAnnouncement } from '@/lib/data';

const variantStyles = {
  info: 'bg-navy text-ivory',
  warning: 'bg-gold text-navy',
  important: 'bg-navy text-gold-light ring-1 ring-gold/30',
} as const;

export default function SiteAnnouncementBar() {
  if (!siteAnnouncement) {
    return null;
  }

  const styles = variantStyles[siteAnnouncement.variant ?? 'info'];

  return (
    <div className={`${styles} px-4 py-2.5 text-center text-sm sm:px-6`} role="status">
      <p className="mx-auto max-w-4xl leading-relaxed">
        {siteAnnouncement.message}
        {siteAnnouncement.href && siteAnnouncement.linkLabel && (
          <>
            {' '}
            <a
              href={siteAnnouncement.href}
              className="font-semibold underline underline-offset-2 transition hover:opacity-80"
            >
              {siteAnnouncement.linkLabel}
            </a>
          </>
        )}
      </p>
    </div>
  );
}
