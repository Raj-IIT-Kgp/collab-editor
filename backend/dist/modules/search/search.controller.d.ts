import { SearchService } from './search.service';
import { User } from '@prisma/client';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchDocuments(workspaceId: string, query: string, user: User): Promise<({
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
    getRecentDocuments(workspaceId: string, user: User): Promise<({
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
