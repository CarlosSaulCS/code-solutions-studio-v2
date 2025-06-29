import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getFileStream } from '@/lib/file-upload';
import { withRateLimit } from '@/lib/rate-limit';

async function downloadFileHandler(request: NextRequest) {
  if (request.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'ID del archivo requerido' },
        { status: 400 }
      );
    }

    // Obtener información del archivo
    const file = await prisma.projectFile.findUnique({
      where: { id: fileId },
      include: {
        project: {
          include: {
            user: true
          }
        }
      }
    });

    if (!file) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos
    const hasAccess = 
      file.userId === session.user.id || // Subió el archivo
      file.project.userId === session.user.id || // Es dueño del proyecto
      session.user.role === 'ADMIN'; // Es admin

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Sin permisos para acceder a este archivo' },
        { status: 403 }
      );
    }

    // Obtener el stream del archivo
    const fileStream = await getFileStream(file.fileUrl);
    
    if (!fileStream.success) {
      return NextResponse.json(
        { error: 'Archivo no disponible' },
        { status: 404 }
      );
    }

    // Crear la respuesta con el archivo
    return new NextResponse(fileStream.stream!, {
      headers: {
        'Content-Type': file.fileType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.fileName}"`,
        'Content-Length': file.fileSize.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(downloadFileHandler, 'general');
