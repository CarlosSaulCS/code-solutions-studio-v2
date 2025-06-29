# 🛠️ SCRIPTS DE MANTENIMIENTO AUTOMATIZADO

Este directorio contiene scripts especializados para el mantenimiento automatizado del sistema Code Solutions Studio.

## 📋 Scripts Disponibles

### 🔍 `verificar-sistema-completo.js`
**Verificación exhaustiva del sistema**
- Verifica dependencias del sistema (Node.js, NPM)
- Comprueba estructura de archivos críticos
- Valida APIs principales
- Verifica configuraciones ambientales
- Ejecuta compilación y pruebas
- Genera reporte detallado

```bash
# Ejecutar verificación completa
node scripts/verificar-sistema-completo.js
```

### 🔗 `monitoreo-conectividad.js`
**Monitoreo de conectividad Frontend-Backend**
- Verifica APIs del backend
- Comprueba páginas del frontend
- Valida componentes críticos
- Monitorea configuraciones de conectividad
- Verifica dependencias de conectividad
- Calcula tiempos de respuesta

```bash
# Ejecutar monitoreo de conectividad
node scripts/monitoreo-conectividad.js
```

### 🔐 `verificar-auth-dashboards.js`
**Verificación de autenticación y dashboards**
- Verifica configuración de NextAuth
- Comprueba middleware de autenticación
- Valida rutas de autenticación
- Verifica dashboard de usuario
- Comprueba dashboard administrativo
- Valida APIs administrativas

```bash
# Verificar autenticación y dashboards
node scripts/verificar-auth-dashboards.js
```

### 🧹 `limpieza-automatica.js`
**Limpieza automática y optimización**
- Elimina archivos temporales y basura
- Limpia directorios de cache
- Optimiza dependencias
- Limpia logs antiguos
- Verifica integridad post-limpieza
- Calcula espacio liberado

```bash
# Limpieza básica
node scripts/limpieza-automatica.js

# Limpieza completa (incluye node_modules)
node scripts/limpieza-automatica.js --completa
```

### 🎛️ `mantenimiento-maestro.js`
**Script maestro que ejecuta todos los mantenimientos**
- Ejecuta todos los scripts en secuencia
- Genera reporte consolidado
- Proporciona estadísticas generales
- Crea recomendaciones
- Verifica estado post-mantenimiento

```bash
# Mantenimiento estándar
node scripts/mantenimiento-maestro.js

# Mantenimiento con limpieza
node scripts/mantenimiento-maestro.js --con-limpieza

# Mantenimiento completo
node scripts/mantenimiento-maestro.js --completo
```

## 📊 Reportes Generados

Todos los scripts generan reportes detallados en el directorio `logs/`:

- `reporte-sistema.json` - Estado general del sistema
- `reporte-conectividad.json` - Estado de conectividad
- `reporte-auth-dashboards.json` - Estado de autenticación
- `reporte-limpieza.json` - Resultados de limpieza
- `reporte-mantenimiento-maestro.json` - Reporte consolidado
- `reporte-mantenimiento-maestro.txt` - Reporte en texto plano

## 🚀 Uso Recomendado

### Mantenimiento Diario
```bash
# Verificación rápida del sistema
node scripts/verificar-sistema-completo.js
```

### Mantenimiento Semanal
```bash
# Mantenimiento completo con limpieza
node scripts/mantenimiento-maestro.js --con-limpieza
```

### Mantenimiento Mensual
```bash
# Mantenimiento completo con limpieza profunda
node scripts/mantenimiento-maestro.js --completo
```

## 🎯 Características

- **Automatización completa**: Ejecuta todo el mantenimiento sin intervención manual
- **Reportes detallados**: Genera reportes JSON y texto plano
- **Verificación de integridad**: Comprueba que todo funcione después del mantenimiento
- **Estadísticas**: Proporciona métricas de rendimiento y estado
- **Recomendaciones**: Sugiere acciones basadas en los resultados
- **Colores en consola**: Salida clara y fácil de leer
- **Manejo de errores**: Gestión robusta de errores y excepciones

## 📈 Estados de Salida

- **0**: Operación exitosa
- **1**: Operación completada con advertencias o errores

## ⚙️ Configuración

Los scripts utilizan las siguientes configuraciones:

- **Timeout de comandos**: 30-120 segundos
- **Retención de logs**: 7 días
- **Verificaciones críticas**: Archivos esenciales para el funcionamiento
- **Umbrales de éxito**: 70% para funcional, 90% para excelente

## 🔧 Personalización

Puedes modificar los scripts para:

- Agregar nuevas verificaciones
- Cambiar umbrales de éxito
- Personalizar patrones de limpieza
- Modificar configuraciones de timeout
- Agregar nuevos tipos de reporte

## 📝 Logs y Debugging

Para debug adicional, puedes:

```bash
# Ejecutar con output detallado
node scripts/mantenimiento-maestro.js --completo > mantenimiento.log 2>&1

# Ver logs en tiempo real
tail -f logs/reporte-mantenimiento-maestro.txt
```

---

*Scripts de mantenimiento para Code Solutions Studio - Automatización completa del sistema*
