import { useState, useEffect, useRef } from "react";
import { Volume2, Video, AlertCircle } from "lucide-react";

interface MediaPlayerProps {
  fileUrl: string;
}

const ListeningMediaPlayer = ({ fileUrl }: MediaPlayerProps) => {
  const [mediaType, setMediaType] = useState<"audio" | "video" | "youtube" | "unknown">("unknown");
  const [hasError, setHasError] = useState<boolean>(false);
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);

  // Analyze the URL to determine the correct player layout
  useEffect(() => {
    setHasError(false); // Reset error status on source change
    
    if (!fileUrl) {
      setMediaType("unknown");
      return;
    }

    const url = fileUrl.toLowerCase().trim();

    // 1. Check for YouTube Links
    if (
      url.includes("youtube.com") || 
      url.includes("youtu.be") || 
      url.includes("/embed/")
    ) {
      setMediaType("youtube");
      return;
    }

    // 2. Check explicitly for standard Video extensions
    if (
      url.endsWith(".mp4") || 
      url.endsWith(".webm") || 
      url.endsWith(".ogg") && !url.includes("audio") // local differentiation
    ) {
      setMediaType("video");
      return;
    }

    // 3. Check explicitly for standard Audio extensions
    if (
      url.endsWith(".mp3") || 
      url.endsWith(".wav") || 
      url.endsWith(".aac") || 
      url.endsWith(".m4a") || 
      url.endsWith(".ogg")
    ) {
      setMediaType("audio");
      return;
    }

    // 4. Smart Guessing Fallbacks if file paths lack strict extensions (e.g., API streaming endpoints)
    if (url.includes("video") || url.includes("stream")) {
      setMediaType("video");
    } else {
      // Default fallback assumption for a listening application
      setMediaType("audio");
    }
  }, [fileUrl]);

  // Transform standard watch links into embed codes for iframe stability
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
      } else if (url.includes("youtube.com/embed/")) {
        return url;
      } else {
        videoId = url.split("v=")[1]?.split(/[&?#]/)[0];
      }
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    } catch {
      return url;
    }
  };

  // --- Render Condition 1: Error Broken State ---
  if (hasError) {
    return (
      <div className="w-full flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
        <AlertCircle size={20} className="shrink-0" />
        <div className="text-sm">
          <p className="font-bold">Media Stream Error</p>
          <p className="opacity-90">The source file could not be fetched. Check your internet connection or file format permissions.</p>
        </div>
      </div>
    );
  }

  // --- Render Condition 2: YouTube Integration ---
  if (mediaType === "youtube") {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider">
          <Video size={14} /> Streaming Video Platform
        </div>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-md bg-black">
          <iframe
            src={getYouTubeEmbedUrl(fileUrl)}
            title="Embedded video player"
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => setHasError(true)}
          />
        </div>
      </div>
    );
  }

  // --- Render Condition 3: Native HTML5 Video Element ---
  if (mediaType === "video") {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Video size={14} /> Video Assignment Content
        </div>
        <div className="w-full flex justify-center bg-slate-950 p-2 rounded-xl border border-slate-200 shadow-md">
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={fileUrl}
            controls
            controlsList="nodownload"
            preload="auto"
            onError={() => setHasError(true)}
            className="w-full max-w-2xl rounded-lg max-h-[380px]"
          >
            Your browser does not support HTML5 video layout streams.
          </video>
        </div>
      </div>
    );
  }

  // --- Render Condition 4: Standard HTML5 Audio Deck Player ---
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
          <Volume2 size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">Audio Practice Segment</p>
          <p className="text-xs text-slate-400">Press play to begin listening to the source sample</p>
        </div>
      </div>

      <div className="w-full sm:w-auto shrink-0">
        <audio
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={fileUrl}
          controls
          controlsList="nodownload"
          preload="auto"
          onError={() => setHasError(true)}
          className="w-full sm:w-[320px] focus:outline-none block h-9 accent-indigo-600"
        >
          Your browser does not support HTML5 audio playback.
        </audio>
      </div>
    </div>
  );
};

export default ListeningMediaPlayer;