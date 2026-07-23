import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { Role } from '@prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createWorkspaceDto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        members: {
          create: {
            userId,
            role: Role.OWNER,
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id,
        members: { some: { userId } },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        },
        folders: true,
      },
    });

    if (!workspace) throw new NotFoundException('Workspace not found or unauthorized');
    return workspace;
  }

  async update(id: string, userId: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    await this.checkWorkspaceRole(id, userId, [Role.OWNER, Role.ADMIN]);
    return this.prisma.workspace.update({
      where: { id },
      data: updateWorkspaceDto,
    });
  }

  async addMember(workspaceId: string, currentUserId: string, addMemberDto: AddMemberDto) {
    await this.checkWorkspaceRole(workspaceId, currentUserId, [Role.OWNER, Role.ADMIN]);

    const targetUser = await this.prisma.user.findUnique({
      where: { email: addMemberDto.email },
    });

    if (!targetUser) {
      throw new NotFoundException('User with given email not found');
    }

    const existingMember = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId: targetUser.id },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    return this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: targetUser.id,
        role: addMemberDto.role,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async removeMember(workspaceId: string, currentUserId: string, targetUserId: string) {
    await this.checkWorkspaceRole(workspaceId, currentUserId, [Role.OWNER, Role.ADMIN]);

    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
    });

    if (!membership) throw new NotFoundException('Member not found');
    if (membership.role === Role.OWNER) throw new ForbiddenException('Cannot remove the owner');

    return this.prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
    });
  }

  async delete(id: string, userId: string) {
    await this.checkWorkspaceRole(id, userId, [Role.OWNER]);
    return this.prisma.workspace.delete({ where: { id } });
  }

  private async checkWorkspaceRole(workspaceId: string, userId: string, allowedRoles: Role[]) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    if (!membership || !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return membership;
  }
}
