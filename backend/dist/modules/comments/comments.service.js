"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let CommentsService = class CommentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createComment(documentId, userId, createCommentDto) {
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
    async getComments(documentId, userId) {
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
    async resolveComment(commentId, userId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: { document: true },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        await this.verifyDocumentAccess(comment.documentId, userId);
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { resolved: true },
        });
    }
    async createReply(commentId, userId, createReplyDto) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
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
    async verifyDocumentAccess(documentId, userId) {
        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
        });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        if (document.ownerId === userId || document.isPublic)
            return;
        const permission = await this.prisma.permission.findUnique({
            where: { documentId_userId: { documentId, userId } },
        });
        if (permission)
            return;
        const membership = await this.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Access denied to this document');
        }
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map