type LogoMarkProps = {
  className?: string;
  title?: string;
};

/** Obrysové logo Na Formance – zelené linky, bez pozadí. */
export default function LogoMark({ className = 'h-14 w-14', title = 'Na Formance' }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="2.2" />

      {/* Příbor – vidlička */}
      <path
        d="M38 28v14M35.5 28v5M40.5 28v5M38 42v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Lžíce */}
      <path
        d="M52 28c0 4 2.5 6 2.5 10v10M54.5 28c0 4-2.5 6-2.5 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Nůž */}
      <path
        d="M68 28l8 14M76 28v20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x="60"
        y="66"
        textAnchor="middle"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="11"
        fontWeight="700"
        letterSpacing="2"
      >
        NA
      </text>
      <text
        x="60"
        y="82"
        textAnchor="middle"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.85"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="10.5"
        fontWeight="700"
        letterSpacing="1.2"
      >
        FORMANCE
      </text>
      <text
        x="60"
        y="96"
        textAnchor="middle"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.55"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="6.5"
        fontWeight="400"
        letterSpacing="2.5"
      >
        RESTAURACE
      </text>
    </svg>
  );
}

export function LogoMarkCompact({ className = 'h-10 w-10', title = 'Na Formance' }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
      <path d="M15 14v8M13.5 14v3.5M16.5 14v3.5M15 22v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 14c0 2.2 1.2 3.5 1.2 6v7M22.2 14c0 2.2-1.2 3.5-1.2 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M28 14l4.5 8M32.5 14v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        fontFamily="Georgia, serif"
        fontSize="5.5"
        fontWeight="700"
        letterSpacing="0.8"
      >
        NA
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.65"
        fontFamily="Georgia, serif"
        fontSize="4.8"
        fontWeight="700"
        letterSpacing="0.5"
      >
        FORM.
      </text>
    </svg>
  );
}
