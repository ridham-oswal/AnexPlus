
import { NavigationBar } from "@/components/NavigationBar";
import { FeaturedContent } from "@/components/FeaturedContent";
import { ContentRow } from "@/components/ContentRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Movie, TVShow, fetchMovies, fetchTVShows } from "@/services/mediaService";
import { useToast } from "@/hooks/use-toast";
import { Layers } from "lucide-react";

const Index = () => {
  const { toast } = useToast();

  const popularMoviesQuery = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => fetchMovies('popular'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch popular movies",
          variant: "destructive",
        });
      },
    },
  });

  const topRatedMoviesQuery = useQuery({
    queryKey: ['movies', 'top_rated'],
    queryFn: () => fetchMovies('top_rated'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch top rated movies",
          variant: "destructive",
        });
      },
    },
  });

  const upcomingMoviesQuery = useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => fetchMovies('upcoming'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch upcoming movies",
          variant: "destructive",
        });
      },
    },
  });

  const popularTVQuery = useQuery({
    queryKey: ['tv', 'popular'],
    queryFn: () => fetchTVShows('popular'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch popular TV shows",
          variant: "destructive",
        });
      },
    },
  });

  const topRatedTVQuery = useQuery({
    queryKey: ['tv', 'top_rated'],
    queryFn: () => fetchTVShows('top_rated'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch top rated TV shows",
          variant: "destructive",
        });
      },
    },
  });

  const onAirTVQuery = useQuery({
    queryKey: ['tv', 'on_the_air'],
    queryFn: () => fetchTVShows('on_the_air'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch on air TV shows",
          variant: "destructive",
        });
      },
    },
  });

  const transformMediaForContentRow = (media: (Movie | TVShow)[] = []) => {
    return media.map(item => ({
      id: item.id,
      title: 'title' in item ? item.title : item.name,
      image: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`,
      media_type: 'title' in item ? 'movie' as const : 'tv' as const,
    }));
  };

  return (
    <div className="min-h-screen bg-vision-background text-vision-text">
      <NavigationBar />
      <FeaturedContent />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 -mt-8">
        <Tabs defaultValue="movies" className="w-full mt-12">
          <div className="flex items-center gap-4 mb-6">
            <Layers className="w-6 h-6 text-vision-text/70" />
            <TabsList className="bg-white/5 backdrop-blur-xl w-full justify-start rounded-2xl border border-white/10 p-1">
              <TabsTrigger 
                value="movies" 
                className="data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-xl data-[state=active]:text-white text-white/70 transition-all duration-300 rounded-xl px-6 py-2.5"
              >
                Movies
              </TabsTrigger>
              <TabsTrigger 
                value="tv" 
                className="data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-xl data-[state=active]:text-white text-white/70 transition-all duration-300 rounded-xl px-6 py-2.5"
              >
                TV Shows
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="movies" className="space-y-12">
            {popularMoviesQuery.isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-pulse text-vision-text/70">Loading movies...</div>
              </div>
            ) : (
              <ContentRow 
                title="Popular Movies" 
                items={transformMediaForContentRow(popularMoviesQuery.data)} 
              />
            )}

            {topRatedMoviesQuery.isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-pulse text-vision-text/70">Loading top rated movies...</div>
              </div>
            ) : (
              <ContentRow 
                title="Top Rated Movies" 
                items={transformMediaForContentRow(topRatedMoviesQuery.data)} 
              />
            )}

            {upcomingMoviesQuery.isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-pulse text-vision-text/70">Loading upcoming movies...</div>
              </div>
            ) : (
              <ContentRow 
                title="Upcoming Movies" 
                items={transformMediaForContentRow(upcomingMoviesQuery.data)} 
              />
            )}
          </TabsContent>

          <TabsContent value="tv" className="space-y-12">
            {popularTVQuery.isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-pulse text-vision-text/70">Loading TV shows...</div>
              </div>
            ) : (
              <ContentRow 
                title="Popular TV Shows" 
                items={transformMediaForContentRow(popularTVQuery.data)} 
              />
            )}

            {topRatedTVQuery.isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-pulse text-vision-text/70">Loading top rated shows...</div>
              </div>
            ) : (
              <ContentRow 
                title="Top Rated TV Shows" 
                items={transformMediaForContentRow(topRatedTVQuery.data)} 
              />
            )}

            {onAirTVQuery.isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-pulse text-vision-text/70">Loading airing shows...</div>
              </div>
            ) : (
              <ContentRow 
                title="Currently Airing TV Shows" 
                items={transformMediaForContentRow(onAirTVQuery.data)} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
