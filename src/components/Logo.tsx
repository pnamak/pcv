import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  href?: string;
  variant?: "light" | "dark";
}

const sizes = {
  sm: { img: 36, text: "text-xs" },
  md: { img: 48, text: "text-sm" },
  lg: { img: 64, text: "text-base" },
  xl: { img: 96, text: "text-lg" },
};

export function Logo({
  size = "md",
  showText = true,
  className,
  href = "/",
  variant = "dark",
}: LogoProps) {
  const { img, text } = sizes[size];

  const content = (
    <>
      <Image
        src="/images/pcv-logo.png"
        alt="Presbyterian Church of Vanuatu — Presbitirin Jyos Blong Vanuatu"
        width={img}
        height={Math.round(img * 1.33)}
        className="h-auto w-auto shrink-0 object-contain"
        priority={size === "md" || size === "lg"}
      />
      {showText && (
        <span
          className={cn(
            "font-semibold leading-tight",
            text,
            variant === "light" ? "text-white" : "text-pcv-burgundy",
            size === "sm" ? "hidden min-[400px]:block" : "hidden sm:block"
          )}
        >
          Presbyterian Church of Vanuatu
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("flex items-center gap-2 sm:gap-3", className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {content}
    </div>
  );
}
