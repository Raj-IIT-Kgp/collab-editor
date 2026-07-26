import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { User } from '@prisma/client';
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    create(user: User, createWorkspaceDto: CreateWorkspaceDto): Promise<{
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
    findAll(user: User): Promise<{}>;
    findOne(id: string, user: User): Promise<{
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
    update(id: string, user: User, updateWorkspaceDto: UpdateWorkspaceDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, user: User): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addMember(workspaceId: string, user: User, addMemberDto: AddMemberDto): Promise<{
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
    removeMember(workspaceId: string, targetUserId: string, user: User): Promise<{
        id: string;
        userId: string;
        role: import("@prisma/client").$Enums.Role;
        joinedAt: Date;
        workspaceId: string;
    }>;
}
