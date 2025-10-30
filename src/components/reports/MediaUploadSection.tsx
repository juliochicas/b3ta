import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Image, Video, Link, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  type: 'photo' | 'video';
  file?: File;
  url?: string;
  caption: string;
}

interface Props {
  mediaFiles: MediaFile[];
  setMediaFiles: (files: MediaFile[]) => void;
}

export const MediaUploadSection = ({ mediaFiles, setMediaFiles }: Props) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkCaption, setLinkCaption] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      // Check file size (50MB for videos, 5MB for photos before resize)
      const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "Archivo muy grande",
          description: `El ${type === 'video' ? 'video' : 'foto'} excede el tamaño máximo de ${type === 'video' ? '50MB' : '5MB'}`,
          variant: "destructive",
        });
        continue;
      }

      try {
        let processedFile = file;
        
        // Auto-resize all photos over 1MB
        if (type === 'photo' && file.size > 1 * 1024 * 1024) {
          try {
            processedFile = await resizeImage(file);
            const sizeSaved = ((1 - processedFile.size / file.size) * 100).toFixed(0);
            toast({
              title: "Imagen optimizada",
              description: `Tamaño reducido en ${sizeSaved}% sin perder calidad`,
            });
          } catch (resizeError) {
            console.error('Resize error:', resizeError);
            // Use original file if resize fails
            processedFile = file;
          }
        }

        setMediaFiles([...mediaFiles, { type, file: processedFile, caption: '' }]);
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Error",
          description: "No se pudo procesar el archivo",
          variant: "destructive",
        });
      }
    }
  };

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Use better image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          }, 'image/jpeg', 0.90);
        };
        img.onerror = () => reject(new Error('Image loading failed'));
      };
      reader.onerror = () => reject(new Error('File reading failed'));
    });
  };

  const addLink = () => {
    if (!linkUrl) return;
    setMediaFiles([...mediaFiles, { type: 'video', url: linkUrl, caption: linkCaption }]);
    setLinkUrl("");
    setLinkCaption("");
    setShowLinkInput(false);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...mediaFiles];
    updated[index].caption = caption;
    setMediaFiles(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('photo-upload')?.click()}>
          <Image className="mr-2 h-4 w-4" />
          Subir Fotos
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('video-upload')?.click()}>
          <Video className="mr-2 h-4 w-4" />
          Subir Video
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setShowLinkInput(true)}>
          <Link className="mr-2 h-4 w-4" />
          Agregar Link
        </Button>
      </div>

      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'photo')}
      />
      <input
        id="video-upload"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'video')}
      />

      {showLinkInput && (
        <Card className="p-4 space-y-3">
          <div className="space-y-2">
            <Label>URL del Video (Loom, YouTube, etc.)</Label>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input
              value={linkCaption}
              onChange={(e) => setLinkCaption(e.target.value)}
              placeholder="Descripción del video"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={addLink}>Agregar</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowLinkInput(false)}>Cancelar</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        {mediaFiles.map((media, index) => (
          <Card key={index} className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {media.type === 'photo' ? (
                  <Image className="h-4 w-4" />
                ) : (
                  <Video className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {media.file ? media.file.name : 'Link externo'}
                </span>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeMedia(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Descripción opcional"
              value={media.caption}
              onChange={(e) => updateCaption(index, e.target.value)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};
