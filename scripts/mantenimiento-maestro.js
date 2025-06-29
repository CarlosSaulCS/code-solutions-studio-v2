#!/usr/bin/env node

/**
 * 🎛️ SCRIPT MAESTRO DE MANTENIMIENTO AUTOMATIZADO
 * 
 * Este script ejecuta todos los scripts de mantenimiento en secuencia:
 * - Verificación completa del sistema
 * - Monitoreo de conectividad
 * - Verificación de autenticación y dashboards
 * - Limpieza automática (opcional)
 * - Generación de reporte consolidado
 * 
 * Uso: 
 *   node scripts/mantenimiento-maestro.js
 *   node scripts/mantenimiento-maestro.js --con-limpieza
 *   node scripts/mantenimiento-maestro.js --completo
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Importar otros scripts
const { verificarSistemaCompleto } = require('./verificar-sistema-completo.js');
const { monitoreoConectividad } = require('./monitoreo-conectividad.js');
const { verificarAuthDashboards } = require('./verificar-auth-dashboards.js');
const { limpiezaAutomatica } = require('./limpieza-automatica.js');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
};

function print(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader(title) {
  console.log('\n' + '█'.repeat(60));
  print('magenta', `🎛️ ${title}`);
  console.log('█'.repeat(60));
}

function printSubHeader(title) {
  console.log('\n' + '▓'.repeat(50));
  print('cyan', `📋 ${title}`);
  console.log('▓'.repeat(50));
}

// Función para crear un separador visual
function separador() {
  console.log('\n' + '─'.repeat(60));
}

// Función para mostrar progreso
function mostrarProgreso(actual, total, descripcion) {
  const porcentaje = Math.round((actual / total) * 100);
  const barras = Math.round(porcentaje / 5);
  const barra = '█'.repeat(barras) + '░'.repeat(20 - barras);
  
  print('blue', `📊 Progreso: [${barra}] ${porcentaje}% - ${descripcion}`);
}

// Función para formatear tiempo
function formatearTiempo(milisegundos) {
  const segundos = Math.floor(milisegundos / 1000);
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  
  if (minutos > 0) {
    return `${minutos}m ${segundosRestantes}s`;
  }
  return `${segundosRestantes}s`;
}

async function mantenimientoMaestro(opciones = {}) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  printHeader('MANTENIMIENTO MAESTRO DEL SISTEMA');
  print('white', `🕐 Iniciado: ${new Date().toLocaleString()}`);
  print('white', `🎯 Modo: ${opciones.completo ? 'COMPLETO' : 'ESTÁNDAR'}`);
  print('white', `🧹 Limpieza: ${opciones.conLimpieza ? 'SÍ' : 'NO'}`);

  const resultadosGlobales = {
    timestamp,
    configuracion: opciones,
    verificaciones: [],
    resumenFinal: {},
    errores: [],
    recomendaciones: [],
    tiempoTotal: 0
  };

  let pasoActual = 0;
  const totalPasos = opciones.conLimpieza ? 5 : 4;

  try {
    // PASO 1: VERIFICACIÓN COMPLETA DEL SISTEMA
    pasoActual++;
    mostrarProgreso(pasoActual, totalPasos, 'Verificación completa del sistema');
    printSubHeader('PASO 1: VERIFICACIÓN COMPLETA DEL SISTEMA');
    
    const inicioSistema = Date.now();
    const resultadoSistema = await verificarSistemaCompleto();
    const tiempoSistema = Date.now() - inicioSistema;
    
    resultadosGlobales.verificaciones.push({
      paso: 1,
      nombre: 'Verificación Sistema',
      exitoso: resultadoSistema,
      tiempo: formatearTiempo(tiempoSistema),
      archivo_reporte: 'logs/reporte-sistema.json'
    });

    if (resultadoSistema) {
      print('green', '✅ Verificación del sistema: EXITOSA');
    } else {
      print('red', '❌ Verificación del sistema: PROBLEMAS DETECTADOS');
      resultadosGlobales.errores.push('Problemas en verificación del sistema');
    }

    separador();

    // PASO 2: MONITOREO DE CONECTIVIDAD
    pasoActual++;
    mostrarProgreso(pasoActual, totalPasos, 'Monitoreo de conectividad');
    printSubHeader('PASO 2: MONITOREO DE CONECTIVIDAD');
    
    const inicioConectividad = Date.now();
    const resultadoConectividad = await monitoreoConectividad();
    const tiempoConectividad = Date.now() - inicioConectividad;
    
    resultadosGlobales.verificaciones.push({
      paso: 2,
      nombre: 'Monitoreo Conectividad',
      exitoso: resultadoConectividad,
      tiempo: formatearTiempo(tiempoConectividad),
      archivo_reporte: 'logs/reporte-conectividad.json'
    });

    if (resultadoConectividad) {
      print('green', '✅ Monitoreo de conectividad: EXITOSO');
    } else {
      print('yellow', '⚠️ Monitoreo de conectividad: ADVERTENCIAS');
      resultadosGlobales.recomendaciones.push('Revisar conectividad de algunos componentes');
    }

    separador();

    // PASO 3: VERIFICACIÓN DE AUTENTICACIÓN Y DASHBOARDS
    pasoActual++;
    mostrarProgreso(pasoActual, totalPasos, 'Verificación de autenticación y dashboards');
    printSubHeader('PASO 3: VERIFICACIÓN DE AUTENTICACIÓN Y DASHBOARDS');
    
    const inicioAuth = Date.now();
    const resultadoAuth = await verificarAuthDashboards();
    const tiempoAuth = Date.now() - inicioAuth;
    
    resultadosGlobales.verificaciones.push({
      paso: 3,
      nombre: 'Autenticación y Dashboards',
      exitoso: resultadoAuth,
      tiempo: formatearTiempo(tiempoAuth),
      archivo_reporte: 'logs/reporte-auth-dashboards.json'
    });

    if (resultadoAuth) {
      print('green', '✅ Autenticación y dashboards: FUNCIONANDO');
    } else {
      print('yellow', '⚠️ Autenticación y dashboards: NECESITA ATENCIÓN');
      resultadosGlobales.recomendaciones.push('Revisar configuración de autenticación y componentes de dashboard');
    }

    separador();

    // PASO 4: LIMPIEZA AUTOMÁTICA (OPCIONAL)
    if (opciones.conLimpieza) {
      pasoActual++;
      mostrarProgreso(pasoActual, totalPasos, 'Limpieza automática');
      printSubHeader('PASO 4: LIMPIEZA AUTOMÁTICA');
      
      const inicioLimpieza = Date.now();
      const resultadoLimpieza = await limpiezaAutomatica(opciones.completo);
      const tiempoLimpieza = Date.now() - inicioLimpieza;
      
      resultadosGlobales.verificaciones.push({
        paso: 4,
        nombre: 'Limpieza Automática',
        exitoso: resultadoLimpieza,
        tiempo: formatearTiempo(tiempoLimpieza),
        archivo_reporte: 'logs/reporte-limpieza.json'
      });

      if (resultadoLimpieza) {
        print('green', '✅ Limpieza automática: COMPLETADA');
      } else {
        print('yellow', '⚠️ Limpieza automática: COMPLETADA CON ADVERTENCIAS');
        resultadosGlobales.recomendaciones.push('Revisar reporte de limpieza para advertencias');
      }

      separador();
    }

    // PASO FINAL: VERIFICACIÓN POST-MANTENIMIENTO
    pasoActual++;
    mostrarProgreso(pasoActual, totalPasos, 'Verificación final');
    printSubHeader('VERIFICACIÓN POST-MANTENIMIENTO');
    
    print('blue', '🔍 Ejecutando verificación final...');
    
    try {
      // Verificar que el proyecto aún compile después del mantenimiento
      execSync('npm run build', { stdio: 'pipe', timeout: 60000 });
      print('green', '✅ Compilación post-mantenimiento: EXITOSA');
      
      // Ejecutar tests si están disponibles
      try {
        execSync('npm test -- --passWithNoTests', { stdio: 'pipe', timeout: 60000 });
        print('green', '✅ Pruebas post-mantenimiento: EXITOSAS');
      } catch (testError) {
        print('yellow', '⚠️ Algunas pruebas fallaron o no hay pruebas disponibles');
      }
      
    } catch (buildError) {
      print('red', '❌ Error en compilación post-mantenimiento');
      resultadosGlobales.errores.push('Error en compilación post-mantenimiento');
    }

  } catch (error) {
    print('red', `❌ Error durante el mantenimiento: ${error.message}`);
    resultadosGlobales.errores.push(`Error crítico: ${error.message}`);
  }

  // GENERAR REPORTE CONSOLIDADO FINAL
  printHeader('REPORTE CONSOLIDADO FINAL');
  
  const endTime = Date.now();
  resultadosGlobales.tiempoTotal = formatearTiempo(endTime - startTime);
  
  // Calcular estadísticas finales
  const verificacionesExitosas = resultadosGlobales.verificaciones.filter(v => v.exitoso).length;
  const totalVerificaciones = resultadosGlobales.verificaciones.length;
  const porcentajeExito = totalVerificaciones > 0 ? ((verificacionesExitosas / totalVerificaciones) * 100).toFixed(1) : 0;

  resultadosGlobales.resumenFinal = {
    verificacionesExitosas,
    totalVerificaciones,
    porcentajeExito: parseFloat(porcentajeExito),
    estado: porcentajeExito >= 90 ? 'EXCELENTE' : porcentajeExito >= 70 ? 'BUENO' : 'NECESITA_ATENCION',
    erroresEncontrados: resultadosGlobales.errores.length,
    recomendacionesGeneradas: resultadosGlobales.recomendaciones.length
  };

  // Mostrar resumen
  print('white', `⏱️ Tiempo total de mantenimiento: ${resultadosGlobales.tiempoTotal}`);
  print('white', `📊 Verificaciones exitosas: ${verificacionesExitosas}/${totalVerificaciones} (${porcentajeExito}%)`);
  print('white', `🚨 Errores encontrados: ${resultadosGlobales.errores.length}`);
  print('white', `💡 Recomendaciones generadas: ${resultadosGlobales.recomendaciones.length}`);

  // Mostrar detalle de verificaciones
  console.log('\n📋 DETALLE DE VERIFICACIONES:');
  resultadosGlobales.verificaciones.forEach(v => {
    const icono = v.exitoso ? '✅' : '⚠️';
    print('white', `   ${icono} ${v.nombre}: ${v.exitoso ? 'OK' : 'ADVERTENCIAS'} (${v.tiempo})`);
  });

  // Mostrar errores si los hay
  if (resultadosGlobales.errores.length > 0) {
    print('red', '\n🚨 ERRORES CRÍTICOS:');
    resultadosGlobales.errores.forEach(error => {
      print('red', `   • ${error}`);
    });
  }

  // Mostrar recomendaciones si las hay
  if (resultadosGlobales.recomendaciones.length > 0) {
    print('yellow', '\n💡 RECOMENDACIONES:');
    resultadosGlobales.recomendaciones.forEach(rec => {
      print('yellow', `   • ${rec}`);
    });
  }

  // Estado final del sistema
  console.log('\n' + '═'.repeat(60));
  if (resultadosGlobales.resumenFinal.estado === 'EXCELENTE') {
    print('green', '🎉 ¡MANTENIMIENTO COMPLETADO EXITOSAMENTE!');
    print('green', '✅ El sistema está en excelente estado');
  } else if (resultadosGlobales.resumenFinal.estado === 'BUENO') {
    print('yellow', '✅ Mantenimiento completado satisfactoriamente');
    print('yellow', '⚠️ Algunas áreas necesitan atención menor');
  } else {
    print('red', '⚠️ Mantenimiento completado con problemas');
    print('red', '🔧 Se requiere atención inmediata en algunas áreas');
  }
  console.log('═'.repeat(60));

  // Guardar reporte consolidado
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
  }

  const reporteConsolidado = 'logs/reporte-mantenimiento-maestro.json';
  fs.writeFileSync(reporteConsolidado, JSON.stringify(resultadosGlobales, null, 2));
  
  print('blue', `📄 Reporte consolidado guardado en: ${reporteConsolidado}`);
  
  // Generar reporte en texto plano también
  const reporteTexto = generarReporteTexto(resultadosGlobales);
  const reporteTextoPath = 'logs/reporte-mantenimiento-maestro.txt';
  fs.writeFileSync(reporteTextoPath, reporteTexto);
  
  print('blue', `📝 Reporte en texto guardado en: ${reporteTextoPath}`);

  return resultadosGlobales.resumenFinal.estado !== 'NECESITA_ATENCION';
}

// Función para generar reporte en texto plano
function generarReporteTexto(resultados) {
  const fecha = new Date(resultados.timestamp).toLocaleString();
  
  let reporte = `
╔══════════════════════════════════════════════════════════════╗
║                    REPORTE DE MANTENIMIENTO                  ║
║                   CODE SOLUTIONS STUDIO                      ║
╚══════════════════════════════════════════════════════════════╝

📅 Fecha: ${fecha}
⏱️ Tiempo Total: ${resultados.tiempoTotal}
🎯 Configuración: ${JSON.stringify(resultados.configuracion)}

┌─────────────────────────────────────────────────────────────┐
│                       RESUMEN GENERAL                       │
└─────────────────────────────────────────────────────────────┘

📊 Verificaciones Exitosas: ${resultados.resumenFinal.verificacionesExitosas}/${resultados.resumenFinal.totalVerificaciones}
📈 Porcentaje de Éxito: ${resultados.resumenFinal.porcentajeExito}%
🎯 Estado General: ${resultados.resumenFinal.estado}
🚨 Errores Encontrados: ${resultados.resumenFinal.erroresEncontrados}
💡 Recomendaciones: ${resultados.resumenFinal.recomendacionesGeneradas}

┌─────────────────────────────────────────────────────────────┐
│                  DETALLE DE VERIFICACIONES                  │
└─────────────────────────────────────────────────────────────┘

`;

  resultados.verificaciones.forEach((v, index) => {
    const estado = v.exitoso ? '✅ EXITOSO' : '⚠️ ADVERTENCIAS';
    reporte += `${index + 1}. ${v.nombre}
   Estado: ${estado}
   Tiempo: ${v.tiempo}
   Reporte: ${v.archivo_reporte}

`;
  });

  if (resultados.errores.length > 0) {
    reporte += `
┌─────────────────────────────────────────────────────────────┐
│                      ERRORES CRÍTICOS                       │
└─────────────────────────────────────────────────────────────┘

`;
    resultados.errores.forEach((error, index) => {
      reporte += `${index + 1}. ${error}\n`;
    });
  }

  if (resultados.recomendaciones.length > 0) {
    reporte += `
┌─────────────────────────────────────────────────────────────┐
│                     RECOMENDACIONES                         │
└─────────────────────────────────────────────────────────────┘

`;
    resultados.recomendaciones.forEach((rec, index) => {
      reporte += `${index + 1}. ${rec}\n`;
    });
  }

  reporte += `
──────────────────────────────────────────────────────────────
Reporte generado automáticamente por el Sistema de Mantenimiento
Code Solutions Studio - ${fecha}
──────────────────────────────────────────────────────────────
`;

  return reporte;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const opciones = {
    conLimpieza: args.includes('--con-limpieza') || args.includes('--completo'),
    completo: args.includes('--completo')
  };

  print('cyan', '🚀 Iniciando Mantenimiento Maestro del Sistema...');
  
  mantenimientoMaestro(opciones)
    .then(success => {
      if (success) {
        print('green', '\n🎉 ¡Mantenimiento maestro completado exitosamente!');
      } else {
        print('yellow', '\n⚠️ Mantenimiento maestro completado con advertencias');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      print('red', `\n❌ Error crítico durante el mantenimiento maestro: ${error.message}`);
      console.error(error);
      process.exit(1);
    });
}

module.exports = { mantenimientoMaestro };
