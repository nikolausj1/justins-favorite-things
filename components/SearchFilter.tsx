interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortBy: "score" | "newest";
  onSortChange: (sort: "score" | "newest") => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: SearchFilterProps) {
  const pill = (active: boolean) =>
    `px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors ${
      active
        ? "bg-black text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="mb-8">
      {/* Search box hidden until product catalog grows
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        className="w-full border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
      />
      */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-gray-400 mr-1">Sort</span>
          <button onClick={() => onSortChange("score")} className={pill(sortBy === "score")}>
            Score
          </button>
          <button onClick={() => onSortChange("newest")} className={pill(sortBy === "newest")}>
            Newest
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => onCategoryChange(null)} className={pill(activeCategory === null)}>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={pill(activeCategory === category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
