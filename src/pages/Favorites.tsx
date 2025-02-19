
import { NavigationBar } from "@/components/NavigationBar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Movie, TVShow } from "@/services/mediaService";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TransformedMedia {
  id: number;
  title: string;
  backdrop_path: string;
  media_type: 'movie' | 'tv';
}

const Favorites = () => {
  const [favorites, setFavorites] = useLocalStorage<(Movie | TVShow)[]>("favorites", []);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRemove = (id: number, title: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    toast({
      title: "Removed from favorites",
      description: `${title} has been removed from your favorites`,
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-vision-background">
        <NavigationBar />
        <div className="container mx-auto pt-32 px-6">
          <div className="glass-morphism rounded-xl p-8 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-vision-text/50" />
            <h1 className="text-2xl font-semibold mb-2 text-gradient">Your Favorites</h1>
            <p className="text-vision-text/70 max-w-md mx-auto">
              Start exploring and add your favorite movies and TV shows to your collection
            </p>
            <Button 
              className="mt-6"
              onClick={() => navigate('/')}
            >
              Explore Content
            </Button>
          </div>
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
            Your Favorites
          </h1>
          <p className="text-vision-text/70 mt-2">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your collection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item) => {
            const title = 'title' in item ? item.title : item.name;
            return (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden glass-morphism"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                  alt={title}
                  className="w-full aspect-video object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-100">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-vision-text font-semibold line-clamp-2 mb-2">
                      {title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-vision-text/70 capitalize">
                        {item.media_type}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.id, title);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/movie/${item.id}?type=${item.media_type}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
