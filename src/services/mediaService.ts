const API_KEY = '08c748f7d51cbcbf3189168114145568';
const BASE_URL = 'https://api.themoviedb.org/3';

interface BaseMedia {
  id: number;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  poster_path: string;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

export interface Movie extends BaseMedia {
  title: string;
  release_date: string;
  runtime?: number;
}

export interface TVShow extends BaseMedia {
  name: string;
  first_air_date: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

interface Video {
  key: string;
  site: string;
  type: string;
}

export type MediaDetails = (Movie | TVShow) & {
  genres: Array<{ id: number; name: string }>;
  tagline: string;
  production_companies: Array<{ id: number; name: string; logo_path: string }>;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
  };
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  name?: string;
  title?: string;
  first_air_date?: string;
  release_date?: string;
  videos?: {
    results: Video[];
  };
};

const handleApiResponse = async (response: Response) => {
  if (response.status === 404) {
    const url = new URL(response.url);
    const pathParts = url.pathname.split('/');
    const mediaType = pathParts[2];
    const mediaId = pathParts[3];
    
    if (mediaType === 'tv') {
      const movieUrl = url.href.replace('/tv/', '/movie/');
      const movieResponse = await fetch(movieUrl);
      if (movieResponse.ok) {
        return movieResponse.json();
      }
    }
    throw new Error(`Media not found: ${url.pathname}`);
  }
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

export const fetchTVSeasonDetails = async (tvId: number, seasonNumber: number) => {
  console.log(`Fetching season ${seasonNumber} details for TV show ${tvId}`);
  const response = await fetch(
    `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`
  );
  return handleApiResponse(response);
};

export const fetchMovies = async (category: 'popular' | 'top_rated' | 'upcoming'): Promise<Movie[]> => {
  console.log(`Fetching ${category} movies`);
  const response = await fetch(
    `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=en-US&page=1`
  );
  const data = await handleApiResponse(response);
  return data.results.map((movie: any) => ({ ...movie, media_type: 'movie' as const }));
};

export const fetchTVShows = async (category: 'popular' | 'top_rated' | 'on_the_air'): Promise<TVShow[]> => {
  console.log(`Fetching ${category} TV shows`);
  const response = await fetch(
    `${BASE_URL}/tv/${category}?api_key=${API_KEY}&language=en-US&page=1`
  );
  const data = await handleApiResponse(response);
  return data.results.map((show: any) => ({ ...show, media_type: 'tv' as const }));
};

export const fetchMovieDetails = async (id: number, type: 'movie' | 'tv' = 'movie'): Promise<MediaDetails> => {
  console.log(`Fetching details for ${type} ${id}`);
  
  try {
    const [detailsResponse, creditsResponse, videosResponse] = await Promise.all([
      fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`),
      fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`),
      fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`)
    ]);

    const [details, credits, videos] = await Promise.all([
      handleApiResponse(detailsResponse),
      handleApiResponse(creditsResponse),
      handleApiResponse(videosResponse)
    ]);

    return {
      ...details,
      credits,
      videos,
      media_type: type,
      title: details.title || details.name
    };
  } catch (error) {
    console.error('Error fetching media details:', error);
    throw error;
  }
};

export const searchMovies = async (query: string): Promise<(Movie | TVShow)[]> => {
  console.log(`Searching with query: ${query}`);
  const response = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=1&include_adult=false`
  );
  const data = await handleApiResponse(response);
  
  // Filter only movies and TV shows, and sort by popularity
  return data.results
    .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
    .sort((a: any, b: any) => b.popularity - a.popularity)
    .map((item: any) => ({
      ...item,
      title: item.title || item.name,
      media_type: item.media_type as 'movie' | 'tv'
    }));
};
