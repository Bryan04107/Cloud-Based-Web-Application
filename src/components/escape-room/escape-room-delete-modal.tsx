"use client";

interface EscapeRoomDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemType?: string;
}

export default function EscapeRoomDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  itemType
}: EscapeRoomDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-16 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div 
        role="dialog" 
        aria-modal="true"
        className="bg-background border-2 border-red-500 rounded-lg shadow-2xl w-full max-w-md p-6 text-center animate-fade-in-scale-up"
      >
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🗑️
        </div>
        
        <h2 className="text-2xl font-bold text-primary mb-2">Delete {itemType}?</h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-bold text-primary">&quot;{title}&quot;</span>? 
          This action cannot be undone.
        </p>

        <div className="flex space-x-3 justify-center">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-primary hover:bg-hover border border-primary/20 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-800 focus:bg-red-800 shadow-md transition-transform"
          >
            Yes, Delete It
          </button>
        </div>
      </div>
    </div>
  );
}