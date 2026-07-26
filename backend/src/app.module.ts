import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { envValidationSchema } from './common/config/env.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './mail/mail.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { FoldersModule } from './modules/folders/folders.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { SearchModule } from './modules/search/search.module';
import { WebsocketModule } from './websocket/websocket.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { VersionHistoryModule } from './modules/version-history/version-history.module';
import { ActivityModule } from './modules/activity/activity.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envValidationSchema.parse(env),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URL || 'redis://localhost:6379',
          ttl: 60000, // 1 minute default
        }),
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // 100 requests per minute
    }]),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    WorkspaceModule,
    PermissionsModule,
    FoldersModule,
    DocumentsModule,
    SearchModule,
    WebsocketModule,
    CommentsModule,
    NotificationsModule,
    UploadsModule,
    VersionHistoryModule,
    ActivityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
