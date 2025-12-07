"use client";

import { RefObject, useState } from 'react';
import type { EscapeRoomConfig, Hotspot } from '@/lib/types';

interface EscapeRoomBuilderPanelProps {
  config: EscapeRoomConfig;
  setConfig: React.Dispatch<React.SetStateAction<EscapeRoomConfig>>;
  isPlayMode: boolean;
  togglePlayMode: (play: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
  onAddHotspot: () => void;
  onEditHotspot: (h: Hotspot) => void;
  onDeleteHotspot: (id: string) => void;
  onBack: () => void;
  onSave: () => void;
}

export default function EscapeRoomBuilderPanel({
  config,
  setConfig,
  isPlayMode,
  togglePlayMode,
  fileInputRef,
  onImageUpload,
  onDownload,
  onAddHotspot,
  onEditHotspot,
  onDeleteHotspot,
  onBack,
  onSave
}: EscapeRoomBuilderPanelProps) {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);

  return (
    <div className="w-full md:w-1/3 bg-background border-b-2 md:border-b-0 md:border-r-2 border-primary flex flex-col h-auto md:h-full shrink-0 overflow-hidden relative">
      <div className="flex-none p-4 pb-2 z-10 bg-background border-b border-primary/10 flex items-center justify-between gap-2">
        <button onClick={onBack} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors cursor-pointer">
          ← Back
        </button>
        
        <div className="flex flex-row gap-4">
          <button 
            onClick={onSave} 
            className="p-2 bg-primary rounded shadow-md hover:bg-shade transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
            title="Save Changes"
          >
            💾
          </button>
          
          <button 
            onClick={onDownload} 
            disabled={config.hotspots.length === 0}
            className="p-2 bg-primary rounded shadow-md hover:bg-shade transition-colors disabled:opacity-50 flex items-center justify-center w-8 h-8 cursor-pointer"
            title="Export Escape room"
            >
            ⬇
          </button>
        </div>
      </div>

      <div className="flex-none px-4 bg-background py-2 border-b border-primary/10 z-11">
        <div className="flex bg-hover p-1 rounded-lg border border-primary/20">
          <button 
            onClick={() => togglePlayMode(false)} 
            className={`flex-1 py-1 rounded-md text-sm font-bold cursor-pointer 
              ${!isPlayMode ? 'bg-primary text-background' : 'text-gray-500 hover:bg-black/20'}`}
            title="Edit Escape Room"
          >
            Edit
          </button>
          <button
            onClick={() => config.backgroundImage && togglePlayMode(true)}
            disabled={!config.backgroundImage}
            className={`flex-1 py-1 rounded-md text-sm font-bold
              ${isPlayMode
                ? 'bg-green-600 text-white'
                : !config.backgroundImage
                  ? 'text-gray-400 cursor-not-allowed opacity-50 bg-black/20'
                  : 'text-gray-500 hover:bg-black/20 cursor-pointer'
              }`}
            title={!config.backgroundImage ? "Upload a background image to enable playtest" : "Playtest Escape Room"}
          >
            Playtest
          </button>
        </div>
      </div>

      <div className={`flex flex-col flex-grow min-h-0 transition-all duration-300 ${isPlayMode ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
        <div className="flex-none px-4 border-b border-primary/10">
          <div className={`flex justify-between items-center py-2 border-b transition-all duration-300 ${isSettingsExpanded ? 'border-primary/20 mb-2' : 'border-primary/0 mb-0'}`}>   
          <h2 className="text-xl font-bold">Room Settings</h2>
          <button 
            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            className="text-primary bg-button hover:bg-hover w-7 h-7 flex items-center justify-center rounded transition-colors font-extrabold cursor-pointer text-2xl border border-primary/20"
            title={isSettingsExpanded ? "Shrink Settings" : "Expand Settings"}
          >
            {isSettingsExpanded ? '↑' : '↓'}
          </button>
        </div>

        <div className={`space-y-2 overflow-hidden px-2 transition-all duration-300 ${isSettingsExpanded ? 'max-h-90 opacity-100 pb-4' : 'max-h-0 opacity-0 pb-0'}`}>  
          <div>
            <label className="block font-bold mb-1 text-sm">Room Title</label>
            <input type="text" value={config.title} onChange={(e) => setConfig({...config, title: e.target.value})} 
              className="w-full  p-2 border-2 border-primary rounded bg-transparent" />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm">Timer (Minutes)</label>
            <input 
              type="number" 
              min="1" 
              value={config.timerMinutes} 
              onChange={(e) => setConfig({...config, timerMinutes: Math.max(1, parseInt(e.target.value) || 1)})} 
              className="w-full p-2 border-2 border-primary rounded bg-transparent" 
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm">Penalty (Seconds)</label>
            <input 
              type="number" 
              min="0" 
              value={config.penaltySeconds}
              onChange={(e) => setConfig({...config, penaltySeconds: Math.max(0, parseInt(e.target.value) || 0)})} 
              className="w-full p-2 border-2 border-primary rounded bg-transparent" 
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm">Background Image</label>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-button hover:bg-shade text-primary py-2 px-3 rounded border border-primary/50 text-sm cursor-pointer">
              {config.backgroundImage ? '🔄 Change Image' : '📁 Upload Image'}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onImageUpload} />
          </div>
        </div>
      </div>

        <div className="flex flex-col flex-grow min-h-0 p-4 pt-2">
          <div className="flex justify-between items-center mb-2 flex-none">
            <h2 className="text-xl font-bold">Hotspots</h2>
            <button 
              onClick={onAddHotspot}
              className="text-primary bg-button hover:bg-hover w-7 h-7 flex items-center justify-center rounded transition-colors font-bold cursor-pointer text-sm border border-primary/20"
              title="Add Hotspot"
            >
              [+]
            </button>
          </div>
          <div className="space-y-2 overflow-y-auto container-scrollbar flex-grow pr-1 max-h-60 md:max-h-none">
            {config.hotspots.length === 0 && <p className="text-gray-500 italic text-sm">No hotspots added.</p>}
            {config.hotspots.map(h => (
              <div key={h.id} className="flex justify-between items-center rounded border border-transparent bg-hover hover:border-primary group text-sm">
                <span 
                  className="truncate p-2 flex-1 font-medium cursor-pointer" 
                  onClick={() => onEditHotspot(h)}
                  title="Edit Hotspot"
                  >
                  {h.lockedBy && (
                    <span className="mr-1" title={h.lockBehavior === 'hidden' ? "Hidden until unlocked" : "Visible but locked"}>
                      {h.lockBehavior === 'hidden' ? "👁️" : "🔒"}
                    </span>
                  )}
                  {h.name}
                </span>
                <button 
                  onClick={() => onDeleteHotspot(h.id)} 
                  className="text-red-500 hover:bg-red-100 rounded font-bold text-xl m-1 px-2 cursor-pointer"
                  title="Delete Hotspot"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}