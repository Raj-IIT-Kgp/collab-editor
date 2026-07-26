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
exports.VersionHistoryController = void 0;
const common_1 = require("@nestjs/common");
const version_history_service_1 = require("./version-history.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let VersionHistoryController = class VersionHistoryController {
    constructor(versionHistoryService) {
        this.versionHistoryService = versionHistoryService;
    }
    getVersions(documentId, user) {
        return this.versionHistoryService.getVersions(documentId, user.id);
    }
    getVersionSnapshot(versionId, user) {
        return this.versionHistoryService.getVersionSnapshot(versionId, user.id);
    }
    restoreVersion(documentId, versionId, user) {
        return this.versionHistoryService.restoreVersion(documentId, versionId, user.id);
    }
};
exports.VersionHistoryController = VersionHistoryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all versions of a document' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VersionHistoryController.prototype, "getVersions", null);
__decorate([
    (0, common_1.Get)(':versionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific document version snapshot' }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VersionHistoryController.prototype, "getVersionSnapshot", null);
__decorate([
    (0, common_1.Post)(':versionId/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore document to a specific version' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Param)('versionId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], VersionHistoryController.prototype, "restoreVersion", null);
exports.VersionHistoryController = VersionHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Version History'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('documents/:documentId/versions'),
    __metadata("design:paramtypes", [version_history_service_1.VersionHistoryService])
], VersionHistoryController);
//# sourceMappingURL=version-history.controller.js.map