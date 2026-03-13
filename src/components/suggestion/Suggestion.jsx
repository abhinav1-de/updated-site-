import getSearchSuggestion from "@/src/utils/getSearchSuggestion.utils";
import { getAISuggestions } from "@/src/utils/getAISuggestions";
import { useEffect, useState } from "react";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import { FaChevronRight, FaRobot, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function Suggestion({ keyword, className, onSuggestionClick }) {
  const [suggestion, setSuggestion] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchSearchSuggestion = async () => {
      if (!keyword) return;
      setLoading(true);
      setHasFetched(false);
      try {
        const data = await getSearchSuggestion(keyword);
        setSuggestion(data);
        setHasFetched(true);
      } catch (err) {
        console.error("Error fetching search suggestion info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAISuggestions = async () => {
      if (!keyword || keyword.length < 2) return;
      setAiLoading(true);
      try {
        const aiData = await getAISuggestions(keyword);
        setAiSuggestions(aiData);
      } catch (err) {
        console.error("Error fetching AI suggestions:", err);
      } finally {
        setAiLoading(false);
      }
    };

    fetchSearchSuggestion();
    fetchAISuggestions();
  }, [keyword]);

  return (
    <div
      className={`bg-zinc-900 ${className} flex ${
        loading ? "justify-center py-4" : "justify-start"
      } ${!suggestion ? "p-2" : "justify-start"} items-center rounded-lg`}
      style={{ 
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.05)"
      }}
    >
      {loading ? (
        <BouncingLoader />
      ) : error && !suggestion ? (
        <div className="text-gray-400 p-3">Error loading suggestions</div>
      ) : (
        <div className="w-full flex flex-col pt-1 overflow-y-auto max-h-[500px]">
          {/* AI Suggestions Section */}
          {aiSuggestions.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50">
                <FaRobot className="text-purple-400 text-sm" />
                <span className="text-sm font-medium text-purple-300">AI Suggestions</span>
              </div>
              {aiSuggestions.map((item, index) => (
                <Link
                  to={`/search?keyword=${encodeURIComponent(item.title)}`}
                  key={`ai-${index}`}
                  onClick={onSuggestionClick}
                  className="group py-2 flex items-center gap-x-3 hover:bg-zinc-800 transition-all duration-200 cursor-pointer px-3 border-l-2 border-purple-500/30"
                >
                  <FaSearch className="text-purple-400 text-sm flex-shrink-0" />
                  <div className="flex flex-col gap-y-1 flex-1">
                    <h1 className="line-clamp-1 leading-5 font-medium text-[14px] text-gray-100 group-hover:text-white">
                      {item.title}
                    </h1>
                    <p className="text-[12px] text-gray-400 line-clamp-1">
                      {item.reason}
                    </p>
                  </div>
                </Link>
              ))}
              <div className="h-px bg-zinc-700 mx-3 my-2"></div>
            </>
          )}

          {/* Manual Search Results Section */}
          {suggestion && hasFetched && suggestion.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50">
                <FaSearch className="text-blue-400 text-sm" />
                <span className="text-sm font-medium text-blue-300">Search Results</span>
              </div>
              {suggestion.map((item, index) => (
                <Link
                  to={`/${item.id}`}
                  key={index}
                  onClick={onSuggestionClick}
                  className="group py-2 flex items-start gap-x-3 hover:bg-zinc-800 transition-all duration-200 cursor-pointer px-3"
                  style={{
                    borderBottom:
                      index === suggestion.length - 1
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <img
                    src={`${item.poster}`}
                    className="w-[45px] h-[65px] flex-shrink-0 object-cover rounded-md shadow-lg"
                    alt=""
                    onError={(e) => {
                      e.target.src = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg";
                    }}
                  />
                  <div className="flex flex-col gap-y-[2px]">
                    {item?.title && (
                      <h1 className="line-clamp-1 leading-5 font-semibold text-[14px] text-gray-100 group-hover:text-white">
                        {item.title || "N/A"}
                      </h1>
                    )}
                    {item?.japanese_title && (
                      <h1 className="line-clamp-1 leading-4 text-[12px] font-normal text-gray-400">
                        {item.japanese_title || "N/A"}
                      </h1>
                    )}
                    {(item?.releaseDate || item?.showType || item?.duration) && (
                      <div className="flex gap-x-2 items-center w-full justify-start mt-[2px]">
                        <p className="leading-4 text-[12px] font-normal text-gray-400">
                          {item.releaseDate || "N/A"}
                        </p>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <p className="leading-4 text-[12px] font-medium text-gray-300 group-hover:text-white">
                          {item.showType || "N/A"}
                        </p>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <p className="leading-4 text-[12px] font-normal text-gray-400">
                          {item.duration || "N/A"}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </>
          )}

          {/* View All Results Button */}
          {(!loading && hasFetched) && (
            <Link
              className="w-full flex py-2.5 justify-center items-center bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 rounded-b-lg mt-2"
              to={`/search?keyword=${encodeURIComponent(keyword)}`}
              onClick={onSuggestionClick}
            >
              <div className="flex w-fit items-center gap-x-2">
                <p className="text-[14px] font-medium text-gray-200">
                  View all results
                </p>
                <FaChevronRight className="text-gray-200 text-[11px] mt-[1px]" />
              </div>
            </Link>
          )}

          {/* No Results State */}
          {hasFetched && (!suggestion || suggestion.length === 0) && aiSuggestions.length === 0 && (
            <p className="text-gray-300 p-3">No results found!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Suggestion;
