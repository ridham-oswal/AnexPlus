import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails, fetchTVSeasonDetails } from "@/services/mediaService";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { MediaHero } from "@/components/MediaHero";
import { MediaStats } from "@/components/MediaStats";
import { TrailerDialog } from "@/components/TrailerDialog";
import { MoviePlayerDialog } from "@/components/MoviePlayerDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlayCircle, CalendarDays, Clock, Users } from "lucide-react";
const MovieDetails = () => {
  const {
    id
  } = useParams();
  const [searchParams] = useSearchParams();
  const mediaType = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const {
    toast
  } = useToast();
  const [favorites, setFavorites] = useLocalStorage<any[]>("favorites", []);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>("1");
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState<number>(1);
  const {
    data: media,
    isLoading: isMediaLoading
  } = useQuery({
    queryKey: ['media', id, mediaType],
    queryFn: () => fetchMovieDetails(Number(id), mediaType),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: `Failed to fetch ${mediaType === 'tv' ? 'TV show' : 'movie'} details`,
          variant: "destructive"
        });
      }
    }
  });
  const {
    data: seasonDetails,
    isLoading: isSeasonLoading
  } = useQuery({
    queryKey: ['season', id, selectedSeason],
    queryFn: () => fetchTVSeasonDetails(Number(id), Number(selectedSeason)),
    enabled: mediaType === 'tv' && !!media,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch season details",
          variant: "destructive"
        });
      }
    }
  });
  useEffect(() => {
    if (media) {
      const isCurrentlyFavorite = favorites.some(fav => fav.id === media.id);
      setIsFavorite(isCurrentlyFavorite);
    }
  }, [media, favorites]);
  const handleFavoriteClick = () => {
    if (!media) return;
    const newFavorite = {
      id: media.id,
      title: mediaType === 'tv' ? media.name : media.title,
      backdrop_path: media.backdrop_path,
      media_type: mediaType
    };
    if (isFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== media.id);
      setFavorites(updatedFavorites);
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: `${mediaType === 'tv' ? media.name : media.title} has been removed from your favorites`
      });
    } else {
      setFavorites([...favorites, newFavorite]);
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${mediaType === 'tv' ? media.name : media.title} has been added to your favorites`
      });
    }
  };
  const handlePlayEpisode = (episodeNumber: number) => {
    setSelectedEpisodeNumber(episodeNumber);
    setIsPlayerOpen(true);
  };
  if (isMediaLoading) {
    return <div className="min-h-screen bg-vision-background text-vision-text flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>;
  }
  if (!media) return null;
  const title = mediaType === 'tv' ? media.name : media.title;
  const releaseDate = mediaType === 'tv' ? media.first_air_date : media.release_date;
  const trailerVideo = media.videos?.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube");
  return <div className="min-h-screen bg-vision-background text-vision-text">
      <MediaHero backdropPath={media.backdrop_path} title={title} />

      <div className="relative mt-[35vh] sm:mt-[40vh] lg:mt-[55vh]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[300px,1fr] gap-8">
            {/* Left Column - Poster and Actions */}
            <div className="relative -mt-20 sm:-mt-24 lg:-mt-32 z-10">
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-xl">
                <img src={`https://image.tmdb.org/t/p/w500${media.poster_path}`} alt={title} className="w-full h-full object-cover" />
              </div>

              {mediaType === 'movie' && <Button onClick={() => setIsPlayerOpen(true)} className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700">
                  <PlayCircle className="mr-2" />
                  Watch Movie
                </Button>}
            </div>

            {/* Right Column - Content */}
            <div className="relative z-10">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
                  <MediaStats mediaType={mediaType} voteAverage={media.vote_average} runtime={media.runtime} releaseDate={releaseDate} numberOfSeasons={media.number_of_seasons} numberOfEpisodes={media.number_of_episodes} isFavorite={isFavorite} onFavoriteClick={handleFavoriteClick} onTrailerClick={() => setIsTrailerOpen(true)} trailerAvailable={!!trailerVideo} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre: {
                  id: number;
                  name: string;
                }) => <span key={genre.id} className="px-3 py-1 text-sm rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                      {genre.name}
                    </span>)}
                </div>

                {media.tagline && <p className="text-xl italic text-vision-text/80 font-serif">
                    "{media.tagline}"
                  </p>}

                <p className="text-lg leading-relaxed text-vision-text/90">
                  {media.overview}
                </p>

                {mediaType === 'tv' && media.number_of_seasons > 1 && <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                        <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({
                        length: media.number_of_seasons
                      }, (_, i) => <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Season {i + 1}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      {seasonDetails && <span className="text-sm text-vision-text/70">
                          {seasonDetails.episodes?.length} Episodes
                        </span>}
                    </div>

                    {seasonDetails && <div className="space-y-4">
                        {seasonDetails.episodes?.map((episode: any) => <div key={episode.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold">
                                  {episode.episode_number}. {episode.name}
                                </h3>
                                <p className="text-sm text-vision-text/70 mt-1">
                                  {new Date(episode.air_date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-vision-text/80 mt-2 line-clamp-2">
                                  {episode.overview}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-sm px-2 py-1 rounded bg-white/10">
                                  {episode.runtime}min
                                </span>
                                <Button
                                  size="sm"
                                  onClick={() => handlePlayEpisode(episode.episode_number)}
                                  className="bg-slate-50 text-slate-950"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                  Play
                                </Button>
                              </div>
                            </div>
                          </div>)}
                      </div>}
                  </div>}

                {/* Cast Section */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Featured Cast</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {media.credits.cast.slice(0, 6).map(actor => <div key={actor.id} className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all">
                        <div className="aspect-[2/3]">
                          <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/placeholder.svg'} alt={actor.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-2">
                          <h3 className="font-medium text-sm truncate">{actor.name}</h3>
                          <p className="text-xs text-vision-text/70 truncate">{actor.character}</p>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Production Companies */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Production</h2>
                  <div className="flex flex-wrap gap-6">
                    {media.production_companies.filter(company => company.logo_path).map(company => <div key={company.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                          <img src={`https://image.tmdb.org/t/p/w185${company.logo_path}`} alt={company.name} className="h-8 sm:h-10 object-contain" />
                        </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrailerDialog isOpen={isTrailerOpen} onClose={() => setIsTrailerOpen(false)} trailerKey={trailerVideo?.key} title={title} />

      <MoviePlayerDialog isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} movieId={Number(id)} title={title} mediaType={mediaType} seasonNumber={Number(selectedSeason)} episodeNumber={selectedEpisodeNumber} />
    </div>;
};
export default MovieDetails;