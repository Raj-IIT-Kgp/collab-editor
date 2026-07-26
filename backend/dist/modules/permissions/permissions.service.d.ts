import { PrismaService } from '../../common/database/prisma.service';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PermissionsService {
    private readonly prisma;
    private readonly notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    updateDocumentPermission(documentId: string, currentUserId: string, targetUserId: string, updatePermissionDto: UpdatePermissionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        role: import("@prisma/client").$Enums.Role;
        documentId: string;
    } | null>;
    getDocumentPermissions(documentId: string, userId: string): Promise<({
        user: {
            email: string;
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        role: import("@prisma/client").$Enums.Role;
        documentId: string;
    })[]>;
    checkAccess(documentId: string, userId: string): Promise<boolean>;
}
