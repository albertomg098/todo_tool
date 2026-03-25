import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

interface HelpViewProps {
  onBack: () => void;
}

export function HelpView({ onBack }: HelpViewProps) {
  return (
    <div className="mx-auto w-full max-w-2xl min-h-screen">
      <div className="flex items-center gap-3 py-4 px-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Cómo usar Daily Stack</h1>
      </div>

      <Separator />

      <div className="px-4 py-4 space-y-4">
        {/* Rituales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Los 3 rituales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">Lunes — Planificación semanal</p>
              <p className="text-muted-foreground">
                Abre la vista semanal y define 3–5 intenciones para la semana.
                Estas guían tu foco diario.
              </p>
            </div>
            <div>
              <p className="font-semibold">Cada mañana — Preparar el día</p>
              <p className="text-muted-foreground">
                Revisa las tareas de hoy. Mueve a TODAY solo las que vas a hacer
                (máximo 5). El resto queda en TODO.
              </p>
            </div>
            <div>
              <p className="font-semibold">Viernes — Revisión semanal</p>
              <p className="text-muted-foreground">
                Revisa la vista semanal: intenciones cumplidas, tareas bloqueadas,
                y backlog pendiente. Ajusta para la siguiente semana.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Estados */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Los 4 estados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-slate-400 text-white">TODO</Badge>
              <span className="text-muted-foreground">
                Tarea pendiente. Puede moverse a TODAY o BLOCKED.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-600 text-white">TODAY</Badge>
              <span className="text-muted-foreground">
                Comprometida para hoy. Puede completarse (DONE), volver a TODO, o bloquearse.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-600 text-white">BLOCKED</Badge>
              <span className="text-muted-foreground">
                Bloqueada por dependencia externa. Al desbloquear, requiere nota explicativa.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white">DONE</Badge>
              <span className="text-muted-foreground">
                Completada. Estado inmutable — no se puede reabrir.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Regla del 5 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Regla del límite de 5</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Si tienes más de 5 tareas en TODAY, aparece un badge rojo de aviso.
            Más de 5 compromisos reales en un día es ilusorio — el límite te fuerza a priorizar.
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Preguntas frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">
                ¿Qué pasa con las tareas de ayer que no completé?
              </p>
              <p className="text-muted-foreground">
                Quedan en su día. Hoy te aparece un aviso para moverlas.
              </p>
            </div>
            <div>
              <p className="font-semibold">
                ¿Puedo crear tareas sin día asignado?
              </p>
              <p className="text-muted-foreground">
                Sí, van al backlog semanal.
              </p>
            </div>
            <div>
              <p className="font-semibold">
                ¿Por qué el límite de 5 en TODAY?
              </p>
              <p className="text-muted-foreground">
                Más de 5 compromisos reales en un día FDE es ilusorio. El límite fuerza a priorizar.
              </p>
            </div>
            <div>
              <p className="font-semibold">
                ¿Puedo reabrir una tarea DONE?
              </p>
              <p className="text-muted-foreground">
                No. Si hay follow-up, crea una tarea nueva.
              </p>
            </div>
            <div>
              <p className="font-semibold">
                ¿Se pierde todo si limpio el navegador?
              </p>
              <p className="text-muted-foreground">
                Sí, v1 usa localStorage. La v2 añadirá Supabase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
