import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function RatingBadge({ rating, showStars = true, showPercentage = true, size = "sm", className = "" }) {
  // Convert rating to percentage if it's out of 10
  const percentage = typeof rating === 'number' ? Math.round((rating / 10) * 100) : 0;
  
  // Determine rating class based on percentage
  const getRatingClass = (percent) => {
    if (percent >= 90) return 'anime-rating-excellent';
    if (percent >= 75) return 'anime-rating-good';
    if (percent >= 60) return 'anime-rating-average';
    if (percent >= 40) return 'anime-rating-poor';
    return 'anime-rating-bad';
  };

  const ratingClass = getRatingClass(percentage);
  
  // Size variants
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const renderStars = () => {
    const starCount = Math.round(rating / 2); // Convert 10-point scale to 5 stars
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={`${i <= starCount ? 'text-yellow-400' : 'text-gray-500'} ${
            size === 'xs' ? 'text-[8px]' : size === 'sm' ? 'text-[10px]' : 'text-xs'
          }`}
        />
      );
    }
    return stars;
  };

  if (!rating || rating === 0) {
    return (
      <div className={`inline-flex items-center gap-1 bg-gray-600 text-white rounded-md ${sizeClasses[size]} ${className}`}>
        <span className="font-semibold">N/A</span>
      </div>
    );
  }

  return (
    <div 
      className={`inline-flex items-center gap-1.5 text-white rounded-md font-semibold ${ratingClass} ${sizeClasses[size]} ${className}`}
      data-testid={`rating-badge-${percentage}`}
    >
      {showStars && (
        <div className="flex items-center gap-0.5">
          {renderStars()}
        </div>
      )}
      {showPercentage && (
        <span className="font-bold">
          {percentage}%
        </span>
      )}
    </div>
  );
}

export default RatingBadge;
