import { PrismaService } from '../../common/database/prisma.service';
export declare class VersionHistoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getVersions(documentId: string, userId: string): Promise<({
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
    getVersionSnapshot(versionId: string, userId: string): Promise<{
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
    restoreVersion(documentId: string, versionId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private verifyDocumentAccess;
    private verifyWriteAccess;
}
