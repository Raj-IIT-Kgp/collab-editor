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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envValidationSchema.parse(env),
    }),
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
  providers: [],
})
export class AppModule {}
