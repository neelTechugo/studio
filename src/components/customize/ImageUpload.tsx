'use client';

import type { ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageUploadProps {
  onImageUpload: (file: File, dataUrl: string) => void;
  title: string;
  currentImagePreview?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, title, currentImagePreview }) => {
  const [preview, setPreview] = useState<string | null>(currentImagePreview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Please upload an image under 5MB.");
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        onImageUpload(file, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    // Call onImageUpload with null to clear it in parent if needed, but ensure types match
    // For now, this just clears preview. Parent manages actual file state.
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-square w-full border-2 border-dashed border-muted rounded-lg flex items-center justify-center overflow-hidden bg-secondary/50">
          {preview ? (
            <>
              <Image src={preview} alt="Image preview" layout="fill" objectFit="contain" data-ai-hint="person portrait" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 rounded-full"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="text-center p-4">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
          <Input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            aria-label="Upload image"
          />
        </div>
         {!preview && (
          <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
            <UploadCloud className="mr-2 h-4 w-4" /> Select Image
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
