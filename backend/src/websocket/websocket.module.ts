import { Module } from '@nestjs/common';
import { EditorGateway } from './websocket.gateway';
import { CollaborationModule } from '../modules/collaboration/collaboration.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CollaborationModule, JwtModule.register({})],
  providers: [EditorGateway],
})
export class WebsocketModule {}
