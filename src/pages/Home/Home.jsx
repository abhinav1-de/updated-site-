import website_name from "@/src/config/website.js";
import Spotlight from "@/src/components/spotlight/Spotlight.jsx";
import Trending from "@/src/components/trending/Trending.jsx";
import CategoryCard from "@/src/components/categorycard/CategoryCard.jsx";
import Genre from "@/src/components/genres/Genre.jsx";
import Topten from "@/src/components/topten/Topten.jsx";
import Loader from "@/src/components/Loader/Loader.jsx";
import Error from "@/src/components/error/Error.jsx";
import { useHomeInfo } from "@/src/context/HomeInfoContext.jsx";
import Schedule from "@/src/components/schedule/Schedule";
import ContinueWatching from "@/src/components/continue/ContinueWatching";
import TabbedAnimeSection from "@/src/components/tabbed-anime/TabbedAnimeSection";
import JoinRoomPanel from "../../components/multiplayer/JoinRoomPanel.jsx";

function Home() {
  const { homeInfo, homeInfoLoading, error } = useHomeInfo();
  if (homeInfoLoading) return <Loader type="home" />;
  if (error) return <Error />;
  if (!homeInfo) return <Error error="404" />;
  return (
    <>
      <JoinRoomPanel />
      <div className="pt-16 w-full min-h-screen" style={{ background: 'var(--anime-bg-primary)' }}>
        {/* Hero Section */}
        <section className="mb-12">
          <Spotlight spotlights={homeInfo.spotlights} />
        </section>
        
        {/* Genres Section */}
        <section className="mb-12 px-4 lg:px-8">
          <Genre data={homeInfo.genres} />
        </section>
        
        {/* Continue Watching */}
        <section className="mb-12">
          <ContinueWatching />
        </section>
        
        {/* Main Content Grid */}
        <div className="px-4 lg:px-8">
          <div className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,75%),minmax(0,25%)] gap-8 max-w-[2048px] mx-auto">
            {/* Primary Content */}
            <main className="space-y-12">
              <section>
                <CategoryCard
                  label="Latest Episodes"
                  data={homeInfo.latest_episode}
                  path="recently-updated"
                  limit={12}
                />
              </section>
              
              <section>
                <Schedule />
              </section>
              
              <section>
                <TabbedAnimeSection 
                  topAiring={homeInfo.top_airing}
                  mostFavorite={homeInfo.most_favorite}
                  latestCompleted={homeInfo.latest_completed}
                />
              </section>
            </main>

            {/* Sidebar Content */}
            <aside className="space-y-12 xl:pl-4">
              <section>
                <Trending trending={homeInfo.trending} />
              </section>
              
              <section>
                <Topten data={homeInfo.topten} />
              </section>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

