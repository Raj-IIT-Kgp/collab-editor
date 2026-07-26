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
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
const cache_manager_1 = require("@nestjs/cache-manager");
let WorkspaceService = class WorkspaceService {
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async create(userId, createWorkspaceDto) {
        return this.prisma.workspace.create({
            data: {
                name: createWorkspaceDto.name,
                members: {
                    create: {
                        userId,
                        role: client_1.Role.OWNER,
                    },
                },
            },
            include: {
                members: true,
            },
        });
    }
    async findAllForUser(userId) {
        const cacheKey = `workspaces_${userId}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const workspaces = await this.prisma.workspace.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
                    },
                },
            },
        });
        await this.cacheManager.set(cacheKey, workspaces, 60000);
        return workspaces;
    }
    async findOne(id, userId) {
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                id,
                members: { some: { userId } },
            },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
                },
                folders: true,
            },
        });
        if (!workspace)
            throw new common_1.NotFoundException('Workspace not found or unauthorized');
        return workspace;
    }
    async update(id, userId, updateWorkspaceDto) {
        await this.checkWorkspaceRole(id, userId, [client_1.Role.OWNER, client_1.Role.ADMIN]);
        return this.prisma.workspace.update({
            where: { id },
            data: updateWorkspaceDto,
        });
    }
    async addMember(workspaceId, currentUserId, addMemberDto) {
        await this.checkWorkspaceRole(workspaceId, currentUserId, [client_1.Role.OWNER, client_1.Role.ADMIN]);
        const targetUser = await this.prisma.user.findUnique({
            where: { email: addMemberDto.email },
        });
        if (!targetUser) {
            throw new common_1.NotFoundException('User with given email not found');
        }
        const existingMember = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: { workspaceId, userId: targetUser.id },
            },
        });
        if (existingMember) {
            throw new common_1.ConflictException('User is already a member of this workspace');
        }
        return this.prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: targetUser.id,
                role: addMemberDto.role,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async removeMember(workspaceId, currentUserId, targetUserId) {
        await this.checkWorkspaceRole(workspaceId, currentUserId, [client_1.Role.OWNER, client_1.Role.ADMIN]);
        const membership = await this.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
        });
        if (!membership)
            throw new common_1.NotFoundException('Member not found');
        if (membership.role === client_1.Role.OWNER)
            throw new common_1.ForbiddenException('Cannot remove the owner');
        return this.prisma.workspaceMember.delete({
            where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
        });
    }
    async delete(id, userId) {
        await this.checkWorkspaceRole(id, userId, [client_1.Role.OWNER]);
        return this.prisma.workspace.delete({ where: { id } });
    }
    async checkWorkspaceRole(workspaceId, userId, allowedRoles) {
        const membership = await this.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if (!membership || !allowedRoles.includes(membership.role)) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        return membership;
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map