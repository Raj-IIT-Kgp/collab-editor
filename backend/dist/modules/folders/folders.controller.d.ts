import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { User } from '@prisma/client';
export declare class FoldersController {
    private readonly foldersService;
    constructor(foldersService: FoldersService);
    create(user: User, createFolderDto: CreateFolderDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        parentId: string | null;
    }>;
    findAllInWorkspace(workspaceId: string, user: User): Promise<({
        documents: {
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
        }[];
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            parentId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        parentId: string | null;
    })[]>;
    findOne(id: string, user: User): Promise<{
        documents: {
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
        }[];
        children: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            parentId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        parentId: string | null;
    }>;
    update(id: string, user: User, updateFolderDto: UpdateFolderDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        parentId: string | null;
    }>;
    remove(id: string, user: User): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        parentId: string | null;
    }>;
}
