'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Info } from 'lucide-react';
import ImageUpload from '@/components/customize/ImageUpload';
import CustomizationControls, { type CustomizationFormData } from '@/components/customize/CustomizationControls';
import RenderedOutfitView from '@/components/customize/RenderedOutfitView';
import { fileToDataUrl } from '@/lib/utils';
import { renderOutfitOnUserImage, type RenderOutfitOnUserImageInput } from '@/ai/flows/render-outfit';
import { useToast } from "@/hooks/use-toast";

function CustomizePageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [selectedOutfitUrl, setSelectedOutfitUrl] = useState<string | null>(null);
  const [selectedOutfitName, setSelectedOutfitName] = useState<string | undefined>(undefined);
  
  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [userImageDataUrl, setUserImageDataUrl] = useState<string | null>(null);
  
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [renderedDescription, setRenderedDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const outfitUrl = searchParams.get('outfitUrl');
    const outfitName = searchParams.get('outfitName');
    if (outfitUrl) {
      setSelectedOutfitUrl(decodeURIComponent(outfitUrl));
    }
    if (outfitName) {
      setSelectedOutfitName(decodeURIComponent(outfitName));
    }
  }, [searchParams]);

  const handleUserImageUpload = useCallback((file: File, dataUrl: string) => {
    setUserImageFile(file);
    setUserImageDataUrl(dataUrl);
    setRenderedImage(null); // Clear previous render when new user image is uploaded
    setRenderedDescription(null);
  }, []);

  const formatCustomizations = (data: CustomizationFormData): string => {
    return `Dress length: ${data.dressLength}% (0% shortest, 100% longest). Neckline depth: ${data.necklineDepth}% (0% highest, 100% deepest). Side slit: ${data.sideSlit ? 'Yes' : 'No'}.`;
  };

  const handleVisualize = async (data: CustomizationFormData) => {
    if (!userImageDataUrl || !selectedOutfitUrl) {
      toast({
        title: "Missing Information",
        description: "Please upload your image and ensure an outfit is selected.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setRenderedImage(null);
    setRenderedDescription(null);

    try {
      // The AI flow expects a data URI for the outfit image as well.
      // Assuming selectedOutfitUrl is a regular URL, we need to fetch and convert it.
      // For simplicity, if it's already a data URI (e.g. from picsum if it could be), we use it directly.
      // However, picsum returns images, not data URIs.
      // For a real app, this might involve a backend proxy to fetch and convert, or pre-converted data URIs.
      // For this demo with picsum, we'll show a placeholder or skip this conversion.
      // The AI flow might fail if it cannot access the `selectedOutfitUrl` directly.
      // Let's assume for now `selectedOutfitUrl` can be directly used or is a data URI for the AI.
      // A better approach is to provide example data URIs for outfits.
      // For now, we will pass the URL and hope the AI can fetch it.
      // If `renderOutfitOnUserImage` internally fetches URLs, it might work. If not, it will fail.
      // The spec says `outfitImage: z.string().describe("A photo of the outfit, as a data URI...")`
      // This means `selectedOutfitUrl` ideally should be a data URI.
      // For this exercise, we will proceed with the assumption that the provided AI flow might handle URLs or
      // that the placeholder URLs are sufficient for demonstration. If a real fetch and conversion is needed,
      // it adds complexity with CORS and server-side operations.

      // A practical way for picsum photos would be to fetch them client side, draw to canvas, then toDataURL.
      // This will be mocked for now or assumed the AI can handle it.
      // Let's try to fetch and convert the outfit image to data URI.
      let outfitImageDataUrl = selectedOutfitUrl;
      if (!selectedOutfitUrl.startsWith('data:')) {
        try {
            const response = await fetch(selectedOutfitUrl);
            if (!response.ok) throw new Error(`Failed to fetch outfit image: ${response.statusText}`);
            const blob = await response.blob();
            const tempFile = new File([blob], "outfit-image", { type: blob.type });
            outfitImageDataUrl = await fileToDataUrl(tempFile);
        } catch (e) {
            console.error("Failed to convert outfit URL to data URI:", e);
            toast({
                title: "Outfit Image Error",
                description: "Could not process the selected outfit image. Please try another outfit.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }
      }


      const customizations = formatCustomizations(data);
      const input: RenderOutfitOnUserImageInput = {
        userImage: userImageDataUrl,
        outfitImage: outfitImageDataUrl, // This should ideally be a data URI
        customizations,
      };

      const result = await renderOutfitOnUserImage(input);
      setRenderedImage(result.renderedImage);
      setRenderedDescription(result.description);
      toast({
        title: "Outfit Visualized!",
        description: "Your customized outfit has been rendered.",
      });

    } catch (e: any) {
      console.error("Error visualizing outfit:", e);
      setError(e.message || "Failed to visualize outfit. Please try again.");
      toast({
        title: "Visualization Failed",
        description: e.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedOutfitUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading outfit details...</p>
        <p className="text-sm text-muted-foreground mt-2">If this takes too long, please try selecting an outfit again.</p>
         <Button onClick={() => window.location.href = '/outfits'} variant="outline" className="mt-4">
          Back to Outfits
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Customize Your Look</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          You are customizing: <span className="font-semibold text-primary">{selectedOutfitName || 'Selected Outfit'}</span>
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <ImageUpload onImageUpload={handleUserImageUpload} title="1. Upload Your Photo" currentImagePreview={userImageDataUrl} />
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">2. Selected Outfit</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedOutfitUrl && (
                <div className="aspect-square w-full bg-secondary/50 rounded-lg overflow-hidden border">
                <Image
                  src={selectedOutfitUrl}
                  alt={selectedOutfitName || "Selected outfit"}
                  width={300}
                  height={300}
                  className="object-contain w-full h-full"
                  data-ai-hint="dress fashion"
                />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
           <RenderedOutfitView
            imageUrl={renderedImage}
            description={renderedDescription}
            userImageUrl={userImageDataUrl}
            outfitName={selectedOutfitName}
          />
        </div>

        <div className="lg:col-span-1">
          <CustomizationControls onSubmit={handleVisualize} isLoading={isLoading} />
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 flex flex-col items-center justify-center z-50">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="mt-4 text-xl font-semibold">Generating your virtual try-on...</p>
          <p className="text-muted-foreground">This may take a moment.</p>
        </div>
      )}
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Loading...</span></div>}>
      <CustomizePageContent />
    </Suspense>
  );
}

