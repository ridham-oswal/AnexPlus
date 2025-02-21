
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Server } from "lucide-react";

interface ServerOption {
  name: string;
  getEmbedUrl: (params: {
    movieId: number;
    mediaType: 'movie' | 'tv';
    seasonNumber?: number;
    episodeNumber?: number;
  }) => string;
}

export const servers: ServerOption[] = [
  {
    name: "Server 1",
    getEmbedUrl: ({ movieId, mediaType, seasonNumber, episodeNumber }) =>
      mediaType === 'tv'
        ? `https://embed.su/embed/tv/${movieId}/${seasonNumber}/${episodeNumber}`
        : `https://embed.su/embed/movie/${movieId}`
  },
  {
    name: "Server 2",
    getEmbedUrl: ({ movieId, mediaType, seasonNumber, episodeNumber }) =>
      mediaType === 'tv'
        ? `https://vidbinge.dev/embed/tv/${movieId}/${seasonNumber}/${episodeNumber}`
        : `https://vidbinge.dev/embed/movie/${movieId}`
  },
  {
    name: "Server 3",
    getEmbedUrl: ({ movieId, mediaType, seasonNumber, episodeNumber }) =>
      mediaType === 'tv'
        ? `https://vidsrc.xyz/embed/tv/${movieId}/${seasonNumber}/${episodeNumber}`
        : `https://vidsrc.xyz/embed/movie/${movieId}`
  },
  {
    name: "Server 4",
    getEmbedUrl: ({ movieId, mediaType, seasonNumber, episodeNumber }) =>
      mediaType === 'tv'
        ? `https://player.autoembed.cc/embed/tv/${movieId}/${seasonNumber}/${episodeNumber}`
        : `https://player.autoembed.cc/embed/movie/${movieId}`
  }
];

interface ServerSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onServerSelect: (server: ServerOption) => void;
  title: string;
}

export const ServerSelectionDialog = ({
  isOpen,
  onClose,
  onServerSelect,
  title
}: ServerSelectionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-morphism border-none bg-black/40">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient text-slate-50">{title}</DialogTitle>
          <p className="text-sm text-white/70 mt-2">Select your preferred streaming server</p>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {servers.map((server, index) => (
            <Button
              key={index}
              onClick={() => onServerSelect(server)}
              className="flex items-center justify-start gap-3 w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-200 hover:scale-[1.02]"
              variant="outline"
            >
              <Server className="h-4 w-4 text-white/70" />
              <span className="font-medium text-slate-50">{server.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
