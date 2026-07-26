import { CommentsService } from './comments.service';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';
import { User } from '@prisma/client';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    createComment(documentId: string, user: User, createCommentDto: CreateCommentDto): Promise<{
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
    getComments(documentId: string, user: User): Promise<({
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
    resolveComment(commentId: string, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        documentId: string;
        position: import("@prisma/client/runtime/library").JsonValue | null;
        resolved: boolean;
    }>;
    createReply(commentId: string, user: User, createReplyDto: CreateReplyDto): Promise<{
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
}
