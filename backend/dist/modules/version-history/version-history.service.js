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
exports.VersionHistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let VersionHistoryService = class VersionHistoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getVersions(documentId, userId) {
        await this.verifyDocumentAccess(documentId, userId);
        return this.prisma.documentVersion.findMany({
            where: { documentId },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getVersionSnapshot(versionId, userId) {
        const version = await this.prisma.documentVersion.findUnique({
            where: { id: versionId },
            include: { document: true },
        });
        if (!version)
            throw new common_1.NotFoundException('Version not found');
        await this.verifyDocumentAccess(version.documentId, userId);
        return version;
    }
    async restoreVersion(documentId, versionId, userId) {
        const version = await this.getVersionSnapshot(versionId, userId);
        await this.verifyWriteAccess(version.document, userId);
        await this.prisma.document.update({
            where: { id: documentId },
            data: { content: version.snapshot },
        });
        return { success: true, message: 'Document restored to previous version' };
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
        throw new common_1.ForbiddenException('Write access denied to this document');
    }
};
exports.VersionHistoryService = VersionHistoryService;
exports.VersionHistoryService = VersionHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VersionHistoryService);
//# sourceMappingURL=version-history.service.js.map