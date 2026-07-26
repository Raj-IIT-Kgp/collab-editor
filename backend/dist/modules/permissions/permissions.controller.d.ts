import { PermissionsService } from './permissions.service';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from '@prisma/client';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    getPermissions(documentId: string, user: User): Promise<({
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
    updatePermission(documentId: string, targetUserId: string, user: User, updatePermissionDto: UpdatePermissionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        role: import("@prisma/client").$Enums.Role;
        documentId: string;
    } | null>;
    removePermission(documentId: string, targetUserId: string, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        role: import("@prisma/client").$Enums.Role;
        documentId: string;
    } | null>;
}
