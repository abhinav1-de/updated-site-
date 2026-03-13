/* eslint-disable react/prop-types */
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
  const { isInRoom, isHost, syncVideoAction, roomVideoState, shouldSyncVideo, setShouldSyncVideo } =
    useMultiplayer();

  const iframeRef = useRef(null);
  const isUpdatingFromSync = useRef(false);

  const baseURL =
    serverName.toLowerCase() === "hd-1"
      ? import.meta.env.VITE_BASE_IFRAME_URL
      : serverName.toLowerCase() === "hd-4"
      ? import.meta.env.VITE_BASE_IFRAME_URL_2
      : serverName.toLowerCase() === "nest" ||
        servertype === "multi" ||
        activeServer?.type === "multi"
      ? import.meta.env.VITE_BASE_IFRAME_URL_3
      : activeServer?.type === "slay"
      ? "https://slay-knight.xyz"
      : activeServer?.isVidapi
      ? "https://vidapi.xyz"
      : activeServer?.isPahe
      ? "https://vidnest.fun"
      : undefined;

  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [blockedRedirect, setBlockedRedirect] = useState(false);

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    episodes?.findIndex((episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId)
  );

  useEffect(() => {
    const loadIframeUrl = async () => {
      setLoading(true);
      setIframeLoaded(false);
      setIframeSrc("");

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (serverName.toLowerCase() === "nest") {
        setIframeSrc(`${baseURL}/${aniid}/${episodeNum}/hindi`);
      } else if (activeServer?.type === "slay") {
        const anilistId = animeInfo?.anilistId || aniid;
        const slayLang = activeServer?.slayLang || "DUB";

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
            langParam = "dub";
        }

        const slayUrl = `${baseURL}/player/${anilistId}/${episodeNum}/${langParam}?autoplay=true`;
        setIframeSrc(slayUrl);
      } else if (activeServer?.isVidapi) {
        const animeTitle = animeInfo?.title || "";

        const linkUrl = animeTitle
          .toLowerCase()
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .replace(/\s+/g, "-")
          .trim();

        setIframeSrc(`${baseURL}/embed/anime/${linkUrl}-episode-${episodeNum}`);
      } else if (activeServer?.isPahe) {
        const paheServerType = activeServer.type;
        const pahePath = paheServerType === "sub" ? "animepahe" : "anime";

        setIframeSrc(`${baseURL}/${pahePath}/${aniid}/${episodeNum}/${paheServerType}`);
      } else if (activeServer?.type === "multi" || serverName.toLowerCase() === "multi") {
        setIframeSrc(`${baseURL}/${aniid}/${episodeNum}/hindi`);
      } else {
        setIframeSrc(`${baseURL}/${episodeId}/${servertype}`);
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

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "redirect-blocked") {
        setBlockedRedirect(true);
      }

      const { currentTime, duration } = event.data;

      if (typeof currentTime === "number" && typeof duration === "number") {
        if (
          currentTime >= duration &&
          currentEpisodeIndex < episodes?.length - 1 &&
          autoNext
        ) {
          playNext(episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [autoNext, currentEpisodeIndex, episodes, playNext]);

  useEffect(() => {
    setLoading(true);
    setIframeLoaded(false);

    return () => {
      const continueWatching =
        JSON.parse(localStorage.getItem("continueWatching")) || [];

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
  }, [episodeId, servertype]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Loader */}
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
        referrerPolicy="origin-when-cross-origin"
        allowFullScreen
        allow="autoplay; fullscreen; encrypted-media"
        className={`w-full h-full transition-opacity duration-500 ${
          iframeLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => {
          setIframeLoaded(true);
          setTimeout(() => setLoading(false), 1000);
          setBlockedRedirect(false);

          try {
            if (iframeRef.current?.contentWindow) {
              const script = document.createElement("script");

              script.textContent = `
                const blockedDomains = ['lt.shangflayed.shop','jb.bipedalpelmata.top','sliwercohue.top'];

                const origReplace = Location.prototype.replace;
                Location.prototype.replace = function(url){
                  if(blockedDomains.some(d=>url.includes(d))){
                    window.parent.postMessage({type:'redirect-blocked',url:url},'*');
                    return;
                  }
                  return origReplace.call(this,url);
                };

                const origAssign = Location.prototype.assign;
                Location.prototype.assign = function(url){
                  if(blockedDomains.some(d=>url.includes(d))){
                    window.parent.postMessage({type:'redirect-blocked',url:url},'*');
                    return;
                  }
                  return origAssign.call(this,url);
                };

                const origOpen = window.open;
                window.open = function(url,...args){
                  if(url && blockedDomains.some(d=>url.includes(d))){
                    window.parent.postMessage({type:'redirect-blocked',url:url},'*');
                    return null;
                  }
                  return origOpen.apply(window,[url,...args]);
                };
              `;

              iframeRef.current.contentWindow.document.head.appendChild(script);
            }
          } catch (err) {
            console.log("Cross-origin iframe, script injection blocked.");
          }
        }}
        onError={() => {
          console.error("Iframe failed to load:", iframeSrc);
          setLoading(false);
        }}
      />

      {/* Ad URL blocked */}
      {isAdUrlBlocked(iframeSrc) && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-75 z-20 rounded-lg">
          <p className="text-white text-lg font-semibold mb-2">Ad URL Blocked</p>
          <p className="text-gray-300 text-sm">
            This iframe contains a blocked ad URL and has been prevented from loading.
          </p>
        </div>
      )}

      {/* Redirect blocked */}
      {blockedRedirect && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-75 z-20 rounded-lg">
          <p className="text-white text-lg font-semibold mb-2">Redirect Blocked</p>
          <p className="text-gray-300 text-sm">
            An attempt to redirect to a blocked ad domain was prevented.
          </p>

          <button
            onClick={() => setBlockedRedirect(false)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}



