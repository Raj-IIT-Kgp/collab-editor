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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let ActivityService = class ActivityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logActivity(userId, documentId, action, details) {
        return this.prisma.activityLog.create({
            data: {
                userId,
                documentId,
                action,
                details: details || {},
            },
        });
    }
    async getDocumentActivity(documentId, userId) {
        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
        });
        if (!document)
            throw new common_1.ForbiddenException('Document not found');
        if (document.ownerId !== userId && !document.isPublic) {
            const membership = await this.prisma.workspaceMember.findUnique({
                where: { workspaceId_userId: { workspaceId: document.workspaceId, userId } },
            });
            const permission = await this.prisma.permission.findUnique({
                where: { documentId_userId: { documentId, userId } },
            });
            if (!membership && !permission) {
                throw new common_1.ForbiddenException('Access denied to activity logs');
            }
        }
        return this.prisma.activityLog.findMany({
            where: { documentId },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivityService);
//# sourceMappingURL=activity.service.js.map