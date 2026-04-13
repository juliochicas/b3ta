"use client";

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
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  // Configurar el canvas con la resolución correcta
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Configurar el tamaño real del canvas para alta resolución
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      // Configuración de línea para dibujo suave
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';
    }

    // Cargar firma existente si hay
    if (signature) {
      const img = new window.Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = signature;
    }
  }, [signature]);

  // Obtener coordenadas normalizadas del evento
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Evento táctil
      if (e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
    } else {
      // Evento de mouse
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    return null;
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    setLastPoint(coords);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Dibujar línea suave desde el último punto
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setLastPoint(coords);
  };

  const stopDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setLastPoint(null);

    const canvas = canvasRef.current;
    if (canvas) {
      // Guardar la firma como imagen
      setSignature(canvas.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
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
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border border-border rounded w-full cursor-crosshair bg-background touch-none"
              style={{ height: '150px' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Dibuja tu firma usando el mouse o tu dedo en pantallas táctiles
          </p>
        </div>
      </Card>
    </div>
  );
};
