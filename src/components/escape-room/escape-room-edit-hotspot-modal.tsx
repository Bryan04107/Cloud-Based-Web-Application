"use client";

import { useState, useEffect } from 'react';
import type { Hotspot, HotspotType } from '@/lib/types';
import { toast } from 'sonner';

interface EscapeRoomEditHotspotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotspot: Hotspot) => void;
  onDelete: (id: string) => void;
  hotspotToEdit?: Hotspot;
  existingHotspots: Hotspot[];
}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const initialData: Hotspot = {
  id: "",
  name: "New Puzzle",
  x: 50,
  y: 50,
  type: 'guide',
  isBonus: false,
  points: 0,
  lockBehavior: 'visible_locked',
  content: { question: "", solution: "", options: [] }
};

export default function EscapeRoomEditHotspotModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  hotspotToEdit,
  existingHotspots
}: EscapeRoomEditHotspotModalProps) {
  const [formData, setFormData] = useState<Hotspot>(initialData);
  const [newOption, setNewOption] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      if (hotspotToEdit) {
        setFormData(hotspotToEdit);
      } else {
        setFormData({ ...initialData, id: generateId() });
      }
    }
  }, [isOpen, hotspotToEdit]);

  const addOption = () => {
    const trimmed = newOption.trim();
    if (trimmed) {
      const currentOptions = formData.content.options || [];
      if (currentOptions.includes(trimmed)) {
        setErrorMsg("Error: That option already exists.");
        return;
      }
      setFormData(prev => ({
        ...prev,
        content: { ...prev.content, options: [...currentOptions, trimmed] }
      }));
      setNewOption("");
      setErrorMsg(null);
    }
  };

  const removeOption = (index: number) => {
    setFormData(prev => {
      const currentOpts = prev.content.options || [];
      const optionToRemove = currentOpts[index];
      const newOpts = currentOpts.filter((_, i) => i !== index);
      let newSolution = prev.content.solution;
      if (prev.type === 'mcq_single' && newSolution === optionToRemove) {
        newSolution = "";
      } else if (prev.type === 'mcq_multi') {
        try {
          const sols = JSON.parse(newSolution || "[]") as string[];
          newSolution = JSON.stringify(sols.filter(s => s !== optionToRemove));
        } catch { newSolution = "[]"; }
      }
      return { ...prev, content: { ...prev.content, options: newOpts, solution: newSolution } };
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) return;
    const currentOpts = [...(formData.content.options || [])];
    const itemToMove = currentOpts[draggedIdx];
    currentOpts.splice(draggedIdx, 1);
    currentOpts.splice(dropIndex, 0, itemToMove);
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, options: currentOpts }
    }));
    setDraggedIdx(null);
  };

  const toggleCorrectOption = (opt: string) => {
    let currentSolutions: string[] = [];
    try {
      currentSolutions = JSON.parse(formData.content.solution || "[]");
    } catch { currentSolutions = []; }

    if (currentSolutions.includes(opt)) {
      currentSolutions = currentSolutions.filter(s => s !== opt);
    } else {
      currentSolutions.push(opt);
    }
    setFormData(prev => ({ ...prev, content: { ...prev.content, solution: JSON.stringify(currentSolutions) } }));
  };

  const handleValidateAndSave = () => {
    setErrorMsg(null);
    if (!formData.name.trim()) { setErrorMsg("Error: Please give this hotspot a name."); return; }
    if (!formData.content.question.trim()) { setErrorMsg("Error: The Question/Prompt cannot be empty."); return; }
    if (formData.type === 'code') {
      if (!formData.content.solution || !formData.content.solution.trim()) { setErrorMsg("Error: Code Challenges require an expected answer."); return; }
    }
    if (formData.type === 'mcq_single') {
      const opts = formData.content.options || [];
      if (opts.length < 2) { setErrorMsg("Error: Multiple Choice requires at least 2 options."); return; }
      if (!formData.content.solution) { setErrorMsg("Error: You must select which option is the Correct Answer."); return; }
    }
    if (formData.type === 'mcq_multi') {
      const opts = formData.content.options || [];
      if (opts.length < 2) { setErrorMsg("Error: Multi-Select requires at least 2 options."); return; }
      try {
        const sol = JSON.parse(formData.content.solution || "[]");
        if (sol.length === 0) { setErrorMsg("Error: Select at least one correct option."); return; }
      } catch { setErrorMsg("Error: Invalid solution format."); return; }
    }
    onSave(formData);
    toast.success(hotspotToEdit ? 'Puzzle succesfully updated!' : 'Puzzle succesfully created!');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-15 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>  
      <div className="bg-background border-2 border-primary rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-primary flex flex-col animate-fade-in-scale-up">
        <h2 className="text-2xl font-bold mb-4">{hotspotToEdit ? 'Edit Hotspot' : 'Add New Hotspot'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Name</label>
              <input type="text" className="w-full p-2 border border-primary rounded bg-hover"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Type</label>
              <select className="w-full p-2 border border-primary rounded bg-button"
                value={formData.type} onChange={e => {
                  const newType = e.target.value as HotspotType;
                  setFormData({ 
                    ...formData, 
                    type: newType,
                    points: newType === 'guide' ? 0 : (formData.points || 10)
                  });
                  setErrorMsg(null);
                }}>
                <option value="guide">Text Guide</option>
                <option value="code">Code Challenge</option>
                <option value="mcq_single">MCQ (Single Choice)</option>
                <option value="mcq_multi">MCQ (Multi Choice)</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block text-xs font-bold mb-1">X (%)</label>
                <input type="number" min="0" max="100" className="w-full p-2 border border-primary rounded bg-hover"
                  value={formData.x} onChange={e => setFormData({ ...formData, x: Math.min(100, Math.max(0, Number(e.target.value))) })} />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-bold mb-1">Y (%)</label>
                <input type="number" min="0" max="100" className="w-full p-2 border border-primary rounded bg-hover"
                  value={formData.y} onChange={e => setFormData({ ...formData, y: Math.min(100, Math.max(0, Number(e.target.value))) })} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Question Prerequisites</label>
              <select className="w-full p-2 border border-primary rounded bg-button"
                value={formData.lockedBy || ""} onChange={e => setFormData({ ...formData, lockedBy: e.target.value || undefined })}>
                <option value="">None</option>
                {existingHotspots.filter(h => h.id !== formData.id).map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            
            {formData.lockedBy && (
              <div className="bg-hover p-2 py-1 rounded border border-primary/20 animate-fade-in-scale-up">
                <label className="block text-xs font-bold mb-1 pb-1">Lock Behavior</label>
                <div className="flex flex-col space-y-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="lockBehavior" checked={formData.lockBehavior === 'hidden'}
                      onChange={() => setFormData({...formData, lockBehavior: 'hidden'})} />
                    <span className="text-sm">Invisible until unlocked</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="lockBehavior" checked={formData.lockBehavior === 'visible_locked'}
                      onChange={() => setFormData({...formData, lockBehavior: 'visible_locked'})} />
                    <span className="text-sm">Visible but locked (shows 🔒 icon)</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between bg-hover p-2 py-1 rounded border border-primary/20">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={formData.isBonus} onChange={e => setFormData({ ...formData, isBonus: e.target.checked })} className="w-4 h-4" />
                <span className="font-bold text-sm">Bonus?</span>
              </label>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold ${formData.type === 'guide' ? 'opacity-50' : ''}`}>PTS:</span>
                <input 
                  type="number" 
                  min="0" 
                  className={`w-12 p-1 border border-primary rounded bg-background text-right ${formData.type === 'guide' ? 'opacity-50 cursor-not-allowed text-gray-500' : ''}`}
                  value={formData.points} 
                  disabled={formData.type === 'guide'}
                  onChange={e => setFormData({ ...formData, points: Number(e.target.value) })} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 flex-grow">
          <h3 className="font-bold border-b border-primary pb-1">Content</h3>
          <div>
            <label className="block text-xs font-bold mb-1">Question / Text <span className="text-red-500">*</span></label>
            <textarea className="w-full p-2 border border-primary rounded bg-hover h-20 text-sm focus:border-blue-500 outline-none"
              value={formData.content.question} onChange={e => {
                setFormData({ ...formData, content: { ...formData.content, question: e.target.value } });
                if(e.target.value) setErrorMsg(null);
              }}
              placeholder="Enter the challenge description here..." />
          </div>

          {(formData.type === 'mcq_single' || formData.type === 'mcq_multi') && (
            <div className="bg-hover p-3 rounded border border-primary/30 space-y-3 animate-fade-in-scale-up">
              <label className="block text-xs font-bold">
                {formData.type === 'mcq_single' ? 'Options (Select 1 Correct)' : 'Options (Select 1 or more Correct)'} <span className="text-red-500">*</span>
              </label>
              
              <ul className="space-y-2">
                {formData.content.options?.map((opt, idx) => {
                  let isCorrect = false;
                  if (formData.type === 'mcq_single') {
                    isCorrect = formData.content.solution === opt;
                  } else {
                    try {
                      isCorrect = JSON.parse(formData.content.solution || "[]").includes(opt);
                    } catch { isCorrect = false; }
                  }

                  return (
                    <li
                      key={idx}
                      className={`flex items-center space-x-2 p-1 rounded border 
                      ${isCorrect ? 'bg-green-50/60 border-green-300/60' : 'bg-background border-primary/10'}
                      ${draggedIdx === idx ? 'opacity-50 border-dashed border-primary' : ''}
                      `}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e)}
                      onDrop={(e) => handleDrop(e, idx)}
                    >
                      <div className="cursor-grab p-1 text-primary/50 hover:text-primary active:cursor-grabbing" title="Drag to reorder">
                        <svg width="12" height="20" viewBox="0 0 6 12" fill="currentColor">
                          <circle cx="2" cy="2" r="1"/>
                          <circle cx="5" cy="2" r="1"/>
                          <circle cx="2" cy="6" r="1"/>
                          <circle cx="5" cy="6" r="1"/>
                          <circle cx="2" cy="10" r="1"/>
                          <circle cx="5" cy="10" r="1"/>
                        </svg>
                      </div>
                      <button onClick={() => removeOption(idx)} className="text-red-500 hover:bg-red-100 rounded px-2 font-bold cursor-pointer">x</button>
                      <span className="flex-grow text-sm truncate">{opt}</span>
                      
                      <label className="flex items-center space-x-1 cursor-pointer px-2 py-1 hover:bg-green-100 rounded">
                        <span className="text-xs text-gray-500">Correct?</span>
                        {formData.type === 'mcq_single' ? (
                          <input 
                            type="radio" 
                            name="correct" 
                            checked={isCorrect}
                            onChange={() => {
                              setFormData({ ...formData, content: { ...formData.content, solution: opt } });
                              setErrorMsg(null);
                            }} 
                          />
                        ) : (
                          <input 
                            type="checkbox" 
                            checked={isCorrect}
                            onChange={() => {
                              toggleCorrectOption(opt);
                              setErrorMsg(null);
                            }}
                          />
                        )}
                      </label>
                    </li>
                  );
                })}
              </ul>

              <div className="flex space-x-2">
                <input type="text" value={newOption} 
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addOption()}
                  className="flex-grow p-1 border border-primary rounded bg-background text-sm" placeholder="Type an option..." />
                <button onClick={addOption} className="bg-button px-3 py-1 rounded border border-primary font-bold text-sm hover:bg-shade">Add</button>
              </div>
            </div>
          )}

          {formData.type === 'code' && (
            <div className="animate-fade-in-scale-up">
              <label className="block text-xs font-bold mb-1">Expected Code Answer <span className="text-red-500">*</span></label>
              <textarea 
                className="w-full p-2 border border-primary rounded bg-hover font-mono text-sm h-20 outline-none focus:border-blue-500"
                value={formData.content.solution} 
                onChange={e => {
                  setFormData({ ...formData, content: { ...formData.content, solution: e.target.value } });
                  if(e.target.value) setErrorMsg(null);
                }} 
                placeholder="Enter the expected answer here..."
              />
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm font-bold rounded text-center animate-pulse">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="mt-6 flex justify-between items-center pt-4 border-t border-primary/20">
          {hotspotToEdit ? (
            <button onClick={() => onDelete(formData.id)} 
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800 focus:bg-red-800 disabled:opacity-50 cursor-pointer"
            >
              Delete
            </button>
          ) : <div />}
          
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 rounded text-primary hover:bg-hover transition-colors cursor-pointer">Cancel</button>
            <button onClick={handleValidateAndSave} className="px-6 py-2 rounded bg-primary text-background font-bold shadow hover:opacity-90 transition-opacity cursor-pointer">
              Save Hotspot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}