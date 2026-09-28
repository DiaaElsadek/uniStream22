import Image from "next/image";
import { cn } from "@/lib/utils";

interface UniStreamLogoProps {
  size?: number;
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  textClassName?: string;
  subtitle?: string;
  priority?: boolean;
}

export default function UniStreamLogo({
  size = 32,
  className,
  imageClassName,
  showText = false,
  textClassName,
  subtitle,
  priority = true,
}: UniStreamLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl border border-primary/20 bg-background/80 shadow-xs shadow-primary/10 transition-transform duration-200 group-hover:scale-105",
          imageClassName
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src="/icons/icon-192x192.png"
          alt="UniStream22"
          width={size}
          height={size}
          priority={priority}
          className="h-full w-full object-cover rounded-xl"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={cn("flex items-center gap-1 font-extrabold tracking-tight text-foreground", textClassName)}>
            <span>UniStream</span>
            <span className="text-primary font-black">22</span>
          </div>
          {subtitle && (
            <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
