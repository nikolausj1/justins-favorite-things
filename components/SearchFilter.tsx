interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
}: SearchFilterProps) {
  return (
    <div className="mb-12">
      {/* Search box hidden until product catalog grows
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        className="w-full border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
      />
      */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors ${
            activeCategory === null
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors ${
              activeCategory === category
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
