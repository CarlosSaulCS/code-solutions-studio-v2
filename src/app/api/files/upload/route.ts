import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFile, validateFile } from '@/lib/file-upload';
import { prisma } from '@/lib/prisma';
import { withRateLimit } from '@/lib/rate-limit';

async function uploadFileHandler(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Archivo requerido' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'ID del proyecto requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario tiene acceso al proyecto
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
          // Admins pueden subir archivos a cualquier proyecto
          session.user.role === 'ADMIN' ? {} : { userId: session.user.id }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado o sin permisos' },
        { status: 404 }
      );
    }

    // Validar el archivo
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Subir el archivo
    const uploadResult = await uploadFile(file, {
      category: 'GENERAL',
      projectId,
      userId: session.user.id
    });

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error },
        { status: 500 }
      );
    }

    // Guardar información del archivo en la base de datos
    const fileRecord = await prisma.projectFile.create({
      data: {
        projectId,
        userId: session.user.id,
        fileName: uploadResult.fileName!,
        fileUrl: uploadResult.fileUrl!,
        fileSize: file.size,
        fileType: file.type,
        category: 'GENERAL'
      }
    });

    return NextResponse.json({
      message: 'Archivo subido exitosamente',
      file: {
        id: fileRecord.id,
        fileName: fileRecord.fileName,
        fileUrl: fileRecord.fileUrl,
        fileSize: fileRecord.fileSize,
        fileType: fileRecord.fileType,
        category: fileRecord.category,
        uploadedAt: fileRecord.createdAt
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(uploadFileHandler, 'general');
