import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faThLarge, 
  faList, 
  faFilter, 
  faSort,
  faChevronDown 
} from "@fortawesome/free-solid-svg-icons";

function ViewControls({ 
  viewMode = "grid", 
  onViewChange, 
  sortBy = "latest", 
  onSortChange,
  totalResults = 0,
  showFilters = true,
  showSort = true,
  showViewToggle = true,
  className = ""
}) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const sortOptions = [
    { value: "latest", label: "Latest Updated" },
    { value: "rating", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" },
    { value: "alphabetical", label: "A-Z" },
    { value: "year", label: "Release Year" }
  ];

  const filterOptions = [
    { value: "all", label: "All Anime" },
    { value: "tv", label: "TV Series" },
    { value: "movie", label: "Movies" },
    { value: "ova", label: "OVA" },
    { value: "special", label: "Special" }
  ];

  return (
    <div 
      className={`flex items-center justify-between flex-wrap gap-4 mb-6 p-4 rounded-lg border ${className}`}
      style={{ 
        backgroundColor: 'var(--anime-bg-secondary)', 
        borderColor: 'var(--anime-border-primary)' 
      }}
    >
      {/* Results Count */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium" style={{ color: 'var(--anime-text-muted)' }}>
          Showing {totalResults} results
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Filter Dropdown */}
        {showFilters && (
          <div className="relative">
            <button
              className="anime-btn-secondary flex items-center gap-2 text-sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              data-testid="filter-dropdown-toggle"
            >
              <FontAwesomeIcon icon={faFilter} className="text-xs" />
              <span>Filter</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`text-xs transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-var(--anime-bg-card) border border-var(--anime-border-primary) rounded-lg shadow-lg z-50">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    className="w-full text-left px-4 py-2 text-sm text-var(--anime-text-secondary) hover:bg-var(--anime-bg-hover) hover:text-var(--anime-text-primary) transition-colors first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      // onFilterChange && onFilterChange(option.value);
                      setShowFilterDropdown(false);
                    }}
                    data-testid={`filter-${option.value}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sort Dropdown */}
        {showSort && (
          <div className="relative">
            <button
              className="anime-btn-secondary flex items-center gap-2 text-sm"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              data-testid="sort-dropdown-toggle"
            >
              <FontAwesomeIcon icon={faSort} className="text-xs" />
              <span>{sortOptions.find(opt => opt.value === sortBy)?.label || "Sort"}</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`text-xs transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-var(--anime-bg-card) border border-var(--anime-border-primary) rounded-lg shadow-lg z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option.value 
                        ? 'bg-var(--anime-primary) text-white' 
                        : 'text-var(--anime-text-secondary) hover:bg-var(--anime-bg-hover) hover:text-var(--anime-text-primary)'
                    }`}
                    onClick={() => {
                      onSortChange && onSortChange(option.value);
                      setShowSortDropdown(false);
                    }}
                    data-testid={`sort-${option.value}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View Toggle */}
        {showViewToggle && (
          <div className="flex items-center bg-var(--anime-bg-tertiary) rounded-lg p-1 border border-var(--anime-border-primary)">
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-var(--anime-primary) text-white shadow-md"
                  : "text-var(--anime-text-muted) hover:text-var(--anime-text-primary) hover:bg-var(--anime-bg-hover)"
              }`}
              onClick={() => onViewChange && onViewChange("grid")}
              data-testid="view-grid"
            >
              <FontAwesomeIcon icon={faThLarge} className="text-sm" />
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-var(--anime-primary) text-white shadow-md"
                  : "text-var(--anime-text-muted) hover:text-var(--anime-text-primary) hover:bg-var(--anime-bg-hover)"
              }`}
              onClick={() => onViewChange && onViewChange("list")}
              data-testid="view-list"
            >
              <FontAwesomeIcon icon={faList} className="text-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewControls;
