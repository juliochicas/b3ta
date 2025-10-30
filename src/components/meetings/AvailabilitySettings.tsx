import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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
  const [dayOfWeek, setDayOfWeek] = useState("1");
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

  const handleAddSlot = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("No user found");

      const { error } = await supabase.from("user_availability").insert([
        {
          user_id: userData.user.id,
          day_of_week: parseInt(dayOfWeek),
          start_time: startTime,
          end_time: endTime,
          timezone,
          is_active: true,
        },
      ]);

      if (error) throw error;

      toast.success("Disponibilidad añadida");
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Día de la semana</Label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <Button onClick={handleAddSlot} className="w-full">
            Añadir Horario
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
