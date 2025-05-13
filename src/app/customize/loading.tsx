import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8 text-center">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
      <h1 className="text-2xl font-semibold text-foreground mb-2">Loading Customization Studio...</h1>
      <p className="text-muted-foreground">Preparing your virtual fitting room. Please wait a moment.</p>
    </div>
  );
}
