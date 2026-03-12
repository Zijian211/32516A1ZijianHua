import React from 'react';

const SearchFilterBar = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* --- Search Input Bar --- */}
      <input
        type="text"
        placeholder="Search for devices..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
        aria-label="Search products"
      />
      {/* --- Category Filter --- */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white cursor-pointer"
        aria-label="Filter by category"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat === "All" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilterBar;