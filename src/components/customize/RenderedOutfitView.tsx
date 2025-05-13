'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, Share2, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface RenderedOutfitViewProps {
  imageUrl: string | null;
  description: string | null;
  userImageUrl: string | null; // To show the user's original image before rendering
  outfitName?: string;
}

const RenderedOutfitView: React.FC<RenderedOutfitViewProps> = ({ imageUrl, description, userImageUrl, outfitName }) => {
  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `virtufit_${outfitName ? outfitName.replace(/\s+/g, '_').toLowerCase() : 'custom_outfit'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share && imageUrl) {
      try {
        // Convert data URL to Blob for sharing
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `virtufit_outfit.png`, { type: blob.type });

        await navigator.share({
          title: `My VirtuFit Outfit: ${outfitName || 'Custom Design'}`,
          text: description || `Check out my virtually tried-on outfit from VirtuFit!`,
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback for when sharing files is not supported or fails for other reasons
        try {
           await navigator.share({
            title: `My VirtuFit Outfit: ${outfitName || 'Custom Design'}`,
            text: description || `Check out my virtually tried-on outfit from VirtuFit! View it here: ${imageUrl}`,
            url: imageUrl, // Data URLs might not be shareable via URL, but it's a fallback
          });
        } catch (fallbackError) {
          console.error('Error sharing fallback:', fallbackError);
          alert('Sharing failed. You can download the image and share it manually.');
        }
      }
    } else if (imageUrl) {
      // Fallback for browsers that don't support navigator.share or file sharing
      try {
        await navigator.clipboard.writeText(imageUrl);
        alert('Image URL copied to clipboard! (Sharing directly is not supported in your browser)');
      } catch (err) {
        alert('Could not copy image URL. Please download and share manually.');
      }
    } else {
      alert('No image to share yet.');
    }
  };
  
  const displayImageUrl = imageUrl || userImageUrl;

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {imageUrl ? (outfitName ? `Your Customized ${outfitName}` : 'Your Customized Outfit') : 'Outfit Preview'}
        </CardTitle>
        {imageUrl && description && (
          <CardDescription>{description}</CardDescription>
        )}
         {!imageUrl && !userImageUrl && (
          <CardDescription>Your customized outfit will appear here once visualized.</CardDescription>
        )}
        {userImageUrl && !imageUrl && (
          <CardDescription>This is your uploaded image. Adjust controls and click "Visualize".</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full bg-secondary/50 rounded-lg flex items-center justify-center overflow-hidden border">
          {displayImageUrl ? (
            <Image
              src={displayImageUrl}
              alt={imageUrl ? (outfitName || 'Rendered outfit') : 'User image'}
              width={500}
              height={500}
              className="object-contain w-full h-full"
              data-ai-hint="fashion style"
            />
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <ImageIcon className="mx-auto h-24 w-24" />
              <p className="mt-4 text-lg">Your design will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
      {imageUrl && (
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleDownload} className="w-full sm:w-auto flex-grow">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          {navigator.share && (
            <Button onClick={handleShare} variant="outline" className="w-full sm:w-auto flex-grow">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RenderedOutfitView;
