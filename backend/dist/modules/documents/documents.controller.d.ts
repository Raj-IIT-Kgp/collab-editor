import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from '@prisma/client';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    create(user: User, createDocumentDto: CreateDocumentDto): Promise<{
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
    findAllInWorkspace(workspaceId: string, user: User): Promise<{}>;
    findTrashInWorkspace(workspaceId: string, user: User): Promise<({
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
    findStarredInWorkspace(workspaceId: string, user: User): Promise<({
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
    findOne(id: string, user: User): Promise<{
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
    update(id: string, user: User, updateDocumentDto: UpdateDocumentDto): Promise<{
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
    duplicate(id: string, user: User): Promise<{
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
    remove(id: string, user: User): Promise<{
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
}
