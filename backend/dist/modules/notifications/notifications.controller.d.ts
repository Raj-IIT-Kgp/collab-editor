import { NotificationsService } from './notifications.service';
import { User } from '@prisma/client';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(user: User): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        link: string | null;
        isRead: boolean;
    }[]>;
    markAllAsRead(user: User): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAsRead(id: string, user: User): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
