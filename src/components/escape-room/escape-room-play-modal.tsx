"use client";

import { useState, useEffect } from 'react';
import type { Hotspot } from '@/lib/types';

interface EscapeRoomPlayModalProps {
  hotspot: Hotspot | null;
  onClose: () => void;
  onSolve: (id: string, points: number) => void;
  onPenalty: () => void;
  penaltySeconds: number;
}

export default function EscapeRoomPlayModal({ 
  hotspot,
  onClose,
  onSolve,
  onPenalty,
  penaltySeconds = 30
}: EscapeRoomPlayModalProps) {
  const [input, setInput] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  const [solvedProcessed, setSolvedProcessed] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hotspot) {
      setInput("");
      setSelectedOptions([]);
      setError("");
      setIsSolved(false);
      setSolvedProcessed(false);
      if (timerId) {
        clearTimeout(timerId);
        setTimerId(null);
      }
    }
  }, [hotspot?.id]);

  if (!hotspot) return null;

  const finish = () => {
    if (timerId) clearTimeout(timerId);
    if (!solvedProcessed) {
      setSolvedProcessed(true);
      onSolve(hotspot.id, hotspot.points);
    }
    setInput("");
    setSelectedOptions([]);
    setIsSolved(false);
    setSolvedProcessed(false);
    onClose();
  };

  const handleSubmit = () => {
    if (isSolved || solvedProcessed) return;

    let correct = false;
    if (hotspot.type === 'guide') {
      finish();
      return;
    }
    else if (hotspot.type === 'mcq_single') correct = input === hotspot.content.solution;
    else if (hotspot.type === 'code') correct = input.trim() === hotspot.content.solution.trim();
    else if (hotspot.type === 'mcq_multi') {
      try {
        const solutions = JSON.parse(hotspot.content.solution);
        correct = selectedOptions.length === solutions.length && selectedOptions.every(val => solutions.includes(val));
      } catch { correct = false; }
    }

    if (correct) {
      setIsSolved(true);
      const id = setTimeout(() => {
        finish();
      }, 1500);
      setTimerId(id);
    } else {
      setError(`Incorrect! -${penaltySeconds} Seconds`);
      onPenalty();
    }
  };

  const toggleOption = (opt: string) => {
    setSelectedOptions(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
    setError("");
  };

  return (
    <div 
      className="fixed inset-0 z-18 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>

      <div 
        onClick={() => isSolved && finish()} 
        className={`
          w-full max-w-lg p-6 rounded-xl shadow-2xl border-4 text-center transition-all flex flex-col max-h-[90vh] animate-fade-in-scale-up
          ${isSolved ? 'bg-green-100 border-green-500 scale-105 cursor-pointer' : 'bg-background border-primary'}
        `}
      >
        {isSolved ? (
          <div className="py-8">
            <h2 className="text-3xl font-bold text-green-700 mb-2">✅ Correct!</h2>
            <p className="text-sm font-bold mt-4 text-green-600">+{hotspot.points} Points</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2 flex-none">
              <span className="font-bold uppercase text-xs tracking-widest text-gray-500">
                {hotspot.type === 'code' ? '💻 Code Challenge' : hotspot.type === 'guide' ? '📜 Guide' : '❓ Multiple Choice'}
              </span>
              <button onClick={onClose} className="text-red-500 hover:text-red-700 font-bold">✕</button>
            </div>

            <div className="flex-grow overflow-y-auto mb-6 text-left">
              <h3 className="text-xl font-bold whitespace-pre-wrap break-words">{hotspot.content.question}</h3>
            </div>

            <div className="flex-none">
                {hotspot.type === 'guide' && (
                  <button onClick={handleSubmit} className="w-full mt-4 py-3 bg-primary text-background rounded font-bold">Got it</button>
                )}
                {hotspot.type === 'code' && (
                  <div>
                    <textarea value={input} onChange={e => setInput(e.target.value)}
                      className="w-full h-32 p-3 bg-gray-900 text-green-400 font-mono text-sm rounded border-2 border-gray-700 outline-none"
                      placeholder="Type your answer here..." />
                    <button onClick={handleSubmit} disabled={!input} className="w-full mt-4 py-3 bg-primary text-background rounded font-bold disabled:opacity-50">Submit Answer</button>
                  </div>
                )}
                 {hotspot.type === 'mcq_single' && (
                  <div className="space-y-2">
                    {hotspot.content.options?.map((opt, i) => (
                      <button key={i} onClick={() => { setInput(opt); setError(""); }}
                        className={`w-full p-3 rounded border-2 font-medium transition-all ${input === opt ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200 hover:border-blue-300'}`}>
                        {opt}
                      </button>
                    ))}
                    <button onClick={handleSubmit} disabled={!input} className="w-full mt-4 py-3 bg-primary text-background rounded font-bold disabled:opacity-50">Submit Answer</button>
                  </div>
                )}
                {hotspot.type === 'mcq_multi' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 italic mb-2">Select all that apply:</p>
                    {hotspot.content.options?.map((opt, i) => (
                      <button key={i} onClick={() => toggleOption(opt)}
                        className={`w-full p-3 rounded border-2 font-medium transition-all flex justify-between items-center ${selectedOptions.includes(opt) ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200 hover:border-blue-300'}`}>
                        <span>{opt}</span>{selectedOptions.includes(opt) && <span>✓</span>}
                      </button>
                    ))}
                    <button onClick={handleSubmit} disabled={selectedOptions.length === 0} className="w-full mt-4 py-3 bg-primary text-background rounded font-bold disabled:opacity-50">Submit Answer</button>
                  </div>
                )}
            </div>

            {error && <p className="text-red-600 font-bold mt-3 animate-pulse">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}