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
exports.WorkspaceController = void 0;
const common_1 = require("@nestjs/common");
const workspace_service_1 = require("./workspace.service");
const create_workspace_dto_1 = require("./dto/create-workspace.dto");
const update_workspace_dto_1 = require("./dto/update-workspace.dto");
const add_member_dto_1 = require("./dto/add-member.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let WorkspaceController = class WorkspaceController {
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    create(user, createWorkspaceDto) {
        return this.workspaceService.create(user.id, createWorkspaceDto);
    }
    findAll(user) {
        return this.workspaceService.findAllForUser(user.id);
    }
    findOne(id, user) {
        return this.workspaceService.findOne(id, user.id);
    }
    update(id, user, updateWorkspaceDto) {
        return this.workspaceService.update(id, user.id, updateWorkspaceDto);
    }
    remove(id, user) {
        return this.workspaceService.delete(id, user.id);
    }
    addMember(workspaceId, user, addMemberDto) {
        return this.workspaceService.addMember(workspaceId, user.id, addMemberDto);
    }
    removeMember(workspaceId, targetUserId, user) {
        return this.workspaceService.removeMember(workspaceId, user.id, targetUserId);
    }
};
exports.WorkspaceController = WorkspaceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new workspace' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_workspace_dto_1.CreateWorkspaceDto]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all workspaces for the current user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workspace by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update workspace' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_workspace_dto_1.UpdateWorkspaceDto]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete workspace' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':workspaceId/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Add member to workspace' }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, add_member_dto_1.AddMemberDto]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':workspaceId/members/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove member from workspace' }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "removeMember", null);
exports.WorkspaceController = WorkspaceController = __decorate([
    (0, swagger_1.ApiTags)('Workspaces'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('workspaces'),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService])
], WorkspaceController);
//# sourceMappingURL=workspace.controller.js.map