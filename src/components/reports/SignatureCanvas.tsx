import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eraser } from "lucide-react";

interface Props {
  signature: string;
  setSignature: (signature: string) => void;
}

export const SignatureCanvas = ({ signature, setSignature }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [consultantName, setConsultantName] = useState("");

  useEffect(() => {
    if (signature && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
      img.src = signature;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Nombre del Consultor</Label>
        <Input
          value={consultantName}
          onChange={(e) => setConsultantName(e.target.value)}
          placeholder="Nombre completo"
        />
      </div>
      
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Firma Digital</Label>
            <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
              <Eraser className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          </div>
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="border border-border rounded w-full cursor-crosshair bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <p className="text-xs text-muted-foreground">
            Dibuja tu firma en el recuadro
          </p>
        </div>
      </Card>
    </div>
  );
};
