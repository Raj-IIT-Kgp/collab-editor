import { PrismaService } from '../../common/database/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
export declare class FoldersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createFolderDto: CreateFolderDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        parentId: string | null;
    }>;
    findAllInWorkspace(workspaceId: string, userId: string): Promise<({
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
    findOne(id: string, userId: string): Promise<{
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
    update(id: string, userId: string, updateFolderDto: UpdateFolderDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        parentId: string | null;
    }>;
    remove(id: string, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        parentId: string | null;
    }>;
    private verifyWorkspaceAccess;
}
