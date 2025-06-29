import jsPDF from 'jspdf';
import ExcelJS from 'exceljs';
import { prisma } from './prisma';

export interface ReportData {
  projects?: any[];
  quotes?: any[];
  users?: any[];
  payments?: any[];
  messages?: any[];
  summary?: {
    totalProjects: number;
    activeProjects: number;
    totalRevenue: number;
    pendingQuotes: number;
    totalUsers: number;
  };
}

export interface ReportOptions {
  type: 'projects' | 'quotes' | 'users' | 'payments' | 'analytics' | 'full';
  format: 'pdf' | 'excel';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  includeDetails?: boolean;
}

// Generate analytics data
export async function generateAnalyticsData(dateRange?: { startDate: Date; endDate: Date }): Promise<ReportData> {
  const whereClause = dateRange ? {
    createdAt: {
      gte: dateRange.startDate,
      lte: dateRange.endDate
    }
  } : {};

  const [projects, quotes, users, payments, messages] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true }
        },
        quote: {
          select: { totalPrice: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    
    prisma.quote.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            quotes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    
    prisma.payment.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true }
        },
        project: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    
    prisma.message.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true }
        },
        project: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit messages for performance
    })
  ]);

  // Calculate summary
  const summary = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => 
      ['PLANNING', 'DEVELOPMENT', 'TESTING', 'REVIEW'].includes(p.status)
    ).length,
    totalRevenue: payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingQuotes: quotes.filter(q => q.status === 'PENDING').length,
    totalUsers: users.length
  };

  return {
    projects,
    quotes,
    users,
    payments,
    messages,
    summary
  };
}

// Generate PDF report
export async function generatePDFReport(data: ReportData, options: ReportOptions): Promise<Buffer> {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Header
  doc.setFontSize(20);
  doc.text('Code Solutions Studio', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(16);
  doc.text('Reporte de Analytics', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, 20, yPosition);
  yPosition += 20;

  // Summary section
  if (data.summary) {
    doc.setFontSize(14);
    doc.text('Resumen Ejecutivo', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    const summaryItems = [
      `Total de Proyectos: ${data.summary.totalProjects}`,
      `Proyectos Activos: ${data.summary.activeProjects}`,
      `Ingresos Totales: $${data.summary.totalRevenue.toLocaleString('es-MX')} MXN`,
      `Cotizaciones Pendientes: ${data.summary.pendingQuotes}`,
      `Total de Usuarios: ${data.summary.totalUsers}`
    ];
    
    summaryItems.forEach(item => {
      doc.text(item, 25, yPosition);
      yPosition += 8;
    });
    yPosition += 10;
  }

  // Projects section
  if (data.projects && data.projects.length > 0 && (options.type === 'projects' || options.type === 'full')) {
    doc.setFontSize(14);
    doc.text('Proyectos', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(8);
    data.projects.slice(0, 20).forEach(project => { // Limit for space
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`• ${project.title}`, 25, yPosition);
      yPosition += 6;
      doc.text(`  Cliente: ${project.user.name || 'N/A'} | Estado: ${project.status}`, 25, yPosition);
      yPosition += 6;
      doc.text(`  Fecha: ${new Date(project.createdAt).toLocaleDateString('es-MX')}`, 25, yPosition);
      yPosition += 10;
    });
  }

  return Buffer.from(doc.output('arraybuffer'));
}

// Generate Excel report
export async function generateExcelReport(data: ReportData, options: ReportOptions): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  
  // Summary worksheet
  if (data.summary) {
    const summaryWs = workbook.addWorksheet('Resumen');
    
    summaryWs.columns = [
      { header: 'Métrica', key: 'metric', width: 30 },
      { header: 'Valor', key: 'value', width: 20 }
    ];
    
    summaryWs.addRows([
      { metric: 'Total de Proyectos', value: data.summary.totalProjects },
      { metric: 'Proyectos Activos', value: data.summary.activeProjects },
      { metric: 'Ingresos Totales (MXN)', value: data.summary.totalRevenue },
      { metric: 'Cotizaciones Pendientes', value: data.summary.pendingQuotes },
      { metric: 'Total de Usuarios', value: data.summary.totalUsers },
      { metric: 'Fecha de Generación', value: new Date().toLocaleString('es-MX') }
    ]);
    
    // Style header
    summaryWs.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '366EF7' } };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true };
    });
  }

  // Projects worksheet
  if (data.projects && (options.type === 'projects' || options.type === 'full')) {
    const projectsWs = workbook.addWorksheet('Proyectos');
    
    projectsWs.columns = [
      { header: 'ID', key: 'id', width: 12 },
      { header: 'Título', key: 'title', width: 30 },
      { header: 'Cliente', key: 'clientName', width: 25 },
      { header: 'Email', key: 'clientEmail', width: 30 },
      { header: 'Estado', key: 'status', width: 15 },
      { header: 'Tipo de Servicio', key: 'serviceType', width: 20 },
      { header: 'Progreso (%)', key: 'progress', width: 12 },
      { header: 'Presupuesto', key: 'budget', width: 15 },
      { header: 'Fecha Inicio', key: 'startDate', width: 15 },
      { header: 'Fecha Creación', key: 'createdAt', width: 15 }
    ];
    
    data.projects.forEach(project => {
      projectsWs.addRow({
        id: project.id,
        title: project.title,
        clientName: project.user.name || 'N/A',
        clientEmail: project.user.email,
        status: project.status,
        serviceType: project.serviceType,
        progress: project.progress,
        budget: project.budget,
        startDate: project.startDate ? new Date(project.startDate).toLocaleDateString('es-MX') : 'N/A',
        createdAt: new Date(project.createdAt).toLocaleDateString('es-MX')
      });
    });
    
    // Style header
    projectsWs.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '366EF7' } };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true };
    });
  }

  // Quotes worksheet
  if (data.quotes && (options.type === 'quotes' || options.type === 'full')) {
    const quotesWs = workbook.addWorksheet('Cotizaciones');
    
    quotesWs.columns = [
      { header: 'ID', key: 'id', width: 12 },
      { header: 'Cliente', key: 'clientName', width: 25 },
      { header: 'Email', key: 'clientEmail', width: 30 },
      { header: 'Tipo de Servicio', key: 'serviceType', width: 20 },
      { header: 'Paquete', key: 'packageType', width: 15 },
      { header: 'Precio Base', key: 'basePrice', width: 15 },
      { header: 'Precio Total', key: 'totalPrice', width: 15 },
      { header: 'Estado', key: 'status', width: 15 },
      { header: 'Válida Hasta', key: 'validUntil', width: 15 },
      { header: 'Fecha Creación', key: 'createdAt', width: 15 }
    ];
    
    data.quotes.forEach(quote => {
      quotesWs.addRow({
        id: quote.id,
        clientName: quote.user.name || 'N/A',
        clientEmail: quote.user.email,
        serviceType: quote.serviceType,
        packageType: quote.packageType,
        basePrice: quote.basePrice,
        totalPrice: quote.totalPrice,
        status: quote.status,
        validUntil: new Date(quote.validUntil).toLocaleDateString('es-MX'),
        createdAt: new Date(quote.createdAt).toLocaleDateString('es-MX')
      });
    });
    
    // Style header
    quotesWs.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '366EF7' } };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true };
    });
  }

  // Payments worksheet
  if (data.payments && (options.type === 'payments' || options.type === 'full')) {
    const paymentsWs = workbook.addWorksheet('Pagos');
    
    paymentsWs.columns = [
      { header: 'ID', key: 'id', width: 12 },
      { header: 'Proyecto', key: 'projectTitle', width: 30 },
      { header: 'Cliente', key: 'clientName', width: 25 },
      { header: 'Monto', key: 'amount', width: 15 },
      { header: 'Moneda', key: 'currency', width: 10 },
      { header: 'Estado', key: 'status', width: 15 },
      { header: 'Stripe ID', key: 'stripePaymentId', width: 20 },
      { header: 'Fecha Pago', key: 'paidAt', width: 15 },
      { header: 'Fecha Creación', key: 'createdAt', width: 15 }
    ];
    
    data.payments.forEach(payment => {
      paymentsWs.addRow({
        id: payment.id,
        projectTitle: payment.project.title,
        clientName: payment.user.name || 'N/A',
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        stripePaymentId: payment.stripePaymentId || 'N/A',
        paidAt: payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('es-MX') : 'N/A',
        createdAt: new Date(payment.createdAt).toLocaleDateString('es-MX')
      });
    });
    
    // Style header
    paymentsWs.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '366EF7' } };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true };
    });
  }

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

// Main function to generate reports
export async function generateReport(options: ReportOptions): Promise<{
  success: boolean;
  buffer?: Buffer;
  filename?: string;
  mimeType?: string;
  error?: string;
}> {
  try {
    const data = await generateAnalyticsData(options.dateRange);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `reporte_${options.type}_${timestamp}.${options.format}`;
    
    let buffer: Buffer;
    let mimeType: string;
    
    if (options.format === 'pdf') {
      buffer = await generatePDFReport(data, options);
      mimeType = 'application/pdf';
    } else {
      buffer = await generateExcelReport(data, options);
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    
    return {
      success: true,
      buffer,
      filename,
      mimeType
    };
    
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
