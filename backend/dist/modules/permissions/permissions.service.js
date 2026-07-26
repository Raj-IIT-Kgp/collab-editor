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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
let PermissionsService = class PermissionsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async updateDocumentPermission(documentId, currentUserId, targetUserId, updatePermissionDto) {
        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
            include: { workspace: { include: { members: true } } },
        });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        const currentUserMembership = document.workspace.members.find((m) => m.userId === currentUserId);
        const isOwner = document.ownerId === currentUserId;
        const isWorkspaceAdmin = currentUserMembership && (currentUserMembership.role === client_1.Role.OWNER || currentUserMembership.role === client_1.Role.ADMIN);
        if (!isOwner && !isWorkspaceAdmin) {
            throw new common_1.ForbiddenException('Not authorized to change document permissions');
        }
        if (updatePermissionDto.role === null) {
            return this.prisma.permission.delete({
                where: { documentId_userId: { documentId, userId: targetUserId } },
            }).catch(() => null);
        }
        const res = await this.prisma.permission.upsert({
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
        if (updatePermissionDto.role !== null) {
            this.notificationsService.createNotification(targetUserId, 'SHARE', `A document "${document.title}" was shared with you`, `/document/${documentId}`);
        }
        return res;
    }
    async getDocumentPermissions(documentId, userId) {
        const permission = await this.checkAccess(documentId, userId);
        if (!permission)
            throw new common_1.ForbiddenException('Access denied');
        return this.prisma.permission.findMany({
            where: { documentId },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
    async checkAccess(documentId, userId) {
        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
        });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        if (document.ownerId === userId)
            return true;
        const permission = await this.prisma.permission.findUnique({
            where: { documentId_userId: { documentId, userId } },
        });
        if (permission)
            return true;
        const membership = await this.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
        });
        if (membership)
            return true;
        if (document.isPublic)
            return true;
        return false;
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map