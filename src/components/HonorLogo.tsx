interface HonorLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function HonorLogo({ className = "", showText = true, size = "md" }: HonorLogoProps) {
  const iconSizes = {
    sm: "size-6",
    md: "size-8",
    lg: "size-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        className={`${iconSizes[size]} text-accent shrink-0`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Diamond frame */}
        <path
          d="M20 2L38 20L20 38L2 20L20 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="opacity-40"
        />
        <path
          d="M20 6L34 20L20 34L6 20L20 6Z"
          stroke="currentColor"
          strokeWidth="0.75"
          className="opacity-20"
        />
        {/* Monogram H with Needle Motif */}
        <path
          d="M14 12V28M26 12V28M14 20H26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Needle Eye Accent */}
        <circle cx="20" cy="12" r="1.5" fill="currentColor" />
        {/* Thread Curve */}
        <path
          d="M20 13.5C20 16 23 17 23 20C23 23 17 24 17 27"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="1.5 1.5"
          className="opacity-60"
        />
      </svg>
      {showText && (
        <span
          className={`font-serif italic font-light tracking-tight text-ink ${textSizes[size]}`}
        >
          HONOR
        </span>
      )}
    </div>
  );
}
