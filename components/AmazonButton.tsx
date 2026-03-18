interface AmazonButtonProps {
  href: string;
}

export default function AmazonButton({ href }: AmazonButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="block w-full bg-black text-white text-center py-4 text-sm tracking-widest font-medium uppercase transition-colors hover:bg-gray-800"
    >
      View on Amazon
    </a>
  );
}
