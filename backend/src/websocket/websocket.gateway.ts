import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CollaborationService } from '../modules/collaboration/collaboration.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as Y from 'yjs';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EditorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(EditorGateway.name);

  // Track rooms and connection counts to know when to flush to DB
  private roomConnections: Map<string, number> = new Map();

  constructor(
    private readonly collaborationService: CollaborationService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Missing token');
      
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      client.data.user = payload;
      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (e) {
      this.logger.error(`Connection failed: ${e.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    if (client.data.rooms) {
      for (const roomId of client.data.rooms) {
        let count = this.roomConnections.get(roomId) || 0;
        count = Math.max(0, count - 1);
        this.roomConnections.set(roomId, count);
        
        if (count === 0) {
          this.collaborationService.saveDocumentToDb(roomId).then(() => {
            this.collaborationService.clearDocumentMemory(roomId);
            this.roomConnections.delete(roomId);
          }).catch(err => this.logger.error(`Error saving doc ${roomId}: ${err}`));
        }
      }
    }
  }

  @SubscribeMessage('join-document')
  async handleJoinDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() documentId: string,
  ) {
    client.join(documentId);
    if (!client.data.rooms) client.data.rooms = new Set();
    client.data.rooms.add(documentId);

    const count = this.roomConnections.get(documentId) || 0;
    this.roomConnections.set(documentId, count + 1);

    const ydoc = await this.collaborationService.loadDocument(documentId);
    const update = Y.encodeStateAsUpdate(ydoc);
    
    client.emit('sync-update', Buffer.from(update)); // Send full state to joining client
  }

  @SubscribeMessage('sync-update')
  handleSyncUpdate(@ConnectedSocket() client: Socket, @MessageBody() data: { documentId: string, update: Buffer }) {
    const { documentId, update } = data;
    const uint8Update = new Uint8Array(update);
    
    // Apply locally
    this.collaborationService.handleUpdate(documentId, uint8Update);
    
    // Broadcast to others
    client.to(documentId).emit('sync-update', update);
  }

  @SubscribeMessage('awareness-update')
  handleAwarenessUpdate(@ConnectedSocket() client: Socket, @MessageBody() data: { documentId: string, update: Buffer }) {
    const { documentId, update } = data;
    client.to(documentId).emit('awareness-update', update);
  }
}
