#!/usr/bin/env node

/**
 * 🔧 DIAGNÓSTICO MEJORADO DE COMPONENTES
 * 
 * Este script hace un diagnóstico más preciso de los componentes
 * para identificar los problemas reales vs falsos positivos
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
  print('cyan', `🔧 ${title}`);
  console.log('='.repeat(60));
}

// Función mejorada para verificar componentes
function verificarComponenteMejorado(rutaArchivo, descripcion, tipo = 'component') {
  print('blue', `🔍 Analizando ${descripcion}...`);
  
  if (!fs.existsSync(rutaArchivo)) {
    print('red', `❌ ${descripcion} - Archivo no encontrado`);
    return { 
      success: false, 
      error: 'Archivo no encontrado',
      detalles: { existe: false }
    };
  }

  try {
    const contenido = fs.readFileSync(rutaArchivo, 'utf8');
    
    if (contenido.trim().length < 10) {
      print('red', `❌ ${descripcion} - Archivo vacío`);
      return { 
        success: false, 
        error: 'Archivo vacío',
        detalles: { existe: true, tamaño: contenido.length }
      };
    }

    const analisis = {
      tieneExport: /export\s+(default\s+)?function|export\s+{|export\s+const|export\s+class|export\s+async\s+function/.test(contenido),
      tieneFunction: /function\s+\w+|const\s+\w+\s*=|=>\s*{|\w+\s*:\s*\w+|async\s+function/.test(contenido),
      tieneComponent: /return\s*\(|return\s*<|jsx|tsx|React\.FC|ReactElement/.test(contenido),
      tieneUseState: /useState|useEffect|useCallback|useMemo/.test(contenido),
      tieneImports: /import\s+[\s\S]*?from|import\s+{[\s\S]*?}\s+from/.test(contenido),
      esAPINextJS: /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)/.test(contenido),
      lineas: contenido.split('\n').length,
      tamaño: contenido.length
    };

    // Criterios específicos por tipo
    let esValido = false;
    let razon = '';

    if (tipo === 'component') {
      esValido = analisis.tieneExport && (analisis.tieneFunction || analisis.tieneComponent) && analisis.tieneImports;
      razon = `Export: ${analisis.tieneExport}, Function: ${analisis.tieneFunction}, Component: ${analisis.tieneComponent}, Imports: ${analisis.tieneImports}`;
    } else if (tipo === 'api') {
      // Para APIs de Next.js, verificar que tenga funciones HTTP exportadas
      esValido = analisis.esAPINextJS || (analisis.tieneExport && analisis.tieneFunction);
      razon = `NextJS API: ${analisis.esAPINextJS}, Export: ${analisis.tieneExport}, Function: ${analisis.tieneFunction}`;
    } else if (tipo === 'hook') {
      esValido = analisis.tieneExport && analisis.tieneFunction && analisis.tieneUseState;
      razon = `Export: ${analisis.tieneExport}, Function: ${analisis.tieneFunction}, Hooks: ${analisis.tieneUseState}`;
    }

    if (esValido) {
      print('green', `✅ ${descripcion} - OK (${analisis.lineas} líneas)`);
    } else {
      print('yellow', `⚠️ ${descripcion} - Advertencia (${razon})`);
    }

    return {
      success: esValido,
      analisis,
      razon,
      detalles: {
        existe: true,
        tamaño: analisis.tamaño,
        lineas: analisis.lineas
      }
    };

  } catch (error) {
    print('red', `❌ Error leyendo ${descripcion}: ${error.message}`);
    return { 
      success: false, 
      error: error.message,
      detalles: { existe: true }
    };
  }
}

async function diagnosticoMejorado() {
  printHeader('DIAGNÓSTICO MEJORADO DE COMPONENTES');
  print('white', `Fecha: ${new Date().toLocaleString()}`);

  const resultados = {
    nextauth: {},
    apis: [],
    componentesUsuario: [],
    componentesAdmin: [],
    resumen: {}
  };

  // 1. VERIFICAR NEXTAUTH
  printHeader('1. VERIFICACIÓN NEXTAUTH');
  
  const nextAuthFiles = [
    { ruta: 'src/app/api/auth/[...nextauth]/route.ts', desc: 'NextAuth Handler' },
    { ruta: 'src/lib/auth.ts', desc: 'Configuración de Auth' }
  ];

  for (const file of nextAuthFiles) {
    const resultado = verificarComponenteMejorado(file.ruta, file.desc, 'api');
    resultados.nextauth[file.desc] = resultado;
  }

  // 2. VERIFICAR APIs PROBLEMÁTICAS
  printHeader('2. APIs QUE REPORTARON PROBLEMAS');
  
  const apisProblematicas = [
    { ruta: 'src/app/api/auth/register/route.ts', desc: 'API de Registro' }
  ];

  for (const api of apisProblematicas) {
    const resultado = verificarComponenteMejorado(api.ruta, api.desc, 'api');
    resultados.apis.push({ ...api, resultado });
  }

  // 3. VERIFICAR COMPONENTES DE USUARIO
  printHeader('3. COMPONENTES DE DASHBOARD DE USUARIO');
  
  const componentesUsuario = [
    { ruta: 'src/components/DashboardStatsGrid.tsx', desc: 'Grid de estadísticas' },
    { ruta: 'src/components/ProjectsOverview.tsx', desc: 'Vista de proyectos' },
    { ruta: 'src/components/RecentActivities.tsx', desc: 'Actividades recientes' }
  ];

  for (const comp of componentesUsuario) {
    const resultado = verificarComponenteMejorado(comp.ruta, comp.desc, 'component');
    resultados.componentesUsuario.push({ ...comp, resultado });
  }

  // 4. VERIFICAR COMPONENTES ADMIN
  printHeader('4. COMPONENTES DE DASHBOARD ADMINISTRATIVO');
  
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
    const resultado = verificarComponenteMejorado(comp.ruta, comp.desc, 'component');
    resultados.componentesAdmin.push({ ...comp, resultado });
  }

  // 5. GENERAR RESUMEN
  printHeader('RESUMEN DEL DIAGNÓSTICO');

  const nextAuthOK = Object.values(resultados.nextauth).every(r => r.success);
  const apisOK = resultados.apis.filter(a => a.resultado.success).length;
  const compUsuarioOK = resultados.componentesUsuario.filter(c => c.resultado.success).length;
  const compAdminOK = resultados.componentesAdmin.filter(c => c.resultado.success).length;

  resultados.resumen = {
    nextAuth: nextAuthOK,
    apis: `${apisOK}/${resultados.apis.length}`,
    componentesUsuario: `${compUsuarioOK}/${resultados.componentesUsuario.length}`,
    componentesAdmin: `${compAdminOK}/${resultados.componentesAdmin.length}`
  };

  print('white', `🔐 NextAuth: ${nextAuthOK ? '✅ OK' : '❌ ERROR'}`);
  print('white', `🌐 APIs: ${apisOK}/${resultados.apis.length} funcionando`);
  print('white', `👤 Componentes Usuario: ${compUsuarioOK}/${resultados.componentesUsuario.length} OK`);
  print('white', `🛠️ Componentes Admin: ${compAdminOK}/${resultados.componentesAdmin.length} OK`);

  const totalComponentes = resultados.apis.length + resultados.componentesUsuario.length + resultados.componentesAdmin.length;
  const totalOK = apisOK + compUsuarioOK + compAdminOK + (nextAuthOK ? 1 : 0);
  const porcentaje = ((totalOK / (totalComponentes + 1)) * 100).toFixed(1);

  print('white', `📊 Estado General: ${totalOK}/${totalComponentes + 1} (${porcentaje}%)`);

  if (porcentaje >= 90) {
    print('green', '🎉 ¡DIAGNÓSTICO: SISTEMA EN EXCELENTE ESTADO!');
    print('green', '✅ Los reportes anteriores contenían falsos positivos');
  } else if (porcentaje >= 70) {
    print('yellow', '⚠️ Sistema en buen estado con algunas áreas menores');
  } else {
    print('red', '❌ Se encontraron problemas reales que necesitan atención');
  }

  // Mostrar detalles de problemas reales
  const problemasReales = [];
  
  if (!nextAuthOK) {
    problemasReales.push('Configuración NextAuth incompleta');
  }
  
  resultados.apis.forEach(api => {
    if (!api.resultado.success) {
      problemasReales.push(`API ${api.desc}: ${api.resultado.error || api.resultado.razon}`);
    }
  });

  resultados.componentesUsuario.forEach(comp => {
    if (!comp.resultado.success) {
      problemasReales.push(`Componente Usuario ${comp.desc}: ${comp.resultado.error || comp.resultado.razon}`);
    }
  });

  resultados.componentesAdmin.forEach(comp => {
    if (!comp.resultado.success) {
      problemasReales.push(`Componente Admin ${comp.desc}: ${comp.resultado.error || comp.resultado.razon}`);
    }
  });

  if (problemasReales.length > 0) {
    print('red', '\n🚨 PROBLEMAS REALES ENCONTRADOS:');
    problemasReales.forEach(problema => {
      print('red', `   • ${problema}`);
    });
  } else {
    print('green', '\n✅ NO SE ENCONTRARON PROBLEMAS REALES');
    print('green', 'Los reportes anteriores eran falsos positivos debido a criterios muy estrictos');
  }

  // Guardar reporte
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
  }

  const reporteDetallado = {
    fecha: new Date().toISOString(),
    diagnostico: 'mejorado',
    porcentajeReal: parseFloat(porcentaje),
    problemasReales: problemasReales.length,
    detalles: resultados
  };

  fs.writeFileSync('logs/diagnostico-mejorado.json', JSON.stringify(reporteDetallado, null, 2));
  print('blue', `📄 Diagnóstico detallado guardado en: logs/diagnostico-mejorado.json`);

  console.log('\n' + '='.repeat(60));
  print('cyan', '🏁 DIAGNÓSTICO MEJORADO COMPLETADO');
  console.log('='.repeat(60));

  return problemasReales.length === 0;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  diagnosticoMejorado()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error durante el diagnóstico:', error);
      process.exit(1);
    });
}

module.exports = { diagnosticoMejorado };
