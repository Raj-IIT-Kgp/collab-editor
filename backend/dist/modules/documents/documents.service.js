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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const cache_manager_1 = require("@nestjs/cache-manager");
let DocumentsService = class DocumentsService {
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async create(userId, createDocumentDto) {
        await this.verifyWorkspaceAccess(createDocumentDto.workspaceId, userId);
        if (createDocumentDto.folderId) {
            const folder = await this.prisma.folder.findUnique({ where: { id: createDocumentDto.folderId } });
            if (!folder || folder.workspaceId !== createDocumentDto.workspaceId) {
                throw new common_1.NotFoundException('Target folder not found in this workspace');
            }
        }
        const newDocument = await this.prisma.document.create({
            data: {
                ...createDocumentDto,
                ownerId: userId,
            },
        });
        const cacheKey = `documents_workspace_${createDocumentDto.workspaceId}_user_${userId}`;
        await this.cacheManager.del(cacheKey);
        return newDocument;
    }
    async findAllInWorkspace(workspaceId, userId) {
        await this.verifyWorkspaceAccess(workspaceId, userId);
        const cacheKey = `documents_workspace_${workspaceId}_user_${userId}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const documents = await this.prisma.document.findMany({
            where: { workspaceId, isArchived: false, isDeleted: false },
            include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
            orderBy: { updatedAt: 'desc' },
        });
        await this.cacheManager.set(cacheKey, documents, 30000);
        return documents;
    }
    async findTrashInWorkspace(workspaceId, userId) {
        await this.verifyWorkspaceAccess(workspaceId, userId);
        return this.prisma.document.findMany({
            where: { workspaceId, isDeleted: true },
            include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findStarredInWorkspace(workspaceId, userId) {
        await this.verifyWorkspaceAccess(workspaceId, userId);
        return this.prisma.document.findMany({
            where: { workspaceId, isStarred: true, isDeleted: false },
            include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const document = await this.prisma.document.findUnique({
            where: { id },
            include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
        });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        await this.verifyReadAccess(document, userId);
        return document;
    }
    async update(id, userId, updateDocumentDto) {
        const document = await this.findOne(id, userId);
        await this.verifyWriteAccess(document, userId);
        if (updateDocumentDto.folderId && updateDocumentDto.folderId !== document.folderId) {
            const newFolder = await this.prisma.folder.findUnique({ where: { id: updateDocumentDto.folderId } });
            if (!newFolder || newFolder.workspaceId !== document.workspaceId) {
                throw new common_1.NotFoundException('Target folder not found in this workspace');
            }
        }
        const updatedDocument = await this.prisma.document.update({
            where: { id },
            data: updateDocumentDto,
        });
        const cacheKey = `documents_workspace_${document.workspaceId}_user_${userId}`;
        await this.cacheManager.del(cacheKey);
        return updatedDocument;
    }
    async duplicate(id, userId) {
        const document = await this.findOne(id, userId);
        const duplicatedDocument = await this.prisma.document.create({
            data: {
                title: `${document.title} (Copy)`,
                content: document.content,
                workspaceId: document.workspaceId,
                folderId: document.folderId,
                ownerId: userId,
                isPublic: document.isPublic,
                publicRole: document.publicRole,
            },
        });
        const cacheKey = `documents_workspace_${document.workspaceId}_user_${userId}`;
        await this.cacheManager.del(cacheKey);
        return duplicatedDocument;
    }
    async remove(id, userId) {
        const document = await this.findOne(id, userId);
        if (document.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only the owner can permanently delete the document');
        }
        const deletedDocument = await this.prisma.document.delete({ where: { id } });
        const cacheKey = `documents_workspace_${document.workspaceId}_user_${userId}`;
        await this.cacheManager.del(cacheKey);
        return deletedDocument;
    }
    async verifyWorkspaceAccess(workspaceId, userId) {
        const membership = await this.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Access denied to this workspace');
        }
    }
    async verifyReadAccess(document, userId) {
        if (document.ownerId === userId || document.isPublic)
            return true;
        const membership = await this.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
        });
        if (membership)
            return true;
        const permission = await this.prisma.permission.findUnique({
            where: { documentId_userId: { documentId: document.id, userId } },
        });
        if (!permission)
            throw new common_1.ForbiddenException('Access denied to this document');
    }
    async verifyWriteAccess(document, userId) {
        if (document.ownerId === userId)
            return true;
        const membership = await this.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
        });
        if (membership && ['EDITOR', 'ADMIN', 'OWNER'].includes(membership.role))
            return true;
        const permission = await this.prisma.permission.findUnique({
            where: { documentId_userId: { documentId: document.id, userId } },
        });
        if (permission && ['EDITOR', 'ADMIN', 'OWNER'].includes(permission.role))
            return true;
        if (document.isPublic && ['EDITOR', 'ADMIN', 'OWNER'].includes(document.publicRole))
            return true;
        throw new common_1.ForbiddenException('Write access denied to this document');
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map