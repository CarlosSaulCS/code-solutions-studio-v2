const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

// Sample data
const sampleUsers = [
  {
    email: 'admin@codesolutionstudio.com.mx',
    name: 'Administrador',
    role: 'ADMIN',
    password: 'admin123456' // Will be hashed
  },
  {
    email: 'carlos.martinez@example.com',
    name: 'Carlos Martínez',
    role: 'CLIENT',
    company: 'TechStart MX',
    phone: '+52 55 1234 5678',
    password: 'cliente123456'
  },
  {
    email: 'maria.gonzalez@example.com',
    name: 'María González',
    role: 'CLIENT',
    company: 'Innovación Digital',
    phone: '+52 33 2345 6789',
    password: 'cliente123456'
  },
  {
    email: 'juan.lopez@example.com',
    name: 'Juan López',
    role: 'CLIENT',
    company: 'StartupGDL',
    phone: '+52 81 3456 7890',
    password: 'cliente123456'
  }
];

const sampleQuotes = [
  {
    serviceType: 'WEB',
    packageType: 'BUSINESS',
    selectedAddons: JSON.stringify(['ECOMMERCE', 'SEO_BASIC']),
    basePrice: 15000,
    addonsPrice: 8000,
    totalPrice: 23000,
    timeline: 45,
    status: 'APPROVED',
    notes: 'Necesito un sitio web corporativo con tienda en línea para mi empresa de productos orgánicos.',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    serviceType: 'MOBILE',
    packageType: 'STARTUP',
    selectedAddons: JSON.stringify(['ANALYTICS', 'PUSH_NOTIFICATIONS']),
    basePrice: 20000,
    addonsPrice: 4000,
    totalPrice: 24000,
    timeline: 60,
    status: 'PENDING',
    notes: 'App móvil para delivery de comida. Necesito que funcione en iOS y Android.',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    serviceType: 'ECOMMERCE',
    packageType: 'ENTERPRISE',
    selectedAddons: JSON.stringify(['PAYMENT_GATEWAY', 'INVENTORY_MANAGEMENT', 'ANALYTICS']),
    basePrice: 35000,
    addonsPrice: 15000,
    totalPrice: 50000,
    timeline: 90,
    status: 'CONVERTED',
    notes: 'Plataforma de ecommerce completa para distribuidor de electrónicos.',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
];

const sampleProjects = [
  {
    title: 'Sitio Web Corporativo - TechStart MX',
    description: 'Desarrollo de sitio web corporativo con tienda en línea para empresa de productos orgánicos. Incluye catálogo de productos, carrito de compras, pasarela de pagos y panel de administración.',
    serviceType: 'WEB',
    packageType: 'BUSINESS',
    status: 'DEVELOPMENT',
    progress: 65,
    budget: 23000,
    startDate: new Date('2024-11-15'),
    estimatedEndDate: new Date('2024-12-30'),
    milestones: JSON.stringify([
      { name: 'Diseño UI/UX', completed: true, date: '2024-11-20' },
      { name: 'Desarrollo Frontend', completed: true, date: '2024-12-05' },
      { name: 'Desarrollo Backend', completed: false, date: '2024-12-15' },
      { name: 'Integración de Pagos', completed: false, date: '2024-12-20' },
      { name: 'Testing y Deployment', completed: false, date: '2024-12-30' }
    ]),
    statusNotes: 'Progreso excelente. Cliente muy satisfecho con el diseño. Backend en desarrollo.'
  },
  {
    title: 'Plataforma E-commerce - Distribuidora MX',
    description: 'Plataforma de e-commerce completa para distribuidora de electrónicos. Incluye gestión de inventario, múltiples proveedores, reportes avanzados y integración con sistemas existentes.',
    serviceType: 'ECOMMERCE',
    packageType: 'ENTERPRISE',
    status: 'PLANNING',
    progress: 15,
    budget: 50000,
    startDate: new Date('2024-12-01'),
    estimatedEndDate: new Date('2025-03-01'),
    milestones: JSON.stringify([
      { name: 'Análisis de Requerimientos', completed: true, date: '2024-12-05' },
      { name: 'Arquitectura del Sistema', completed: false, date: '2024-12-15' },
      { name: 'Diseño de Base de Datos', completed: false, date: '2024-12-20' },
      { name: 'Desarrollo Core', completed: false, date: '2025-01-31' },
      { name: 'Integraciones', completed: false, date: '2025-02-20' },
      { name: 'Testing y Deployment', completed: false, date: '2025-03-01' }
    ]),
    statusNotes: 'Proyecto complejo con múltiples integraciones. Reunión inicial completada exitosamente.'
  }
];

const sampleMessages = [
  {
    content: 'Hola, me interesa saber más sobre sus servicios de desarrollo web. ¿Podrían contactarme?',
    type: 'CONTACT_FORM',
    isFromAdmin: false,
    status: 'REPLIED',
    priority: 'MEDIUM',
    subject: 'Consulta sobre servicios web',
    senderEmail: 'nuevo.cliente@example.com',
    requiresEmailResponse: true,
    responseMethod: 'EMAIL'
  },
  {
    content: '¿Cuál es el progreso actual del proyecto? ¿Podremos hacer una revisión esta semana?',
    type: 'TEXT',
    isFromAdmin: false,
    status: 'READ',
    priority: 'HIGH',
    subject: 'Seguimiento de proyecto',
    requiresEmailResponse: false,
    responseMethod: 'CHAT'
  },
  {
    content: 'El cliente está muy satisfecho con el avance. Se ha programado una reunión para el viernes para revisar los últimos cambios.',
    type: 'SYSTEM',
    isFromAdmin: true,
    status: 'READ',
    priority: 'MEDIUM'
  }
];

const samplePayments = [
  {
    amount: 11500, // 50% del proyecto
    currency: 'MXN',
    status: 'COMPLETED',
    description: 'Pago inicial - 50% del proyecto',
    paidAt: new Date('2024-11-16')
  },
  {
    amount: 25000, // Pago completo del proyecto enterprise
    currency: 'MXN',
    status: 'PENDING',
    description: 'Pago inicial - Proyecto E-commerce Enterprise',
    dueDate: new Date('2024-12-15')
  }
];

const sampleContactForms = [
  {
    name: 'Ana Ruiz',
    email: 'ana.ruiz@startup.mx',
    phone: '+52 55 9876 5432',
    company: 'Startup Innovadora',
    service: 'Desarrollo de App Móvil',
    budget: '$20,000 - $30,000 MXN',
    timeline: '2-3 meses',
    message: 'Necesitamos desarrollar una aplicación móvil para nuestro servicio de delivery. La app debe funcionar en iOS y Android, con geolocalización y pagos en línea.',
    status: 'NEW',
    priority: 'HIGH',
    responseMethod: 'EMAIL'
  },
  {
    name: 'Roberto Silva',
    email: 'roberto@comercial.com',
    phone: '+52 33 5555 1234',
    company: 'Comercial Silva',
    service: 'E-commerce',
    budget: '$15,000 - $25,000 MXN',
    timeline: '1-2 meses',
    message: 'Queremos lanzar una tienda en línea para vender nuestros productos. Necesitamos integración con inventario y múltiples métodos de pago.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    responseMethod: 'PHONE'
  }
];

async function main() {
  try {
    console.log('🌱 Iniciando seed de datos...');

    // Clear existing data
    console.log('🧹 Limpiando datos existentes...');
    await prisma.contactForm.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.message.deleteMany();
    await prisma.project.deleteMany();
    await prisma.quote.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log('👥 Creando usuarios...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await hash(userData.password, 12);
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          emailVerified: new Date() // Mark as verified for testing
        }
      });
      createdUsers.push(user);
      console.log(`✅ Usuario creado: ${user.email}`);
    }

    // Create quotes
    console.log('💰 Creando cotizaciones...');
    const createdQuotes = [];
    for (let i = 0; i < sampleQuotes.length; i++) {
      const quote = await prisma.quote.create({
        data: {
          ...sampleQuotes[i],
          userId: createdUsers[i + 1].id // Skip admin user
        }
      });
      createdQuotes.push(quote);
      console.log(`✅ Cotización creada: ${quote.id}`);
    }

    // Create projects
    console.log('🚀 Creando proyectos...');
    const createdProjects = [];
    for (let i = 0; i < sampleProjects.length; i++) {
      // Only create projects for approved/converted quotes
      if (i < 2) { // First two projects
        const project = await prisma.project.create({
          data: {
            ...sampleProjects[i],
            userId: createdUsers[i + 1].id,
            quoteId: createdQuotes[i].id
          }
        });
        createdProjects.push(project);
        console.log(`✅ Proyecto creado: ${project.title}`);
      }
    }

    // Create messages
    console.log('💬 Creando mensajes...');
    for (let i = 0; i < sampleMessages.length; i++) {
      const messageData = {
        ...sampleMessages[i],
        userId: createdUsers[i + 1]?.id || createdUsers[1].id
      };
      
      // Add projectId for project-related messages
      if (i < createdProjects.length) {
        messageData.projectId = createdProjects[i].id;
      }

      const message = await prisma.message.create({
        data: messageData
      });
      console.log(`✅ Mensaje creado: ${message.id}`);
    }

    // Create payments
    console.log('💳 Creando pagos...');
    for (let i = 0; i < samplePayments.length && i < createdProjects.length; i++) {
      const payment = await prisma.payment.create({
        data: {
          ...samplePayments[i],
          projectId: createdProjects[i].id,
          userId: createdProjects[i].userId
        }
      });
      console.log(`✅ Pago creado: ${payment.id}`);
    }

    // Create contact forms
    console.log('📝 Creando formularios de contacto...');
    for (const contactData of sampleContactForms) {
      const contact = await prisma.contactForm.create({
        data: contactData
      });
      console.log(`✅ Formulario de contacto creado: ${contact.name}`);
    }

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`👥 Usuarios: ${createdUsers.length}`);
    console.log(`💰 Cotizaciones: ${createdQuotes.length}`);
    console.log(`🚀 Proyectos: ${createdProjects.length}`);
    console.log(`💬 Mensajes: ${sampleMessages.length}`);
    console.log(`💳 Pagos: ${Math.min(samplePayments.length, createdProjects.length)}`);
    console.log(`📝 Formularios: ${sampleContactForms.length}`);
    
    console.log('\n🔑 Credenciales de prueba:');
    console.log('Admin: admin@codesolutionstudio.com.mx / admin123456');
    console.log('Cliente: carlos.martinez@example.com / cliente123456');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
