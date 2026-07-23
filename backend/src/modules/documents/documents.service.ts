import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createDocumentDto: CreateDocumentDto) {
    await this.verifyWorkspaceAccess(createDocumentDto.workspaceId, userId);

    if (createDocumentDto.folderId) {
      const folder = await this.prisma.folder.findUnique({ where: { id: createDocumentDto.folderId } });
      if (!folder || folder.workspaceId !== createDocumentDto.workspaceId) {
        throw new NotFoundException('Target folder not found in this workspace');
      }
    }

    return this.prisma.document.create({
      data: {
        ...createDocumentDto,
        ownerId: userId,
      },
    });
  }

  async findAllInWorkspace(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    return this.prisma.document.findMany({
      where: { workspaceId, isArchived: false },
      include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
    });

    if (!document) throw new NotFoundException('Document not found');
    await this.verifyReadAccess(document, userId);

    return document;
  }

  async update(id: string, userId: string, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.findOne(id, userId);
    await this.verifyWriteAccess(document, userId);

    if (updateDocumentDto.folderId && updateDocumentDto.folderId !== document.folderId) {
      const newFolder = await this.prisma.folder.findUnique({ where: { id: updateDocumentDto.folderId } });
      if (!newFolder || newFolder.workspaceId !== document.workspaceId) {
        throw new NotFoundException('Target folder not found in this workspace');
      }
    }

    return this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
    });
  }

  async duplicate(id: string, userId: string) {
    const document = await this.findOne(id, userId);

    return this.prisma.document.create({
      data: {
        title: `${document.title} (Copy)`,
        content: document.content, // Copy CRDT binary state
        workspaceId: document.workspaceId,
        folderId: document.folderId,
        ownerId: userId,
        isPublic: document.isPublic,
        publicRole: document.publicRole,
      },
    });
  }

  async remove(id: string, userId: string) {
    const document = await this.findOne(id, userId);
    if (document.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can permanently delete the document');
    }
    return this.prisma.document.delete({ where: { id } });
  }

  private async verifyWorkspaceAccess(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied to this workspace');
    }
  }

  private async verifyReadAccess(document: any, userId: string) {
    if (document.ownerId === userId || document.isPublic) return true;

    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
    });

    if (membership) return true;

    const permission = await this.prisma.permission.findUnique({
      where: { documentId_userId: { documentId: document.id, userId } },
    });

    if (!permission) throw new ForbiddenException('Access denied to this document');
  }

  private async verifyWriteAccess(document: any, userId: string) {
    if (document.ownerId === userId) return true;

    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
    });

    // If they are an EDITOR, ADMIN, OWNER in the workspace
    if (membership && ['EDITOR', 'ADMIN', 'OWNER'].includes(membership.role)) return true;

    const permission = await this.prisma.permission.findUnique({
      where: { documentId_userId: { documentId: document.id, userId } },
    });

    if (permission && ['EDITOR', 'ADMIN', 'OWNER'].includes(permission.role)) return true;
    
    if (document.isPublic && ['EDITOR', 'ADMIN', 'OWNER'].includes(document.publicRole)) return true;

    throw new ForbiddenException('Write access denied to this document');
  }
}
