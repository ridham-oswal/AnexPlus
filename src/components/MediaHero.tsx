
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface MediaHeroProps {
  backdropPath: string;
  title: string;
}

export const MediaHero = ({ backdropPath, title }: MediaHeroProps) => {
  const navigate = useNavigate();
  const isPlayerMode = window.location.hash === '#player';

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[40vh] sm:h-[45vh] lg:h-[60vh] z-0">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${backdropPath}`}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vision-background from-20% via-vision-background/50 to-transparent" />
        </div>
      </div>

      {!isPlayerMode && (
        <button 
          onClick={handleBack}
          className="fixed top-4 left-4 z-[100] flex items-center gap-2 text-vision-text hover:text-vision-text/80 transition-colors bg-black/30 hover:bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      )}
    </>
  );
};