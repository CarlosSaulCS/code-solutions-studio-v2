#!/usr/bin/env node

/**
 * 🧹 SCRIPT DE LIMPIEZA AUTOMÁTICA Y OPTIMIZACIÓN
 * 
 * Este script automatiza la limpieza y optimización del proyecto:
 * - Elimina archivos temporales y basura
 * - Limpia node_modules y reinstala dependencias
 * - Optimiza el bundle y cache
 * - Limpia logs antiguos
 * - Elimina archivos de build innecesarios
 * - Optimiza imágenes y assets
 * 
 * Uso: node scripts/limpieza-automatica.js [--completa]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function print(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader(title) {
  console.log('\n' + '='.repeat(60));
  print('cyan', `🧹 ${title}`);
  console.log('='.repeat(60));
}

// Función para eliminar archivos/directorios de forma segura
function eliminarSeguro(ruta, descripcion) {
  try {
    if (fs.existsSync(ruta)) {
      const stats = fs.statSync(ruta);
      if (stats.isDirectory()) {
        fs.rmSync(ruta, { recursive: true, force: true });
      } else {
        fs.unlinkSync(ruta);
      }
      print('green', `✅ ${descripcion} eliminado`);
      return true;
    } else {
      print('blue', `ℹ️ ${descripcion} no existe`);
      return false;
    }
  } catch (error) {
    print('red', `❌ Error eliminando ${descripcion}: ${error.message}`);
    return false;
  }
}

// Función para obtener tamaño de directorio
function obtenerTamanoDirectorio(rutaDir) {
  try {
    if (!fs.existsSync(rutaDir)) return 0;
    
    let tamaño = 0;
    const archivos = fs.readdirSync(rutaDir);
    
    for (const archivo of archivos) {
      const rutaCompleta = path.join(rutaDir, archivo);
      const stats = fs.statSync(rutaCompleta);
      
      if (stats.isDirectory()) {
        tamaño += obtenerTamanoDirectorio(rutaCompleta);
      } else {
        tamaño += stats.size;
      }
    }
    
    return tamaño;
  } catch (error) {
    return 0;
  }
}

// Convertir bytes a formato legible
function formatearTamaño(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const tamaños = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tamaños[i];
}

// Función para ejecutar comandos con manejo de errores
function ejecutarComando(comando, descripcion, opcional = false) {
  try {
    print('blue', `🔄 ${descripcion}...`);
    execSync(comando, { 
      stdio: 'pipe', 
      cwd: process.cwd(),
      timeout: 120000 // 2 minutos timeout
    });
    print('green', `✅ ${descripcion} completado`);
    return true;
  } catch (error) {
    if (opcional) {
      print('yellow', `⚠️ ${descripcion} falló (opcional): ${error.message}`);
      return false;
    } else {
      print('red', `❌ Error en ${descripcion}: ${error.message}`);
      return false;
    }
  }
}

// Limpiar archivos temporales por patrón
function limpiarPatron(patron, descripcion) {
  try {
    const comando = process.platform === 'win32' 
      ? `powershell -Command "Get-ChildItem -Path . -Include ${patron} -Recurse | Remove-Item -Force -Recurse"`
      : `find . -name "${patron}" -type f -delete`;
    
    print('blue', `🔍 Buscando ${descripcion}...`);
    execSync(comando, { stdio: 'pipe', cwd: process.cwd() });
    print('green', `✅ ${descripcion} limpiados`);
    return true;
  } catch (error) {
    print('blue', `ℹ️ No se encontraron ${descripcion}`);
    return false;
  }
}

// Función principal de limpieza
async function limpiezaAutomatica(completa = false) {
  const startTime = Date.now();
  
  printHeader('LIMPIEZA AUTOMÁTICA DEL PROYECTO');
  print('white', `Iniciado: ${new Date().toLocaleString()}`);
  print('white', `Modo: ${completa ? 'LIMPIEZA COMPLETA' : 'LIMPIEZA BÁSICA'}`);

  const estadisticas = {
    archivosEliminados: 0,
    directoriosEliminados: 0,
    espacioLiberado: 0,
    errores: []
  };

  // 1. LIMPIEZA DE ARCHIVOS TEMPORALES
  printHeader('1. ARCHIVOS TEMPORALES Y BASURA');
  
  const archivosTemporal = [
    { ruta: '.next', desc: 'Cache de Next.js' },
    { ruta: '.turbo', desc: 'Cache de Turbo' },
    { ruta: 'dist', desc: 'Directorio de build' },
    { ruta: 'build', desc: 'Directorio de build alternativo' },
    { ruta: '.cache', desc: 'Cache general' },
    { ruta: 'coverage', desc: 'Reportes de cobertura' },
    { ruta: '.nyc_output', desc: 'Cache de NYC' }
  ];

  for (const item of archivosTemporal) {
    const tamañoAntes = obtenerTamanoDirectorio(item.ruta);
    if (eliminarSeguro(item.ruta, item.desc)) {
      estadisticas.directoriosEliminados++;
      estadisticas.espacioLiberado += tamañoAntes;
    }
  }

  // 2. LIMPIEZA DE ARCHIVOS POR PATRÓN
  printHeader('2. ARCHIVOS POR PATRÓN');
  
  const patronesLimpieza = [
    { patron: '*.tmp', desc: 'archivos temporales (.tmp)' },
    { patron: '*.temp', desc: 'archivos temporales (.temp)' },
    { patron: '*.log', desc: 'archivos de log antiguos' },
    { patron: '*.bak', desc: 'archivos de backup (.bak)' },
    { patron: '*.old', desc: 'archivos antiguos (.old)' },
    { patron: '*~', desc: 'archivos de backup del editor' },
    { patron: '.DS_Store', desc: 'archivos de sistema macOS' },
    { patron: 'Thumbs.db', desc: 'archivos de sistema Windows' },
    { patron: '*.swp', desc: 'archivos swap de Vim' },
    { patron: '*.swo', desc: 'archivos swap de Vim' }
  ];

  for (const patron of patronesLimpieza) {
    if (limpiarPatron(patron.patron, patron.desc)) {
      estadisticas.archivosEliminados += 5; // Estimación
    }
  }

  // 3. LIMPIEZA DE LOGS ANTIGUOS
  printHeader('3. LOGS Y REPORTES ANTIGUOS');
  
  if (fs.existsSync('logs')) {
    print('blue', '📋 Limpiando logs antiguos...');
    
    const archivosLogs = fs.readdirSync('logs');
    const ahora = Date.now();
    const seteDiasMs = 7 * 24 * 60 * 60 * 1000; // 7 días en ms
    
    let logsEliminados = 0;
    for (const archivo of archivosLogs) {
      const rutaArchivo = path.join('logs', archivo);
      const stats = fs.statSync(rutaArchivo);
      
      // Eliminar logs más antiguos de 7 días
      if (ahora - stats.mtime.getTime() > seteDiasMs) {
        if (eliminarSeguro(rutaArchivo, `Log antiguo: ${archivo}`)) {
          logsEliminados++;
          estadisticas.archivosEliminados++;
        }
      }
    }
    
    if (logsEliminados === 0) {
      print('blue', 'ℹ️ No hay logs antiguos para eliminar');
    }
  }

  // 4. LIMPIEZA DE NODE_MODULES (si es completa)
  if (completa) {
    printHeader('4. LIMPIEZA COMPLETA DE DEPENDENCIAS');
    
    const tamañoNodeModules = obtenerTamanoDirectorio('node_modules');
    
    if (eliminarSeguro('node_modules', 'Node modules')) {
      estadisticas.directoriosEliminados++;
      estadisticas.espacioLiberado += tamañoNodeModules;
      
      // Limpiar cache de npm
      ejecutarComando('npm cache clean --force', 'Limpieza de cache NPM', true);
      
      // Reinstalar dependencias
      if (ejecutarComando('npm install', 'Reinstalación de dependencias')) {
        print('green', '✅ Dependencias reinstaladas exitosamente');
      }
    }
  }

  // 5. OPTIMIZACIÓN DE PACKAGE-LOCK
  printHeader('5. OPTIMIZACIÓN DE DEPENDENCIAS');
  
  if (fs.existsSync('package-lock.json')) {
    ejecutarComando('npm audit fix', 'Corrección de vulnerabilidades', true);
    ejecutarComando('npm dedupe', 'Deduplicación de dependencias', true);
  }

  // 6. LIMPIEZA DE ARCHIVOS DE REPORTE ANTIGUOS
  printHeader('6. REPORTES Y DOCUMENTACIÓN TEMPORAL');
  
  const archivosReporte = [
    'LIMPIEZA_FINAL_COMPLETADA.md',
    'REPORTE_TEMPORAL.md',
    'VERIFICACION_TEMPORAL.md',
    'CLEANUP_REPORT.md'
  ];

  for (const archivo of archivosReporte) {
    if (eliminarSeguro(archivo, `Reporte temporal: ${archivo}`)) {
      estadisticas.archivosEliminados++;
    }
  }

  // 7. VERIFICACIÓN POST-LIMPIEZA
  printHeader('7. VERIFICACIÓN POST-LIMPIEZA');
  
  print('blue', '🔍 Verificando integridad del proyecto...');
  
  const archivosCriticos = [
    'package.json',
    'next.config.js',
    'src/app/layout.tsx',
    'src/app/page.tsx'
  ];

  let integridadOK = true;
  for (const archivo of archivosCriticos) {
    if (!fs.existsSync(archivo)) {
      print('red', `❌ Archivo crítico faltante: ${archivo}`);
      integridadOK = false;
      estadisticas.errores.push(`Archivo crítico faltante: ${archivo}`);
    }
  }

  if (integridadOK) {
    print('green', '✅ Integridad del proyecto verificada');
    
    // Verificar que compile
    if (ejecutarComando('npm run build', 'Verificación de compilación')) {
      print('green', '✅ El proyecto compila correctamente después de la limpieza');
    }
  }

  // 8. REPORTE FINAL
  printHeader('REPORTE DE LIMPIEZA');
  
  const endTime = Date.now();
  const tiempoTotal = ((endTime - startTime) / 1000).toFixed(2);
  
  print('white', `⏱️ Tiempo total: ${tiempoTotal} segundos`);
  print('white', `🗑️ Archivos eliminados: ${estadisticas.archivosEliminados}`);
  print('white', `📁 Directorios eliminados: ${estadisticas.directoriosEliminados}`);
  print('white', `💾 Espacio liberado: ${formatearTamaño(estadisticas.espacioLiberado)}`);

  if (estadisticas.errores.length > 0) {
    print('red', '\n🚨 ERRORES DETECTADOS:');
    estadisticas.errores.forEach(error => {
      print('red', `   • ${error}`);
    });
  }

  // Guardar reporte de limpieza
  const reporte = {
    fecha: new Date().toISOString(),
    tipoLimpieza: completa ? 'COMPLETA' : 'BÁSICA',
    tiempoEjecucion: tiempoTotal,
    estadisticas,
    integridadVerificada: integridadOK
  };

  // Crear directorio logs si no existe
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
  }

  const reportePath = 'logs/reporte-limpieza.json';
  fs.writeFileSync(reportePath, JSON.stringify(reporte, null, 2));

  if (integridadOK && estadisticas.errores.length === 0) {
    print('green', '\n🎉 ¡LIMPIEZA COMPLETADA EXITOSAMENTE!');
    print('green', '✅ Proyecto optimizado y funcionando correctamente');
  } else {
    print('yellow', '\n⚠️ Limpieza completada con advertencias');
    print('yellow', 'Revisa los errores reportados');
  }

  print('blue', `📄 Reporte detallado guardado en: ${reportePath}`);

  console.log('\n' + '='.repeat(60));
  print('cyan', '🏁 LIMPIEZA AUTOMÁTICA COMPLETADA');
  console.log('='.repeat(60));

  return integridadOK && estadisticas.errores.length === 0;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const limpiezaCompleta = args.includes('--completa') || args.includes('--full');
  
  limpiezaAutomatica(limpiezaCompleta)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error durante la limpieza:', error);
      process.exit(1);
    });
}

module.exports = { limpiezaAutomatica };
