import Image from 'next/image';

export default function LandieLogo() {
  return (
    <div className="relative w-full h-full min-w-[200px]">
      <Image
        src="/logo.png"
        fill
        className="object-contain object-left"
        alt="Landie Logo"
        priority={true}
      />
    </div>
  );
}
