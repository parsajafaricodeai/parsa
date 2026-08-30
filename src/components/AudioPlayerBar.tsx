import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, FileText, X, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AudioPlayerBar: React.FC = () => {
  const { activeChant, isPlayingAudio, toggleAudioPlay, stopAudio, chants, playChant } = useApp();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyricsModal, setShowLyricsModal] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.play().catch(() => {
          // auto-play restriction handled gracefully
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlayingAudio, activeChant]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!activeChant) return null;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '۰۰:۰۰';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNext = () => {
    const currentIndex = chants.findIndex((c) => c.id === activeChant.id);
    const nextIndex = (currentIndex + 1) % chants.length;
    playChant(chants[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = chants.findIndex((c) => c.id === activeChant.id);
    const prevIndex = (currentIndex - 1 + chants.length) % chants.length;
    playChant(chants[prevIndex]);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={activeChant.audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
      />

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-3 inset-x-3 md:inset-x-6 z-40 bg-slate-900/95 text-white backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-3 md:px-5 md:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3"
      >
        {/* Track Details */}
        <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0 justify-between md:justify-start">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-700 shadow-md">
              {activeChant.coverImage && activeChant.coverImage.trim() ? (
                <img
                  src={activeChant.coverImage}
                  alt={activeChant.title}
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-white/80" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{activeChant.title}</p>
              <p className="text-xs text-sky-300 truncate mt-0.5">{activeChant.singerGroup}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={toggleAudioPlay}
              className="p-2 rounded-full bg-amber-500 text-slate-950 font-bold"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={stopAudio}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Controls & Progress Bar */}
        <div className="flex-1 w-full max-w-xl flex flex-col items-center gap-1.5">
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="قبلی"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={toggleAudioPlay}
              className="p-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition transform hover:scale-105"
              title={isPlayingAudio ? 'توقف' : 'پخش'}
            >
              {isPlayingAudio ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="بعدی"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Slider */}
          <div className="w-full flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span>{formatTime(duration) || activeChant.duration}</span>
          </div>
        </div>

        {/* Right Tools: Volume, Lyrics, Close */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
          {activeChant.lyrics && (
            <button
              onClick={() => setShowLyricsModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
              title="متن سرود / شعر"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              متن شعر
            </button>
          )}

          {/* Volume Control */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white p-1"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          <button
            onClick={stopAudio}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
            title="بستن پلیر"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Lyrics Modal */}
      <AnimatePresence>
        {showLyricsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative"
            >
              <button
                onClick={() => setShowLyricsModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-6 h-6 text-sky-500" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    متن {activeChant.title}
                  </h3>
                  <p className="text-xs text-slate-500">{activeChant.singerGroup}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-sans whitespace-pre-line border border-slate-200 dark:border-slate-700/60 max-h-72 overflow-y-auto">
                {activeChant.lyrics}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
