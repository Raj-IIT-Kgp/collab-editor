"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./common/database/database.module");
const env_config_1 = require("./common/config/env.config");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const mail_module_1 = require("./mail/mail.module");
const workspace_module_1 = require("./modules/workspace/workspace.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const folders_module_1 = require("./modules/folders/folders.module");
const documents_module_1 = require("./modules/documents/documents.module");
const search_module_1 = require("./modules/search/search.module");
const websocket_module_1 = require("./websocket/websocket.module");
const comments_module_1 = require("./modules/comments/comments.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const version_history_module_1 = require("./modules/version-history/version-history.module");
const activity_module_1 = require("./modules/activity/activity.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: (env) => env_config_1.envValidationSchema.parse(env),
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async () => ({
                    store: await (0, cache_manager_redis_yet_1.redisStore)({
                        url: process.env.REDIS_URL || 'redis://localhost:6379',
                        ttl: 60000,
                    }),
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            workspace_module_1.WorkspaceModule,
            permissions_module_1.PermissionsModule,
            folders_module_1.FoldersModule,
            documents_module_1.DocumentsModule,
            search_module_1.SearchModule,
            websocket_module_1.WebsocketModule,
            comments_module_1.CommentsModule,
            notifications_module_1.NotificationsModule,
            uploads_module_1.UploadsModule,
            version_history_module_1.VersionHistoryModule,
            activity_module_1.ActivityModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map