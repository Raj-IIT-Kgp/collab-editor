import { PrismaService } from '../../common/database/prisma.service';
export declare class SearchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    searchDocuments(workspaceId: string, userId: string, query: string): Promise<({
        folder: {
            name: string;
            id: string;
        } | null;
        owner: {
            name: string;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        workspaceId: string;
        content: Buffer | null;
        folderId: string | null;
        ownerId: string;
        isArchived: boolean;
        isDeleted: boolean;
        isStarred: boolean;
        isPublic: boolean;
        publicRole: import("@prisma/client").$Enums.Role;
    })[]>;
    getRecentDocuments(workspaceId: string, userId: string): Promise<({
        owner: {
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        workspaceId: string;
        content: Buffer | null;
        folderId: string | null;
        ownerId: string;
        isArchived: boolean;
        isDeleted: boolean;
        isStarred: boolean;
        isPublic: boolean;
        publicRole: import("@prisma/client").$Enums.Role;
    })[]>;
}
