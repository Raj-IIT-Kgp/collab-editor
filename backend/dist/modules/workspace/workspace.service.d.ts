import { PrismaService } from '../../common/database/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { Cache } from 'cache-manager';
export declare class WorkspaceService {
    private readonly prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    create(userId: string, createWorkspaceDto: CreateWorkspaceDto): Promise<{
        members: {
            id: string;
            userId: string;
            role: import("@prisma/client").$Enums.Role;
            joinedAt: Date;
            workspaceId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllForUser(userId: string): Promise<{}>;
    findOne(id: string, userId: string): Promise<{
        members: ({
            user: {
                email: string;
                name: string;
                avatarUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            userId: string;
            role: import("@prisma/client").$Enums.Role;
            joinedAt: Date;
            workspaceId: string;
        })[];
        folders: {
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
    }>;
    update(id: string, userId: string, updateWorkspaceDto: UpdateWorkspaceDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addMember(workspaceId: string, currentUserId: string, addMemberDto: AddMemberDto): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.Role;
        joinedAt: Date;
        workspaceId: string;
    }>;
    removeMember(workspaceId: string, currentUserId: string, targetUserId: string): Promise<{
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.Role;
        joinedAt: Date;
        workspaceId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private checkWorkspaceRole;
}
