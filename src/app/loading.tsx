import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-41 flex flex-col items-center justify-center bg-background text-primary">
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        
        <div className="p-4 bg-background rounded-full relative z-40">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/10 rounded-full animate-ping" />
      </div>
      
      <h2 className="mt-8 text-xl font-bold tracking-widest uppercase animate-pulse">
        Initializing Room...
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Decrypting assets
      </p>
    </div>
  );
}