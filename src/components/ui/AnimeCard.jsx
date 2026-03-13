import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faClosedCaptioning, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import RatingBadge from "./RatingBadge";

function AnimeCard({ 
  anime, 
  showRating = true, 
  showMetadata = true, 
  size = "default",
  className = "" 
}) {
  if (!anime) return null;

  const {
    id,
    title,
    image,
    releaseDate,
    subOrDub,
    type,
    rating,
    status,
    episodes
  } = anime;

  // Size variants
  const sizeClasses = {
    small: {
      container: "w-full",
      image: "aspect-[3/4] w-full",
      title: "text-sm font-semibold",
      metadata: "text-xs"
    },
    default: {
      container: "w-full",
      image: "aspect-[3/4] w-full", 
      title: "text-sm font-semibold",
      metadata: "text-xs"
    },
    large: {
      container: "w-full",
      image: "aspect-[3/4] w-full",
      title: "text-base font-bold",
      metadata: "text-sm"
    }
  };

  const sizes = sizeClasses[size];

  const handleCardClick = () => {
    // Navigate to anime info page
  };

  return (
    <Link
      to={`/info/${id}`}
      className={`anime-card group cursor-pointer block ${sizes.container} ${className}`}
      data-testid={`anime-card-${id}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className={`${sizes.image} object-cover transition-all duration-300 group-hover:scale-105`}
          loading="lazy"
          data-testid={`anime-image-${id}`}
        />
        
        {/* Overlay */}
        <div className="anime-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white bg-opacity-20 anime-backdrop-blur rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <FontAwesomeIcon 
                icon={faPlay} 
                className="text-white text-2xl" 
                data-testid={`play-icon-${id}`}
              />
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        {showRating && rating && (
          <div className="absolute top-3 left-3">
            <RatingBadge 
              rating={rating} 
              size="sm" 
              showStars={false}
              data-testid={`rating-${id}`}
            />
          </div>
        )}

        {/* Status Badge */}
        {status && (
          <div className="absolute top-3 right-3">
            <div className="bg-black bg-opacity-60 anime-backdrop-blur px-2 py-1 rounded-md">
              <span className="text-white text-xs font-medium uppercase tracking-wider">
                {status}
              </span>
            </div>
          </div>
        )}

        {/* Sub/Dub Badges */}
        {showMetadata && subOrDub && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {subOrDub.includes("sub") && (
              <div className="category-badge flex items-center gap-1">
                <FontAwesomeIcon icon={faClosedCaptioning} className="text-xs" />
                <span className="text-xs font-medium">SUB</span>
              </div>
            )}
            {subOrDub.includes("dub") && (
              <div className="category-badge flex items-center gap-1">
                <FontAwesomeIcon icon={faMicrophone} className="text-xs" />
                <span className="text-xs font-medium">DUB</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-3 pb-1">
        {/* Title */}
        <h3 
          className={`${sizes.title} text-white group-hover:text-gray-300 transition-colors duration-200 line-clamp-2 mb-1`}
          data-testid={`anime-title-${id}`}
        >
          {title}
        </h3>

        {/* Metadata */}
        {showMetadata && (
          <div className={`${sizes.metadata} text-gray-400 flex items-center gap-2 flex-wrap`}>
            {type && (
              <span className="uppercase font-medium tracking-wider">
                {type}
              </span>
            )}
            {type && releaseDate && <span className="dot"></span>}
            {releaseDate && (
              <span>{releaseDate}</span>
            )}
            {episodes && (
              <>
                <span className="dot"></span>
                <span>{episodes} eps</span>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default AnimeCard;
