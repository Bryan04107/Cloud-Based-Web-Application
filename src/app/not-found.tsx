import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-full min-w-full flex flex-col items-center justify-center bg-background text-center p-4">
      <div className="space-y-6 max-w-md">
        <h1 className="text-9xl font-black text-primary opacity-20 select-none">
          404
        </h1>
        
        <div className="space-y-2 relative -mt-19">
          <h2 className="text-3xl font-bold tracking-tight">
            Page not Found
          </h2>
        </div>

        <div className="p-6 border border-dashed border-primary/30 rounded-lg bg-primary/5">
          <p className="text-sm font-mono text-primary/80 mb-4">
            Status Code: 404 Not Found<br/>
          </p>
          
          <Link 
            href="/about"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors bg-primary text-background hover:bg-primary/90 rounded-md shadow-lg shadow-primary/20"
          >
            Return to About page
          </Link>
        </div>
      </div>
    </div>
  );
}