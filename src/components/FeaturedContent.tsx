
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "@/services/mediaService";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

export const FeaturedContent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: movies } = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => fetchMovies('popular'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch featured content",
          variant: "destructive"
        });
      }
    }
  });

  useEffect(() => {
    if (movies && movies.length > 0) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex(prevIndex => prevIndex === Math.min(movies.length - 1, 9) ? 0 : prevIndex + 1);
          setIsTransitioning(false);
        }, 500);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [movies]);

  const featuredMovie = movies?.[currentIndex];

  if (!featuredMovie) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <img 
          src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`} 
          alt={featuredMovie.title} 
          className={`w-full h-full object-cover object-center transition-all duration-1000 ${
            isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vision-background via-vision-background/50 to-transparent" />
      </div>
      
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className={`max-w-2xl transition-all duration-1000 ${
          isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
        }`}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-vision-text mb-4 font-orbitron">
            {featuredMovie.title}
          </h1>
          <p className="text-lg sm:text-xl text-vision-text/80 mb-8 line-clamp-3">
            {featuredMovie.overview}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate(`/movie/${featuredMovie.id}`)} 
              className="bg-white text-vision-background hover:bg-white/90 transition-colors rounded-full px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate(`/movie/${featuredMovie.id}`)} 
              className="border-white/20 text-vision-text transition-colors rounded-full px-8 bg-zinc-600 hover:bg-zinc-500"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {movies?.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 500);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
