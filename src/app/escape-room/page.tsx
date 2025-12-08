"use client";

import { useState, useEffect, useMemo } from 'react';
import type { EscapeRoomConfig, Hotspot } from '@/lib/types';
import EscapeRoomEditorPage from '@/components/escape-room/escape-room-editor-page';
import DeleteModal from '@/components/escape-room/escape-room-delete-modal';
import SkeletonCard from '@/components/escape-room/escape-room-skeleton-card';
import { toast } from 'sonner';
import type { EscapeRoom } from '@prisma/client';

type SortOption = 'newest' | 'oldest' | 'az' | 'za' | 'puzzles' | 'time' | 'penalty' | 'points';

export default function EscapeRoomPage() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [rooms, setRooms] = useState<EscapeRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<EscapeRoomConfig | undefined>(undefined);
  const [roomToDelete, setRoomToDelete] = useState<EscapeRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('newest');

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

  const handleEdit = (room: EscapeRoom) => {
    try {
      let parsedHotspots: Hotspot[] = [];

      if (Array.isArray(room.hotspots)) {
        parsedHotspots = room.hotspots;
      } else if (typeof room.hotspots === 'string') {
        parsedHotspots = JSON.parse(room.hotspots);
      }

      const editorConfig: EscapeRoomConfig = {
        ...room,
        hotspots: parsedHotspots
      };
      setActiveRoom(editorConfig);
      setView('editor');
    } catch (e) {
      console.error("Edit Error:", e);
      toast.error("Error opening room: Data is corrupted.");
    }
  };

  const handleDeleteClick = (room: EscapeRoom) => {
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
      toast.error('Could not delete room.', { description: 'Deleted room was restored.' });
    }
  };

  const handleSaveRoom = async (updatedRoom: EscapeRoomConfig) => {
    try {
      const payload = {
        ...updatedRoom,
        hotspots: JSON.stringify(updatedRoom.hotspots)
      };

      let savedRoom: EscapeRoom;
      const exists = rooms.find(r => r.id === updatedRoom.id);

      if (exists && updatedRoom.id) {
        const res = await fetch(`/api/escape-rooms/${updatedRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        savedRoom = await res.json();
      } else {
        const res = await fetch('/api/escape-rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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
      toast.error("Failed to save room.");
    }
  };

  const getRoomStats = (room: EscapeRoom) => {
    try {
      let hotspots: Hotspot[] = [];
      
      if (Array.isArray(room.hotspots)) {
        hotspots = room.hotspots;
      } 
      else if (typeof room.hotspots === 'string') {
        hotspots = JSON.parse(room.hotspots);
      }

      const points = hotspots.reduce((sum: number, h: Hotspot) => sum + (h.points || 0), 0);
      return { count: hotspots.length, points };
    } catch (e) {
      console.error("Stats Error:", e);
      return { count: 0, points: 0 };
    }
  };

  const processedRooms = useMemo(() => {
    const result = rooms.filter(r =>
      (r.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      const statsA = getRoomStats(a);
      const statsB = getRoomStats(b);
      const titleA = a.title || "";
      const titleB = b.title || "";

      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'az': return titleA.localeCompare(titleB);
        case 'za': return titleB.localeCompare(titleA);
        case 'puzzles': return statsB.count - statsA.count;
        case 'points': return statsB.points - statsA.points;
        case 'time': return b.timerMinutes - a.timerMinutes;
        case 'penalty': return b.penaltySeconds - a.penaltySeconds;
        default: return 0;
      }
    });

    return result;
  }, [rooms, searchQuery, sortBy]);

  if (view === 'dashboard') {
    return (
      <div style={{ scrollbarGutter: 'stable' }} className={`container p-4 md:py-8 md:px-24 min-w-full max-h-[calc(100vh-73.49px-55.99px)] md:max-h-[calc(100vh-113.47px-55.99px)] ${isLoading ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">My Escape Rooms</h1>

          <div className="flex flex-1 max-w-full gap-2 w-full">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input 
                type="text" 
                placeholder="Search rooms..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full pl-9 pr-4 py-2 rounded bg-background border border-primary/30 focus:border-primary outline-none transition-colors"
              />
            </div>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="lg:hidden p-2 rounded bg-button text-primary font-bold border border-primary/30 cursor-pointer hover:bg-shade outline-none appearance-none text-center min-w-[3rem]"
              title="Sort By"
            >
              <option value="newest">📅↓</option>
              <option value="oldest">📅↑</option>
              <option value="az">🔠↓</option>
              <option value="za">🔠↑</option>
              <option value="puzzles">🧩↓</option>
              <option value="points">💎↓</option>
              <option value="time">⏳↓</option>
              <option value="penalty">❌↓</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="hidden lg:block p-2 rounded bg-button text-primary font-bold border border-primary/30 cursor-pointer hover:bg-shade outline-none appearance-none text-left"
              title="Sort By"
            >
              <option value="newest">📅 Newest</option>
              <option value="oldest">📅 Oldest</option>
              <option value="az">🔠 A-Z</option>
              <option value="za">🔠 Z-A</option>
              <option value="puzzles">🧩 Most Puzzles</option>
              <option value="points">💎 Most Points</option>
              <option value="time">⏳ Longest Time</option>
              <option value="penalty">❌ Highest Penalty</option>
            </select>

            <button 
              onClick={handleCreateNew}
              aria-label="Create New Room"
              title="Create New Room"
              className="bg-button text-primary p-2 rounded font-bold shadow-lg hover:bg-shade border border-primary/30 transition-transform cursor-pointer whitespace-nowrap"
            >
              <span className="lg:hidden">[+]</span>
              <span className="hidden lg:inline">[+] Create New Room</span>
            </button>
          </div>
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
        ) : processedRooms.length === 0 ? (
          <div className="text-center p-20 border-2 border-transparent rounded-xl">
             <p className="text-2xl text-primary font-bold mb-2">No results found.</p>
             <button 
               onClick={() => {setSearchQuery(""); setSortBy('newest');}} 
               className="mt-4 text-primary underline hover:text-primary/50 cursor-pointer"
             >
               Clear Searchbar
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedRooms.map(room => {
              let parsedHotspots: Hotspot[] = [];
              try {
                if (Array.isArray(room.hotspots)) {
                  parsedHotspots = room.hotspots;
                } else if (typeof room.hotspots === 'string') {
                  parsedHotspots = JSON.parse(room.hotspots);
                }
              } catch (e) {
                console.error("Grid Parse Error:", e);
                parsedHotspots = [];
              }

              const totalPoints = parsedHotspots.reduce((sum, h) => sum + (h.points || 0), 0);
              const bonusPoints = parsedHotspots
                .filter((h: Hotspot) => h.isBonus)
                .reduce((sum, h) => sum + (h.points || 0), 0);

              return (
                <div key={room.id} className="bg-background border-2 border-primary rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col">
                  <div className="h-45 bg-gray-200 relative border-b border-primary/70">
                    {room.backgroundImage ? (
                      <img src={room.backgroundImage} className="w-full h-full object-cover" alt="Preview" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/70 bg-background/90">No Image</div>
                    )}
                    <div className="absolute top-2 right-2 bg-shade/70 text-white p-1 rounded font-bold backdrop-blur-sm">
                      <div className="flex flex-col items-end justify-between text-sm px-1 text-primary/80">
                        <span>⏱️ {room.timerMinutes} Minutes</span>
                        <span>❌ {room.penaltySeconds} Seconds</span>
                        <span>🧩 {parsedHotspots.length} Puzzles</span>
                        <span>💎 {totalPoints} Points</span>
                        {bonusPoints > 0 && (
                          <span className="text-green-500/60 text-xs">({bonusPoints} Bonus)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-grow">
                    <h2 className="text-xl font-bold mb-1 truncate" title={room.title}>{room.title}</h2>
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