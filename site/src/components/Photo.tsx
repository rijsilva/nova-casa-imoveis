import Image from "next/image";

type Props = React.ComponentProps<typeof Image> & { src: string };

export function Photo({ src, alt = "", className = "", priority, fill, ...rest }: Props) {
  if (!src) {
    return <div className={`bg-sand ${className}`} aria-hidden="true" />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill ?? true}
      sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
      className={`object-cover ${className}`}
      priority={priority}
      {...rest}
    />
  );
}
