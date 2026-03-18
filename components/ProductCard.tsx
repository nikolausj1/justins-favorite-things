import Image from "next/image";
import { Product } from "@/lib/types";
import AmazonButton from "./AmazonButton";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority }: ProductCardProps) {
  return (
    <article className="bg-white border border-gray-100 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-8"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h2 className="font-semibold text-lg text-black leading-tight">
          {product.name}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{product.tagline}</p>
        <div className="mt-4 border-l-2 border-gray-800 pl-4 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Justin says
          </p>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
            {product.personalNote}
          </p>
        </div>
        <div className="mt-6">
          <AmazonButton href={product.affiliateUrl} />
        </div>
      </div>
    </article>
  );
}
