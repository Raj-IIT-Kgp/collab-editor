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
var EditorGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const collaboration_service_1 = require("../modules/collaboration/collaboration.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const Y = require("yjs");
let EditorGateway = EditorGateway_1 = class EditorGateway {
    constructor(collaborationService, jwtService, configService) {
        this.collaborationService = collaborationService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(EditorGateway_1.name);
        this.roomConnections = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token)
                throw new Error('Missing token');
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            client.data.user = payload;
            client.join(`user_${payload.sub}`);
            this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);
        }
        catch (e) {
            this.logger.error(`Connection failed: ${e.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
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
    async handleJoinDocument(client, documentId) {
        client.join(documentId);
        if (!client.data.rooms)
            client.data.rooms = new Set();
        client.data.rooms.add(documentId);
        const count = this.roomConnections.get(documentId) || 0;
        this.roomConnections.set(documentId, count + 1);
        const ydoc = await this.collaborationService.loadDocument(documentId);
        const update = Y.encodeStateAsUpdate(ydoc);
        client.emit('sync-update', Buffer.from(update));
    }
    handleSyncUpdate(client, data) {
        const { documentId, update } = data;
        const uint8Update = new Uint8Array(update);
        this.collaborationService.handleUpdate(documentId, uint8Update);
        client.to(documentId).emit('sync-update', update);
    }
    handleAwarenessUpdate(client, data) {
        const { documentId, update } = data;
        client.to(documentId).emit('awareness-update', update);
    }
    sendNotificationToUser(userId, notification) {
        this.server.to(`user_${userId}`).emit('new-notification', notification);
    }
};
exports.EditorGateway = EditorGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EditorGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-document'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], EditorGateway.prototype, "handleJoinDocument", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sync-update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EditorGateway.prototype, "handleSyncUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('awareness-update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EditorGateway.prototype, "handleAwarenessUpdate", null);
exports.EditorGateway = EditorGateway = EditorGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [collaboration_service_1.CollaborationService,
        jwt_1.JwtService,
        config_1.ConfigService])
], EditorGateway);
//# sourceMappingURL=websocket.gateway.js.map