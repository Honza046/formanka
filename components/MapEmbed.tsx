import { site } from '@/lib/data';

type MapEmbedProps = {
  className?: string;
  minHeightClass?: string;
  fill?: boolean;
};

export default function MapEmbed({
  className = '',
  minHeightClass = 'min-h-[280px] sm:min-h-[360px]',
  fill = false,
}: MapEmbedProps) {
  const sizeClass = fill
    ? `absolute inset-0 h-full w-full border-0 ${className}`
    : `w-full border-0 ${minHeightClass} ${className}`;

  return (
    <iframe
      title="Mapa Na Formance Žeravice"
      src={site.mapsEmbedUrl}
      className={sizeClass}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
