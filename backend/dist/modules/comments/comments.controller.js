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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const comments_service_1 = require("./comments.service");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    createComment(documentId, user, createCommentDto) {
        return this.commentsService.createComment(documentId, user.id, createCommentDto);
    }
    getComments(documentId, user) {
        return this.commentsService.getComments(documentId, user.id);
    }
    resolveComment(commentId, user) {
        return this.commentsService.resolveComment(commentId, user.id);
    }
    createReply(commentId, user, createReplyDto) {
        return this.commentsService.createReply(commentId, user.id, createReplyDto);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a document' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all comments for a document' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Put)(':commentId/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve a comment' }),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "resolveComment", null);
__decorate([
    (0, common_1.Post)(':commentId/replies'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a reply to a comment' }),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_comment_dto_1.CreateReplyDto]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "createReply", null);
exports.CommentsController = CommentsController = __decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('documents/:documentId/comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map