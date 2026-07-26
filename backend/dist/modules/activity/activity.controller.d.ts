import { ActivityService } from './activity.service';
import { User } from '@prisma/client';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    getDocumentActivity(documentId: string, user: User): Promise<({
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
