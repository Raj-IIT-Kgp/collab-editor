import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(documentId: string, userId: string, createCommentDto: CreateCommentDto) {
    await this.verifyDocumentAccess(documentId, userId);

    return this.prisma.comment.create({
      data: {
        documentId,
        userId,
        content: createCommentDto.content,
        position: createCommentDto.position || {},
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async getComments(documentId: string, userId: string) {
    await this.verifyDocumentAccess(documentId, userId);

    return this.prisma.comment.findMany({
      where: { documentId },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        replies: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { document: true },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    await this.verifyDocumentAccess(comment.documentId, userId);

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { resolved: true },
    });
  }

  async createReply(commentId: string, userId: string, createReplyDto: CreateReplyDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    await this.verifyDocumentAccess(comment.documentId, userId);

    return this.prisma.reply.create({
      data: {
        commentId,
        userId,
        content: createReplyDto.content,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
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
}
