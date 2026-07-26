import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CollaborationService } from '../modules/collaboration/collaboration.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class EditorGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly collaborationService;
    private readonly jwtService;
    private readonly configService;
    server: Server;
    private readonly logger;
    private roomConnections;
    constructor(collaborationService: CollaborationService, jwtService: JwtService, configService: ConfigService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinDocument(client: Socket, documentId: string): Promise<void>;
    handleSyncUpdate(client: Socket, data: {
        documentId: string;
        update: Buffer;
    }): void;
    handleAwarenessUpdate(client: Socket, data: {
        documentId: string;
        update: Buffer;
    }): void;
    sendNotificationToUser(userId: string, notification: any): void;
}
