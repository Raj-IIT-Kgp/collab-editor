import { PrismaService } from '../../common/database/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Cache } from 'cache-manager';
export declare class DocumentsService {
    private readonly prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    create(userId: string, createDocumentDto: CreateDocumentDto): Promise<{
        id: string;
        title: string;
        content: Buffer | null;
        isArchived: boolean;
        isDeleted: boolean;
        isStarred: boolean;
        isPublic: boolean;
        publicRole: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        folderId: string | null;
        workspaceId: string;
        ownerId: string;
    }>;
    findAllInWorkspace(workspaceId: string, userId: string): Promise<{}>;
    findTrashInWorkspace(workspaceId: string, userId: string): Promise<({
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        content: Buffer | null;
        isArchived: boolean;
        isDeleted: boolean;
        isStarred: boolean;
        isPublic: boolean;
        publicRole: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        folderId: string | null;
        workspaceId: string;
        ownerId: string;
    })[]>;
    findStarredInWorkspace(workspaceId: string, userId: string): Promise<({
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        content: Buffer | null;
        isArchived: boolean;
        isDeleted: boolean;
        isStarred: boolean;
        isPublic: boolean;
        publicRole: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        folderId: string | null;
        workspaceId: string;
        ownerId: string;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        content: Buffer | null;
        isArchived: boolean;
        isDeleted: boolean;
        isStarred: boolean;
        isPublic: boolean;
        publicRole: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        folderId: string | null;
        workspaceId: string;
        ownerId: string;
    }>;
    update(id: string, userId: string, updateDocumentDto: UpdateDocumentDto): Promise<{
        id: string;
        title: string;
        content: Buffer | null;
        isArchived: boolean;
        isDeleted: boolean;
        isStarred: boolean;
        isPublic: boolean;
        publicRole: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        folderId: string | null;
        workspaceId: string;
        ownerId: string;
    }>;
    duplicate(id: string, userId: string): Promise<{
        id: string;
        title: string;
        content: Buffer | null;
        isArchived: boolean;
        isDeleted: boolean;
        isStarred: boolean;
        isPublic: boolean;
        publicRole: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        folderId: string | null;
        workspaceId: string;
        ownerId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        title: string;
        content: Buffer | null;
        isArchived: boolean;
        isDeleted: boolean;
        isStarred: boolean;
        isPublic: boolean;
        publicRole: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        folderId: string | null;
        workspaceId: string;
        ownerId: string;
    }>;
    private verifyWorkspaceAccess;
    private verifyReadAccess;
    private verifyWriteAccess;
}
