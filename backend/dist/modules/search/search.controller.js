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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const search_service_1 = require("./search.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    searchDocuments(workspaceId, query, user) {
        return this.searchService.searchDocuments(workspaceId, user.id, query);
    }
    getRecentDocuments(workspaceId, user) {
        return this.searchService.getRecentDocuments(workspaceId, user.id);
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)('workspace/:workspaceId/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Search documents by title' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: true }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "searchDocuments", null);
__decorate([
    (0, common_1.Get)('workspace/:workspaceId/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recently updated documents' }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "getRecentDocuments", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('Search'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map