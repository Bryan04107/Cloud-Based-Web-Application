"use client";

import { useState, useEffect } from 'react';
import type { EscapeRoomConfig } from '@/lib/types';
import EscapeRoomEditorPage from '@/components/escape-room/escape-room-editor-page';
import DeleteModal from '@/components/escape-room/escape-room-delete-modal';

export default function EscapeRoomRoot() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [rooms, setRooms] = useState<EscapeRoomConfig[]>([]);
  const [activeRoom, setActiveRoom] = useState<EscapeRoomConfig | undefined>(undefined);
  const [roomToDelete, setRoomToDelete] = useState<EscapeRoomConfig | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('escape-rooms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRooms(parsed);
        }
      } catch (e) {
        console.error("Failed to load rooms", e);
      }
    }
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      localStorage.setItem('escape-rooms', JSON.stringify(rooms));
    }
  }, [rooms]);

  const handleCreateNew = () => {
    setActiveRoom(undefined);
    setView('editor');
  };

  const handleEdit = (room: EscapeRoomConfig) => {
    setActiveRoom(room);
    setView('editor');
  };

  const handleDeleteClick = (room: EscapeRoomConfig) => {
    setRoomToDelete(room);
  };

  const confirmDelete = () => {
    if (!roomToDelete) return;
    const newRooms = rooms.filter(r => r.id !== roomToDelete.id);
    setRooms(newRooms);
    if (newRooms.length === 0) localStorage.removeItem('escape-rooms');
    else localStorage.setItem('escape-rooms', JSON.stringify(newRooms));
    setRoomToDelete(null);
  };

  const handleSaveRoom = (updatedRoom: EscapeRoomConfig) => {
    setRooms(prev => {
      const exists = prev.find(r => r.id === updatedRoom.id);
      if (exists) {
        return prev.map(r => r.id === updatedRoom.id ? updatedRoom : r);
      }
      return [...prev, updatedRoom];
    });
  };

  if (view === 'dashboard') {
    return (
      <div className="container p-8 px-24 min-w-full max-h-[calc(100vh-106.74px-63.99px)] overflow-y-auto">
        <div className="flex flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">My Escape Rooms</h1>
          </div>
          <button 
            onClick={handleCreateNew}
            className="bg-button text-primary px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-shade border-2 border-primary transition-transform hover:scale-105 cursor-pointer"
          >
            [+] Create New Room
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center p-20 border-4 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-xl text-gray-500 mb-4">No rooms created yet.</p>
            <button onClick={handleCreateNew} className="text-blue-600 font-bold underline text-lg">Get Started</button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {rooms.map(room => {
              const totalPoints = room.hotspots.reduce((sum, h) => sum + (h.points || 0), 0);
              const bonusPoints = room.hotspots
                .filter(h => h.isBonus)
                .reduce((sum, h) => sum + (h.points || 0), 0);
              return (
              <div key={room.id} className="bg-background border-2 border-primary rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col">
                <div className="h-45 bg-gray-200 relative border-b border-primary/20">
                  {room.backgroundImage ? (
                    <img src={room.backgroundImage} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/70 bg-background/90">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded font-bold backdrop-blur-sm">
                    <div className="flex flex-col items-end justify-between text-sm px-1 text-primary/80">
                      <span>⏱️ {room.timerMinutes} Minutes</span>
                      <span>❌ {room.penaltySeconds} Seconds</span>
                      <span>🧩 {room.hotspots.length} Puzzles</span>
                      <span>💎 {totalPoints} Points</span>
                      {bonusPoints > 0 && (
                        <span className="text-green-500/60 text-xs">({bonusPoints} Bonus)</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex-grow">
                  <h3 className="text-xl font-bold mb-1 truncate" title={room.title}>{room.title}</h3>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <button 
                    onClick={() => handleEdit(room)}
                    className="flex-1 bg-button text-primary border border-primary/50 py-2 rounded font-bold hover:bg-shade transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(room)}
                    className="px-3 py-2 border border-red-200 text-red-500 rounded hover:bg-red-50 hover:border-red-500 transition-colors cursor-pointer"
                    title="Delete Room"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}

        <DeleteModal
          isOpen={!!roomToDelete}
          onClose={() => setRoomToDelete(null)}
          onConfirm={confirmDelete}
          title={roomToDelete?.title || "Unknown Room"}
          itemType="Room"
        />
      </div>
    );
  }

  return (
    <EscapeRoomEditorPage
      initialConfig={activeRoom} 
      onSave={handleSaveRoom} 
      onBack={() => setView('dashboard')} 
    />
  );
}