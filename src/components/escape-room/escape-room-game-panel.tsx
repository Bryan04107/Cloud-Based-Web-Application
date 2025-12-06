"use client";

import { RefObject, useRef } from 'react';
import type { EscapeRoomConfig, Hotspot } from '@/lib/types';

interface EscapeRoomGamePanelProps {
  config: EscapeRoomConfig;
  imageRef: RefObject<HTMLImageElement | null>;
  isPlayMode: boolean;
  solvedIds: string[];
  score: number;
  timeLeft: number;
  isVictory: boolean;
  isGameOver: boolean;
  lockedAlert: string | null;
  onMapClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPlayClick: (e: React.MouseEvent, hotspot: Hotspot) => void;
  onHotspotMove?: (id: string, newX: number, newY: number) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatTime: (seconds: number) => string;
  onRestart: () => void;
  onBackToEditor: () => void;
}

export default function EscapeRoomGamePanel({
  config,
  imageRef,
  isPlayMode,
  solvedIds,
  score,
  timeLeft,
  isVictory,
  isGameOver,
  lockedAlert,
  onMapClick,
  onPlayClick,
  onHotspotMove,
  onImageUpload,
  formatTime,
  onRestart,
  onBackToEditor
}: EscapeRoomGamePanelProps) {
  
  const emptyStateInputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (isPlayMode) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("hotspotId", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isPlayMode || !onHotspotMove) return;

    const hotspotId = e.dataTransfer.getData("hotspotId");
    if (!hotspotId) return;

    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;

    const percentX = Math.max(0, Math.min(100, (x / container.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / container.height) * 100));

    onHotspotMove(hotspotId, Math.round(percentX), Math.round(percentY));
  };

  const getHotspotIcon = (h: Hotspot, isSolved: boolean, isLocked: boolean) => {
    if (isPlayMode && isLocked) return '🔒';
    if (h.type === 'guide') return '📜';
    if (isSolved) return '✓';

    switch (h.type) {
      case 'code': return '💻';
      case 'mcq_single': return '❓';
      case 'mcq_multi': return '❓';
      default: return '📜';
    }
  };

  return (
    <div className="w-2/3 bg-hover/100 relative flex items-center justify-center p-4 overflow-hidden h-full">
      {isPlayMode && (
        <div className="absolute top-4 right-4 z-[19] flex gap-4 pointer-events-none">
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg border-2 border-white/20 shadow-xl backdrop-blur-md">
            <div className="text-xs uppercase text-gray-400 font-bold">Time Left</div>
            <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg border-2 border-white/20 shadow-xl backdrop-blur-md">
            <div className="text-xs uppercase text-gray-400 font-bold">Score</div>
            <div className="text-2xl font-mono font-bold text-yellow-400">{score}</div>
          </div>
        </div>
      )}

      {lockedAlert && (
        <div className="absolute top-20 z-[17] bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold animate-fade-in-scale-up">
          {lockedAlert}
        </div>
      )}

      {config.backgroundImage ? (
        <div 
          className="relative inline-block border-2 border-gray-700 shadow-2xl" 
          style={{ maxHeight: '100%', maxWidth: '100%' }} 
          onClick={onMapClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          
          <img ref={imageRef} src={config.backgroundImage} alt="Room" 
               className="max-h-[calc(100vh-10rem)] max-w-full object-contain block select-none" />
          
          {config.hotspots.map(h => {
            const isLocked = h.lockedBy && !solvedIds.includes(h.lockedBy);
            if (isPlayMode && isLocked && h.lockBehavior === 'hidden') return null;
            
            const isSolved = solvedIds.includes(h.id);
            const isGuide = h.type === 'guide';
            const isInteractive = !isPlayMode || !isSolved || isGuide;

            let cursorStyle = '';
            let scaleStyle = '';
            let opacityStyle = '';
            let colorStyle = '';

            if (!isPlayMode) {
              cursorStyle = 'cursor-move';
              scaleStyle = 'hover:scale-125';
            } else {
              if (isInteractive) {
                cursorStyle = 'cursor-pointer';
                scaleStyle = 'hover:scale-110';
              } else {
                cursorStyle = 'cursor-default'; 
                scaleStyle = '';
              }
            }

            if (isSolved) {
              colorStyle = 'bg-green-500 border-green-200 text-white';
              if (isGuide) {
                opacityStyle = 'opacity-100'; 
              } else {
                opacityStyle = 'opacity-60'; 
              }
            } else {
              if (h.isBonus) {
                colorStyle = 'bg-yellow-400 border-yellow-600 text-black';
              } else {
                colorStyle = 'bg-blue-600 border-blue-300 text-white';
              }
              opacityStyle = 'opacity-100';
            }

            return (
              <button 
                key={h.id} 
                onClick={(e) => {
                  if (!isInteractive && isPlayMode) return;
                  onPlayClick(e, h);
                }}
                disabled={isPlayMode && !isInteractive}
                draggable={!isPlayMode}
                onDragStart={(e) => handleDragStart(e, h.id)}
                style={{ top: `${h.y}%`, left: `${h.x}%`, position: 'absolute', transform: 'translate(-50%, -50%)' }}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg z-[12] transition-transform
                  ${cursorStyle} 
                  ${scaleStyle}
                  ${colorStyle}
                  ${opacityStyle}
                `}
                title={h.name}
              >
                {getHotspotIcon(h, isSolved, !!(isPlayMode && isLocked))}
              </button>
            )
          })}
        </div>
      ) : (
        <div 
          onClick={() => emptyStateInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-700 rounded-xl hover:bg-gray-800/50 cursor-pointer transition-colors p-10 text-center"
        >
          <input 
            type="file" 
            ref={emptyStateInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={onImageUpload} 
          />
          <p className="text-xl text-primary font-bold mb-2">No Background Image</p>
          <p className="text-gray-500 text-sm">Upload an image to start.</p>
        </div>
      )}

      {isVictory && isPlayMode && (
        <div className="absolute inset-0 z-[14] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md text-white animate-fade-in-scale-up">
          <h1 className="text-6xl font-bold text-green-500 mb-4">VICTORY!</h1>
          <p className="text-2xl mb-8">You escaped the room.</p>
          <div className="bg-gray-800 p-6 rounded-xl border-2 border-green-500 text-center">
            <p className="text-gray-400 uppercase text-sm">Final Score</p>
            <p className="text-4xl font-mono font-bold text-yellow-400 mb-4">{score}</p>
            <button onClick={onBackToEditor} className="bg-primary text-background px-6 py-2 rounded font-bold hover:opacity-90">
              Back to Editor
            </button>
          </div>
        </div>
      )}

      {isGameOver && isPlayMode && (
        <div className="absolute inset-0 z-[13] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md text-white animate-fade-in-scale-up">
          <h1 className="text-6xl font-bold text-red-600 mb-4">GAME OVER</h1>
          <p className="text-2xl mb-8">You ran out of time.</p>
          <div className="bg-gray-800 p-6 rounded-xl border-2 border-red-600 text-center">
            <p className="text-gray-400 uppercase text-sm">Final Score</p>
            <p className="text-4xl font-mono font-bold text-white mb-4">{score}</p>
            <button onClick={onRestart} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 cursor-pointer">
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}