import { Clock, Star, Calendar, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { PlayCircle } from "lucide-react";
interface MediaStatsProps {
  mediaType: 'movie' | 'tv';
  voteAverage: number;
  runtime?: number;
  releaseDate: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onTrailerClick: () => void;
  trailerAvailable: boolean;
}
export const MediaStats = ({
  mediaType,
  voteAverage,
  runtime,
  releaseDate,
  numberOfSeasons,
  numberOfEpisodes,
  isFavorite,
  onFavoriteClick,
  onTrailerClick,
  trailerAvailable
}: MediaStatsProps) => <div className="flex flex-wrap gap-4 items-center">
    <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1.5 rounded-lg">
      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
      <span className="text-sm font-medium">{voteAverage.toFixed(1)}</span>
    </div>
    
    {mediaType === 'tv' ? <>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4 text-vision-text/70" />
          <span className="text-sm">{numberOfSeasons} Seasons</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
          <Calendar className="w-4 h-4 text-vision-text/70" />
          <span className="text-sm">{numberOfEpisodes} Episodes</span>
        </div>
      </> : <>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4 text-vision-text/70" />
          <span className="text-sm">{runtime} min</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
          <Calendar className="w-4 h-4 text-vision-text/70" />
          <span className="text-sm">{new Date(releaseDate).getFullYear()}</span>
        </div>
      </>}
    
    <button onClick={onFavoriteClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isFavorite ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-vision-text/70 hover:text-red-500 hover:bg-red-500/20'}`}>
      <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
      <span className="text-sm">
        {isFavorite ? 'Remove' : 'Add to Favorites'}
      </span>
    </button>

    {trailerAvailable && <Button onClick={onTrailerClick} variant="secondary" className="px-3 py-1.5 h-auto font-normal text-slate-950 bg-slate-50">
        <PlayCircle className="w-4 h-4 mr-2" />
        <span className="text-sm">Watch Trailer</span>
      </Button>}
  </div>;