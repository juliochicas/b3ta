# Guía de Configuración de Seguridad - B3TA

## ✅ Correcciones Implementadas

Se han implementado las siguientes mejoras de seguridad en tu aplicación:

### 1. 🛡️ **Protección XSS en Visor de Emails** (CRÍTICO - IMPLEMENTADO)
- ✅ Instalado DOMPurify para sanitizar HTML de emails
- ✅ Configurado allowlist estricto de tags HTML permitidos
- ✅ Bloqueados tags peligrosos: `<script>`, `<iframe>`, `<form>`, `<input>`, `<button>`
- ✅ Bloqueados atributos de eventos: `onclick`, `onerror`, `onload`, etc.

**Estado:** ✅ Completado - Los emails maliciosos ya no pueden ejecutar JavaScript

---

### 2. 🔐 **Autenticación del Webhook de Emails** (CRÍTICO - IMPLEMENTADO)
- ✅ Agregado soporte para validación HMAC de firmas
- ✅ Protección contra ataques de replay (ventana de 5 minutos)
- ✅ Logging de intentos no autorizados

**Requiere configuración adicional** - Ver sección siguiente

---

### 3. 🔒 **Autenticación de Tareas Programadas** (IMPORTANTE - IMPLEMENTADO)
- ✅ Agregado secret token para `send-meeting-reminder`
- ✅ Validación de Authorization header
- ✅ Logging de intentos no autorizados

**Requiere configuración adicional** - Ver sección siguiente

---

### 4. 🚦 **Rate Limiting Mejorado en AI Consultant** (IMPORTANTE - IMPLEMENTADO)
- ✅ Rate limiting basado en sesión (no solo IP)
- ✅ Límites más estrictos: 10 requests / 5 minutos por sesión
- ✅ Límite adicional por IP: 15 requests / 5 minutos
- ✅ Protección contra rotación de IPs

**Estado:** ✅ Completado - Abuso de AI creditosmitigado

---

## 🔧 Configuración Requerida

Para completar la seguridad, necesitas configurar los siguientes secretos en tu backend:

### 1. WEBHOOK_SECRET (Email Webhook)

Este secret se usa para validar que los webhooks de email realmente vienen de Hostinger.

**Cómo configurarlo:**

1. Genera un secret seguro (puedes usar este comando):
   ```bash
   openssl rand -hex 32
   ```

2. Agrega el secret a tu backend de Lovable Cloud:
   - Ve a Backend → Secrets
   - Agrega nuevo secret: `WEBHOOK_SECRET`
   - Pega el valor generado

3. Configura Hostinger para enviar el signature:
   - En el panel de Hostinger, configura el webhook para emails
   - Agrega estos headers personalizados:
     - `X-Webhook-Signature`: HMAC-SHA256 del timestamp + body usando WEBHOOK_SECRET
     - `X-Webhook-Timestamp`: Timestamp en milisegundos

**Ejemplo de cómo Hostinger debe firmar el webhook (para su referencia):**
```javascript
const crypto = require('crypto');
const timestamp = Date.now().toString();
const body = JSON.stringify(emailData);
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(timestamp + body)
  .digest('hex');

// Enviar con headers:
// X-Webhook-Signature: <signature>
// X-Webhook-Timestamp: <timestamp>
```

---

### 2. CRON_SECRET (Meeting Reminders)

Este secret protege la función de recordatorios de reuniones.

**Cómo configurarlo:**

1. Genera un secret seguro:
   ```bash
   openssl rand -hex 32
   ```

2. Agrega el secret a tu backend:
   - Ve a Backend → Secrets
   - Agrega nuevo secret: `CRON_SECRET`
   - Pega el valor generado

3. Configura tu tarea programada (cron job) para incluir el secret:
   ```bash
   # Ejemplo de cron job (ajusta según tu scheduler)
   curl -X POST https://[tu-proyecto].supabase.co/functions/v1/send-meeting-reminder \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

**Si usas GitHub Actions, Vercel Cron, o similar:**
```yaml
# GitHub Actions ejemplo
- name: Trigger meeting reminders
  run: |
    curl -X POST ${{ secrets.EDGE_FUNCTION_URL }}/send-meeting-reminder \
      -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

---

## ⚠️ Problemas Pendientes

### 🔴 Contraseñas de Email en Texto Plano (CRÍTICO - PENDIENTE)

**Problema:** Las contraseñas SMTP/IMAP se guardan sin encriptar en `email_accounts.password_encrypted`

**Riesgo:** Si alguien accede a la base de datos, puede leer todas las credenciales de email

**Solución Recomendada:** Migrar a Supabase Vault

Esta es una migración más compleja que requiere:
1. Crear una función de migración de datos
2. Actualizar el código que lee/escribe passwords
3. Mover passwords existentes al vault
4. Actualizar edge functions que usan las credenciales

**¿Quieres que implemente esta migración ahora?**

---

## 📊 Resumen de Estado

| Vulnerabilidad | Severidad | Estado | Requiere Acción |
|---------------|-----------|--------|-----------------|
| XSS en emails | 🔴 Crítico | ✅ Corregido | No |
| Webhook sin auth | 🔴 Crítico | ✅ Implementado | ⚠️ Sí - Configurar WEBHOOK_SECRET |
| Passwords en texto plano | 🔴 Crítico | ⚠️ Pendiente | ⚠️ Sí - Requiere migración |
| Cron sin auth | 🟡 Importante | ✅ Implementado | ⚠️ Sí - Configurar CRON_SECRET |
| AI endpoint público | 🟡 Importante | ✅ Mejorado | No |

---

## 🎯 Próximos Pasos

1. **Inmediato:** Configura `WEBHOOK_SECRET` y `CRON_SECRET` usando las instrucciones de arriba
2. **Corto plazo:** Considera implementar la migración de passwords a Supabase Vault
3. **Recomendado:** Habilita "Leaked password protection" en configuración de Auth de Supabase

---

## 🆘 Soporte

Si necesitas ayuda con:
- Generar los secrets
- Configurar Hostinger webhook
- Implementar la migración de passwords
- Cualquier otra pregunta de seguridad

Solo pregunta y te guiaré paso a paso.

---

**Última actualización:** $(date)
**Versión de seguridad:** 1.0
