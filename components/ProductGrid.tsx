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
  const [sortBy, setSortBy] = useState<"score" | "newest">("score");

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const matched = products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        [p.name, p.tagline, p.personalNote].some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        !activeCategory || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "score") {
      return [...matched].sort((a, b) => {
        // Unrated (0) goes to bottom
        if (a.justinsScore === 0 && b.justinsScore === 0) {
          return b.dateAdded.localeCompare(a.dateAdded);
        }
        if (a.justinsScore === 0) return 1;
        if (b.justinsScore === 0) return -1;
        // Higher score first, then newer first as tiebreaker
        if (b.justinsScore !== a.justinsScore) {
          return b.justinsScore - a.justinsScore;
        }
        return b.dateAdded.localeCompare(a.dateAdded);
      });
    }

    // Newest first
    return [...matched].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
  }, [products, searchQuery, activeCategory, sortBy]);

  return (
    <div>
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-gray-400 mr-2">Sort</span>
        <button
          onClick={() => setSortBy("score")}
          className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors ${
            sortBy === "score"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Score
        </button>
        <button
          onClick={() => setSortBy("newest")}
          className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors ${
            sortBy === "newest"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Newest
        </button>
      </div>
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
