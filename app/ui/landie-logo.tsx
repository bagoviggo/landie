import Image from 'next/image';

export default function LandieLogo() {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.jpeg"
        width={80}
        height={28}
        className="object-contain rounded-lg"
        alt="Landie Logo"
        priority={true}
      />
    </div>
  );
}
