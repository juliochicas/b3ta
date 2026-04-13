"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Calendar } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

const TIMEZONES = [
  { value: "America/Mexico_City", label: "Ciudad de México (GMT-6)" },
  { value: "America/New_York", label: "Nueva York (GMT-5)" },
  { value: "America/Los_Angeles", label: "Los Ángeles (GMT-8)" },
  { value: "Europe/Madrid", label: "Madrid (GMT+1)" },
  { value: "Europe/London", label: "Londres (GMT+0)" },
];

export const AvailabilitySettings = () => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [timezone, setTimezone] = useState("America/Mexico_City");

  const { data: availability, refetch } = useQuery({
    queryKey: ["user-availability"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_availability")
        .select("*")
        .order("day_of_week")
        .order("start_time");

      if (error) throw error;
      return data;
    },
  });

  const handleToggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSelectPreset = (preset: string) => {
    switch (preset) {
      case "weekdays":
        setSelectedDays([1, 2, 3, 4, 5]); // Lunes a Viernes
        break;
      case "weekend":
        setSelectedDays([0, 6]); // Domingo y Sábado
        break;
      case "all":
        setSelectedDays([0, 1, 2, 3, 4, 5, 6]); // Toda la semana
        break;
      case "none":
        setSelectedDays([]);
        break;
    }
  };

  const handleAddSlot = async () => {
    if (selectedDays.length === 0) {
      toast.error("Selecciona al menos un día");
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("No user found");

      // Crear un slot para cada día seleccionado
      const slots = selectedDays.map(day => ({
        user_id: userData.user.id,
        day_of_week: day,
        start_time: startTime,
        end_time: endTime,
        timezone,
        is_active: true,
      }));

      const { error } = await supabase.from("user_availability").insert(slots);

      if (error) throw error;

      toast.success(`Disponibilidad añadida para ${selectedDays.length} día(s)`);
      setSelectedDays([]);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Error al añadir disponibilidad");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("user_availability")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success("Disponibilidad actualizada");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar disponibilidad");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_availability")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Disponibilidad eliminada");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar disponibilidad");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Añadir Disponibilidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-3 block">Días de la semana</Label>
            
            {/* Botones de acceso rápido */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleSelectPreset("weekdays")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Lunes a Viernes
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleSelectPreset("weekend")}
              >
                Fin de Semana
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleSelectPreset("all")}
              >
                Toda la Semana
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleSelectPreset("none")}
              >
                Limpiar
              </Button>
            </div>

            {/* Checkboxes para días individuales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => handleToggleDay(day.value)}
                  />
                  <label
                    htmlFor={`day-${day.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>

            {selectedDays.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedDays.length} día(s) seleccionado(s)
              </p>
            )}
          </div>

          <div>
            <Label>Zona Horaria</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Hora de inicio</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div>
              <Label>Hora de fin</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleAddSlot} 
            className="w-full"
            disabled={selectedDays.length === 0}
          >
            {selectedDays.length === 0 
              ? "Selecciona días para continuar" 
              : `Añadir Horario para ${selectedDays.length} día(s)`}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mi Disponibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          {!availability || availability.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No has configurado tu disponibilidad aún
            </p>
          ) : (
            <div className="space-y-2">
              {availability.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {DAYS_OF_WEEK.find((d) => d.value === slot.day_of_week)
                        ?.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {slot.start_time} - {slot.end_time} ({slot.timezone})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={slot.is_active}
                      onCheckedChange={() =>
                        handleToggleActive(slot.id, slot.is_active)
                      }
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(slot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
