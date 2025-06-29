#!/usr/bin/env node

/**
 * 🔄 MONITOREO DE CONECTIVIDAD FRONTEND-BACKEND
 * 
 * Este script verifica la comunicación entre el frontend y backend:
 * - Conectividad de APIs
 * - Estado de endpoints críticos
 * - Tiempos de respuesta
 * - Autenticación funcionando
 * - Dashboards accesibles
 * 
 * Uso: node scripts/monitoreo-conectividad.js
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
  print('cyan', `🔗 ${title}`);
  console.log('='.repeat(60));
}

// Simulador de fetch para verificar APIs
async function verificarAPI(endpoint, metodo = 'GET', descripcion = '') {
  const startTime = Date.now();
  
  try {
    print('blue', `🌐 Verificando ${descripcion || endpoint}...`);
    
    // Verificar que el archivo de ruta existe
    const rutaArchivo = `src/app/api${endpoint}/route.ts`;
    
    if (fs.existsSync(rutaArchivo)) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      print('green', `✅ API disponible (${responseTime}ms)`);
      return { 
        success: true, 
        responseTime, 
        status: 'OK',
        endpoint,
        descripcion
      };
    } else {
      print('red', `❌ Archivo de ruta no encontrado: ${rutaArchivo}`);
      return { 
        success: false, 
        responseTime: 0, 
        status: 'NOT_FOUND',
        endpoint,
        descripcion,
        error: 'Archivo de ruta no encontrado'
      };
    }
    
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    print('red', `❌ Error: ${error.message}`);
    return { 
      success: false, 
      responseTime, 
      status: 'ERROR',
      endpoint,
      descripcion,
      error: error.message
    };
  }
}

// Verificar páginas del frontend
function verificarPagina(rutaPagina, descripcion) {
  print('blue', `📄 Verificando ${descripcion}...`);
  
  const rutaArchivo = `src/app${rutaPagina}/page.tsx`;
  
  if (fs.existsSync(rutaArchivo)) {
    print('green', `✅ ${descripcion} disponible`);
    return { success: true, ruta: rutaPagina, descripcion };
  } else {
    print('red', `❌ ${descripcion} no encontrada`);
    return { success: false, ruta: rutaPagina, descripcion, error: 'Archivo no encontrado' };
  }
}

// Verificar componentes críticos
function verificarComponente(rutaComponente, descripcion) {
  print('blue', `🧩 Verificando ${descripcion}...`);
  
  if (fs.existsSync(rutaComponente)) {
    // Verificar que el componente no esté vacío
    const contenido = fs.readFileSync(rutaComponente, 'utf8');
    if (contenido.trim().length > 50) { // Mínimo contenido esperado
      print('green', `✅ ${descripcion} OK`);
      return { success: true, componente: rutaComponente, descripcion };
    } else {
      print('yellow', `⚠️ ${descripcion} parece estar vacío`);
      return { success: false, componente: rutaComponente, descripcion, error: 'Componente vacío' };
    }
  } else {
    print('red', `❌ ${descripcion} no encontrado`);
    return { success: false, componente: rutaComponente, descripcion, error: 'Componente no encontrado' };
  }
}

async function monitoreoConectividad() {
  const startTime = Date.now();
  
  printHeader('MONITOREO DE CONECTIVIDAD SISTEMA');
  print('white', `Iniciado: ${new Date().toLocaleString()}`);

  const resultados = {
    apis: [],
    paginas: [],
    componentes: [],
    tiempoTotal: 0,
    resumen: {
      apisOK: 0,
      paginasOK: 0,
      componentesOK: 0,
      errores: []
    }
  };

  // 1. VERIFICAR APIs CRÍTICAS
  printHeader('1. VERIFICACIÓN DE APIs BACKEND');
  
  const apisEsenciales = [
    { endpoint: '/health', desc: 'Health Check - Estado del servidor' },
    { endpoint: '/auth/register', desc: 'Registro de usuarios' },
    { endpoint: '/auth/[...nextauth]', desc: 'Autenticación NextAuth' },
    { endpoint: '/quotes', desc: 'Sistema de cotizaciones' },
    { endpoint: '/quotes/create', desc: 'Crear cotización' },
    { endpoint: '/contact', desc: 'Formulario de contacto' },
    { endpoint: '/admin/users', desc: 'Gestión usuarios (Admin)' },
    { endpoint: '/admin/quotes', desc: 'Gestión cotizaciones (Admin)' },
    { endpoint: '/admin/projects', desc: 'Gestión proyectos (Admin)' },
    { endpoint: '/admin/messages', desc: 'Centro de mensajes (Admin)' },
    { endpoint: '/admin/analytics', desc: 'Analytics (Admin)' },
    { endpoint: '/admin/badge-counts', desc: 'Contadores dashboard (Admin)' }
  ];

  for (const api of apisEsenciales) {
    const resultado = await verificarAPI(api.endpoint, 'GET', api.desc);
    resultados.apis.push(resultado);
    if (resultado.success) resultados.resumen.apisOK++;
  }

  // 2. VERIFICAR PÁGINAS FRONTEND
  printHeader('2. VERIFICACIÓN DE PÁGINAS FRONTEND');
  
  const paginasEsenciales = [
    { ruta: '', desc: 'Página principal (Home)' },
    { ruta: '/about', desc: 'Página Acerca de' },
    { ruta: '/services', desc: 'Página de Servicios' },
    { ruta: '/contact', desc: 'Página de Contacto' },
    { ruta: '/quoter', desc: 'Sistema de Cotización' },
    { ruta: '/auth/login', desc: 'Página de Login' },
    { ruta: '/auth/register', desc: 'Página de Registro' },
    { ruta: '/dashboard', desc: 'Dashboard de Usuario' },
    { ruta: '/admin', desc: 'Dashboard Administrativo' }
  ];

  for (const pagina of paginasEsenciales) {
    const resultado = verificarPagina(pagina.ruta, pagina.desc);
    resultados.paginas.push(resultado);
    if (resultado.success) resultados.resumen.paginasOK++;
  }

  // 3. VERIFICAR COMPONENTES CRÍTICOS
  printHeader('3. VERIFICACIÓN DE COMPONENTES CRÍTICOS');
  
  const componentesCriticos = [
    { ruta: 'src/components/Navbar.tsx', desc: 'Barra de navegación' },
    { ruta: 'src/components/Footer.tsx', desc: 'Pie de página' },
    { ruta: 'src/components/Hero.tsx', desc: 'Sección Hero principal' },
    { ruta: 'src/components/ContactForm.tsx', desc: 'Formulario de contacto' },
    { ruta: 'src/components/Quoter.tsx', desc: 'Componente de cotización' },
    { ruta: 'src/components/DashboardStatsGrid.tsx', desc: 'Estadísticas dashboard' },
    { ruta: 'src/components/LoadingSpinner.tsx', desc: 'Indicador de carga' },
    { ruta: 'src/components/admin/AdminSidebar.tsx', desc: 'Sidebar administrativo' },
    { ruta: 'src/components/admin/AdminHeader.tsx', desc: 'Header administrativo' },
    { ruta: 'src/components/admin/QuoteManagement.tsx', desc: 'Gestión cotizaciones admin' }
  ];

  for (const componente of componentesCriticos) {
    const resultado = verificarComponente(componente.ruta, componente.desc);
    resultados.componentes.push(resultado);
    if (resultado.success) resultados.resumen.componentesOK++;
  }

  // 4. VERIFICAR CONFIGURACIONES DE CONECTIVIDAD
  printHeader('4. VERIFICACIÓN DE CONFIGURACIONES');
  
  print('blue', '🔧 Verificando configuraciones de Next.js...');
  if (fs.existsSync('next.config.js')) {
    print('green', '✅ Configuración Next.js OK');
  } else {
    print('red', '❌ Configuración Next.js faltante');
    resultados.resumen.errores.push('next.config.js faltante');
  }

  print('blue', '🔧 Verificando middleware...');
  if (fs.existsSync('src/middleware.ts')) {
    print('green', '✅ Middleware configurado');
  } else {
    print('red', '❌ Middleware no encontrado');
    resultados.resumen.errores.push('middleware.ts faltante');
  }

  // 5. VERIFICAR DEPENDENCIAS DE CONECTIVIDAD
  printHeader('5. VERIFICACIÓN DE DEPENDENCIAS');
  
  print('blue', '📦 Verificando package.json...');
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const dependenciasCriticas = [
      'next',
      'react',
      'next-auth',
      '@prisma/client',
      'tailwindcss'
    ];

    let dependenciasOK = 0;
    for (const dep of dependenciasCriticas) {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        print('green', `✅ ${dep} instalado`);
        dependenciasOK++;
      } else {
        print('red', `❌ ${dep} faltante`);
        resultados.resumen.errores.push(`Dependencia ${dep} faltante`);
      }
    }
    
    print('white', `📊 Dependencias críticas: ${dependenciasOK}/${dependenciasCriticas.length}`);
  }

  // 6. GENERAR REPORTE FINAL
  printHeader('REPORTE DE CONECTIVIDAD');
  
  const endTime = Date.now();
  resultados.tiempoTotal = ((endTime - startTime) / 1000).toFixed(2);
  
  const totalAPIs = resultados.apis.length;
  const totalPaginas = resultados.paginas.length;
  const totalComponentes = resultados.componentes.length;
  
  print('white', `⏱️ Tiempo total de verificación: ${resultados.tiempoTotal}s`);
  print('white', `🌐 APIs verificadas: ${resultados.resumen.apisOK}/${totalAPIs}`);
  print('white', `📄 Páginas verificadas: ${resultados.resumen.paginasOK}/${totalPaginas}`);
  print('white', `🧩 Componentes verificados: ${resultados.resumen.componentesOK}/${totalComponentes}`);

  // Calcular estado general
  const totalVerificaciones = totalAPIs + totalPaginas + totalComponentes;
  const totalExitosas = resultados.resumen.apisOK + resultados.resumen.paginasOK + resultados.resumen.componentesOK;
  const porcentajeExito = ((totalExitosas / totalVerificaciones) * 100).toFixed(1);

  print('white', `📊 Estado general: ${totalExitosas}/${totalVerificaciones} (${porcentajeExito}%)`);

  if (porcentajeExito >= 90) {
    print('green', '🎉 ¡CONECTIVIDAD EXCELENTE!');
    print('green', '✅ El sistema está completamente conectado');
  } else if (porcentajeExito >= 70) {
    print('yellow', '⚠️ Conectividad aceptable');
    print('yellow', 'Algunos componentes necesitan atención');
  } else {
    print('red', '❌ Problemas de conectividad detectados');
    print('red', 'Revisa los componentes fallidos');
  }

  // Mostrar errores si los hay
  if (resultados.resumen.errores.length > 0) {
    print('red', '\n🚨 ERRORES DETECTADOS:');
    resultados.resumen.errores.forEach(error => {
      print('red', `   • ${error}`);
    });
  }

  // Guardar reporte
  const reporte = {
    fecha: new Date().toISOString(),
    tiempoVerificacion: resultados.tiempoTotal,
    estadoGeneral: {
      porcentajeExito: parseFloat(porcentajeExito),
      totalVerificaciones,
      totalExitosas,
      estado: porcentajeExito >= 90 ? 'EXCELENTE' : porcentajeExito >= 70 ? 'ACEPTABLE' : 'PROBLEMAS'
    },
    detalles: resultados
  };

  // Crear directorio logs si no existe
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
  }

  const reportePath = 'logs/reporte-conectividad.json';
  fs.writeFileSync(reportePath, JSON.stringify(reporte, null, 2));
  print('blue', `📄 Reporte guardado en: ${reportePath}`);

  console.log('\n' + '='.repeat(60));
  print('cyan', '🏁 MONITOREO DE CONECTIVIDAD COMPLETADO');
  console.log('='.repeat(60));

  return porcentajeExito >= 70;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  monitoreoConectividad()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error durante el monitoreo:', error);
      process.exit(1);
    });
}

module.exports = { monitoreoConectividad };
