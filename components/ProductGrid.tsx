"use client";

import { useMemo, useState } from "react";
import { Product } from "@/lib/types";
import SearchFilter from "./SearchFilter";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        [p.name, p.tagline, p.personalNote].some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        !activeCategory || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  return (
    <div>
      {/* Search hidden until product catalog grows
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">No products match your search.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory(null);
            }}
            className="mt-4 text-sm text-black underline underline-offset-4 hover:text-gray-600"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
