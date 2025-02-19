
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/services/mediaService";
import { NavigationBar } from "@/components/NavigationBar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Search, Film, Tv } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: media, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to search movies and TV shows",
          variant: "destructive",
        });
      },
    },
  });

  if (!query) {
    return (
      <div className="min-h-screen bg-vision-background">
        <NavigationBar />
        <div className="pt-32 flex flex-col items-center justify-center gap-4 px-6 text-center text-vision-text">
          <Search className="w-12 h-12 text-vision-text/50" />
          <h1 className="text-2xl font-semibold">Start Your Search</h1>
          <p className="text-vision-text/70 max-w-md">
            Enter a search term in the bar above to discover movies and TV shows
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vision-background">
      <NavigationBar />
      <div className="container mx-auto pt-32 px-6">
        <div className="glass-morphism rounded-xl p-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gradient">
            Search Results for "{query}"
          </h1>
          <p className="text-vision-text/70 mt-2">
            {media?.length || 0} results found
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-video bg-white/5 rounded-xl mb-2" />
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {media?.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/movie/${item.id}?type=${item.media_type}`)}
              >
                <div className="relative rounded-xl overflow-hidden glass-morphism">
                  <img
                    src={
                      item.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
                        : "/placeholder.svg"
                    }
                    alt={'title' in item ? item.title : item.name}
                    className="w-full aspect-video object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-vision-text font-semibold line-clamp-1">
                        {'title' in item ? item.title : item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-sm text-vision-text/70">
                          {item.media_type === 'movie' ? (
                            <Film className="w-3 h-3" />
                          ) : (
                            <Tv className="w-3 h-3" />
                          )}
                          <span className="capitalize">{item.media_type}</span>
                        </span>
                        {item.vote_average > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-500">★</span>
                            <span className="text-vision-text/70">
                              {item.vote_average.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {media?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <Search className="w-12 h-12 text-vision-text/50" />
            <h2 className="text-xl font-semibold">No results found</h2>
            <p className="text-vision-text/70 max-w-md">
              Try adjusting your search or browse our categories for inspiration
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
