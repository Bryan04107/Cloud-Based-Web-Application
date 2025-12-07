export default function EscapeRoomSkeletonCard() {
  return (
    <div className="bg-background border-2 border-primary rounded-xl overflow-hidden shadow-sm flex flex-col animate-pulse">
      <div className="h-45 bg-gray-200 relative border-b border-primary/70">
        <div className="w-full h-full flex bg-background/90">
          <div className="absolute top-2 right-2 w-28 h-22 bg-shade/70 rounded"></div>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="h-6 bg-shade/70 rounded w-3/4"></div>
      </div>
      <div className="p-4 pt-2 pb-[17.5px] flex gap-2">
        <div className="flex-1 h-10 bg-shade/70 py-2 rounded"></div>
        <div className="w-12 h-10 bg-shade/70 px-3 py-2 rounded"></div>
      </div>
    </div>
  );
}