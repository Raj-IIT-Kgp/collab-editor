import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async logActivity(userId: string, documentId: string, action: string, details?: any) {
    return this.prisma.activityLog.create({
      data: {
        userId,
        documentId,
        action,
        details: details || {},
      },
    });
  }

  async getDocumentActivity(documentId: string, userId: string) {
    // Verify access
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new ForbiddenException('Document not found');
    
    if (document.ownerId !== userId && !document.isPublic) {
      const membership = await this.prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
      });
      const permission = await this.prisma.permission.findUnique({
        where: { documentId_userId: { documentId, userId } },
      });

      if (!membership && !permission) {
        throw new ForbiddenException('Access denied to activity logs');
      }
    }

    return this.prisma.activityLog.findMany({
      where: { documentId },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
