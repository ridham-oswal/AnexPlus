
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ServerSelectionDialog, servers } from "./ServerSelectionDialog";

interface MoviePlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number;
  title: string;
  mediaType: 'movie' | 'tv';
  seasonNumber?: number;
  episodeNumber?: number;
}

export const MoviePlayerDialog = ({ 
  isOpen, 
  onClose,
  movieId, 
  title,
  mediaType,
  seasonNumber,
  episodeNumber 
}: MoviePlayerDialogProps) => {
  const [showServerSelection, setShowServerSelection] = useState(true);
  const [selectedServer, setSelectedServer] = useState(servers[0]);

  const handleServerSelect = (server: typeof servers[0]) => {
    setSelectedServer(server);
    setShowServerSelection(false);
  };

  const handleClose = () => {
    setShowServerSelection(true);
    onClose();
  };

  if (!isOpen) return null;

  if (showServerSelection) {
    return (
      <ServerSelectionDialog
        isOpen={true}
        onClose={handleClose}
        onServerSelect={handleServerSelect}
        title={title}
      />
    );
  }

  const embedUrl = selectedServer.getEmbedUrl({
    movieId,
    mediaType,
    seasonNumber,
    episodeNumber
  });

  return (
    <div className="fixed inset-0 w-full h-full z-50 bg-black">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
        onClick={handleClose}
      >
        <X className="h-6 w-6" />
      </Button>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        allowFullScreen
        allow="fullscreen"
        className="w-full h-full"
      />
    </div>
  );
};
