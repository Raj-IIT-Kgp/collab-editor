import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Role } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async updateDocumentPermission(
    documentId: string,
    currentUserId: string,
    targetUserId: string,
    updatePermissionDto: UpdatePermissionDto,
  ) {
    // Basic check: only owners/admins of the document's workspace or the document owner can change permissions
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { workspace: { include: { members: true } } },
    });

    if (!document) throw new NotFoundException('Document not found');

    const currentUserMembership = document.workspace.members.find(
      (m) => m.userId === currentUserId,
    );
    const isOwner = document.ownerId === currentUserId;
    const isWorkspaceAdmin = currentUserMembership && (currentUserMembership.role === Role.OWNER || currentUserMembership.role === Role.ADMIN);

    if (!isOwner && !isWorkspaceAdmin) {
      throw new ForbiddenException('Not authorized to change document permissions');
    }

    if (updatePermissionDto.role === null) {
      // Remove permission
      return this.prisma.permission.delete({
        where: { documentId_userId: { documentId, userId: targetUserId } },
      }).catch(() => null);
    }

    return this.prisma.permission.upsert({
      where: {
        documentId_userId: { documentId, userId: targetUserId },
      },
      update: {
        role: updatePermissionDto.role,
      },
      create: {
        documentId,
        userId: targetUserId,
        role: updatePermissionDto.role,
      },
    });
  }

  async getDocumentPermissions(documentId: string, userId: string) {
    // Check read access
    const permission = await this.checkAccess(documentId, userId);
    if (!permission) throw new ForbiddenException('Access denied');

    return this.prisma.permission.findMany({
      where: { documentId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async checkAccess(documentId: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new NotFoundException('Document not found');

    if (document.ownerId === userId) return true;

    const permission = await this.prisma.permission.findUnique({
      where: { documentId_userId: { documentId, userId } },
    });

    if (permission) return true;

    // Check workspace-level permission
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
    });

    if (membership) return true;

    if (document.isPublic) return true;

    return false;
  }
}
