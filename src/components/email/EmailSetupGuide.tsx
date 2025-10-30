import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Mail, Server, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmailSetupGuide = () => {
  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/receive-email-webhook`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración del Correo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Cómo recibir correos</AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
              <p>
                Para recibir correos automáticamente, tienes 2 opciones:
              </p>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Opción 1: Sincronización Manual (Recomendada)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  Usa el botón <strong>"Sincronizar"</strong> en la interfaz para obtener
                  correos nuevos del servidor IMAP cuando los necesites.
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-mono text-xs">
                    ✓ Funciona inmediatamente
                    <br />
                    ✓ No requiere configuración adicional
                    <br />
                    ✓ Control total sobre cuándo sincronizar
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Opción 2: Webhook (Requiere configuración en Hostinger)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Para recibir correos automáticamente, configura este webhook en tu
                  panel de Hostinger:
                </p>
                <div className="bg-muted p-3 rounded-md space-y-2">
                  <p className="text-xs font-medium">URL del Webhook:</p>
                  <div className="flex gap-2 items-center">
                    <code className="flex-1 text-xs bg-background p-2 rounded border overflow-x-auto">
                      {webhookUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(webhookUrl)}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                <Alert variant="default">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Nota:</strong> Hostinger debe soportar webhooks para correo
                    entrante. Si no está disponible en tu plan, usa la Opción 1.
                  </AlertDescription>
                </Alert>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Pasos para configurar en Hostinger:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Accede al panel de Hostinger</li>
                    <li>Ve a la configuración de tu correo (consulting@b3ta.us)</li>
                    <li>Busca "Reenvío" o "Forwarding" o "Webhook"</li>
                    <li>Configura el webhook con la URL de arriba</li>
                    <li>Guarda los cambios</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
