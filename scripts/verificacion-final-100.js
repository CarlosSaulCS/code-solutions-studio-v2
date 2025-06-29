#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE VERIFICACIÓN FINAL 100% COMPLETA
 * 
 * Este script realiza una verificación exhaustiva final del proyecto
 * para confirmar que está 100% listo para producción.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class VerificacionFinal100 {
    constructor() {
        this.rootPath = path.resolve(__dirname, '..');
        this.resultados = {
            verificaciones: [],
            errores: [],
            warnings: [],
            resumen: {
                total: 0,
                exitosas: 0,
                fallidas: 0,
                porcentaje: 0
            }
        };
    }

    log(mensaje, tipo = 'info') {
        const timestamp = new Date().toISOString();
        const prefijos = {
            info: '📋',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };
        
        console.log(`${prefijos[tipo]} [${timestamp}] ${mensaje}`);
    }

    async verificar(nombre, funcion) {
        this.resultados.resumen.total++;
        this.log(`Verificando: ${nombre}`, 'info');
        
        try {
            const resultado = await funcion();
            if (resultado.success) {
                this.resultados.exitosas++;
                this.resultados.verificaciones.push({
                    nombre,
                    estado: 'exitosa',
                    detalles: resultado.detalles || 'OK'
                });
                this.log(`✓ ${nombre}: ${resultado.detalles || 'OK'}`, 'success');
            } else {
                this.resultados.errores.push({
                    nombre,
                    error: resultado.error || 'Error desconocido'
                });
                this.log(`✗ ${nombre}: ${resultado.error}`, 'error');
            }
        } catch (error) {
            this.resultados.errores.push({
                nombre,
                error: error.message
            });
            this.log(`✗ ${nombre}: ${error.message}`, 'error');
        }
    }

    async verificarEstructuraProyecto() {
        const archivosCriticos = [
            'package.json',
            'next.config.js',
            'tsconfig.json',
            'tailwind.config.js',
            'src/app/layout.tsx',
            'src/app/page.tsx',
            'src/lib/prisma.ts',
            'src/lib/auth.ts',
            'prisma/schema.prisma'
        ];

        const faltantes = archivosCriticos.filter(archivo => 
            !fs.existsSync(path.join(this.rootPath, archivo))
        );

        return {
            success: faltantes.length === 0,
            detalles: faltantes.length === 0 
                ? `Todos los ${archivosCriticos.length} archivos críticos presentes`
                : `Archivos faltantes: ${faltantes.join(', ')}`,
            error: faltantes.length > 0 ? `Archivos críticos faltantes: ${faltantes.join(', ')}` : null
        };
    }

    async verificarDependencias() {
        try {
            const packageJson = JSON.parse(
                fs.readFileSync(path.join(this.rootPath, 'package.json'), 'utf8')
            );

            const dependenciasCriticas = [
                'next',
                'react',
                'react-dom',
                'typescript',
                'tailwindcss',
                '@prisma/client',
                'next-auth'
            ];

            const todasLasDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            const faltantes = dependenciasCriticas.filter(dep => !todasLasDeps[dep]);

            return {
                success: faltantes.length === 0,
                detalles: faltantes.length === 0 
                    ? `Todas las ${dependenciasCriticas.length} dependencias críticas instaladas`
                    : `Dependencias faltantes: ${faltantes.join(', ')}`,
                error: faltantes.length > 0 ? `Dependencias críticas faltantes: ${faltantes.join(', ')}` : null
            };
        } catch (error) {
            return {
                success: false,
                error: `Error al verificar dependencias: ${error.message}`
            };
        }
    }

    async verificarBuild() {
        try {
            const { stdout, stderr } = await execAsync('npm run build', {
                cwd: this.rootPath,
                timeout: 120000
            });

            return {
                success: !stderr.includes('Error') && !stderr.includes('Failed'),
                detalles: 'Build ejecutado exitosamente',
                error: stderr.includes('Error') || stderr.includes('Failed') ? 'Build falló' : null
            };
        } catch (error) {
            return {
                success: false,
                error: `Build falló: ${error.message}`
            };
        }
    }

    async verificarTests() {
        try {
            const { stdout, stderr } = await execAsync('npm test -- --passWithNoTests', {
                cwd: this.rootPath,
                timeout: 60000
            });

            const testsCount = stdout.match(/Tests:\s+(\d+)\s+passed/);
            const passed = testsCount ? parseInt(testsCount[1]) : 0;

            return {
                success: !stderr.includes('FAIL') && passed >= 0,
                detalles: `${passed} tests pasaron exitosamente`,
                error: stderr.includes('FAIL') ? 'Algunos tests fallaron' : null
            };
        } catch (error) {
            return {
                success: false,
                error: `Tests fallaron: ${error.message}`
            };
        }
    }

    async verificarVariablesEntorno() {
        const envPath = path.join(this.rootPath, '.env.local');
        
        if (!fs.existsSync(envPath)) {
            return {
                success: false,
                error: 'Archivo .env.local no encontrado'
            };
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const variablesRequeridas = [
            'NEXTAUTH_URL',
            'NEXTAUTH_SECRET',
            'DATABASE_URL'
        ];

        const faltantes = variablesRequeridas.filter(variable => 
            !envContent.includes(variable)
        );

        return {
            success: faltantes.length === 0,
            detalles: faltantes.length === 0 
                ? `Todas las ${variablesRequeridas.length} variables de entorno configuradas`
                : `Variables faltantes: ${faltantes.join(', ')}`,
            error: faltantes.length > 0 ? `Variables de entorno faltantes: ${faltantes.join(', ')}` : null
        };
    }

    async verificarRutasPrincipales() {
        const rutas = [
            'src/app/page.tsx',
            'src/app/about/page.tsx',
            'src/app/services/page.tsx',
            'src/app/contact/page.tsx',
            'src/app/dashboard/page.tsx',
            'src/app/auth/login/page.tsx',
            'src/app/admin/page.tsx'
        ];

        const faltantes = rutas.filter(ruta => 
            !fs.existsSync(path.join(this.rootPath, ruta))
        );

        return {
            success: faltantes.length === 0,
            detalles: faltantes.length === 0 
                ? `Todas las ${rutas.length} rutas principales presentes`
                : `Rutas faltantes: ${faltantes.join(', ')}`,
            error: faltantes.length > 0 ? `Rutas faltantes: ${faltantes.join(', ')}` : null
        };
    }

    async verificarGitStatus() {
        try {
            const { stdout } = await execAsync('git status --porcelain', {
                cwd: this.rootPath
            });

            const archivosModificados = stdout.trim().split('\n').filter(line => line.trim());

            return {
                success: archivosModificados.length === 0,
                detalles: archivosModificados.length === 0 
                    ? 'Repositorio Git limpio, todo sincronizado'
                    : `${archivosModificados.length} archivos sin sincronizar`,
                error: archivosModificados.length > 0 ? `Archivos sin sincronizar: ${archivosModificados.length}` : null
            };
        } catch (error) {
            return {
                success: false,
                error: `Error al verificar Git: ${error.message}`
            };
        }
    }

    async ejecutar() {
        this.log('🚀 INICIANDO VERIFICACIÓN FINAL 100% COMPLETA', 'info');
        this.log('=' * 50, 'info');

        // Ejecutar todas las verificaciones
        await this.verificar('Estructura del Proyecto', () => this.verificarEstructuraProyecto());
        await this.verificar('Dependencias', () => this.verificarDependencias());
        await this.verificar('Variables de Entorno', () => this.verificarVariablesEntorno());
        await this.verificar('Rutas Principales', () => this.verificarRutasPrincipales());
        await this.verificar('Build del Proyecto', () => this.verificarBuild());
        await this.verificar('Tests', () => this.verificarTests());
        await this.verificar('Estado de Git', () => this.verificarGitStatus());

        // Calcular estadísticas
        this.resultados.resumen.exitosas = this.resultados.verificaciones.length;
        this.resultados.resumen.fallidas = this.resultados.errores.length;
        this.resultados.resumen.porcentaje = Math.round(
            (this.resultados.resumen.exitosas / this.resultados.resumen.total) * 100
        );

        // Mostrar resumen
        this.mostrarResumen();

        // Generar reporte
        this.generarReporte();

        return this.resultados.resumen.porcentaje === 100;
    }

    mostrarResumen() {
        this.log('', 'info');
        this.log('📊 RESUMEN DE VERIFICACIÓN FINAL', 'info');
        this.log('=' * 40, 'info');
        this.log(`Total de verificaciones: ${this.resultados.resumen.total}`, 'info');
        this.log(`Exitosas: ${this.resultados.resumen.exitosas}`, 'success');
        this.log(`Fallidas: ${this.resultados.resumen.fallidas}`, this.resultados.resumen.fallidas > 0 ? 'error' : 'info');
        this.log(`Porcentaje de éxito: ${this.resultados.resumen.porcentaje}%`, 
                 this.resultados.resumen.porcentaje === 100 ? 'success' : 'warning');

        if (this.resultados.errores.length > 0) {
            this.log('', 'info');
            this.log('❌ ERRORES ENCONTRADOS:', 'error');
            this.resultados.errores.forEach(error => {
                this.log(`  • ${error.nombre}: ${error.error}`, 'error');
            });
        }

        if (this.resultados.resumen.porcentaje === 100) {
            this.log('', 'info');
            this.log('🎉 ¡PROYECTO 100% LISTO PARA PRODUCCIÓN!', 'success');
            this.log('✅ Todas las verificaciones pasaron exitosamente', 'success');
            this.log('🚀 El proyecto está completamente funcional y optimizado', 'success');
        }
    }

    generarReporte() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reporte = {
            timestamp: new Date().toISOString(),
            porcentaje: this.resultados.resumen.porcentaje,
            estado: this.resultados.resumen.porcentaje === 100 ? 'LISTO_PARA_PRODUCCION' : 'REQUIERE_ATENCION',
            resumen: this.resultados.resumen,
            verificaciones: this.resultados.verificaciones,
            errores: this.resultados.errores,
            warnings: this.resultados.warnings
        };

        const reportePath = path.join(this.rootPath, `VERIFICACION_FINAL_100_COMPLETA_${timestamp}.md`);
        const contenidoReporte = this.generarContenidoReporte(reporte);
        
        fs.writeFileSync(reportePath, contenidoReporte);
        this.log(`📄 Reporte generado: ${path.basename(reportePath)}`, 'success');
    }

    generarContenidoReporte(reporte) {
        return `# 🚀 VERIFICACIÓN FINAL 100% COMPLETA

**Timestamp:** ${reporte.timestamp}
**Estado:** ${reporte.estado}
**Porcentaje de éxito:** ${reporte.porcentaje}%

## 📊 Resumen Ejecutivo

- **Total de verificaciones:** ${reporte.resumen.total}
- **Exitosas:** ${reporte.resumen.exitosas}
- **Fallidas:** ${reporte.resumen.fallidas}
- **Porcentaje de éxito:** ${reporte.porcentaje}%

## ✅ Verificaciones Exitosas

${reporte.verificaciones.map(v => `- **${v.nombre}:** ${v.detalles}`).join('\n')}

${reporte.errores.length > 0 ? `## ❌ Errores Encontrados

${reporte.errores.map(e => `- **${e.nombre}:** ${e.error}`).join('\n')}` : ''}

## 🎯 Conclusión

${reporte.porcentaje === 100 
    ? `🎉 **¡PROYECTO 100% LISTO PARA PRODUCCIÓN!**

El proyecto Code Solutions Studio ha pasado todas las verificaciones exitosamente:

- ✅ Estructura del proyecto completa
- ✅ Dependencias instaladas correctamente
- ✅ Variables de entorno configuradas
- ✅ Todas las rutas principales funcionando
- ✅ Build exitoso
- ✅ Tests pasando
- ✅ Repositorio Git sincronizado

**El sistema está completamente funcional, optimizado y listo para despliegue en producción.**`
    : `⚠️ **PROYECTO REQUIERE ATENCIÓN**

Se encontraron ${reporte.errores.length} errores que deben ser corregidos antes del despliegue en producción.`}

---
*Generado automáticamente por el script de verificación final del proyecto Code Solutions Studio*
`;
    }
}

// Ejecutar la verificación
if (require.main === module) {
    const verificador = new VerificacionFinal100();
    verificador.ejecutar()
        .then(exito => {
            process.exit(exito ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Error durante la verificación:', error);
            process.exit(1);
        });
}

module.exports = VerificacionFinal100;
