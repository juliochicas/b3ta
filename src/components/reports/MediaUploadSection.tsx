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
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const maxSize = type === 'video' ? 20 * 1024 * 1024 : 2 * 1024 * 1024; // 20MB for video, 2MB for photo
      
      if (file.size > maxSize) {
        if (type === 'photo') {
          // Auto-resize photo
          const resized = await resizeImage(file);
          setMediaFiles([...mediaFiles, { type, file: resized, caption: "" }]);
        } else {
          toast({
            title: "Error",
            description: `El video excede el límite de 20MB`,
            variant: "destructive",
          });
        }
      } else {
        setMediaFiles([...mediaFiles, { type, file, caption: "" }]);
      }
    }
  };

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxSize = 1920;
          if (width > height && width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          } else if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.85);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
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
