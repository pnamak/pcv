import { ChurchLogo } from "@/components/ChurchLogo";

interface NewsCardHeaderProps {
  church?: { id: number; name: string; logoPath: string | null } | null;
}

export function NewsCardHeader({ church }: NewsCardHeaderProps) {
  return (
    <div className="card-gradient flex h-24 items-center justify-center gap-3 px-4 sm:h-28">
      <ChurchLogo church={church} size="lg" className="h-14 w-auto sm:h-16" />
      {church && (
        <p className="max-w-[10rem] text-center text-xs font-medium text-white/95 sm:text-sm">
          {church.name}
        </p>
      )}
    </div>
  );
}
