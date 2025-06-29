# 🚀 Code Solutions Studio

**Plataforma web completa para servicios de desarrollo de software**

Una aplicación web moderna y responsive desarrollada con Next.js 14, que ofrece servicios de desarrollo de software, sistema de cotizaciones, dashboard de usuario y panel administrativo.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## ✨ Características Principales

### 🌐 **Sitio Web Corporativo**
- **Responsive Design**: Adaptación perfecta a todos los dispositivos
- **Navegación Inteligente**: Navbar con efectos visuales avanzados
- **Multiidioma**: Soporte completo ES/EN con traducciones dinámicas
- **Multi-moneda**: Cotizaciones en MXN y USD
- **SEO Optimizado**: Meta tags y estructura optimizada

### 💼 **Servicios Ofrecidos**
- Desarrollo Web
- Aplicaciones Móviles  
- E-commerce
- Migración a la Nube
- Soluciones de IA
- Consultoría IT

### 🔐 **Sistema de Autenticación**
- **NextAuth.js**: Autenticación segura con JWT
- **Registro/Login**: Sistema completo de usuarios
- **Roles de Usuario**: USER y ADMIN con permisos diferenciados
- **Sesiones Persistentes**: Manejo seguro de sesiones

### 📊 **Dashboard de Usuario**
- **Cotizaciones**: Gestión completa de solicitudes
- **Notificaciones**: Sistema en tiempo real
- **Chat**: Comunicación directa con el equipo
- **Estadísticas**: Métricas personalizadas del usuario

### ⚙️ **Panel Administrativo**
- **Gestión de Usuarios**: CRUD completo
- **Gestión de Cotizaciones**: Aprobación y seguimiento
- **Analytics**: Métricas del negocio
- **Centro de Mensajes**: Comunicación centralizada
- **Configuración del Sistema**: Ajustes globales

### 💬 **Sistema de Comunicación**
- **Cotizador Inteligente**: Formulario dinámico con precios en tiempo real
- **Notificaciones**: Sistema push y email
- **Chat en Vivo**: Comunicación bidireccional
- **Email Automatizado**: Integración con Resend

## 🛠️ Tecnologías

### **Frontend**
- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Diseño utility-first responsive
- **Lucide Icons**: Iconografía moderna y consistente

### **Backend**
- **Next.js API Routes**: API RESTful integrada
- **Prisma**: ORM moderno con SQLite
- **NextAuth.js**: Autenticación y autorización
- **Resend**: Servicio de email transaccional

### **Base de Datos**
- **SQLite**: Base de datos embebida para desarrollo
- **Prisma Schema**: Modelado de datos tipado

### **Herramientas de Desarrollo**
- **ESLint**: Linting de código
- **Prettier**: Formateo automático
- **TypeScript**: Verificación de tipos
- **Jest**: Testing framework

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18.17 o superior
- npm o yarn
- Git

### **1. Clonar el Repositorio**
\`\`\`bash
git clone https://github.com/CarlosSaulCS/code-solutions-studio.git
cd code-solutions-studio
\`\`\`

### **2. Instalar Dependencias**
\`\`\`bash
npm install
\`\`\`

### **3. Configurar Variables de Entorno**
\`\`\`bash
cp .env.example .env.local
\`\`\`

**Editar `.env.local`:**
\`\`\`env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-seguro-aqui

# Database
DATABASE_URL="file:./dev.db"

# Email (Resend)
RESEND_API_KEY=tu-api-key-de-resend

# Admin por defecto
ADMIN_EMAIL=carlossaulcante@outlook.com
ADMIN_PASSWORD=Casc+10098@
\`\`\`

### **4. Configurar Base de Datos**
\`\`\`bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# (Opcional) Ver base de datos
npx prisma studio
\`\`\`

### **5. Crear Usuario Administrador**
\`\`\`bash
# Ejecutar script de setup
npm run setup:admin
\`\`\`

### **6. Ejecutar en Desarrollo**
\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en: http://localhost:3000

## 📁 Estructura del Proyecto

\`\`\`
├── prisma/                 # Configuración de base de datos
│   ├── schema.prisma      # Esquema de la base de datos
│   └── dev.db            # Base de datos SQLite
├── public/                # Archivos estáticos
├── src/
│   ├── app/              # App Router de Next.js
│   │   ├── (pages)/      # Páginas principales
│   │   ├── api/          # API Routes
│   │   ├── auth/         # Páginas de autenticación
│   │   ├── dashboard/    # Dashboard de usuario
│   │   └── admin/        # Panel administrativo
│   ├── components/       # Componentes reutilizables
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilidades y configuraciones
│   └── types/           # Definiciones de TypeScript
├── scripts/             # Scripts de utilidad
└── tests/              # Tests automatizados
\`\`\`

## 🔑 Credenciales por Defecto

### **Administrador**
- **Email**: \`carlossaulcante@outlook.com\`
- **Password**: \`Casc+10098@\`

### **Usuario de Prueba**
- **Registro**: Disponible en `/auth/register`

## 🚦 Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Verificar código

# Base de datos
npm run db:push      # Aplicar cambios al schema
npm run db:studio    # Interfaz visual de la DB
npm run db:seed      # Poblar con datos de prueba

# Setup
npm run setup:admin  # Crear usuario administrador

# Testing
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
\`\`\`

## 🌍 Configuración de Producción

### **Variables de Entorno para Producción**
\`\`\`env
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=secret-muy-seguro-para-produccion
DATABASE_URL=tu-url-de-base-de-datos-produccion
RESEND_API_KEY=tu-api-key-real-de-resend
\`\`\`

### **Deploy en Vercel**
1. Fork este repositorio
2. Conecta tu cuenta de Vercel
3. Configura las variables de entorno
4. Deploy automático

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver \`LICENSE\` para más información.

## 👨‍💻 Autor

**Carlos Saul** - [CarlosSaulCS](https://github.com/CarlosSaulCS)

## 📞 Contacto

- **Email**: carlossaulcante@outlook.com
- **GitHub**: [@CarlosSaulCS](https://github.com/CarlosSaulCS)
- **Website**: [Code Solutions Studio](https://code-solutions-studio.vercel.app)

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐
