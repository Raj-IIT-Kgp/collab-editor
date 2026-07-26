import { PrismaService } from '../../common/database/prisma.service';
export declare class ActivityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logActivity(userId: string, documentId: string, action: string, details?: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        documentId: string | null;
        action: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getDocumentActivity(documentId: string, userId: string): Promise<({
        user: {
            name: string;
            avatarUrl: string | null;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        documentId: string | null;
        action: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
}
