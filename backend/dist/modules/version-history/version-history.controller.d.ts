import { VersionHistoryService } from './version-history.service';
import { User } from '@prisma/client';
export declare class VersionHistoryController {
    private readonly versionHistoryService;
    constructor(versionHistoryService: VersionHistoryService);
    getVersions(documentId: string, user: User): Promise<({
        user: {
            name: string;
            avatarUrl: string | null;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        snapshot: Buffer;
        documentId: string;
    })[]>;
    getVersionSnapshot(versionId: string, user: User): Promise<{
        document: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        snapshot: Buffer;
        documentId: string;
    }>;
    restoreVersion(documentId: string, versionId: string, user: User): Promise<{
        success: boolean;
        message: string;
    }>;
}
