import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Injectable()
export class FoldersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createFolderDto: CreateFolderDto) {
    await this.verifyWorkspaceAccess(createFolderDto.workspaceId, userId);
    
    if (createFolderDto.parentId) {
      const parent = await this.prisma.folder.findUnique({ where: { id: createFolderDto.parentId } });
      if (!parent || parent.workspaceId !== createFolderDto.workspaceId) {
        throw new NotFoundException('Parent folder not found in this workspace');
      }
    }

    return this.prisma.folder.create({
      data: createFolderDto,
    });
  }

  async findAllInWorkspace(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    
    return this.prisma.folder.findMany({
      where: { workspaceId },
      include: { children: true, documents: true },
    });
  }

  async findOne(id: string, userId: string) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: { children: true, documents: true },
    });
    
    if (!folder) throw new NotFoundException('Folder not found');
    await this.verifyWorkspaceAccess(folder.workspaceId, userId);

    return folder;
  }

  async update(id: string, userId: string, updateFolderDto: UpdateFolderDto) {
    const folder = await this.findOne(id, userId);
    
    if (updateFolderDto.parentId && updateFolderDto.parentId !== folder.parentId) {
      const newParent = await this.prisma.folder.findUnique({ where: { id: updateFolderDto.parentId } });
      if (!newParent || newParent.workspaceId !== folder.workspaceId) {
        throw new NotFoundException('Target parent folder not found in this workspace');
      }
    }

    return this.prisma.folder.update({
      where: { id },
      data: updateFolderDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // verifies access
    return this.prisma.folder.delete({ where: { id } });
  }

  private async verifyWorkspaceAccess(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied to this workspace');
    }
  }
}
