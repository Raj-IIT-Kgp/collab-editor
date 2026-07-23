import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class VersionHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getVersions(documentId: string, userId: string) {
    await this.verifyDocumentAccess(documentId, userId);

    return this.prisma.documentVersion.findMany({
      where: { documentId },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVersionSnapshot(versionId: string, userId: string) {
    const version = await this.prisma.documentVersion.findUnique({
      where: { id: versionId },
      include: { document: true },
    });

    if (!version) throw new NotFoundException('Version not found');
    await this.verifyDocumentAccess(version.documentId, userId);

    return version;
  }

  async restoreVersion(documentId: string, versionId: string, userId: string) {
    const version = await this.getVersionSnapshot(versionId, userId);
    
    // Check write access
    await this.verifyWriteAccess(version.document, userId);

    // Overwrite current document state with the snapshot
    await this.prisma.document.update({
      where: { id: documentId },
      data: { content: version.snapshot },
    });

    return { success: true, message: 'Document restored to previous version' };
  }

  private async verifyDocumentAccess(documentId: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new NotFoundException('Document not found');
    if (document.ownerId === userId || document.isPublic) return;

    const permission = await this.prisma.permission.findUnique({
      where: { documentId_userId: { documentId, userId } },
    });

    if (permission) return;

    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied to this document');
    }
  }

  private async verifyWriteAccess(document: any, userId: string) {
    if (document.ownerId === userId) return true;

    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
    });

    if (membership && ['EDITOR', 'ADMIN', 'OWNER'].includes(membership.role)) return true;

    const permission = await this.prisma.permission.findUnique({
      where: { documentId_userId: { documentId: document.id, userId } },
    });

    if (permission && ['EDITOR', 'ADMIN', 'OWNER'].includes(permission.role)) return true;

    throw new ForbiddenException('Write access denied to this document');
  }
}
