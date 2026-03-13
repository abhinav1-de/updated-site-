//* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import { useMultiplayer } from "@/src/context/MultiplayerContext";
import { isAdUrlBlocked } from "@/src/utils/adBlocklist";

export default function IframePlayer({
  episodeId,
  serverName,
  servertype,
  animeInfo,
  episodeNum,
  episodes,
  playNext,
  autoNext, 
  aniid,
  activeServer,
}) {
  // Multiplayer integration
  const { 
    isInRoom, 
    isHost, 
    syncVideoAction, 
    roomVideoState, 
    shouldSyncVideo, 
    setShouldSyncVideo 
  } = useMultiplayer();
  
  const iframeRef = useRef(null);
  const isUpdatingFromSync = useRef(false);
  const baseURL =
    serverName.toLowerCase() === "hd-1"
      ? import.meta.env.VITE_BASE_IFRAME_URL
      : serverName.toLowerCase() === "hd-4"
      ? import.meta.env.VITE_BASE_IFRAME_URL_2
      : serverName.toLowerCase() === "nest" || servertype === "multi" || activeServer?.type === "multi"
      ? import.meta.env.VITE_BASE_IFRAME_URL_3
      : activeServer?.type === "slay"
      ? "https://slay-knight.xyz"
      : activeServer?.isVidapi
      ? "https://vidapi.xyz"
      : activeServer?.isPahe
      ? "https://vidnest.fun"
      : activeServer?.isAbyss
      ? "abyss"
      : undefined; 

  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [blockedRedirect, setBlockedRedirect] = useState(false);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    episodes?.findIndex(
      (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
    )
  );

  useEffect(() => {
    const loadIframeUrl = async () => {
      setLoading(true);
      setIframeLoaded(false);
      // Clear the iframe src first to force a reload
      setIframeSrc("");
      
      // Add a small delay to ensure the iframe is cleared before setting new src
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("Loading iframe URL for:", {
        serverName,
        servertype,
        activeServer,
        baseURL,
        episodeId,
        episodeNum,
        aniid: animeInfo?.anilistId || aniid,
        animeInfo: animeInfo
      });

      if (serverName.toLowerCase() === "nest") {
        const nestUrl = `${baseURL}/${aniid}/${episodeNum}/hindi`;
        console.log("Nest URL:", nestUrl);
        setIframeSrc(nestUrl);
      } else if (activeServer?.type === "slay") {
        // Use anilistId from animeInfo if available, otherwise use aniid
        const anilistId = animeInfo?.anilistId || aniid;
        const slayLang = activeServer?.slayLang || "DUB";
        
        // Map languages to correct URL parameters based on the API response format
        let langParam;
        switch (slayLang) {
          case "ENGLISH":
            langParam = "dub";
            break;
          case "JAPANESE":
            langParam = "sub";
            break;
          case "HINDI":
            langParam = "hindi";
            break;
          case "NEST":
            langParam = "nest";
            break;
          default:
            langParam = "dub"; // Default to dub
        }
        
        // Construct URL following the pattern: /player/[anilist_id]/[ep]/[LANG]?autoplay=true
        const slayUrl = `${baseURL}/player/${anilistId}/${episodeNum}/${langParam}?autoplay=true`;
        console.log("=== SLAY SERVER DEBUG ===");
        console.log("Slay Knight URL:", slayUrl);
        console.log("AnilistId:", anilistId, "EpisodeNum:", episodeNum, "Lang:", slayLang, "LangParam:", langParam);
        console.log("BaseURL:", baseURL);
        console.log("AnimeInfo anilistId:", animeInfo?.anilistId);
        console.log("Fallback aniid:", aniid);
        console.log("========================");
        setIframeSrc(slayUrl);
      } else if (activeServer?.isVidapi) {
        // Handle vidapi server
        // Convert anime title to URL-friendly format for vidapi
        const animeTitle = animeInfo?.title || "";
        const linkUrl = animeTitle
          .toLowerCase()
          .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .trim();
        
        const vidapiUrl = `${baseURL}/embed/anime/${linkUrl}-episode-${episodeNum}`;
        console.log("=== VIDAPI SERVER DEBUG ===");
        console.log("Vidapi URL:", vidapiUrl);
        console.log("Anime Title:", animeTitle);
        console.log("Link URL:", linkUrl);
        console.log("Episode Num:", episodeNum);
        console.log("BaseURL:", baseURL);
        console.log("==========================");
        setIframeSrc(vidapiUrl);
      } else if (activeServer?.isPahe) {
        // Handle Pahe server with correct endpoint format
        // SUB uses /animepahe/ path, DUB uses /anime/ path
        const paheServerType = activeServer.type; // Use the actual server type (sub/dub)
        const pahePath = paheServerType === "sub" ? "animepahe" : "anime";
        const paheUrl = `${baseURL}/${pahePath}/${aniid}/${episodeNum}/${paheServerType}`;
        console.log("=== PAHE SERVER DEBUG ===");
        console.log("Pahe URL:", paheUrl);
        console.log("Aniid:", aniid);
        console.log("Episode Num:", episodeNum);
        console.log("ActiveServer Type:", paheServerType);
        console.log("Pahe Path:", pahePath);
        console.log("BaseURL:", baseURL);
        console.log("========================");
        setIframeSrc(paheUrl);
      } else if (activeServer?.isAbyss) {
        try {
          // Decode the Abyss URL to get the individual language links
          const encodedData = activeServer.embedUrl.split('data=')[1];
          const decodedData = JSON.parse(atob(decodeURIComponent(encodedData)));
          const hindiLink = decodedData.find(item => item.language === "Hindi")?.link;
          
          if (hindiLink) {
            console.log("Hindi Link found in Abyss:", hindiLink);
            setIframeSrc(hindiLink);
          } else {
            console.error("Hindi link not found in Abyss data");
            setLoading(false);
          }
        } catch (err) {
          console.error("Error parsing Abyss data:", err);
          setLoading(false);
        }
      } else if (activeServer?.type === "multi" || serverName.toLowerCase() === "multi") {
        // Handle multi server (old Nest functionality)
        const multiUrl = `${baseURL}/${aniid}/${episodeNum}/hindi`;
        console.log("Multi URL:", multiUrl);
        setIframeSrc(multiUrl);
      } else if (activeServer?.isHindiIframe) {
        // Handle Hindi API server as an iframe (scraper API)
        const hindiUrl = `https://ani-biee-anime-world-india-scraper.vercel.app/api/embed/${activeServer.animeId}/1/${activeServer.episodeNum}`;
        setIframeSrc(hindiUrl);
      } else if (activeServer?.isHindiApi) {
        // Handle direct server URLs from the Hindi API response
        setIframeSrc(activeServer.data_id);
      } else {
        const regularUrl = `${baseURL}/${episodeId}/${servertype}`;
        console.log("Regular URL:", regularUrl);
        setIframeSrc(regularUrl);
      }
    };

    loadIframeUrl();
  }, [episodeId, servertype, serverName, baseURL, aniid, episodeNum]);

  useEffect(() => {
    if (episodes?.length > 0) {
      const newIndex = episodes.findIndex(
        (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
      );
      setCurrentEpisodeIndex(newIndex);
    }
  }, [episodeId, episodes]);

  // Video sync disabled for iframe players to prevent buffering during chat


  // Redirect blocking - monitor for navigation attempts to blocked domains
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Received message from iframe:', event.data);
      
      // Check for redirect block notifications from iframe
      if (event.data?.type === 'redirect-blocked') {
        console.warn('Redirect blocked:', event.data.url);
        setBlockedRedirect(true);
      }
      
      const { currentTime, duration, type, action } = event.data;
      
      // Handle auto-next functionality
      if (typeof currentTime === "number" && typeof duration === "number") {
        if (
          currentTime >= duration &&
          currentEpisodeIndex < episodes?.length - 1 &&
          autoNext
        ) {
          playNext(episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]);
        }
      }
      
      // Multiplayer video sync disabled for iframe players
    };
    
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [autoNext, currentEpisodeIndex, episodes, playNext]);

  useEffect(() => {
    setLoading(true);
    setIframeLoaded(false);
    return () => {
      const continueWatching = JSON.parse(localStorage.getItem("continueWatching")) || [];
      const newEntry = {
        id: animeInfo?.id,
        data_id: animeInfo?.data_id,
        episodeId,
        episodeNum,
        adultContent: animeInfo?.adultContent,
        poster: animeInfo?.poster,
        title: animeInfo?.title,
        japanese_title: animeInfo?.japanese_title,
      };
      if (!newEntry.data_id) return;
      const existingIndex = continueWatching.findIndex(
        (item) => item.data_id === newEntry.data_id
      );
      if (existingIndex !== -1) {
        continueWatching[existingIndex] = newEntry;
      } else {
        continueWatching.push(newEntry);
      }
      localStorage.setItem("continueWatching", JSON.stringify(continueWatching));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, servertype]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Loader Overlay */}
      <div
        className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition-opacity duration-500 ${
          loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <BouncingLoader />
      </div>

      <iframe
        ref={iframeRef}
        key={`${episodeId}-${servertype}-${serverName}`}
        src={isAdUrlBlocked(iframeSrc) ? undefined : iframeSrc}
        allowFullScreen
        allow="autoplay; fullscreen; encrypted-media"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        className={`w-full h-full transition-opacity duration-500 ${
          iframeLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => {
          setIframeLoaded(true);
          setTimeout(() => setLoading(false), 1000);
          setBlockedRedirect(false);
          
          // Inject redirect blocker into iframe if possible
          try {
            if (iframeRef.current?.contentWindow) {
              const script = document.createElement('script');
              script.textContent = `
                const blockedDomains = ['lt.shangflayed.shop', 'jb.bipedalpelmata.top', 'sliwercohue.top'];
                
                // Override location.replace
                const origReplace = Location.prototype.replace;
                Location.prototype.replace = function(url) {
                  if (blockedDomains.some(d => url.includes(d))) {
                    window.parent.postMessage({type: 'redirect-blocked', url: url}, '*');
                    console.warn('Redirect blocked:', url);
                    return;
                  }
                  return origReplace.call(this, url);
                };
                
                // Override location.assign
                const origAssign = Location.prototype.assign;
                Location.prototype.assign = function(url) {
                  if (blockedDomains.some(d => url.includes(d))) {
                    window.parent.postMessage({type: 'redirect-blocked', url: url}, '*');
                    console.warn('Redirect blocked:', url);
                    return;
                  }
                  return origAssign.call(this, url);
                };
                
                // Override window.open
                const origOpen = window.open;
                window.open = function(url, ...args) {
                  if (url && blockedDomains.some(d => url.includes(d))) {
                    window.parent.postMessage({type: 'redirect-blocked', url: url}, '*');
                    console.warn('Popup blocked to ad domain:', url);
                    return null;
                  }
                  return origOpen.apply(window, [url, ...args]);
                };
              `;
              iframeRef.current.contentWindow.document.head.appendChild(script);
            }
          } catch (err) {
            console.log('Unable to inject redirect blocker (cross-origin):', err);
          }
        }}
        onError={() => {
          console.error("Iframe failed to load:", iframeSrc);
          setLoading(false);
        }}
      ></iframe>
      
      {/* Ad Blocker Warning */}
      {isAdUrlBlocked(iframeSrc) && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-75 z-20 rounded-lg">
          <div className="text-center">
            <p className="text-white text-lg font-semibold mb-2">Ad URL Blocked</p>
            <p className="text-gray-300 text-sm">This iframe contains a blocked ad URL and has been prevented from loading.</p>
            <p className="text-gray-400 text-xs mt-2">Please try a different server.</p>
          </div>
        </div>
      )}
      
      {/* Redirect Block Warning */}
      {blockedRedirect && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-75 z-20 rounded-lg">
          <div className="text-center">
            <p className="text-white text-lg font-semibold mb-2">Redirect Blocked</p>
            <p className="text-gray-300 text-sm">An attempt to redirect to a blocked ad domain was detected and prevented.</p>
            <p className="text-gray-400 text-xs mt-2">Your protection is active.</p>
            <button
              onClick={() => setBlockedRedirect(false)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      

    </div>
  );
}










