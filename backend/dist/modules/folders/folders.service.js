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
exports.FoldersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let FoldersService = class FoldersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createFolderDto) {
        await this.verifyWorkspaceAccess(createFolderDto.workspaceId, userId);
        if (createFolderDto.parentId) {
            const parent = await this.prisma.folder.findUnique({ where: { id: createFolderDto.parentId } });
            if (!parent || parent.workspaceId !== createFolderDto.workspaceId) {
                throw new common_1.NotFoundException('Parent folder not found in this workspace');
            }
        }
        return this.prisma.folder.create({
            data: createFolderDto,
        });
    }
    async findAllInWorkspace(workspaceId, userId) {
        await this.verifyWorkspaceAccess(workspaceId, userId);
        return this.prisma.folder.findMany({
            where: { workspaceId },
            include: { children: true, documents: true },
        });
    }
    async findOne(id, userId) {
        const folder = await this.prisma.folder.findUnique({
            where: { id },
            include: { children: true, documents: true },
        });
        if (!folder)
            throw new common_1.NotFoundException('Folder not found');
        await this.verifyWorkspaceAccess(folder.workspaceId, userId);
        return folder;
    }
    async update(id, userId, updateFolderDto) {
        const folder = await this.findOne(id, userId);
        if (updateFolderDto.parentId && updateFolderDto.parentId !== folder.parentId) {
            const newParent = await this.prisma.folder.findUnique({ where: { id: updateFolderDto.parentId } });
            if (!newParent || newParent.workspaceId !== folder.workspaceId) {
                throw new common_1.NotFoundException('Target parent folder not found in this workspace');
            }
        }
        return this.prisma.folder.update({
            where: { id },
            data: updateFolderDto,
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.folder.delete({ where: { id } });
    }
    async verifyWorkspaceAccess(workspaceId, userId) {
        const membership = await this.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Access denied to this workspace');
        }
    }
};
exports.FoldersService = FoldersService;
exports.FoldersService = FoldersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoldersService);
//# sourceMappingURL=folders.service.js.map