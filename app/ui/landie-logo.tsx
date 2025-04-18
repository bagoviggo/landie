import Image from 'next/image';

export default function LandieLogo() {
  return (
    <div className="flex items-center h-full">
      <Image
        src="/logo.jpeg"
        width={150}
        height={50}
        className="object-contain max-h-full rounded"
        alt="Landie Logo"
        priority={true}
      />
    </div>
  );
}
