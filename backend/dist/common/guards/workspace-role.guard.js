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
exports.WorkspaceRoleGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
const prisma_service_1 = require("../database/prisma.service");
let WorkspaceRoleGuard = class WorkspaceRoleGuard {
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const workspaceId = request.params.workspaceId || request.body.workspaceId || request.params.id;
        if (!user || !workspaceId) {
            return false;
        }
        const membership = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: user.id,
                }
            }
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You are not a member of this workspace');
        }
        if (!requiredRoles.includes(membership.role)) {
            throw new common_1.ForbiddenException(`Require one of roles: ${requiredRoles.join(', ')}`);
        }
        return true;
    }
};
exports.WorkspaceRoleGuard = WorkspaceRoleGuard;
exports.WorkspaceRoleGuard = WorkspaceRoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], WorkspaceRoleGuard);
//# sourceMappingURL=workspace-role.guard.js.map