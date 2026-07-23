import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchDocuments(workspaceId: string, userId: string, query: string) {
    // Verify access to workspace
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied to this workspace');
    }

    // Full text search on document title
    return this.prisma.document.findMany({
      where: {
        workspaceId,
        isArchived: false,
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        folder: { select: { id: true, name: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 20, // Pagination limit
    });
  }

  async getRecentDocuments(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied to this workspace');
    }

    return this.prisma.document.findMany({
      where: {
        workspaceId,
        isArchived: false,
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: { owner: { select: { name: true, avatarUrl: true } } }
    });
  }
}
