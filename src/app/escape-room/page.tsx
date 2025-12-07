"use client";

import { useState, useEffect } from 'react';
import type { EscapeRoomConfig } from '@/lib/types';
import EscapeRoomEditorPage from '@/components/escape-room/escape-room-editor-page';
import DeleteModal from '@/components/escape-room/escape-room-delete-modal';
import SkeletonCard from '@/components/escape-room/escape-room-skeleton-card';
import { toast } from 'sonner';

export default function EscapeRoomRoot() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [rooms, setRooms] = useState<EscapeRoomConfig[]>([]);
  const [activeRoom, setActiveRoom] = useState<EscapeRoomConfig | undefined>(undefined);
  const [roomToDelete, setRoomToDelete] = useState<EscapeRoomConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch('/api/escape-rooms');
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      } catch (error) {
        toast.error('Failed to fetch rooms.', {description: 'Please the reload page or try again later.',});
      } finally {
        setIsLoading(false);
      }
    }
    fetchRooms();
  }, []);

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

  const confirmDelete = async () => {
      if (!roomToDelete) return;
      const previousRooms = [...rooms];
      const newRooms = rooms.filter(r => r.id !== roomToDelete.id);
      setRooms(newRooms);
      const idToDelete = roomToDelete.id;
      setRoomToDelete(null);
      toast.success('Room deleted successfully!');

      try {
        const res = await fetch(`/api/escape-rooms/${idToDelete}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Server failed to delete');
        }
      } catch (error) {
        console.error("Failed to delete room", error);
        setRooms(previousRooms);
        toast.error('Could not delete room.', {description: 'Deleted room was restored.',}); 
    }
  };

  const handleSaveRoom = async (updatedRoom: EscapeRoomConfig) => {
    try {
      let savedRoom;
      const exists = rooms.find(r => r.id === updatedRoom.id);

      if (exists && updatedRoom.id) {
        const res = await fetch(`/api/escape-rooms/${updatedRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRoom),
        });
        savedRoom = await res.json();
      } else {
        const res = await fetch('/api/escape-rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRoom),
        });
        savedRoom = await res.json();
      }

      setRooms(prev => {
        const exists = prev.find(r => r.id === savedRoom.id);
        if (exists) {
          return prev.map(r => r.id === savedRoom.id ? savedRoom : r);
        }
        return [...prev, savedRoom];
      });
      
    } catch (error) {
      console.error("Failed to save room", error);
    }
  };

  if (view === 'dashboard') {
    return (
      <div className={`container p-4 md:py-8 md:px-24 min-w-full max-h-[calc(100vh-73.49px-55.99px)] md:max-h-[calc(100vh-113.47px-55.99px)] ${isLoading ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div className="flex flex-row justify-between items-center mb-4 md:mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">My Escape Rooms</h1>
          </div>
            <button 
              onClick={handleCreateNew}
              aria-label="Create New Room"
              title="Create New Room"
              className="bg-button text-primary px-3 md:px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-shade border-2 border-primary transition-transform hover:scale-105 cursor-pointer"
            >
              <span className="md:hidden">[+]</span>
              <span className="hidden md:inline">[+] Create New Room</span>
            </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div onClick={handleCreateNew} className="text-center p-20 py-40 border-4 border-dashed border-gray-700 hover:bg-gray-800/50 rounded-xl bg-hover cursor-pointer">
            <p className="text-2xl text-primary font-bold mb-2">No rooms created yet.</p>
          <p className="text-gray-500 text-m">Create new room?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => {
              const totalPoints = room.hotspots.reduce((sum, h) => sum + (h.points || 0), 0);
              const bonusPoints = room.hotspots
                .filter(h => h.isBonus)
                .reduce((sum, h) => sum + (h.points || 0), 0);
              return (
              <div key={room.id} className="bg-background border-2 border-primary rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col">
                <div className="h-45 bg-gray-200 relative border-b border-primary/70">
                  {room.backgroundImage ? (
                    <img src={room.backgroundImage} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/70 bg-background/90">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 bg-shade/70 text-white p-1 rounded font-bold backdrop-blur-sm">
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