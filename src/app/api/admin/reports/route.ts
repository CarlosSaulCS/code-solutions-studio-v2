import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateReport, ReportOptions } from '@/lib/reports';
import { withRateLimit } from '@/lib/rate-limit';

async function generateReportHandler(request: NextRequest) {
  if (request.method !== 'POST' && request.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const session = await getServerSession(authOptions);
    
    // Solo admins pueden generar reportes
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { 
      type, 
      format, 
      startDate, 
      endDate, 
      includeDetails = true 
    } = request.method === 'GET' ? {
      type: 'projects',
      format: 'pdf',
      startDate: undefined,
      endDate: undefined,
      includeDetails: true
    } : await request.json();

    if (!type || !format) {
      return NextResponse.json(
        { error: 'Tipo de reporte y formato son requeridos' },
        { status: 400 }
      );
    }

    if (!['projects', 'quotes', 'users', 'payments', 'analytics', 'full'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de reporte inválido' },
        { status: 400 }
      );
    }

    if (!['pdf', 'excel'].includes(format)) {
      return NextResponse.json(
        { error: 'Formato de reporte inválido' },
        { status: 400 }
      );
    }

    const options: ReportOptions = {
      type,
      format,
      includeDetails
    };

    // Agregar rango de fechas si se proporciona
    if (startDate && endDate) {
      options.dateRange = {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      };
    }

    // Generar el reporte
    const result = await generateReport(options);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error generando el reporte' },
        { status: 500 }
      );
    }

    // Retornar el archivo como respuesta
    return new NextResponse(new Uint8Array(result.buffer!), {
      headers: {
        'Content-Type': result.mimeType!,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': result.buffer!.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(generateReportHandler, 'general');
export const GET = withRateLimit(generateReportHandler, 'general');
