import { getChurchLogoSrc } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ChurchLogoProps {
  church?: { id: number; name: string; logoPath: string | null } | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function ChurchLogo({ church, size = "md", className }: ChurchLogoProps) {
  const src = getChurchLogoSrc(church ?? null);
  const alt = church?.logoPath
    ? `${church.name} logo`
    : "Presbyterian Church of Vanuatu";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("shrink-0 object-contain", sizeClasses[size], className)}
    />
  );
}
