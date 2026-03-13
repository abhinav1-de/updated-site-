import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
  faBookmark,
  faShare,
  faEllipsisH,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import website_name from "@/src/config/website";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Sidecard from "@/src/components/sidecard/Sidecard";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import { useLanguage } from "@/src/context/LanguageContext";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";

// Star Rating Component
function StarRating({ rating = 4.9, totalRatings = "23K" }) {
  const stars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className={`text-lg ${
              i < stars 
                ? 'text-yellow-400' 
                : i === stars && hasHalfStar 
                ? 'text-yellow-400' 
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-white text-base">
        Average Rating: <span className="font-bold">{rating} ({totalRatings})</span>
        <FontAwesomeIcon icon={faEllipsisH} className="ml-2 text-gray-400 rotate-90" />
      </span>
    </div>
  );
}

// Metadata Info Component for Sidebar
function MetadataItem({ label, value, isLink = false }) {
  return (
    value && (
      <div className="text-sm">
        <span className="text-gray-400 font-medium">{label}: </span>
        <span className="text-gray-300">
          {Array.isArray(value) ? value.join(", ") : value}
        </span>
      </div>
    )
  );
}

function InfoItem({ label, value, isProducer = true }) {
  return (
    value && (
      <div className="text-[11px] sm:text-[14px] font-medium transition-all duration-300">
        <span className="text-gray-400">{`${label}: `}</span>
        <span className="font-light text-white/90">
          {Array.isArray(value) ? (
            value.map((item, index) =>
              isProducer ? (
                <Link
                  to={`/producer/${item
                    .replace(/[&'"^%$#@!()+=<>:;,.?/\\|{}[\]`~*_]/g, "")
                    .split(" ")
                    .join("-")
                    .replace(/-+/g, "-")}`}
                  key={index}
                  className="cursor-pointer transition-colors duration-300 hover:text-gray-300"
                >
                  {item}
                  {index < value.length - 1 && ", "}
                </Link>
              ) : (
                <span key={index}>
                  {item}
                  {index < value.length - 1 && ", "}
                </span>
              )
            )
          ) : isProducer ? (
            <Link
              to={`/producer/${value
                .replace(/[&'"^%$#@!()+=<>:;,.?/\\|{}[\]`~*_]/g, "")
                .split(" ")
                .join("-")
                .replace(/-+/g, "-")}`}
              className="cursor-pointer transition-colors duration-300 hover:text-gray-300"
            >
              {value}
            </Link>
          ) : (
            <span>{value}</span>
          )}
        </span>
      </div>
    )
  );
}

// Tag Component for metadata badges
function Tag({ bgColor, index, icon, text, variant = "default" }) {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded";
  const variantClasses = {
    default: "bg-gray-700 text-white",
    rating: "bg-orange-600 text-white",
    quality: "bg-blue-600 text-white",
    sub: "bg-green-600 text-white",
    dub: "bg-purple-600 text-white"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant] || variantClasses.default}`}>
      {icon && <FontAwesomeIcon icon={icon} className="text-xs mr-1" />}
      <span>{text}</span>
    </div>
  );
}

function AnimeInfo({ random = false }) {
  const { language } = useLanguage();
  const { id: paramId } = useParams();
  const id = random ? null : paramId;
  const [isFull, setIsFull] = useState(false);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { homeInfo } = useHomeInfo();
  const { id: currentId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (id === "404-not-found-page") {
      console.log("404 got!");
      return null;
    } else {
      const fetchAnimeInfo = async () => {
        setLoading(true);
        try {
          const data = await getAnimeInfo(id, random);
          setSeasons(data?.seasons);
          setAnimeInfo(data.data);
        } catch (err) {
          console.error("Error fetching anime info:", err);
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAnimeInfo();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id, random]);
  useEffect(() => {
    if (animeInfo && location.pathname === `/${animeInfo.id}`) {
      document.title = `Watch ${animeInfo.title} English Sub/Dub online Free on ${website_name}`;
    }
    return () => {
      document.title = `${website_name} | Free anime streaming platform`;
    };
  }, [animeInfo]);
  if (loading) return <Loader type="animeInfo" />;
  if (error) {
    return <Error />;
  }
  if (!animeInfo) {
    navigate("/404-not-found-page");
    return undefined;
  }
  const { title, japanese_title, poster, animeInfo: info } = animeInfo;
  // Generate episode availability date (7 days from now)
  const nextEpisodeDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="erc-root-layout text-white">
      {/* Crunchyroll-style Large Hero Banner */}
      <div className="relative h-[600px] lg:h-[700px] xl:h-[800px] w-full overflow-hidden mt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={poster}
            alt={`${title} Background`}
            className="w-full h-full object-cover"
            style={{
              objectFit: 'cover',
              objectPosition: 'center center',
              width: '100%',
              height: '100%'
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full">
          <div className="container mx-auto px-6 lg:px-8 xl:px-12 h-full">
            <div className="flex h-full items-end pb-12 lg:pb-16">
              {/* Left Side - Main Content */}
              <div className="flex-1 max-w-4xl">
                {/* Large Title - Crunchyroll Style */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight" style={{fontFamily: 'Lato, sans-serif', fontWeight: 700}}>
                  {language === "EN" ? title : japanese_title}
                </h1>

                {/* Episode Availability Notice */}
                <div className="mb-4 lg:mb-6">
                  <p className="text-white text-base lg:text-lg font-medium" style={{fontFamily: 'Lato, sans-serif'}}>
                    The next episode will be available on 9/12
                  </p>
                </div>

                {/* Metadata Tags - Exact Crunchyroll Style */}
                <div className="flex flex-wrap items-center gap-1 mb-4 lg:mb-6 text-white text-sm lg:text-base" style={{fontFamily: 'Lato, sans-serif'}}>
                  <span className="inline-flex items-center px-2 py-1 bg-gray-700/80 rounded text-xs font-medium">
                    {info?.tvInfo?.rating || 'U/A 16+'}
                  </span>
                  <span className="mx-1">•</span>
                  {info?.tvInfo?.sub && info?.tvInfo?.dub ? (
                    <span>Sub | Dub</span>
                  ) : info?.tvInfo?.sub ? (
                    <span>Sub</span>
                  ) : info?.tvInfo?.dub ? (
                    <span>Dub</span>
                  ) : (
                    <span>Sub | Dub</span>
                  )}
                  <span className="mx-1">•</span>
                  <span>
                    {info?.Genres?.slice(0, 4).join(", ") || "Adventure, Comedy, Drama, Fantasy"}
                  </span>
                </div>

                {/* Star Rating */}
                <div className="mb-8">
                  <StarRating rating={4.9} totalRatings="23K" />
                </div>

                {/* Action Buttons - Exact Crunchyroll Style */}
                <div className="flex items-center gap-3 mb-8 lg:mb-12">
                  {animeInfo?.animeInfo?.Status?.toLowerCase() !== "not-yet-aired" ? (
                    <Link
                      to={`/watch/${animeInfo.id}`}
                      className="inline-flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded text-sm lg:text-base uppercase tracking-wide transition-all duration-200"
                      style={{backgroundColor: '#f47521', fontFamily: 'Lato, sans-serif'}}
                    >
                      <FontAwesomeIcon icon={faPlay} className="text-sm" />
                      START WATCHING E1
                    </Link>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-gray-700 text-white font-bold rounded text-sm lg:text-base uppercase tracking-wide">
                      NOT YET RELEASED
                    </div>
                  )}

                  <button className="p-2 lg:p-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-600/10 rounded transition-all duration-200" style={{borderColor: '#f47521', color: '#f47521'}}>
                    <FontAwesomeIcon icon={faBookmark} className="text-base lg:text-lg" />
                  </button>

                  <button className="p-2 lg:p-3 text-white hover:text-orange-600 transition-all duration-200">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l2.09 6.26L20 8l-4.17 4.18L16.18 20 12 16.77 7.82 20l.35-7.82L4 8l5.91.26L12 2z"/>
                    </svg>
                  </button>

                  <button className="p-2 lg:p-3 text-white hover:text-orange-600 transition-all duration-200">
                    <FontAwesomeIcon icon={faShare} className="text-base lg:text-lg" />
                  </button>

                  <button className="p-2 lg:p-3 text-white hover:text-orange-600 transition-all duration-200">
                    <FontAwesomeIcon icon={faEllipsisH} className="text-base lg:text-lg" />
                  </button>
                </div>

                {/* Description - Crunchyroll Style */}
                {info?.Overview && (
                  <div className="max-w-3xl mb-6 lg:mb-8">
                    <p className="text-white text-base lg:text-base leading-relaxed" style={{fontFamily: 'Lato, sans-serif', lineHeight: '1.6'}}>
                      {info.Overview.length > 280 ? (
                        <>
                          {isFull ? info.Overview : `${info.Overview.slice(0, 280)}...`}
                        </>
                      ) : (
                        info.Overview || "Humans couldn't handle magic without chanting until Monica Everett, the Silent Witch and one of the Seven Sages, made unspoken magecraft possible. Painfully shy, she enjoys seclusion. One day, Louis Miller, the Barrier Mage, delivers the king's order: Go undercover at a prestigious school for nobles to guard the second prince. Get ready for her silent mission to begin!"
                      )}
                    </p>
                  </div>
                )}

                {/* More Details Link */}
                <div>
                  <button 
                    className="font-bold text-sm uppercase tracking-wide transition-colors hover:underline"
                    style={{color: '#f47521', fontFamily: 'Lato, sans-serif'}}
                  >
                    FEWER DETAILS
                  </button>
                </div>
              </div>

              {/* Right Side - Metadata Sidebar - Exact Crunchyroll Style */}
              <div className="hidden lg:block w-80 xl:w-96 ml-8 lg:ml-12 flex-shrink-0">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 lg:p-6 mt-8 lg:mt-12" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
                  <div className="space-y-3 lg:space-y-4">
                    <div>
                      <span className="text-white font-semibold text-sm" style={{fontFamily: 'Lato, sans-serif'}}>Audio: </span>
                      <span className="text-gray-300 text-sm" style={{fontFamily: 'Lato, sans-serif'}}>Japanese, English</span>
                    </div>

                    <div>
                      <span className="text-white font-semibold text-sm" style={{fontFamily: 'Lato, sans-serif'}}>Subtitles: </span>
                      <span className="text-gray-300 text-sm" style={{fontFamily: 'Lato, sans-serif'}}>English, Bahasa Indonesia, Bahasa Melayu, Deutsch, Español (América Latina), Español (España), Français, Italiano, Português (Brasil), Русский, العربية, 中文 (繁體字), 한국어</span>
                    </div>

                    <div>
                      <span className="text-white font-semibold text-sm" style={{fontFamily: 'Lato, sans-serif'}}>Content Advisory: </span>
                      <span className="text-gray-300 text-sm" style={{fontFamily: 'Lato, sans-serif'}}>Profanity, Violence</span>
                    </div>

                    <div>
                      <span className="text-white font-semibold text-sm" style={{fontFamily: 'Lato, sans-serif'}}>Genres: </span>
                      <span className="text-gray-300 text-sm" style={{fontFamily: 'Lato, sans-serif'}}>
                        {info?.Genres?.join(", ") || "Action, Drama"}
                      </span>
                    </div>

                    <div>
                      <span className="text-white font-semibold text-sm" style={{fontFamily: 'Lato, sans-serif'}}>Status: </span>
                      <span className="text-gray-300 text-sm" style={{fontFamily: 'Lato, sans-serif'}}>
                        {info?.Status || "Ongoing"}
                      </span>
                    </div>

                    <div>
                      <span className="text-white font-semibold text-sm" style={{fontFamily: 'Lato, sans-serif'}}>Studio: </span>
                      <span className="text-gray-300 text-sm" style={{fontFamily: 'Lato, sans-serif'}}>
                        {Array.isArray(info?.Studios) ? info.Studios.join(", ") : info?.Studios || "Studio SHAFT"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasons Section */}
      {seasons?.length > 0 && (
        <div className="container mx-auto py-8 sm:py-12">
          <h2 className="text-2xl font-bold mb-6 sm:mb-8 px-1">More Seasons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {seasons.map((season, index) => (
              <Link
                to={`/${season.id}`}
                key={index}
                className={`relative w-full aspect-[3/1] sm:aspect-[3/1] rounded-lg overflow-hidden cursor-pointer group ${
                  currentId === String(season.id)
                    ? "ring-2 ring-white/40 shadow-lg shadow-white/10"
                    : ""
                }`}
              >
                <img
                  src={season.season_poster}
                  alt={season.season}
                  className={`w-full h-full object-cover scale-150 ${
                    currentId === String(season.id)
                      ? "opacity-50"
                      : "opacity-40"
                  }`}
                />
                {/* Dots Pattern Overlay */}
                <div 
                  className="absolute inset-0 z-10" 
                  style={{ 
                    backgroundImage: `url('data:image/svg+xml,<svg width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="1.5" cy="1.5" r="0.5" fill="white" fill-opacity="0.25"/></svg>')`,
                    backgroundSize: '3px 3px'
                  }}
                />
                {/* Dark Gradient Overlay */}
                <div className={`absolute inset-0 z-20 bg-gradient-to-r ${
                  currentId === String(season.id)
                    ? "from-black/50 to-transparent"
                    : "from-black/40 to-transparent"
                }`} />
                {/* Title Container */}
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                  <p className={`text-[14px] sm:text-[16px] md:text-[18px] font-bold text-center px-2 sm:px-4 transition-colors duration-300 ${
                    currentId === String(season.id)
                      ? "text-white"
                      : "text-white/90 group-hover:text-white"
                  }`}>
                    {season.season}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Voice Actors Section */}
      {animeInfo?.charactersVoiceActors.length > 0 && (
        <div className="container mx-auto py-12">
          <Voiceactor animeInfo={animeInfo} />
        </div>
      )}

      {/* Recommendations Section */}
      {animeInfo.recommended_data.length > 0 && (
        <div className="container mx-auto py-12">
          <CategoryCard
            label="Recommended for you"
            data={animeInfo.recommended_data}
            limit={animeInfo.recommended_data.length}
            showViewMore={false}
          />
        </div>
      )}
    </div>
  );
}

export default AnimeInfo;
