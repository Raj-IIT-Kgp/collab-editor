import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { EditorGateway } from '../../websocket/websocket.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly editorGateway: EditorGateway,
  ) {}

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // Internal method to trigger notifications
  async createNotification(userId: string, type: string, content: string, link?: string) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        content,
        link,
      },
    });
    
    this.editorGateway.sendNotificationToUser(userId, notification);
    return notification;
  }
}
