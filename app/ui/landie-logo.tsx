import Image from 'next/image';

export default function LandieLogo() {
  return (
    <div className="flex shrink-0 items-end rounded-lg p-4">
      <Image
        src="/logo.png"
        width={200} // Increase the width to 300
        height={200
        } // Increase the height to 300
        className="w-48 h-auto" // Increase the width to 48
        alt="Landie Logo"
        priority={true}
      />
    </div>
  );
}
