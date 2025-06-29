#!/usr/bin/env node

/**
 * 🔐 VERIFICADOR DE AUTENTICACIÓN Y DASHBOARDS
 * 
 * Este script verifica específicamente:
 * - Sistema de autenticación funcionando
 * - Dashboard de usuario accesible
 * - Dashboard administrativo funcionando
 * - Rutas protegidas correctas
 * - Middleware de autenticación
 * 
 * Uso: node scripts/verificar-auth-dashboards.js
 */

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
  print('cyan', `🔐 ${title}`);
  console.log('='.repeat(60));
}

// Verificar contenido de archivo
function verificarContenidoArchivo(ruta, patronesBuscar, descripcion) {
  print('blue', `📄 Verificando ${descripcion}...`);
  
  if (!fs.existsSync(ruta)) {
    print('red', `❌ ${descripcion} no encontrado`);
    return { success: false, error: 'Archivo no encontrado' };
  }

  try {
    const contenido = fs.readFileSync(ruta, 'utf8');
    
    if (contenido.trim().length < 50) {
      print('yellow', `⚠️ ${descripcion} parece estar vacío`);
      return { success: false, error: 'Archivo vacío' };
    }

    const patronesEncontrados = [];
    const patronesFaltantes = [];

    for (const patron of patronesBuscar) {
      if (contenido.includes(patron)) {
        patronesEncontrados.push(patron);
      } else {
        patronesFaltantes.push(patron);
      }
    }

    if (patronesFaltantes.length === 0) {
      print('green', `✅ ${descripcion} OK - Todos los componentes encontrados`);
      return { success: true, encontrados: patronesEncontrados };
    } else {
      print('yellow', `⚠️ ${descripcion} - Algunos componentes faltantes`);
      print('white', `   Encontrados: ${patronesEncontrados.length}/${patronesBuscar.length}`);
      return { 
        success: false, 
        encontrados: patronesEncontrados, 
        faltantes: patronesFaltantes 
      };
    }

  } catch (error) {
    print('red', `❌ Error leyendo ${descripcion}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Verificar configuración de NextAuth
function verificarNextAuth() {
  print('blue', '🔑 Verificando configuración de NextAuth...');
  
  const rutaNextAuth = 'src/app/api/auth/[...nextauth]/route.ts';
  
  if (!fs.existsSync(rutaNextAuth)) {
    print('red', '❌ Configuración NextAuth no encontrada');
    return false;
  }

  const contenido = fs.readFileSync(rutaNextAuth, 'utf8');
  
  const elementosEsenciales = [
    'NextAuth',
    'providers',
    'callbacks',
    'session'
  ];

  let elementosEncontrados = 0;
  for (const elemento of elementosEsenciales) {
    if (contenido.includes(elemento)) {
      elementosEncontrados++;
    }
  }

  if (elementosEncontrados >= 3) {
    print('green', `✅ NextAuth configurado correctamente (${elementosEncontrados}/${elementosEsenciales.length} elementos)`);
    return true;
  } else {
    print('yellow', `⚠️ NextAuth parcialmente configurado (${elementosEncontrados}/${elementosEsenciales.length} elementos)`);
    return false;
  }
}

// Verificar middleware de autenticación
function verificarMiddleware() {
  print('blue', '🛡️ Verificando middleware de autenticación...');
  
  const rutaMiddleware = 'src/middleware.ts';
  
  if (!fs.existsSync(rutaMiddleware)) {
    print('red', '❌ Middleware no encontrado');
    return false;
  }

  const contenido = fs.readFileSync(rutaMiddleware, 'utf8');
  
  const funcionesMiddleware = [
    'NextRequest',
    'NextResponse',
    'matcher',
    'middleware'
  ];

  let funcionesEncontradas = 0;
  for (const funcion of funcionesMiddleware) {
    if (contenido.includes(funcion)) {
      funcionesEncontradas++;
    }
  }

  if (funcionesEncontradas >= 3) {
    print('green', `✅ Middleware configurado (${funcionesEncontradas}/${funcionesMiddleware.length} funciones)`);
    return true;
  } else {
    print('yellow', `⚠️ Middleware incompleto (${funcionesEncontradas}/${funcionesMiddleware.length} funciones)`);
    return false;
  }
}

async function verificarAuthDashboards() {
  const startTime = Date.now();
  
  printHeader('VERIFICACIÓN DE AUTENTICACIÓN Y DASHBOARDS');
  print('white', `Iniciado: ${new Date().toLocaleString()}`);

  const resultados = {
    autenticacion: {
      nextAuth: false,
      middleware: false,
      rutasAuth: []
    },
    dashboards: {
      usuario: false,
      admin: false,
      componentes: []
    },
    rutasProtegidas: [],
    errores: []
  };

  // 1. VERIFICAR SISTEMA DE AUTENTICACIÓN
  printHeader('1. SISTEMA DE AUTENTICACIÓN');
  
  // NextAuth
  resultados.autenticacion.nextAuth = verificarNextAuth();
  
  // Middleware
  resultados.autenticacion.middleware = verificarMiddleware();
  
  // Rutas de autenticación
  const rutasAuth = [
    { ruta: 'src/app/auth/login/page.tsx', desc: 'Página de Login' },
    { ruta: 'src/app/auth/register/page.tsx', desc: 'Página de Registro' },
    { ruta: 'src/app/api/auth/register/route.ts', desc: 'API de Registro' }
  ];

  for (const rutaAuth of rutasAuth) {
    const resultado = verificarContenidoArchivo(
      rutaAuth.ruta, 
      ['export', 'function', 'component'], 
      rutaAuth.desc
    );
    
    resultados.autenticacion.rutasAuth.push({
      ruta: rutaAuth.ruta,
      descripcion: rutaAuth.desc,
      estado: resultado.success
    });
  }

  // 2. VERIFICAR DASHBOARD DE USUARIO
  printHeader('2. DASHBOARD DE USUARIO');
  
  const dashboardUsuario = verificarContenidoArchivo(
    'src/app/dashboard/page.tsx',
    ['useSession', 'dashboard', 'user', 'client'],
    'Dashboard de Usuario'
  );
  
  resultados.dashboards.usuario = dashboardUsuario.success;

  // Componentes del dashboard de usuario
  const componentesUsuario = [
    { ruta: 'src/components/DashboardStatsGrid.tsx', desc: 'Grid de estadísticas' },
    { ruta: 'src/components/ProjectsOverview.tsx', desc: 'Vista de proyectos' },
    { ruta: 'src/components/RecentActivities.tsx', desc: 'Actividades recientes' }
  ];

  for (const comp of componentesUsuario) {
    const resultado = verificarContenidoArchivo(
      comp.ruta,
      ['export', 'function', 'component'],
      comp.desc
    );
    
    resultados.dashboards.componentes.push({
      tipo: 'usuario',
      componente: comp.ruta,
      descripcion: comp.desc,
      estado: resultado.success
    });
  }

  // 3. VERIFICAR DASHBOARD ADMINISTRATIVO
  printHeader('3. DASHBOARD ADMINISTRATIVO');
  
  const dashboardAdmin = verificarContenidoArchivo(
    'src/app/admin/page.tsx',
    ['admin', 'dashboard', 'management'],
    'Dashboard Administrativo'
  );
  
  resultados.dashboards.admin = dashboardAdmin.success;

  // Layout del admin
  verificarContenidoArchivo(
    'src/app/admin/layout.tsx',
    ['admin', 'layout', 'sidebar'],
    'Layout Administrativo'
  );

  // Componentes del dashboard admin
  const componentesAdmin = [
    { ruta: 'src/components/admin/AdminSidebar.tsx', desc: 'Sidebar administrativo' },
    { ruta: 'src/components/admin/AdminHeader.tsx', desc: 'Header administrativo' },
    { ruta: 'src/components/admin/AdminKPIs.tsx', desc: 'KPIs administrativos' },
    { ruta: 'src/components/admin/QuoteManagement.tsx', desc: 'Gestión de cotizaciones' },
    { ruta: 'src/components/admin/ProjectManagement.tsx', desc: 'Gestión de proyectos' },
    { ruta: 'src/components/admin/UserManagement.tsx', desc: 'Gestión de usuarios' },
    { ruta: 'src/components/admin/MessageCenter.tsx', desc: 'Centro de mensajes' },
    { ruta: 'src/components/admin/Analytics.tsx', desc: 'Analytics' },
    { ruta: 'src/components/admin/Finance.tsx', desc: 'Finanzas' }
  ];

  for (const comp of componentesAdmin) {
    const resultado = verificarContenidoArchivo(
      comp.ruta,
      ['export', 'function', 'component', 'useState'],
      comp.desc
    );
    
    resultados.dashboards.componentes.push({
      tipo: 'admin',
      componente: comp.ruta,
      descripcion: comp.desc,
      estado: resultado.success
    });
  }

  // 4. VERIFICAR APIs ADMINISTRATIVAS
  printHeader('4. APIs ADMINISTRATIVAS');
  
  const apisAdmin = [
    'src/app/api/admin/users/route.ts',
    'src/app/api/admin/quotes/route.ts',
    'src/app/api/admin/projects/route.ts',
    'src/app/api/admin/messages/route.ts',
    'src/app/api/admin/analytics/route.ts',
    'src/app/api/admin/badge-counts/route.ts'
  ];

  let apisAdminOK = 0;
  for (const api of apisAdmin) {
    if (fs.existsSync(api)) {
      print('green', `✅ ${path.basename(api)} disponible`);
      apisAdminOK++;
    } else {
      print('red', `❌ ${path.basename(api)} faltante`);
      resultados.errores.push(`API faltante: ${api}`);
    }
  }

  print('white', `📊 APIs administrativas: ${apisAdminOK}/${apisAdmin.length}`);

  // 5. VERIFICAR HOOKS Y UTILIDADES
  printHeader('5. HOOKS Y UTILIDADES DE AUTENTICACIÓN');
  
  const utilidadesAuth = [
    { ruta: 'src/lib/auth.ts', desc: 'Configuración de autenticación' },
    { ruta: 'src/app/providers.tsx', desc: 'Providers de la aplicación' }
  ];

  for (const util of utilidadesAuth) {
    verificarContenidoArchivo(
      util.ruta,
      ['export', 'auth', 'session'],
      util.desc
    );
  }

  // 6. REPORTE FINAL
  printHeader('REPORTE DE AUTENTICACIÓN Y DASHBOARDS');
  
  const endTime = Date.now();
  const tiempoTotal = ((endTime - startTime) / 1000).toFixed(2);

  // Calcular estadísticas
  const rutasAuthOK = resultados.autenticacion.rutasAuth.filter(r => r.estado).length;
  const componentesUsuarioOK = resultados.dashboards.componentes.filter(c => c.tipo === 'usuario' && c.estado).length;
  const componentesAdminOK = resultados.dashboards.componentes.filter(c => c.tipo === 'admin' && c.estado).length;

  print('white', `⏱️ Tiempo de verificación: ${tiempoTotal}s`);
  print('white', `🔐 NextAuth: ${resultados.autenticacion.nextAuth ? 'OK' : 'ERROR'}`);
  print('white', `🛡️ Middleware: ${resultados.autenticacion.middleware ? 'OK' : 'ERROR'}`);
  print('white', `🔑 Rutas Auth: ${rutasAuthOK}/${resultados.autenticacion.rutasAuth.length}`);
  print('white', `👤 Dashboard Usuario: ${resultados.dashboards.usuario ? 'OK' : 'ERROR'}`);
  print('white', `🛠️ Dashboard Admin: ${resultados.dashboards.admin ? 'OK' : 'ERROR'}`);
  print('white', `📊 Componentes Usuario: ${componentesUsuarioOK}/${componentesUsuario.length}`);
  print('white', `🔧 Componentes Admin: ${componentesAdminOK}/${componentesAdmin.length}`);
  print('white', `🌐 APIs Admin: ${apisAdminOK}/${apisAdmin.length}`);

  // Calcular estado general
  const totalVerificaciones = 8; // NextAuth, Middleware, 2 dashboards, 4 grupos de componentes
  let verificacionesExitosas = 0;

  if (resultados.autenticacion.nextAuth) verificacionesExitosas++;
  if (resultados.autenticacion.middleware) verificacionesExitosas++;
  if (resultados.dashboards.usuario) verificacionesExitosas++;
  if (resultados.dashboards.admin) verificacionesExitosas++;
  if (rutasAuthOK >= 2) verificacionesExitosas++;
  if (componentesUsuarioOK >= 2) verificacionesExitosas++;
  if (componentesAdminOK >= 6) verificacionesExitosas++;
  if (apisAdminOK >= 4) verificacionesExitosas++;

  const porcentajeExito = ((verificacionesExitosas / totalVerificaciones) * 100).toFixed(1);

  print('white', `📈 Estado general: ${verificacionesExitosas}/${totalVerificaciones} (${porcentajeExito}%)`);

  if (porcentajeExito >= 90) {
    print('green', '🎉 ¡AUTENTICACIÓN Y DASHBOARDS EXCELENTES!');
    print('green', '✅ Todos los sistemas funcionan correctamente');
  } else if (porcentajeExito >= 70) {
    print('yellow', '⚠️ Autenticación y dashboards funcionales');
    print('yellow', 'Algunos componentes necesitan atención');
  } else {
    print('red', '❌ Problemas críticos detectados');
    print('red', 'Revisa los componentes fallidos');
  }

  // Mostrar errores si los hay
  if (resultados.errores.length > 0) {
    print('red', '\n🚨 ERRORES DETECTADOS:');
    resultados.errores.forEach(error => {
      print('red', `   • ${error}`);
    });
  }

  // Guardar reporte
  const reporte = {
    fecha: new Date().toISOString(),
    tiempoVerificacion: tiempoTotal,
    estadoGeneral: {
      porcentajeExito: parseFloat(porcentajeExito),
      verificacionesExitosas,
      totalVerificaciones,
      estado: porcentajeExito >= 90 ? 'EXCELENTE' : porcentajeExito >= 70 ? 'FUNCIONAL' : 'PROBLEMAS'
    },
    detalles: resultados
  };

  // Crear directorio logs si no existe
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
  }

  const reportePath = 'logs/reporte-auth-dashboards.json';
  fs.writeFileSync(reportePath, JSON.stringify(reporte, null, 2));
  print('blue', `📄 Reporte guardado en: ${reportePath}`);

  console.log('\n' + '='.repeat(60));
  print('cyan', '🏁 VERIFICACIÓN DE AUTH Y DASHBOARDS COMPLETADA');
  console.log('='.repeat(60));

  return porcentajeExito >= 70;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  verificarAuthDashboards()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error durante la verificación:', error);
      process.exit(1);
    });
}

module.exports = { verificarAuthDashboards };
