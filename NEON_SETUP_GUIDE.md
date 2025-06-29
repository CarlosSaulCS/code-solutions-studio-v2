# 🗃️ CONFIGURACIÓN NEON DATABASE - PASO A PASO

## **1. OBTENER CONNECTION STRING DE NEON**

### **1.1. Acceder a tu proyecto:**
1. Ve a https://console.neon.tech
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto existente o crea uno nuevo

### **1.2. Obtener la connection string:**
1. En el Dashboard, ve a **"Connection Details"**
2. Selecciona **"Pooled connection"** (recomendado para Vercel)
3. Copia la **connection string completa**

**Ejemplo:**
```
postgresql://username:password@ep-cool-darkness-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### **1.3. Para connection directa (opcional):**
- También copia la **"Direct connection"** para DIRECT_URL

## **2. CONFIGURAR EN VERCEL**

### **Variables a agregar en Vercel:**

```bash
# 🗃️ DATABASE
DATABASE_URL=tu_connection_string_de_neon_aqui
DIRECT_URL=tu_direct_connection_de_neon_aqui

# 🔑 EMAIL
RESEND_API_KEY=re_f4Y3HzmY_2eCHjryUzyXCJ6jbNbqwN2Rc
ADMIN_EMAIL=carlossaulcante@outlook.com

# ⚙️ NEXT
NODE_ENV=production
NEXTAUTH_URL=https://www.codesolutionstudio.com.mx
NEXTAUTH_SECRET=genera-un-secreto-seguro-aqui
```

## **3. GENERAR NEXTAUTH_SECRET**

Ejecuta este comando para generar un secreto seguro:

```bash
openssl rand -base64 32
```

O usa: https://generate-secret.vercel.app/32

## **4. DESPUÉS DE CONFIGURAR**

1. **Deploy automático** se ejecutará en Vercel
2. **Prisma migrará** la base de datos automáticamente
3. **Formularios funcionarán** inmediatamente

## **5. VERIFICAR CONFIGURACIÓN**

Después de deploy, prueba:
```bash
curl https://www.codesolutionstudio.com.mx/api/health
```

Debe mostrar:
```json
{
  "status": "healthy",
  "database": { "connected": true },
  "integrations": { "resend": "configured" }
}
```

---

## 🎯 **CONFIGURACIÓN COMPLETA**

Después de configurar Neon + Resend:

✅ **Base de datos:** PostgreSQL en Neon  
✅ **Emails:** Resend con dominio personalizado  
✅ **Formularios:** Funcionarán completamente  
✅ **Guardado:** Datos en BD + notificaciones por email  

**¡Tu proyecto estará 100% funcional en producción!** 🚀
