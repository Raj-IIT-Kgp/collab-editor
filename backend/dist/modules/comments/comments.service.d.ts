import { PrismaService } from '../../common/database/prisma.service';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';
export declare class CommentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createComment(documentId: string, userId: string, createCommentDto: CreateCommentDto): Promise<{
        user: {
            name: string;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        documentId: string;
        position: import("@prisma/client/runtime/library").JsonValue | null;
        resolved: boolean;
    }>;
    getComments(documentId: string, userId: string): Promise<({
        user: {
            name: string;
            avatarUrl: string | null;
            id: string;
        };
        replies: ({
            user: {
                name: string;
                avatarUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            commentId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        documentId: string;
        position: import("@prisma/client/runtime/library").JsonValue | null;
        resolved: boolean;
    })[]>;
    resolveComment(commentId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        documentId: string;
        position: import("@prisma/client/runtime/library").JsonValue | null;
        resolved: boolean;
    }>;
    createReply(commentId: string, userId: string, createReplyDto: CreateReplyDto): Promise<{
        user: {
            name: string;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        commentId: string;
    }>;
    private verifyDocumentAccess;
}
