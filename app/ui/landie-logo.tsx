import Image from 'next/image';

export default function LandieLogo() {
  return (
    <div className="flex shrink-0 items-end rounded-lg p-4">
      <Image
        src="/logo.png"
        width={160}
        height={160}
        className="w-32 md:w- h-auto"
        alt="Landie Logo"
        priority={true}
      />
    </div>
  );
}
