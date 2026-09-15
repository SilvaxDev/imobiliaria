import Image from "next/image";
import { MediaFrame } from "@/components/ui/media-frame";

type PropertyPhotoProps = {
  src: string | null;
  alt: string;
  className?: string;
  tone?: "on-ink" | "on-paper";
  priority?: boolean;
};

export function PropertyPhoto({ src, alt, className = "", tone = "on-paper", priority = false }: PropertyPhotoProps) {
  if (!src) {
    return <MediaFrame tone={tone} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
