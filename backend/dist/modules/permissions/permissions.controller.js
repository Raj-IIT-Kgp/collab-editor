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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const permissions_service_1 = require("./permissions.service");
const update_permission_dto_1 = require("./dto/update-permission.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let PermissionsController = class PermissionsController {
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    getPermissions(documentId, user) {
        return this.permissionsService.getDocumentPermissions(documentId, user.id);
    }
    updatePermission(documentId, targetUserId, user, updatePermissionDto) {
        return this.permissionsService.updateDocumentPermission(documentId, user.id, targetUserId, updatePermissionDto);
    }
    removePermission(documentId, targetUserId, user) {
        return this.permissionsService.updateDocumentPermission(documentId, user.id, targetUserId, { role: null });
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get permissions for a document' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Put)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user permission for a document' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, update_permission_dto_1.UpdatePermissionDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "updatePermission", null);
__decorate([
    (0, common_1.Delete)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove user permission for a document' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "removePermission", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Permissions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('documents/:documentId/permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map