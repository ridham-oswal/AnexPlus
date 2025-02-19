
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export interface TransformedMedia {
  id: number;
  title: string;
  image: string;
  media_type?: 'movie' | 'tv';
}

export const ContentRow = ({
  title,
  items,
}: {
  title: string;
  items: TransformedMedia[];
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div>
      <h2 className="text-vision-text text-xl font-semibold mb-4 px-2">
        {title}
      </h2>
      <div className="group relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronLeft className="w-6 h-6 text-vision-text" />
        </button>
        <div
          ref={rowRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4"
        >
          {items.map((item) => (
            <div 
              key={item.id}
              className="flex-none w-[240px] lg:w-[280px] snap-start cursor-pointer"
              onClick={() => navigate(`/movie/${item.id}?type=${item.media_type || 'movie'}`)}
            >
              <div className="relative group/card rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-video object-cover transform transition-transform duration-300 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-vision-text font-semibold line-clamp-1">{item.title}</h3>
                    <span className="text-sm text-vision-text/70 capitalize">
                      {item.media_type || 'movie'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg

-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronRight className="w-6 h-6 text-vision-text" />
        </button>
      </div>
    </div>
  );
};
