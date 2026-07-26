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
exports.FoldersController = void 0;
const common_1 = require("@nestjs/common");
const folders_service_1 = require("./folders.service");
const create_folder_dto_1 = require("./dto/create-folder.dto");
const update_folder_dto_1 = require("./dto/update-folder.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let FoldersController = class FoldersController {
    constructor(foldersService) {
        this.foldersService = foldersService;
    }
    create(user, createFolderDto) {
        return this.foldersService.create(user.id, createFolderDto);
    }
    findAllInWorkspace(workspaceId, user) {
        return this.foldersService.findAllInWorkspace(workspaceId, user.id);
    }
    findOne(id, user) {
        return this.foldersService.findOne(id, user.id);
    }
    update(id, user, updateFolderDto) {
        return this.foldersService.update(id, user.id, updateFolderDto);
    }
    remove(id, user) {
        return this.foldersService.remove(id, user.id);
    }
};
exports.FoldersController = FoldersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new folder' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_folder_dto_1.CreateFolderDto]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('workspace/:workspaceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all folders in a workspace' }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "findAllInWorkspace", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get folder by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update/Move folder' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_folder_dto_1.UpdateFolderDto]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete folder' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "remove", null);
exports.FoldersController = FoldersController = __decorate([
    (0, swagger_1.ApiTags)('Folders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('folders'),
    __metadata("design:paramtypes", [folders_service_1.FoldersService])
], FoldersController);
//# sourceMappingURL=folders.controller.js.map