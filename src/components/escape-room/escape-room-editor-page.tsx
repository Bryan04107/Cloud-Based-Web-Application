"use client";

import { useState, useRef, useEffect } from 'react';
import type { EscapeRoomConfig, Hotspot } from '@/lib/types';
import HotspotModal from '@/components/escape-room/escape-room-edit-hotspot-modal';
import PlayModal from '@/components/escape-room/escape-room-play-modal';
import DeleteModal from '@/components/escape-room/escape-room-delete-modal';
import { generateEscapeRoomHtml } from '@/lib/generate-escape-room';
import BuilderPanel from '@/components/escape-room/escape-room-builder-panel';
import GamePanel from '@/components/escape-room/escape-room-game-panel';
import { toast } from 'sonner';

interface EditorPageProps {
  initialConfig?: EscapeRoomConfig;
  onSave: (config: EscapeRoomConfig) => void;
  onBack: () => void;
}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function EscapeRoomEditorPage({ 
  initialConfig,
  onSave,
  onBack
}: EditorPageProps) {
  const [config, setConfig] = useState<EscapeRoomConfig>(() => initialConfig || {
    id: generateId(),
    title: "New Room",
    timerMinutes: 5,
    penaltySeconds:30,
    backgroundImage: "",
    hotspots: []
  });

  const [baselineConfig, setBaselineConfig] = useState<string>(JSON.stringify(config));
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotspot, setEditingHotspot] = useState<Hotspot | undefined>(undefined);
  const [hotspotToDelete, setHotspotToDelete] = useState<string | null>(null);
  const [isPlayMode, setIsPlayMode] = useState(false);
  const [activePlayHotspot, setActivePlayHotspot] = useState<Hotspot | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lockedAlert, setLockedAlert] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleSaveOnly = () => {
    onSave(config);
    setBaselineConfig(JSON.stringify(config));
    toast.success('Room saved successfully!');
  };

  const handleBackRequest = () => {
    const currentConfigString = JSON.stringify(config);
    if (currentConfigString !== baselineConfig) {
      setShowDiscardAlert(true);
    } else {
      onBack();
    }
  };

  const confirmDiscard = () => {
    onBack();
  };

  const togglePlayMode = (play: boolean) => {
    setIsPlayMode(play);
    if (play) {
      setSolvedIds([]);
      setScore(0);
      setTimeLeft(config.timerMinutes * 60);
      setIsTimerRunning(true);
      setIsVictory(false);
      setIsGameOver(false);
    } else {
      setIsTimerRunning(false);
      setActivePlayHotspot(null);
      setIsVictory(false);
      setIsGameOver(false);
    }
  };

  const handlePenalty = () => setTimeLeft(prev => Math.max(0, prev - (config.penaltySeconds)));

  const handleDownload = () => {
    const html = generateEscapeRoomHtml(config);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Room downloaded successfully!');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setActivePlayHotspot(null);
      setIsGameOver(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, backgroundImage: reader.result as string }));
        toast.success('Background image updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHotspot = () => {
    setEditingHotspot(undefined);
    setIsModalOpen(true);
  };

  const handleEditHotspot = (hotspot: Hotspot) => {
    if (isPlayMode) return;
    setEditingHotspot(hotspot);
    setIsModalOpen(true);
  };

  const handleSaveHotspot = (hotspot: Hotspot) => {
    setConfig(prev => {
      const exists = prev.hotspots.find(h => h.id === hotspot.id);
      return {
        ...prev,
        hotspots: exists 
          ? prev.hotspots.map(h => h.id === hotspot.id ? hotspot : h)
          : [...prev.hotspots, hotspot]
      };
    });
    setIsModalOpen(false);
  };

  const handleDeleteHotspot = (id: string) => {
    setHotspotToDelete(id);
  };

  const confirmDeleteHotspot = () => {
    if (hotspotToDelete) {
      setConfig(prev => ({ ...prev, hotspots: prev.hotspots.filter(h => h.id !== hotspotToDelete) }));
      toast.success('Puzzle deleted succesfully!');
      setHotspotToDelete(null);
      if (editingHotspot?.id === hotspotToDelete) {
        setIsModalOpen(false);
      }
    }
  };

  const handleHotspotMove = (id: string, x: number, y: number) => {
    setConfig(prev => ({
      ...prev,
      hotspots: prev.hotspots.map(h => h.id === id ? { ...h, x, y } : h)
    }));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPlayMode || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    if (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    ) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setEditingHotspot({
        id: generateId(),
        name: "New Puzzle",
        x: Math.round(x),
        y: Math.round(y),
        type: 'guide',
        isBonus: false,
        points: 10,
        lockBehavior: 'visible_locked',
        content: { question: "", solution: "", options: [] }
      });
      setIsModalOpen(true);
    }
  };

  const handlePlayClick = (e: React.MouseEvent, hotspot: Hotspot) => {
    e.stopPropagation();
    if (!isPlayMode) {
      handleEditHotspot(hotspot);
      return;
    }
    if (hotspot.lockedBy && !solvedIds.includes(hotspot.lockedBy)) {
      setLockedAlert("🔒 Locked! You must solve a previous puzzle first.");
      setTimeout(() => setLockedAlert(null), 2000);
      return;
    }
    setActivePlayHotspot(hotspot);
  };

  const handlePuzzleSolve = (id: string, points: number) => {
    if (!solvedIds.includes(id)) {
      const newSolved = [...solvedIds, id];
      setSolvedIds(newSolved);
      setScore(prev => prev + points);
      const mandatory = config.hotspots.filter(h => !h.isBonus);
      const allSolved = mandatory.every(h => newSolved.includes(h.id));  
      if (allSolved) {
        setIsTimerRunning(false);
        setIsVictory(true);
      }
    }
  };

  const hotspotToDeleteName = config.hotspots.find(h => h.id === hotspotToDelete)?.name || "this puzzle";

  return (
    <div className="flex flex-col md:flex-row w-full max-h-[calc(100vh-73.49px-55.99px)] md:max-h-[calc(100vh-113.47px-55.99px)] overflow-auto md:overflow-hidden">
      <BuilderPanel
        config={config}
        setConfig={setConfig}
        isPlayMode={isPlayMode}
        togglePlayMode={togglePlayMode}
        fileInputRef={fileInputRef}
        onImageUpload={handleImageUpload}
        onDownload={handleDownload}
        onAddHotspot={handleAddHotspot}
        onEditHotspot={handleEditHotspot}
        onDeleteHotspot={handleDeleteHotspot}
        onBack={handleBackRequest}
        onSave={handleSaveOnly}
      />

      <GamePanel
        config={config}
        imageRef={imageRef}
        isPlayMode={isPlayMode}
        solvedIds={solvedIds}
        score={score}
        timeLeft={timeLeft}
        isVictory={isVictory}
        isGameOver={isGameOver}
        lockedAlert={lockedAlert}
        onMapClick={handleMapClick}
        onPlayClick={handlePlayClick}
        onHotspotMove={handleHotspotMove}
        onImageUpload={handleImageUpload}
        formatTime={formatTime}
        onRestart={() => togglePlayMode(false)}
        onBackToEditor={() => togglePlayMode(false)}
      />

      <HotspotModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveHotspot} 
        onDelete={handleDeleteHotspot} 
        hotspotToEdit={editingHotspot} 
        existingHotspots={config.hotspots}
      />

      <DeleteModal
        isOpen={!!hotspotToDelete}
        onClose={() => setHotspotToDelete(null)}
        onConfirm={confirmDeleteHotspot}
        title={hotspotToDeleteName}
        itemType="Puzzle" 
      />

      <PlayModal 
        hotspot={activePlayHotspot} 
        onClose={() => setActivePlayHotspot(null)} 
        onSolve={handlePuzzleSolve}
        onPenalty={handlePenalty}
        penaltySeconds={config.penaltySeconds}
      />

      {showDiscardAlert && (
        <div 
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
        >
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <div className="bg-background border-2 border-yellow-500 rounded-lg shadow-2xl w-full max-w-md p-6 text-center animate-fade-in-scale-up">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Unsaved Changes</h2>
            <p className="text-gray-500 mb-6">
              You have unsaved changes in this room. If you leave now changes will be lost.
            </p>
            <div className="flex space-x-3 justify-center">
              <button 
                onClick={() => setShowDiscardAlert(false)}
                className="px-5 py-2 rounded-lg text-primary hover:bg-hover border border-primary/20 transition-colors font-medium"
              >
                Keep Editing
              </button>
              <button 
                onClick={confirmDiscard}
                className="px-5 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-md transition-transform hover:scale-105"
              >
                Discard & Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}