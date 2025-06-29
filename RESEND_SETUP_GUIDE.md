# 🚀 CONFIGURACIÓN RESEND PARA FORMULARIOS - PASO A PASO

## ✅ **CAMBIOS APLICADOS**

Los endpoints `/api/contact` y `/api/quotes/create` han sido modificados para:

1. **Funcionar con o sin base de datos** ✅
2. **Enviar emails via Resend** ✅  
3. **Tener fallback graceful** si falla la BD ✅
4. **Mantener funcionalidad local** ✅

## 🔧 **CONFIGURACIÓN NECESARIA EN VERCEL**

### **1. Crear cuenta Resend**
1. Ve a https://resend.com
2. Regístrate/inicia sesión
3. Ve a "API Keys" 
4. Crea nueva API Key: `Formularios Code Solutions`
5. Copia la API key (empieza con `re_`)

### **2. Configurar variables de entorno en Vercel**

Ve a tu dashboard de Vercel → Tu proyecto → Settings → Environment Variables

Agrega estas variables:

```bash
# RESEND EMAIL CONFIGURATION
RESEND_API_KEY=re_TuApiKeyAqui...
ADMIN_EMAIL=carlossaul.cs@hotmail.com

# OPCIONAL: Email de respaldo
BACKUP_EMAIL=backup@codesolutionstudio.com.mx
```

### **3. Configurar dominio en Resend (OPCIONAL)**

Para mejor deliverability:

1. En Resend dashboard → Domains
2. Add Domain: `codesolutionstudio.com.mx`
3. Agregar registros DNS según instrucciones
4. Verificar dominio

**Sin dominio personalizado:** Los emails se envían desde `onboarding@resend.dev`

## 🧪 **CÓMO PROBAR DESPUÉS DE CONFIGURAR**

### **1. Probar endpoint de contacto:**
```bash
curl -X POST https://www.codesolutionstudio.com.mx/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "message": "Test desde producción"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "messageId": "temp-1751234567890",
  "message": "Mensaje enviado exitosamente. Te responderemos pronto."
}
```

### **2. Probar endpoint de cotización:**
```bash
curl -X POST https://www.codesolutionstudio.com.mx/api/quotes/create \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "WEB",
    "packageType": "STARTUP", 
    "basePrice": 15000,
    "totalPrice": 15000,
    "timeline": 30,
    "contactInfo": {
      "name": "Test Quote",
      "email": "quote@example.com"
    }
  }'
```

## 📧 **EMAILS QUE SE ENVIARÁN**

### **Formulario de Contacto:**
- **Para:** `carlossaul.cs@hotmail.com`
- **Asunto:** "Nuevo mensaje de contacto - [Nombre]"
- **Contenido:** Todos los datos del formulario

### **Formulario de Cotización:**
- **Para:** `carlossaul.cs@hotmail.com` 
- **Asunto:** "Nueva cotización - [Nombre]"
- **Contenido:** Detalles completos de la cotización

## 🔍 **DEBUGGING**

### **Si los formularios fallan:**

1. **Revisar logs de Vercel:**
   - Dashboard → Functions → Ver logs de `/api/contact` y `/api/quotes/create`

2. **Verificar variables de entorno:**
   ```bash
   curl https://www.codesolutionstudio.com.mx/api/health
   ```
   Debe mostrar: `"resend": "configured"`

3. **Errores comunes:**
   - ❌ `RESEND_API_KEY` no configurada
   - ❌ API key inválida o expirada
   - ❌ Rate limit excedido (100 emails/día gratis)

## 📊 **ESTADO ACTUAL**

- ✅ **Endpoints actualizados** con fallback
- ✅ **Código subido** a GitHub
- ✅ **Build desplegado** en Vercel
- ⏳ **Falta:** Configurar `RESEND_API_KEY` en Vercel

## 🎯 **PRÓXIMOS PASOS**

1. **Configurar Resend API Key** en Vercel ⏳
2. **Probar formularios** en producción ⏳
3. **Configurar auto-respuestas** a clientes (opcional)
4. **Configurar base de datos PostgreSQL** (futuro)

---

## 🚀 **DESPUÉS DE CONFIGURAR RESEND**

Los formularios deberían funcionar **inmediatamente** en:
- ✅ https://www.codesolutionstudio.com.mx/contact
- ✅ https://www.codesolutionstudio.com.mx/quoter

**¡Los emails llegarán a tu bandeja automáticamente!** 📬

---

*Configuración actualizada: 29 de Junio, 2025*  
*Estado: ⏳ PENDING RESEND SETUP*
