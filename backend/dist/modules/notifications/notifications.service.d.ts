import { PrismaService } from '../../common/database/prisma.service';
import { EditorGateway } from '../../websocket/websocket.gateway';
export declare class NotificationsService {
    private readonly prisma;
    private readonly editorGateway;
    constructor(prisma: PrismaService, editorGateway: EditorGateway);
    getUserNotifications(userId: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        link: string | null;
        isRead: boolean;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    createNotification(userId: string, type: string, content: string, link?: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        link: string | null;
        isRead: boolean;
    }>;
}
